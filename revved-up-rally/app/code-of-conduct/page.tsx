import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/metadata";
import { PageHeader } from "@/components/layout/PageHeader";
import { LegalNotice } from "@/components/legal/LegalNotice";

export const metadata: Metadata = createPageMetadata({
  title: "Code of Conduct",
  description: "Code of Conduct for Revved Up Rally members and event participants.",
  path: "/code-of-conduct",
});

export default function CodeOfConductPage() {
  return (
    <main>
      <PageHeader title="Code of Conduct" />
      <section className="section-padding mx-auto max-w-3xl">
        <LegalNotice title="Code of Conduct" />
        <div className="space-y-6 text-sm leading-relaxed text-white/60">
          <p>Last updated: January 1, 2027</p>
          <h2 className="font-display text-lg uppercase tracking-[0.08em] text-off-white">
            Our Standards
          </h2>
          <p>
            Revved Up Rally is built on mutual respect, safety, and a shared passion for
            exceptional automotive experiences. All members and participants are expected to
            conduct themselves with integrity and consideration for others.
          </p>
          <h2 className="font-display text-lg uppercase tracking-[0.08em] text-off-white">
            Expected Behavior
          </h2>
          <ul className="list-inside list-disc space-y-2">
            <li>Treat all members, staff, partners, and the public with respect</li>
            <li>Operate vehicles safely and in compliance with all traffic laws</li>
            <li>Represent Revved Up Rally positively in all interactions</li>
            <li>Respect private property and rally venues</li>
            <li>Report safety concerns promptly to rally staff</li>
          </ul>
          <h2 className="font-display text-lg uppercase tracking-[0.08em] text-off-white">
            Prohibited Conduct
          </h2>
          <p>
            Reckless driving, harassment, discrimination, illegal activity, or behavior that
            endangers others will result in immediate removal from events and potential
            membership termination.
          </p>
        </div>
      </section>
    </main>
  );
}
