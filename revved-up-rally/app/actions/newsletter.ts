"use server";

import { newsletterSchema } from "@/lib/validations/schemas";
import { createServiceClientSafe } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/rate-limit";
import type { ActionResult } from "@/types/actions";

export type NewsletterActionState = {
  success: boolean;
  message: string;
};

export async function subscribeNewsletter(
  _prevState: NewsletterActionState,
  formData: FormData,
): Promise<NewsletterActionState> {
  const parsed = newsletterSchema.safeParse({
    email: formData.get("email"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.errors[0]?.message ?? "Invalid email",
    };
  }

  const limit = rateLimit(`newsletter:${parsed.data.email}`, 3, 3600_000);
  if (!limit.success) {
    return {
      success: false,
      message: "Too many attempts. Please try again later.",
    };
  }

  const supabase = createServiceClientSafe();
  if (!supabase) {
    console.info("[dev] Newsletter subscribe:", parsed.data.email);
    return {
      success: true,
      message: "Subscribed (dev mode — Supabase not configured).",
    };
  }

  const { error } = await supabase
    .from("newsletter_subscribers")
    .upsert({ email: parsed.data.email }, { onConflict: "email" });

  if (error) {
    return { success: false, message: error.message };
  }

  return {
    success: true,
    message: "You're subscribed. Welcome to the rally.",
  };
}

export async function subscribeNewsletterDirect(
  data: unknown,
): Promise<ActionResult<{ subscriberId?: string }>> {
  const parsed = newsletterSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.errors[0]?.message ?? "Invalid email",
    };
  }

  const limit = rateLimit(`newsletter:${parsed.data.email}`, 3, 3600_000);
  if (!limit.success) {
    return { success: false, error: "Too many attempts. Please try again later." };
  }

  const supabase = createServiceClientSafe();
  if (!supabase) {
    console.info("[dev] Newsletter subscribe:", parsed.data.email);
    return { success: true, data: { subscriberId: "dev-mode" } };
  }

  const { data: row, error } = await supabase
    .from("newsletter_subscribers")
    .upsert({ email: parsed.data.email }, { onConflict: "email" })
    .select("id")
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, data: { subscriberId: row.id } };
}
