import { redirect } from "next/navigation";
import { createServiceClientSafe } from "@/lib/supabase/server";
import { createCheckoutSession } from "@/lib/stripe/checkout";
import { SEED_RALLIES } from "@/lib/data/seed-data";
import type { Application } from "@/types/database";

interface Props {
  params: Promise<{ applicationId: string }>;
}

export default async function CheckoutPage({ params }: Props) {
  const { applicationId } = await params;
  const supabase = createServiceClientSafe();

  let application: Application | null = null;

  if (supabase) {
    const { data } = await supabase
      .from("applications")
      .select("*")
      .eq("id", applicationId)
      .single();
    application = data as Application | null;
  }

  if (!application) {
    return (
      <div className="section-padding mx-auto max-w-xl pt-32 text-center">
        <h1 className="font-display text-2xl uppercase tracking-[0.15em]">
          Checkout Unavailable
        </h1>
        <p className="mt-6 text-white/60">
          Application not found or Supabase is not configured. Complete setup to
          enable payments.
        </p>
      </div>
    );
  }

  if (application.status !== "approved") {
    return (
      <div className="section-padding mx-auto max-w-xl pt-32 text-center">
        <h1 className="font-display text-2xl uppercase tracking-[0.15em]">
          Pending Approval
        </h1>
        <p className="mt-6 text-white/60">
          Your application must be approved before checkout.
        </p>
      </div>
    );
  }

  try {
    const session = await createCheckoutSession(application);
    if (session.url) redirect(session.url);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Checkout failed";
    return (
      <div className="section-padding mx-auto max-w-xl pt-32 text-center">
        <h1 className="font-display text-2xl uppercase tracking-[0.15em]">
          Checkout Error
        </h1>
        <p className="mt-6 text-white/60">{message}</p>
        <p className="mt-4 text-xs text-white/40">
          Configure STRIPE_SECRET_KEY and price IDs in .env.local
        </p>
      </div>
    );
  }

  return null;
}

// Prevent unused import warning in dev
void SEED_RALLIES;
