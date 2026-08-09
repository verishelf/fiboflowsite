"use client";

import Image from "next/image";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { RALLY_EXPERIENCE_STEPS } from "@/lib/data/seed-data";
import { cn } from "@/lib/utils";

export function RallyExperience() {
  return (
    <section className="section-padding border-t border-white/10 bg-charcoal">
      <div className="mx-auto max-w-7xl">
        <ScrollReveal>
          <SectionHeading
            eyebrow="The Experience"
            title="Four Chapters"
            description="Every rally follows a narrative arc — from arrival to the final celebration. Each chapter is designed to elevate the journey."
          />
        </ScrollReveal>

        <div className="mt-20 space-y-24">
          {RALLY_EXPERIENCE_STEPS.map((step, index) => (
            <ScrollReveal key={step.number} delay={index * 0.05}>
              <article
                className={cn(
                  "grid items-center gap-10 lg:grid-cols-2 lg:gap-16",
                  index % 2 === 1 && "lg:[&>*:first-child]:order-2",
                )}
              >
                <div className="relative aspect-[4/3] overflow-hidden border border-white/10">
                  <Image
                    src={step.image}
                    alt={step.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <span className="absolute left-6 top-6 font-display text-5xl text-off-white/20 md:text-7xl">
                    {step.number}
                  </span>
                </div>

                <div>
                  <p className="mb-3 text-xs uppercase tracking-[0.35em] text-white/40">
                    Chapter {step.number}
                  </p>
                  <h3 className="font-display text-3xl uppercase tracking-[0.12em] text-off-white md:text-4xl">
                    {step.title}
                  </h3>
                  <p className="mt-6 text-base leading-relaxed text-white/60">
                    {step.description}
                  </p>
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
