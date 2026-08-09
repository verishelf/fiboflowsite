import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/metadata";
import { PageHeader } from "@/components/layout/PageHeader";
import { SponsorApplicationForm } from "@/components/forms/SponsorApplicationForm";

export const metadata: Metadata = createPageMetadata({
  title: "Sponsor Application",
  description:
    "Apply to become a Revved Up Rally sponsor and connect with an exclusive community of automotive enthusiasts.",
  path: "/sponsors/apply",
});

export default function SponsorApplyPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Partnerships"
        title="Sponsor Application"
        description="Join the brands that define automotive luxury. Tell us about your company and sponsorship goals."
      />
      <section className="section-padding mx-auto max-w-3xl">
        <SponsorApplicationForm />
      </section>
    </main>
  );
}
