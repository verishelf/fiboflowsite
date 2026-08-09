import Stripe from "stripe";
import { isStripeConfigured } from "@/lib/env";

let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
  if (!isStripeConfigured()) {
    throw new Error("Stripe is not configured. Set STRIPE_SECRET_KEY.");
  }
  if (!stripeInstance) {
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2026-07-29.dahlia",
      typescript: true,
    });
  }
  return stripeInstance;
}

export function getStripeSafe(): Stripe | null {
  if (!isStripeConfigured()) return null;
  return getStripe();
}
