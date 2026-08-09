import { NextResponse } from "next/server";
import { handleStripeWebhook } from "@/lib/stripe/webhook";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const result = await handleStripeWebhook(body, signature);

  if (!result.received) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ received: true });
}
