"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function LoadingScreen() {
  const reducedMotion = useReducedMotion();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (reducedMotion) {
      const timer = window.setTimeout(() => setVisible(false), 0);
      return () => window.clearTimeout(timer);
    }

    let frame = 0;
    const duration = 1800;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const next = Math.min(100, (elapsed / duration) * 100);
      setProgress(next);

      if (next < 100) {
        frame = requestAnimationFrame(tick);
      } else {
        window.setTimeout(() => setVisible(false), 400);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reducedMotion]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex flex-col items-center gap-8 px-6 text-center">
            <p className="text-[10px] uppercase tracking-[0.5em] text-white/40">
              Est. 2024
            </p>
            <h1 className="font-display text-2xl font-light uppercase tracking-[0.35em] text-off-white sm:text-3xl md:text-4xl">
              Revved Up Rally
            </h1>
            <div className="h-px w-48 overflow-hidden bg-white/10 sm:w-64">
              <motion.div
                className="h-full bg-off-white"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1, ease: "linear" }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
