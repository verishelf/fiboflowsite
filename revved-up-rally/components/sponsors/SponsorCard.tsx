import type { Sponsor } from "@/types/database";
import { SPONSOR_CATEGORY_LABELS } from "@/lib/constants/categories";
import { ExternalLink } from "lucide-react";

interface SponsorCardProps {
  sponsor: Sponsor;
}

export function SponsorCard({ sponsor }: SponsorCardProps) {
  return (
    <article className="flex flex-col border border-white/10 bg-charcoal p-6 transition-colors hover:border-white/20">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.25em] text-white/40">
            {SPONSOR_CATEGORY_LABELS[sponsor.category]}
          </p>
          <h3 className="mt-2 font-display text-lg uppercase tracking-[0.08em] text-off-white">
            {sponsor.name}
          </h3>
        </div>
        {sponsor.featured && (
          <span className="shrink-0 border border-off-white/20 px-2 py-0.5 text-[9px] uppercase tracking-[0.15em] text-white/50">
            Featured
          </span>
        )}
      </div>
      {sponsor.description && (
        <p className="mt-4 flex-1 text-sm leading-relaxed text-white/50">
          {sponsor.description}
        </p>
      )}
      {sponsor.website && (
        <a
          href={sponsor.website}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-white/40 transition-colors hover:text-off-white"
        >
          Visit
          <ExternalLink className="h-3 w-3" />
        </a>
      )}
    </article>
  );
}
