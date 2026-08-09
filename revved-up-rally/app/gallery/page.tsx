import type { Metadata } from "next";
import { getGalleryItems } from "@/lib/data/queries";
import { createPageMetadata } from "@/lib/metadata";
import { PageHeader } from "@/components/layout/PageHeader";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";

export const metadata: Metadata = createPageMetadata({
  title: "Gallery",
  description:
    "Moments from Revved Up Rally — exceptional cars, iconic destinations, and the community that brings it all together.",
  path: "/gallery",
});

export default async function GalleryPage() {
  const items = await getGalleryItems();

  return (
    <main>
      <PageHeader
        eyebrow="Visual Stories"
        title="Gallery"
        description="A curated collection of rally moments, member machines, and the destinations that define our journeys."
      />
      <section className="section-padding mx-auto max-w-7xl">
        <GalleryGrid items={items} />
      </section>
    </main>
  );
}
