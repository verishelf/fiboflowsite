import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/metadata";
import { PageHeader } from "@/components/layout/PageHeader";
import { LegalNotice } from "@/components/legal/LegalNotice";

export const metadata: Metadata = createPageMetadata({
  title: "Terms of Service",
  description: "Terms of Service for Revved Up Rally membership and services.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <main>
      <PageHeader title="Terms of Service" />
      <section className="section-padding mx-auto max-w-3xl">
        <LegalNotice title="Terms of Service" />
        <div className="prose prose-invert max-w-none space-y-6 text-sm leading-relaxed text-white/60">
          <p>Last updated: January 1, 2027</p>
          <h2 className="font-display text-lg uppercase tracking-[0.08em] text-off-white">
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing or using Revved Up Rally services, website, or participating in any
            rally event, you agree to be bound by these Terms of Service. If you do not agree,
            you may not use our services.
          </p>
          <h2 className="font-display text-lg uppercase tracking-[0.08em] text-off-white">
            2. Membership
          </h2>
          <p>
            Membership is subject to application approval, payment of applicable fees, and
            compliance with our Membership Agreement and Code of Conduct. Revved Up Rally
            reserves the right to approve or deny any application at its sole discretion.
          </p>
          <h2 className="font-display text-lg uppercase tracking-[0.08em] text-off-white">
            3. Rally Participation
          </h2>
          <p>
            Rally participation requires active membership, vehicle compliance with stated
            requirements, and adherence to all rally rules and safety guidelines. Participants
            assume responsibility for their own vehicles and conduct during events.
          </p>
          <h2 className="font-display text-lg uppercase tracking-[0.08em] text-off-white">
            4. Limitation of Liability
          </h2>
          <p>
            To the maximum extent permitted by law, Revved Up Rally shall not be liable for any
            indirect, incidental, special, or consequential damages arising from participation
            in rallies or use of our services.
          </p>
        </div>
      </section>
    </main>
  );
}
