"use server";

import { newsletterSchema } from "@/lib/validations/schemas";

export type NewsletterActionState = {
  success: boolean;
  message: string;
};

export async function subscribeNewsletter(
  _prevState: NewsletterActionState,
  formData: FormData,
): Promise<NewsletterActionState> {
  const email = formData.get("email");
  const parsed = newsletterSchema.safeParse({ email });

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.errors[0]?.message ?? "Invalid email address.",
    };
  }

  // Placeholder — integrate with email provider when configured
  console.info("Newsletter subscription:", parsed.data.email);

  return {
    success: true,
    message: "Thank you for subscribing.",
  };
}
