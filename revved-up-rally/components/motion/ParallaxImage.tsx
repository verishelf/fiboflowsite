"use client";

import Image, { type ImageProps } from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

interface ParallaxImageProps extends Omit<ImageProps, "fill"> {
  containerClassName?: string;
  className?: string;
  speed?: number;
  scale?: number;
}

export function ParallaxImage({
  containerClassName,
  className,
  speed = 0.3,
  scale = 1.1,
  alt,
  ...imageProps
}: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    reducedMotion ? ["0%", "0%"] : [`-${speed * 100}%`, `${speed * 100}%`],
  );

  const imageScale = useTransform(
    scrollYProgress,
    [0, 1],
    reducedMotion ? [1, 1] : [scale, 1],
  );

  if (reducedMotion) {
    return (
      <div
        ref={ref}
        className={cn("relative overflow-hidden", containerClassName)}
      >
        <Image
          alt={alt}
          fill
          className={cn("object-cover", className)}
          sizes="100vw"
          {...imageProps}
        />
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={cn("relative overflow-hidden", containerClassName)}
    >
      <motion.div
        className="absolute inset-0"
        style={{ y, scale: imageScale }}
      >
        <Image
          alt={alt}
          fill
          className={cn("object-cover", className)}
          sizes="100vw"
          {...imageProps}
        />
      </motion.div>
    </div>
  );
}
