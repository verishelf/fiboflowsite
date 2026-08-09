import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/metadata";
import { PageHeader } from "@/components/layout/PageHeader";
import { LegalNotice } from "@/components/legal/LegalNotice";

export const metadata: Metadata = createPageMetadata({
  title: "Membership Agreement",
  description: "Membership Agreement governing Revved Up Rally member rights and obligations.",
  path: "/membership-agreement",
});

export default function MembershipAgreementPage() {
  return (
    <main>
      <PageHeader title="Membership Agreement" />
      <section className="section-padding mx-auto max-w-3xl">
        <LegalNotice title="Membership Agreement" />
        <div className="space-y-6 text-sm leading-relaxed text-white/60">
          <p>Last updated: January 1, 2027</p>
          <h2 className="font-display text-lg uppercase tracking-[0.08em] text-off-white">
            Membership Terms
          </h2>
          <p>
            By becoming a member of Revved Up Rally, you agree to pay applicable annual
            membership fees, maintain accurate profile and vehicle information, and comply
            with all club policies including the Code of Conduct and Rally Rules.
          </p>
          <h2 className="font-display text-lg uppercase tracking-[0.08em] text-off-white">
            Membership Tiers
          </h2>
          <p>
            Membership benefits vary by tier (Basic, Plus, Elite, Founders). Tier-specific
            benefits are described at the time of application and may be updated with reasonable
            notice to members.
          </p>
          <h2 className="font-display text-lg uppercase tracking-[0.08em] text-off-white">
            Termination
          </h2>
          <p>
            Revved Up Rally may suspend or terminate membership for violation of club policies,
            non-payment, or conduct detrimental to the community. Members may cancel membership
            according to the cancellation policy in effect at the time of cancellation.
          </p>
        </div>
      </section>
    </main>
  );
}
