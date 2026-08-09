import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/metadata";
import { PageHeader } from "@/components/layout/PageHeader";
import { LegalNotice } from "@/components/legal/LegalNotice";

export const metadata: Metadata = createPageMetadata({
  title: "Privacy Policy",
  description: "Privacy Policy for Revved Up Rally — how we collect, use, and protect your data.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <main>
      <PageHeader title="Privacy Policy" />
      <section className="section-padding mx-auto max-w-3xl">
        <LegalNotice title="Privacy Policy" />
        <div className="space-y-6 text-sm leading-relaxed text-white/60">
          <p>Last updated: January 1, 2027</p>
          <h2 className="font-display text-lg uppercase tracking-[0.08em] text-off-white">
            Information We Collect
          </h2>
          <p>
            We collect information you provide directly, including name, email, phone number,
            vehicle information, and payment details when you apply for membership or register
            for events.
          </p>
          <h2 className="font-display text-lg uppercase tracking-[0.08em] text-off-white">
            How We Use Your Information
          </h2>
          <p>
            We use collected information to process applications, manage membership, communicate
            about rallies and events, and improve our services. We do not sell personal
            information to third parties.
          </p>
          <h2 className="font-display text-lg uppercase tracking-[0.08em] text-off-white">
            Data Security
          </h2>
          <p>
            We implement appropriate technical and organizational measures to protect your
            personal information. However, no method of transmission over the Internet is
            completely secure.
          </p>
        </div>
      </section>
    </main>
  );
}
