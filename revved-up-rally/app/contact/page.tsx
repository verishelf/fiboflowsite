import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/metadata";
import { PageHeader } from "@/components/layout/PageHeader";
import { ContactForm } from "@/components/forms/ContactForm";

export const metadata: Metadata = createPageMetadata({
  title: "Contact",
  description:
    "Get in touch with the Revved Up Rally team — membership inquiries, partnerships, and general questions.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Get in Touch"
        title="Contact"
        description="Whether you have questions about membership, partnerships, or upcoming rallies, we would love to hear from you."
      />
      <section className="section-padding mx-auto max-w-3xl">
        <div className="mb-12 grid gap-8 border border-white/10 bg-charcoal p-8 md:grid-cols-2">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">Email</p>
            <p className="mt-2 text-sm text-off-white">hello@revveduprally.com</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">Response Time</p>
            <p className="mt-2 text-sm text-white/60">Within 2 business days</p>
          </div>
        </div>
        <ContactForm />
      </section>
    </main>
  );
}
