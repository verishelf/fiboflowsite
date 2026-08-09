import type { Metadata } from "next";
import { getRallies } from "@/lib/data/queries";
import { createPageMetadata } from "@/lib/metadata";
import { PageHeader } from "@/components/layout/PageHeader";
import { RallyCard } from "@/components/rallies/RallyCard";

export const metadata: Metadata = createPageMetadata({
  title: "Rallies",
  description:
    "Explore curated automotive rally experiences — from desert highways to coastal drives across America's most iconic routes.",
  path: "/rallies",
});

export default async function RalliesPage() {
  const rallies = await getRallies();

  return (
    <main>
      <PageHeader
        eyebrow="Experiences"
        title="Rallies"
        description="Hand-selected routes, luxury accommodations, and unforgettable drives designed for enthusiasts who demand more."
      />
      <section className="section-padding mx-auto max-w-7xl">
        <div className="grid gap-8 md:grid-cols-2">
          {rallies.map((rally) => (
            <RallyCard key={rally.id} rally={rally} />
          ))}
        </div>
      </section>
    </main>
  );
}
