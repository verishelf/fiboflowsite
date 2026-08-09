import type { Metadata } from "next";
import { getDestinations } from "@/lib/data/queries";
import { createPageMetadata } from "@/lib/metadata";
import { PageHeader } from "@/components/layout/PageHeader";
import { DestinationCard } from "@/components/destinations/DestinationCard";

export const metadata: Metadata = createPageMetadata({
  title: "Destinations",
  description:
    "Discover the iconic destinations that define Revved Up Rally — from coastal highways to desert resorts.",
  path: "/destinations",
});

export default async function DestinationsPage() {
  const destinations = await getDestinations();

  return (
    <main>
      <PageHeader
        eyebrow="Explore"
        title="Destinations"
        description="From Los Angeles to Big Sur, each destination is chosen for its roads, culture, and the experiences waiting at the end of the drive."
      />
      <section className="section-padding mx-auto max-w-7xl">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.map((destination) => (
            <DestinationCard key={destination.id} destination={destination} />
          ))}
        </div>
      </section>
    </main>
  );
}
