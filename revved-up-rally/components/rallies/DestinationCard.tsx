"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Destination } from "@/types/database";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

interface DestinationCardProps {
  destination: Destination;
  className?: string;
  variant?: "default" | "featured";
}

export function DestinationCard({
  destination,
  className,
  variant = "default",
}: DestinationCardProps) {
  const reduced = useReducedMotion();

  return (
    <Link
      href={`/destinations/${destination.slug}`}
      className={cn("group block", className)}
    >
      <motion.div
        whileHover={reduced ? undefined : { y: -4 }}
        className={cn(
          "relative overflow-hidden border border-white/10 transition-colors hover:border-white/25",
          variant === "featured" ? "aspect-[3/4]" : "aspect-[4/5]",
        )}
      >
        <Image
          src={destination.image_url}
          alt={destination.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

        {destination.featured && (
          <span className="absolute left-4 top-4 text-[10px] uppercase tracking-[0.3em] text-off-white/80">
            Featured
          </span>
        )}

        <div className="absolute inset-x-0 bottom-0 p-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h3 className="font-display text-2xl uppercase tracking-[0.1em] text-off-white">
                {destination.name}
              </h3>
              {destination.description && (
                <p className="mt-2 line-clamp-2 text-sm text-white/60">
                  {destination.description}
                </p>
              )}
            </div>
            <ArrowUpRight className="h-5 w-5 shrink-0 text-white/40 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-off-white" />
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
