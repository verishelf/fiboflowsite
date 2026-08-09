"use server";

import { requireAdmin } from "@/lib/auth";
import { createServiceClientSafe } from "@/lib/supabase/server";
import { createCheckoutSession } from "@/lib/stripe/checkout";
import { sendEmail } from "@/lib/email";
import { applicationApprovedTemplate, applicationRejectedTemplate } from "@/lib/email/templates";
import { getSiteUrl } from "@/lib/env";
import type { ActionResult } from "@/types/actions";
import type { Application } from "@/types/database";

async function getApplication(id: string): Promise<Application | null> {
  const supabase = createServiceClientSafe();
  if (!supabase) return null;
  const { data } = await supabase.from("applications").select("*").eq("id", id).single();
  return data as Application | null;
}

export async function approveApplication(
  id: string,
  notes?: string,
): Promise<ActionResult<{ checkoutUrl?: string }>> {
  try {
    await requireAdmin();
  } catch {
    return { success: false, error: "Unauthorized" };
  }

  const supabase = createServiceClientSafe();
  if (!supabase) {
    return { success: true, data: { checkoutUrl: `${getSiteUrl()}/checkout/${id}` } };
  }

  const application = await getApplication(id);
  if (!application) return { success: false, error: "Application not found" };

  await supabase
    .from("applications")
    .update({
      status: "approved",
      admin_notes: notes ?? null,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", id);

  const approvedApplication = { ...application, status: "approved" as const };
  let checkoutUrl = `${getSiteUrl()}/checkout/${id}`;

  try {
    const session = await createCheckoutSession(approvedApplication);
    checkoutUrl = session.url ?? checkoutUrl;
    await supabase
      .from("applications")
      .update({ stripe_checkout_session_id: session.id })
      .eq("id", id);
  } catch (err) {
    console.error("[admin] Stripe checkout creation failed:", err);
  }

  await sendEmail({
    to: application.email,
    subject: "Application Approved — Revved Up Rally",
    html: applicationApprovedTemplate({
      name: application.first_name,
      checkoutUrl,
    }),
  });

  return { success: true, data: { checkoutUrl } };
}

export async function rejectApplication(
  id: string,
  notes?: string,
): Promise<ActionResult> {
  try {
    await requireAdmin();
  } catch {
    return { success: false, error: "Unauthorized" };
  }

  const supabase = createServiceClientSafe();
  const application = await getApplication(id);
  if (!application) return { success: false, error: "Application not found" };

  if (supabase) {
    await supabase
      .from("applications")
      .update({
        status: "rejected",
        admin_notes: notes ?? null,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", id);
  }

  await sendEmail({
    to: application.email,
    subject: "Application Update — Revved Up Rally",
    html: applicationRejectedTemplate({ name: application.first_name }),
  });

  return { success: true };
}

export async function waitlistApplication(
  id: string,
  notes?: string,
): Promise<ActionResult> {
  try {
    await requireAdmin();
  } catch {
    return { success: false, error: "Unauthorized" };
  }

  const supabase = createServiceClientSafe();
  if (!supabase) return { success: true };

  const { error } = await supabase
    .from("applications")
    .update({
      status: "waitlisted",
      admin_notes: notes ?? null,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function getApplications(): Promise<Application[]> {
  try {
    await requireAdmin();
  } catch {
    return [];
  }

  const supabase = createServiceClientSafe();
  if (!supabase) return [];

  const { data } = await supabase
    .from("applications")
    .select("*")
    .order("created_at", { ascending: false });

  return (data ?? []) as Application[];
}
