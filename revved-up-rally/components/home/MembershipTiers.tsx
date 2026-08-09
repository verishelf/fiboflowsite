"use client";

import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { MembershipCard } from "@/components/membership/MembershipCard";
import { MEMBERSHIP_PLANS } from "@/lib/pricing/membership-plans";

export function MembershipTiers() {
  return (
    <section id="membership" className="section-padding border-t border-white/10">
      <div className="mx-auto max-w-7xl">
        <ScrollReveal>
          <SectionHeading
            eyebrow="Membership"
            title="Choose Your Tier"
            description="Four levels of access — from community entry to founding member status. Each tier unlocks a deeper connection to the Revved Up Rally experience."
            align="center"
            className="mx-auto"
          />
        </ScrollReveal>

        <div className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {MEMBERSHIP_PLANS.map((plan, index) => (
            <ScrollReveal key={plan.id} delay={index * 0.05}>
              <MembershipCard plan={plan} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
