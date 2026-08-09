"use client";

import Image from "next/image";
import { useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { GalleryItem } from "@/types/database";

interface GalleryLightboxProps {
  items: GalleryItem[];
  initialIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export function GalleryLightbox({
  items,
  initialIndex,
  onClose,
  onNavigate,
}: GalleryLightboxProps) {
  const currentIndex = initialIndex;
  const item = items[currentIndex];

  const goPrev = useCallback(() => {
    onNavigate(currentIndex > 0 ? currentIndex - 1 : items.length - 1);
  }, [currentIndex, items.length, onNavigate]);

  const goNext = useCallback(() => {
    onNavigate(currentIndex < items.length - 1 ? currentIndex + 1 : 0);
  }, [currentIndex, items.length, onNavigate]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [onClose, goPrev, goNext]);

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95">
      <button
        type="button"
        onClick={onClose}
        className="absolute right-6 top-6 z-10 text-white/60 transition-colors hover:text-off-white"
        aria-label="Close lightbox"
      >
        <X className="h-6 w-6" />
      </button>

      <button
        type="button"
        onClick={goPrev}
        className="absolute left-4 z-10 p-2 text-white/60 transition-colors hover:text-off-white md:left-8"
        aria-label="Previous image"
      >
        <ChevronLeft className="h-8 w-8" />
      </button>

      <button
        type="button"
        onClick={goNext}
        className="absolute right-4 z-10 p-2 text-white/60 transition-colors hover:text-off-white md:right-8"
        aria-label="Next image"
      >
        <ChevronRight className="h-8 w-8" />
      </button>

      <div className="relative mx-4 max-h-[85vh] max-w-5xl">
        <Image
          src={item.image_url}
          alt={item.title ?? "Gallery image"}
          width={1600}
          height={1200}
          className="max-h-[85vh] w-auto object-contain"
          priority
        />
        {(item.title || item.caption) && (
          <div className="mt-6 text-center">
            {item.title && (
              <p className="text-sm uppercase tracking-[0.15em] text-off-white">
                {item.title}
              </p>
            )}
            {item.caption && (
              <p className="mt-2 text-sm text-white/50">{item.caption}</p>
            )}
            <p className="mt-4 text-xs text-white/30">
              {currentIndex + 1} / {items.length}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
