import type { Metadata } from "next";
import Image from "next/image";
import { ABOUT_TIMELINE } from "@/lib/data/seed-data";
import { createPageMetadata } from "@/lib/metadata";
import { PageHeader } from "@/components/layout/PageHeader";

export const metadata: Metadata = createPageMetadata({
  title: "About",
  description:
    "The story of Revved Up Rally — an exclusive automotive experience built for enthusiasts who demand more.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Our Story"
        title="About"
        description="Revved Up Rally was born from a simple belief: the drive should be as extraordinary as the destination."
      />

      <section className="section-padding mx-auto max-w-7xl">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="font-display text-3xl uppercase tracking-[0.1em] text-off-white">
              Beyond the Club
            </h2>
            <p className="mt-6 text-base leading-relaxed text-white/60">
              We are not a traditional car club. Revved Up Rally is a curated experience —
              hand-selected routes, luxury accommodations, and a community of enthusiasts who
              share a passion for exceptional machines and unforgettable journeys.
            </p>
            <p className="mt-4 text-base leading-relaxed text-white/60">
              Every rally is designed with intention: the roads, the pacing, the destinations,
              and the people. From desert highways to coastal drives, we create moments that
              extend far beyond the final checkpoint.
            </p>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden border border-white/10">
            <Image
              src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80"
              alt="Revved Up Rally"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 section-padding">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-xs uppercase tracking-[0.25em] text-white/40">Timeline</h2>
          <div className="mt-12 space-y-0">
            {ABOUT_TIMELINE.map((item) => (
              <div
                key={item.title}
                className="grid gap-6 border-b border-white/10 py-10 md:grid-cols-[120px_1fr] md:gap-12"
              >
                <p className="font-display text-2xl text-white/30">{item.year}</p>
                <div>
                  <h3 className="font-display text-xl uppercase tracking-[0.08em] text-off-white">
                    {item.title}
                  </h3>
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/60">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
