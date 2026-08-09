"use client";

import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { Carousel } from "@/components/ui/Carousel";
import { RallyCard } from "@/components/rallies/RallyCard";
import { SEED_RALLIES } from "@/lib/data/seed-data";
import type { Rally } from "@/types/database";

interface UpcomingRalliesProps {
  rallies?: Rally[];
}

export function UpcomingRallies({ rallies }: UpcomingRalliesProps) {
  const items = (rallies ?? SEED_RALLIES).filter((rally) => rally.published);

  return (
    <section id="rallies" className="section-padding border-t border-white/10">
      <div className="mx-auto max-w-7xl">
        <ScrollReveal>
          <SectionHeading
            eyebrow="2027 Season"
            title="Upcoming Rallies"
            description="Four curated journeys across the most iconic landscapes in the American West. Each rally limited to an exclusive group of members."
          />
        </ScrollReveal>

        <ScrollReveal delay={0.1} className="mt-16">
          <Carousel>
            {items.map((rally) => (
              <RallyCard key={rally.id} rally={rally} />
            ))}
          </Carousel>
        </ScrollReveal>
      </div>
    </section>
  );
}
