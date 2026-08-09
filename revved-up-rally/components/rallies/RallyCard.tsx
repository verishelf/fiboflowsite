import Link from "next/link";
import Image from "next/image";
import type { Rally } from "@/types/database";

interface RallyCardProps {
  rally: Rally;
}

export function RallyCard({ rally }: RallyCardProps) {
  return (
    <Link
      href={`/rallies/${rally.slug}`}
      className="group relative block overflow-hidden border border-white/10 bg-charcoal transition-colors hover:border-white/20"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        {rally.card_image && (
          <Image
            src={rally.card_image}
            alt={rally.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6">
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/50">
            {rally.year} · {rally.duration}
          </p>
          <h3 className="mt-2 font-display text-xl uppercase tracking-[0.1em] text-off-white md:text-2xl">
            {rally.name}
          </h3>
        </div>
      </div>
      <div className="p-6">
        <p className="text-sm text-white/50">{rally.route}</p>
        {rally.tagline && (
          <p className="mt-2 text-sm italic text-white/70">{rally.tagline}</p>
        )}
        <div className="mt-4 flex items-center gap-4 text-[10px] uppercase tracking-[0.2em] text-white/40">
          {rally.distance && <span>{rally.distance}</span>}
          {rally.experience_level && <span>{rally.experience_level}</span>}
        </div>
      </div>
    </Link>
  );
}
