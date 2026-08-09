"use server";

import { sponsorApplicationSchema } from "@/lib/validations/schemas";
import { createServiceClientSafe } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/rate-limit";
import type { ActionResult } from "@/types/actions";

export async function submitSponsorApplication(data: unknown): Promise<ActionResult> {
  const parsed = sponsorApplicationSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message ?? "Invalid data" };
  }

  const limit = rateLimit(`sponsor:${parsed.data.email}`, 3, 3600_000);
  if (!limit.success) {
    return { success: false, error: "Too many submissions. Please try again later." };
  }

  const supabase = createServiceClientSafe();
  if (!supabase) {
    console.info("[dev] Sponsor application:", parsed.data);
    return { success: true };
  }

  const { error } = await supabase.from("sponsor_applications").insert({
    company: parsed.data.company,
    contact_name: parsed.data.contactName,
    email: parsed.data.email,
    phone: parsed.data.phone || null,
    website: parsed.data.website || null,
    industry: parsed.data.industry,
    sponsorship_interest: parsed.data.sponsorshipInterest,
    budget_range: parsed.data.budgetRange,
    message: parsed.data.message,
  });

  if (error) return { success: false, error: error.message };
  return { success: true };
}
