import type { Partner } from "@/types/database";
import { PARTNER_CATEGORY_LABELS } from "@/lib/constants/categories";
import { ExternalLink } from "lucide-react";

interface PartnerCardProps {
  partner: Partner;
}

export function PartnerCard({ partner }: PartnerCardProps) {
  return (
    <article className="flex flex-col border border-white/10 bg-charcoal p-6 transition-colors hover:border-white/20">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.25em] text-white/40">
            {PARTNER_CATEGORY_LABELS[partner.category]}
          </p>
          <h3 className="mt-2 font-display text-lg uppercase tracking-[0.08em] text-off-white">
            {partner.name}
          </h3>
        </div>
        {partner.featured && (
          <span className="shrink-0 border border-off-white/20 px-2 py-0.5 text-[9px] uppercase tracking-[0.15em] text-white/50">
            Featured
          </span>
        )}
      </div>
      {partner.description && (
        <p className="mt-4 text-sm leading-relaxed text-white/50">{partner.description}</p>
      )}
      {partner.benefits && (
        <p className="mt-4 border-t border-white/10 pt-4 text-xs text-white/40">
          <span className="uppercase tracking-[0.15em]">Member benefit: </span>
          {partner.benefits}
        </p>
      )}
      {partner.website && (
        <a
          href={partner.website}
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
