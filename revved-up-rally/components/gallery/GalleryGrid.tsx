"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import type { GalleryItem, GalleryCategory } from "@/types/database";
import { cn } from "@/lib/utils";

const CATEGORIES: { value: GalleryCategory | "all"; label: string }[] = [
  { value: "all", label: "ALL" },
  { value: "rallies", label: "RALLIES" },
  { value: "cars", label: "CARS" },
  { value: "people", label: "PEOPLE" },
  { value: "destinations", label: "DESTINATIONS" },
  { value: "lifestyle", label: "LIFESTYLE" },
];

interface GalleryGridProps {
  items: GalleryItem[];
}

export function GalleryGrid({ items: initialItems }: GalleryGridProps) {
  const [category, setCategory] = useState<GalleryCategory | "all">("all");
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);

  const items =
    category === "all"
      ? initialItems
      : initialItems.filter((i) => i.category === category);

  return (
    <>
      <div className="mb-12 flex flex-wrap gap-4">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            type="button"
            onClick={() => setCategory(cat.value)}
            className={cn(
              "text-xs uppercase tracking-[0.2em] transition-colors",
              category === cat.value ? "text-off-white" : "text-white/40 hover:text-white/70",
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setLightbox(item)}
            className="group mb-4 block w-full break-inside-avoid overflow-hidden"
          >
            <div className="relative aspect-auto overflow-hidden">
              <Image
                src={item.image_url}
                alt={item.title ?? "Gallery image"}
                width={800}
                height={600}
                className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/30" />
              {item.title && (
                <p className="absolute bottom-4 left-4 text-xs uppercase tracking-[0.15em] opacity-0 transition-opacity group-hover:opacity-100">
                  {item.title}
                </p>
              )}
            </div>
          </button>
        ))}
      </div>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/95 p-4"
            onClick={() => setLightbox(null)}
          >
            <button
              type="button"
              className="absolute right-6 top-6 z-10"
              onClick={() => setLightbox(null)}
              aria-label="Close"
            >
              <X className="h-8 w-8" />
            </button>
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="relative max-h-[90vh] max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={lightbox.image_url}
                alt={lightbox.title ?? "Gallery"}
                width={1200}
                height={800}
                className="max-h-[85vh] w-auto object-contain"
              />
              {lightbox.caption && (
                <p className="mt-4 text-center text-sm text-white/60">{lightbox.caption}</p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
