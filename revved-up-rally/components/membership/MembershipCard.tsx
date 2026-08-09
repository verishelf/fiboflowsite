import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { MembershipPlan } from "@/lib/pricing/membership-plans";
import { cn, formatCurrency } from "@/lib/utils";

interface MembershipCardProps {
  plan: MembershipPlan;
  className?: string;
  highlighted?: boolean;
}

export function MembershipCard({
  plan,
  className,
  highlighted,
}: MembershipCardProps) {
  const isHighlighted = highlighted ?? plan.id === "plus";

  return (
    <article
      className={cn(
        "relative flex h-full flex-col border p-8 transition-colors",
        isHighlighted
          ? "border-off-white bg-charcoal"
          : "border-white/10 bg-black hover:border-white/25",
        className,
      )}
    >
      {plan.badge && (
        <span className="absolute -top-3 left-8 border border-white/20 bg-black px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-off-white">
          {plan.badge}
        </span>
      )}

      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.3em] text-white/40">
          {plan.name}
        </p>
        <div className="mt-4 flex items-baseline gap-2">
          <span className="font-display text-4xl text-off-white">
            {formatCurrency(plan.priceAnnual)}
          </span>
          <span className="text-sm text-white/40">/ year</span>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-white/60">
          {plan.description}
        </p>
      </div>

      <ul className="mb-10 flex-1 space-y-3">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-3 text-sm text-white/70">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-off-white/70" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <Button asChild variant={isHighlighted ? "default" : "secondary"} className="w-full">
        <Link href={`/membership/${plan.id}`}>{plan.buttonLabel}</Link>
      </Button>
    </article>
  );
}
