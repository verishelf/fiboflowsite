"use client";

import { Check, Minus } from "lucide-react";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { SectionHeading } from "@/components/layout/SectionHeading";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  COMPARISON_LABELS,
  MEMBERSHIP_PLANS,
  type ComparisonFeature,
} from "@/lib/pricing/membership-plans";
import { cn, formatCurrency } from "@/lib/utils";

const comparisonFeatures = Object.keys(COMPARISON_LABELS) as ComparisonFeature[];

function FeatureIcon({ included }: { included: boolean }) {
  return included ? (
    <Check className="h-4 w-4 text-off-white" aria-label="Included" />
  ) : (
    <Minus className="h-4 w-4 text-white/20" aria-label="Not included" />
  );
}

export function MembershipComparison() {
  return (
    <section className="section-padding border-t border-white/10 bg-charcoal">
      <div className="mx-auto max-w-7xl">
        <ScrollReveal>
          <SectionHeading
            eyebrow="Compare"
            title="Membership at a Glance"
            description="A detailed look at what each tier includes — so you can find the level of access that fits your lifestyle."
            align="center"
            className="mx-auto"
          />
        </ScrollReveal>

        <ScrollReveal delay={0.1} className="mt-16 hidden lg:block">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] border-collapse text-left">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="py-4 pr-6 text-xs uppercase tracking-[0.2em] text-white/40">
                    Feature
                  </th>
                  {MEMBERSHIP_PLANS.map((plan) => (
                    <th
                      key={plan.id}
                      className="px-4 py-4 text-center text-xs uppercase tracking-[0.2em] text-off-white"
                    >
                      <div>{plan.name}</div>
                      <div className="mt-2 font-display text-lg normal-case tracking-normal text-white/60">
                        {formatCurrency(plan.priceAnnual)}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((feature) => (
                  <tr key={feature} className="border-b border-white/5">
                    <td className="py-4 pr-6 text-sm text-white/70">
                      {COMPARISON_LABELS[feature]}
                    </td>
                    {MEMBERSHIP_PLANS.map((plan) => (
                      <td key={plan.id} className="px-4 py-4 text-center">
                        <span className="inline-flex justify-center">
                          <FeatureIcon included={plan.comparison[feature]} />
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1} className="mt-16 lg:hidden">
          <Accordion type="single" collapsible className="w-full">
            {MEMBERSHIP_PLANS.map((plan) => (
              <AccordionItem key={plan.id} value={plan.id}>
                <AccordionTrigger className="text-off-white">
                  <span className="flex flex-col items-start gap-1">
                    <span>{plan.name}</span>
                    <span className="font-display text-lg normal-case tracking-normal text-white/50">
                      {formatCurrency(plan.priceAnnual)} / year
                    </span>
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-3">
                    {comparisonFeatures.map((feature) => (
                      <li
                        key={feature}
                        className={cn(
                          "flex items-center justify-between gap-4 text-sm",
                          plan.comparison[feature]
                            ? "text-white/80"
                            : "text-white/30",
                        )}
                      >
                        <span>{COMPARISON_LABELS[feature]}</span>
                        <FeatureIcon included={plan.comparison[feature]} />
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </ScrollReveal>
      </div>
    </section>
  );
}
