import { getStripeSafe } from "@/lib/stripe/client";
import { getSiteUrl } from "@/lib/env";
import { getPlanById, getStripePriceId } from "@/lib/pricing/membership-plans";
import type { Application } from "@/types/database";

export async function createCheckoutSession(application: Application) {
  const stripe = getStripeSafe();
  if (!stripe) {
    throw new Error("Stripe is not configured.");
  }

  if (application.status !== "approved") {
    throw new Error("Application must be approved before checkout.");
  }

  const plan = getPlanById(application.membership_plan_id as "basic" | "plus" | "elite" | "founders");
  if (!plan) {
    throw new Error("Invalid membership plan.");
  }

  const priceId = getStripePriceId(plan);
  if (!priceId) {
    throw new Error(`Stripe price ID not configured for ${plan.name}.`);
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${getSiteUrl()}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${getSiteUrl()}/checkout/cancel`,
    customer_email: application.email,
    metadata: {
      application_id: application.id,
      membership_plan_id: plan.id,
    },
    subscription_data: {
      metadata: {
        application_id: application.id,
        membership_plan_id: plan.id,
      },
    },
  });

  return session;
}
