import { Resend } from "resend";
import { isEmailConfigured } from "@/lib/env";

export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(payload: EmailPayload): Promise<boolean> {
  if (!isEmailConfigured()) {
    console.info("[email] Skipped (not configured):", payload.subject, "→", payload.to);
    return false;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: payload.to,
    subject: payload.subject,
    html: payload.html,
  });

  if (error) {
    console.error("[email] Failed:", error);
    return false;
  }
  return true;
}
