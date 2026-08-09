"use client";

import Link from "next/link";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { DestinationCard } from "@/components/rallies/DestinationCard";
import { Button } from "@/components/ui/button";
import { SEED_DESTINATIONS } from "@/lib/data/seed-data";
import type { Destination } from "@/types/database";

interface DestinationsShowcaseProps {
  destinations?: Destination[];
}

export function DestinationsShowcase({ destinations }: DestinationsShowcaseProps) {
  const source = destinations ?? SEED_DESTINATIONS;
  const featured = source.filter((d) => d.featured).slice(0, 6);
  const [hero, ...rest] = featured;

  return (
    <section className="section-padding border-t border-white/10 bg-black">
      <div className="mx-auto max-w-7xl">
        <ScrollReveal>
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <SectionHeading
              eyebrow="Destinations"
              title="Where We Drive"
              description="From coastal highways to desert horizons — each destination chosen for its character, beauty, and the roads that lead there."
            />
            <Button asChild variant="secondary" className="shrink-0">
              <Link href="/destinations">View All</Link>
            </Button>
          </div>
        </ScrollReveal>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-12">
          {hero && (
            <ScrollReveal className="lg:col-span-7">
              <DestinationCard destination={hero} variant="featured" />
            </ScrollReveal>
          )}

          <div className="grid gap-6 sm:grid-cols-2 lg:col-span-5">
            {rest.slice(0, 2).map((destination, index) => (
              <ScrollReveal key={destination.id} delay={index * 0.05}>
                <DestinationCard destination={destination} />
              </ScrollReveal>
            ))}
          </div>

          {rest.slice(2).map((destination, index) => (
            <ScrollReveal
              key={destination.id}
              delay={index * 0.05}
              className="sm:col-span-1 lg:col-span-4"
            >
              <DestinationCard destination={destination} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
