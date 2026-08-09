import Image from "next/image";
import type { Destination } from "@/types/database";

interface DestinationCardProps {
  destination: Destination;
}

export function DestinationCard({ destination }: DestinationCardProps) {
  return (
    <article className="group relative overflow-hidden border border-white/10 bg-charcoal">
      <div className="relative aspect-[4/5] overflow-hidden">
        <Image
          src={destination.image_url}
          alt={destination.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
        {destination.featured && (
          <span className="absolute right-4 top-4 border border-off-white/30 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-off-white">
            Featured
          </span>
        )}
        <div className="absolute bottom-0 left-0 p-6">
          <h3 className="font-display text-2xl uppercase tracking-[0.1em] text-off-white">
            {destination.name}
          </h3>
        </div>
      </div>
      {destination.description && (
        <div className="p-6">
          <p className="text-sm leading-relaxed text-white/60">{destination.description}</p>
        </div>
      )}
    </article>
  );
}
