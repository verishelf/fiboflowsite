"use server";

import { contactSchema } from "@/lib/validations/schemas";
import { createServiceClientSafe } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/rate-limit";
import type { ActionResult } from "@/types/actions";

export async function submitContact(data: unknown): Promise<ActionResult> {
  const parsed = contactSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message ?? "Invalid data" };
  }

  const limit = rateLimit(`contact:${parsed.data.email}`, 5, 3600_000);
  if (!limit.success) {
    return { success: false, error: "Too many submissions. Please try again later." };
  }

  const supabase = createServiceClientSafe();
  if (!supabase) {
    console.info("[dev] Contact submission:", parsed.data);
    return { success: true };
  }

  const { error } = await supabase.from("contact_submissions").insert({
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone || null,
    subject: parsed.data.subject,
    message: parsed.data.message,
  });

  if (error) return { success: false, error: error.message };
  return { success: true };
}
