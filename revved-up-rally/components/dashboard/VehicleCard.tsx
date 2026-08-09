import Image from "next/image";
import type { Vehicle } from "@/types/database";

interface VehicleCardProps {
  vehicle: Vehicle;
  onDelete?: (id: string) => void;
}

export function VehicleCard({ vehicle, onDelete }: VehicleCardProps) {
  return (
    <article className="thin-border group overflow-hidden">
      <div className="relative aspect-[16/10] bg-charcoal">
        {vehicle.photo_url ? (
          <Image
            src={vehicle.photo_url}
            alt={`${vehicle.make} ${vehicle.model}`}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-white/20">
            No Photo
          </div>
        )}
      </div>
      <div className="p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-silver">{vehicle.year}</p>
        <h3 className="mt-2 font-display text-2xl uppercase tracking-[0.1em]">
          {vehicle.make}
        </h3>
        <p className="font-display text-xl uppercase tracking-[0.05em] text-white/80">
          {vehicle.model}
        </p>
        {vehicle.trim && (
          <p className="mt-1 text-sm text-white/50">{vehicle.trim}</p>
        )}
        <div className="mt-4 flex gap-4 text-xs text-white/40">
          {vehicle.color && <span>{vehicle.color}</span>}
          {vehicle.horsepower && <span>{vehicle.horsepower} HP</span>}
          {vehicle.engine && <span>{vehicle.engine}</span>}
        </div>
        {onDelete && (
          <button
            type="button"
            onClick={() => onDelete(vehicle.id)}
            className="mt-4 text-xs uppercase tracking-[0.15em] text-red-400/70 hover:text-red-400"
          >
            Remove
          </button>
        )}
      </div>
    </article>
  );
}
