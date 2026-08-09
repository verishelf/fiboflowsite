import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/metadata";
import { PageHeader } from "@/components/layout/PageHeader";
import { LegalNotice } from "@/components/legal/LegalNotice";

export const metadata: Metadata = createPageMetadata({
  title: "Rally Rules",
  description: "Official rules and guidelines for Revved Up Rally event participation.",
  path: "/rally-rules",
});

export default function RallyRulesPage() {
  return (
    <main>
      <PageHeader title="Rally Rules" />
      <section className="section-padding mx-auto max-w-3xl">
        <LegalNotice title="Rally Rules" />
        <div className="space-y-6 text-sm leading-relaxed text-white/60">
          <p>Last updated: January 1, 2027</p>
          <h2 className="font-display text-lg uppercase tracking-[0.08em] text-off-white">
            General Rules
          </h2>
          <p>
            All rally participants must hold a valid driver&apos;s license, maintain active
            membership, and ensure their vehicle meets stated requirements for the specific
            rally. Registration is required prior to event participation.
          </p>
          <h2 className="font-display text-lg uppercase tracking-[0.08em] text-off-white">
            On-Road Conduct
          </h2>
          <ul className="list-inside list-disc space-y-2">
            <li>Obey all traffic laws and speed limits at all times</li>
            <li>Follow designated route and pacing guidelines</li>
            <li>No racing or competitive driving on public roads</li>
            <li>Maintain safe following distances within the convoy</li>
            <li>Use designated communication channels during drives</li>
          </ul>
          <h2 className="font-display text-lg uppercase tracking-[0.08em] text-off-white">
            Vehicle Requirements
          </h2>
          <p>
            Vehicles must be in safe operating condition with current registration and
            insurance. Specific rallies may have additional horsepower, performance, or
            vehicle type requirements as stated in rally details.
          </p>
        </div>
      </section>
    </main>
  );
}
