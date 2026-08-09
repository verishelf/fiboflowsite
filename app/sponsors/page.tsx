import type { Metadata } from "next";
import Link from "next/link";
import { getSponsors } from "@/lib/data/queries";
import { SPONSOR_CATEGORY_LABELS } from "@/lib/constants/categories";
import { createPageMetadata } from "@/lib/metadata";
import { PageHeader } from "@/components/layout/PageHeader";
import { SponsorCard } from "@/components/sponsors/SponsorCard";
import { Button } from "@/components/ui/button";
import type { SponsorCategory } from "@/types/database";

export const metadata: Metadata = createPageMetadata({
  title: "Sponsors",
  description:
    "Meet the brands that power Revved Up Rally — premium automotive, luxury lifestyle, and hospitality partners.",
  path: "/sponsors",
});

export default async function SponsorsPage() {
  const sponsors = await getSponsors();
  const categories = Object.keys(SPONSOR_CATEGORY_LABELS) as SponsorCategory[];

  const grouped = categories
    .map((category) => ({
      category,
      label: SPONSOR_CATEGORY_LABELS[category],
      sponsors: sponsors.filter((s) => s.category === category),
    }))
    .filter((group) => group.sponsors.length > 0);

  return (
    <main>
      <PageHeader
        eyebrow="Partnerships"
        title="Sponsors"
        description="Revved Up Rally is made possible by brands that share our passion for exceptional machines and unforgettable experiences."
      >
        <Button className="mt-8" asChild>
          <Link href="/sponsors/apply">Become a Sponsor</Link>
        </Button>
      </PageHeader>

      <section className="section-padding mx-auto max-w-7xl space-y-16">
        {grouped.map((group) => (
          <div key={group.category}>
            <h2 className="font-display text-2xl uppercase tracking-[0.1em] text-off-white">
              {group.label}
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {group.sponsors.map((sponsor) => (
                <SponsorCard key={sponsor.id} sponsor={sponsor} />
              ))}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
