"use client";

import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useRef, type MouseEvent } from "react";
import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { Button } from "@/components/ui/button";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { SEED_RALLIES } from "@/lib/data/seed-data";

const heroRally = SEED_RALLIES[0];

export function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 120, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 120, damping: 20 });
  const rotateX = useTransform(springY, [-0.5, 0.5], [4, -4]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-4, 4]);

  const handleMouseMove = (event: MouseEvent<HTMLElement>) => {
    if (reducedMotion || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const heroImage = heroRally.hero_image ?? heroRally.card_image;

  return (
    <section
      ref={containerRef}
      className="relative flex min-h-screen items-end overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {heroImage && (
        <ParallaxImage
          src={heroImage}
          alt={heroRally.name}
          priority
          containerClassName="absolute inset-0"
          speed={0.2}
          scale={1.15}
        />
      )}

      <div className="cinematic-overlay absolute inset-0" />

      <motion.div
        className="relative z-10 w-full px-6 pb-16 pt-32 md:px-12 md:pb-24 lg:px-16"
        style={
          reducedMotion
            ? undefined
            : { rotateX, rotateY, transformPerspective: 1200 }
        }
      >
        <div className="mx-auto max-w-7xl">
          <motion.p
            className="mb-6 text-xs uppercase tracking-[0.4em] text-white/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Luxury Automotive Rallies
          </motion.p>

          <motion.h1
            className="editorial-headline max-w-5xl text-off-white"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.35 }}
          >
            Revved Up Rally
          </motion.h1>

          <motion.p
            className="mt-8 max-w-xl text-base leading-relaxed text-white/60 md:text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.55 }}
          >
            {heroRally.tagline ??
              "Curated drives. Exceptional machines. A community built for those who live for the road."}
          </motion.p>

          <motion.div
            className="mt-10 flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <Button asChild size="lg">
              <Link href="/#rallies">Explore Rallies</Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link href="/#membership">Become a Member</Link>
            </Button>
          </motion.div>
        </div>
      </motion.div>

      <motion.a
        href="#intro"
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-white/50 transition-colors hover:text-off-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        aria-label="Scroll to content"
      >
        <span>Scroll</span>
        <motion.span
          animate={reducedMotion ? undefined : { y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="h-5 w-5" />
        </motion.span>
      </motion.a>
    </section>
  );
}
