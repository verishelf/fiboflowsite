import type { Metadata } from "next";
import { getPartners } from "@/lib/data/queries";
import { PARTNER_CATEGORY_LABELS } from "@/lib/constants/categories";
import { createPageMetadata } from "@/lib/metadata";
import { PageHeader } from "@/components/layout/PageHeader";
import { PartnerCard } from "@/components/partners/PartnerCard";
import type { PartnerCategory } from "@/types/database";

export const metadata: Metadata = createPageMetadata({
  title: "Partners",
  description:
    "Exclusive partner benefits for Revved Up Rally members — hotels, dining, detailing, and more.",
  path: "/partners",
});

export default async function PartnersPage() {
  const partners = await getPartners();
  const categories = Object.keys(PARTNER_CATEGORY_LABELS) as PartnerCategory[];

  const grouped = categories
    .map((category) => ({
      category,
      label: PARTNER_CATEGORY_LABELS[category],
      partners: partners.filter((p) => p.category === category),
    }))
    .filter((group) => group.partners.length > 0);

  return (
    <main>
      <PageHeader
        eyebrow="Member Benefits"
        title="Partners"
        description="Our partner network extends the Revved Up Rally experience beyond the road — exclusive access, priority reservations, and member pricing."
      />
      <section className="section-padding mx-auto max-w-7xl space-y-16">
        {grouped.map((group) => (
          <div key={group.category}>
            <h2 className="font-display text-2xl uppercase tracking-[0.1em] text-off-white">
              {group.label}
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {group.partners.map((partner) => (
                <PartnerCard key={partner.id} partner={partner} />
              ))}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
