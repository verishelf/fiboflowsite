import Stripe from "stripe";
import { getStripeSafe } from "@/lib/stripe/client";
import { createServiceClientSafe } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email";
import { membershipActivatedTemplate, paymentFailedTemplate, paymentSuccessfulTemplate } from "@/lib/email/templates";

export async function handleStripeWebhook(
  body: string,
  signature: string,
): Promise<{ received: boolean; error?: string }> {
  const stripe = getStripeSafe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const supabase = createServiceClientSafe();

  if (!stripe || !webhookSecret || !supabase) {
    return { received: false, error: "Stripe or Supabase not configured" };
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    return { received: false, error: message };
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      await handleCheckoutCompleted(session, supabase, stripe);
      break;
    }
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      await syncSubscription(subscription, supabase);
      break;
    }
    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      await handlePaymentFailed(invoice, supabase);
      break;
    }
    default:
      break;
  }

  return { received: true };
}

async function handleCheckoutCompleted(
  session: Stripe.Checkout.Session,
  supabase: NonNullable<ReturnType<typeof createServiceClientSafe>>,
  stripe: Stripe,
) {
  const applicationId = session.metadata?.application_id;
  const planId = session.metadata?.membership_plan_id;
  if (!applicationId || !planId) return;

  const { data: application } = await supabase
    .from("applications")
    .select("*")
    .eq("id", applicationId)
    .single();

  if (!application) return;

  const subscriptionId =
    typeof session.subscription === "string"
      ? session.subscription
      : session.subscription?.id;

  const customerId =
    typeof session.customer === "string"
      ? session.customer
      : session.customer?.id;

  let periodEnd: string | null = null;
  if (subscriptionId) {
    const sub = await stripe.subscriptions.retrieve(subscriptionId);
    const periodEndUnix = (sub as Stripe.Subscription & { current_period_end?: number })
      .current_period_end;
    if (periodEndUnix) {
      periodEnd = new Date(periodEndUnix * 1000).toISOString();
    }
  }

  const { data: member } = await supabase
    .from("members")
    .insert({
      application_id: applicationId,
      membership_plan_id: planId,
      status: "active",
      joined_at: new Date().toISOString(),
      expiration_date: periodEnd,
      stripe_customer_id: customerId,
      profile: {
        first_name: application.first_name,
        last_name: application.last_name,
        email: application.email,
      },
    })
    .select()
    .single();

  if (member && subscriptionId && customerId) {
    await supabase.from("subscriptions").insert({
      member_id: member.id,
      stripe_subscription_id: subscriptionId,
      stripe_customer_id: customerId,
      status: "active",
      current_period_end: periodEnd,
    });
  }

  if (session.amount_total) {
    await supabase.from("payments").insert({
      member_id: member?.id,
      application_id: applicationId,
      amount: session.amount_total,
      status: "succeeded",
      stripe_payment_intent_id:
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : session.payment_intent?.id,
    });
  }

  await sendEmail({
    to: application.email,
    subject: "Payment Successful — Revved Up Rally",
    html: paymentSuccessfulTemplate({
      name: application.first_name,
      planName: planId.toUpperCase(),
    }),
  });

  if (member) {
    await sendEmail({
      to: application.email,
      subject: "Membership Activated — Revved Up Rally",
      html: membershipActivatedTemplate({
        name: application.first_name,
        membershipNumber: member.membership_number ?? "RR-PENDING",
        planName: planId.toUpperCase(),
      }),
    });
  }
}

async function syncSubscription(
  subscription: Stripe.Subscription,
  supabase: NonNullable<ReturnType<typeof createServiceClientSafe>>,
) {
  const { data: existing } = await supabase
    .from("subscriptions")
    .select("member_id")
    .eq("stripe_subscription_id", subscription.id)
    .single();

  if (!existing) return;

  const status = subscription.status;
  const periodEndUnix = (subscription as Stripe.Subscription & { current_period_end?: number })
    .current_period_end;
  const periodEnd = periodEndUnix
    ? new Date(periodEndUnix * 1000).toISOString()
    : null;

  await supabase
    .from("subscriptions")
    .update({
      status,
      current_period_end: periodEnd,
      cancel_at_period_end: subscription.cancel_at_period_end,
    })
    .eq("stripe_subscription_id", subscription.id);

  const memberStatus =
    status === "active" ? "active" : status === "canceled" ? "expired" : "suspended";

  await supabase
    .from("members")
    .update({ status: memberStatus, expiration_date: periodEnd })
    .eq("id", existing.member_id);
}

async function handlePaymentFailed(
  invoice: Stripe.Invoice,
  supabase: NonNullable<ReturnType<typeof createServiceClientSafe>>,
) {
  const customerId =
    typeof invoice.customer === "string" ? invoice.customer : invoice.customer?.id;

  if (!customerId) return;

  const { data: member } = await supabase
    .from("members")
    .select("profile")
    .eq("stripe_customer_id", customerId)
    .single();

  const profile = member?.profile as { email?: string; first_name?: string } | undefined;
  if (profile?.email) {
    await sendEmail({
      to: profile.email,
      subject: "Payment Failed — Revved Up Rally",
      html: paymentFailedTemplate({ name: profile.first_name ?? "Member" }),
    });
  }
}
