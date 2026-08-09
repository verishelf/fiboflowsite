import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/metadata";
import { PageHeader } from "@/components/layout/PageHeader";
import { ApplicationForm } from "@/components/forms/ApplicationForm";

export const metadata: Metadata = createPageMetadata({
  title: "Apply",
  description:
    "Apply for Revved Up Rally membership — join an exclusive community of automotive enthusiasts.",
  path: "/apply",
});

export default function ApplyPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Membership"
        title="Apply"
        description="Complete the application below to join Revved Up Rally. Our membership committee reviews every application personally."
      />
      <section className="section-padding mx-auto max-w-4xl">
        <ApplicationForm />
      </section>
    </main>
  );
}
