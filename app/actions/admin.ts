"use server";

import { requireAdmin } from "@/lib/auth";
import { createServiceClientSafe } from "@/lib/supabase/server";
import { getApplications as getApplicationsFromDb } from "@/lib/data/admin-queries";
import { createCheckoutSession } from "@/lib/stripe/checkout";
import { sendEmail } from "@/lib/email";
import { applicationApprovedTemplate, applicationRejectedTemplate } from "@/lib/email/templates";
import { getSiteUrl } from "@/lib/env";
import type { ActionResult } from "@/types/actions";
import type { Application } from "@/types/database";

async function getApplication(id: string): Promise<Application | null> {
  const supabase = createServiceClientSafe();
  if (!supabase) {
    const apps = await getApplicationsFromDb();
    return apps.find((a) => a.id === id) ?? null;
  }
  const { data } = await supabase.from("applications").select("*").eq("id", id).single();
  return data as Application | null;
}

export async function getApplications(): Promise<Application[]> {
  try {
    await requireAdmin();
  } catch {
    return [];
  }
  return getApplicationsFromDb();
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
  const application = await getApplication(id);
  if (!application) return { success: false, error: "Application not found" };

  let checkoutUrl = `${getSiteUrl()}/checkout/${id}`;

  if (supabase) {
    try {
      const session = await createCheckoutSession(application);
      checkoutUrl = session.url ?? checkoutUrl;
      await supabase
        .from("applications")
        .update({
          status: "approved",
          admin_notes: notes ?? null,
          reviewed_at: new Date().toISOString(),
          stripe_checkout_session_id: session.id,
        })
        .eq("id", id);
    } catch {
      await supabase
        .from("applications")
        .update({
          status: "approved",
          admin_notes: notes ?? null,
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", id);
    }
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
