"use client";

import useEmblaCarousel from "embla-carousel-react";
import type { EmblaCarouselType, EmblaOptionsType } from "embla-carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Children,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CarouselProps {
  children: ReactNode;
  className?: string;
  options?: EmblaOptionsType;
  showControls?: boolean;
  showProgress?: boolean;
}

export function Carousel({
  children,
  className,
  options,
  showControls = true,
  showProgress = true,
}: CarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: false,
    ...options,
  });
  const [scrollProgress, setScrollProgress] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const onSelect = useCallback((api: EmblaCarouselType) => {
    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
    setScrollProgress(api.scrollProgress());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect(emblaApi);
    emblaApi.on("select", onSelect);
    emblaApi.on("scroll", onSelect);
    emblaApi.on("reInit", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("scroll", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const slides = Children.toArray(children);

  return (
    <div className={cn("relative", className)}>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y gap-6">
          {slides.map((slide, index) => (
            <div
              key={index}
              className="min-w-0 shrink-0 grow-0 basis-full md:basis-[calc(50%-12px)] lg:basis-[calc(33.333%-16px)]"
            >
              {slide}
            </div>
          ))}
        </div>
      </div>

      {(showControls || showProgress) && (
        <div className="mt-10 flex items-center justify-between gap-6">
          {showProgress && (
            <div className="h-px flex-1 bg-white/10">
              <div
                className="h-full bg-off-white transition-[width] duration-150 ease-out"
                style={{ width: `${Math.max(scrollProgress * 100, 2)}%` }}
              />
            </div>
          )}

          {showControls && (
            <div className="flex shrink-0 items-center gap-2">
              <Button
                type="button"
                variant="secondary"
                size="icon"
                onClick={scrollPrev}
                disabled={!canScrollPrev}
                aria-label="Previous slide"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="icon"
                onClick={scrollNext}
                disabled={!canScrollNext}
                aria-label="Next slide"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
