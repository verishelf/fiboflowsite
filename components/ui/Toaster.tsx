"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useStore } from "@/store/useStore";

const tone: Record<string, string> = {
  success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-100",
  error: "border-red-500/30 bg-red-500/10 text-red-100",
  info: "border-blue-500/30 bg-blue-500/10 text-blue-100",
};

export function Toaster() {
  const toasts = useStore((s) => s.toasts);
  const dismiss = useStore((s) => s.dismissToast);

  return (
    <div className="pointer-events-none fixed bottom-24 right-4 z-[100] flex w-[min(360px,calc(100vw-2rem))] flex-col gap-2 md:bottom-6 md:right-6">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 420, damping: 32 }}
            className={`pointer-events-auto glass-card rounded-2xl border px-4 py-3 text-sm shadow-xl ${tone[t.type] ?? tone.info}`}
          >
            <div className="flex items-start justify-between gap-3">
              <p className="leading-snug">{t.message}</p>
              <button
                type="button"
                onClick={() => dismiss(t.id)}
                className="shrink-0 rounded-lg px-2 py-0.5 text-xs text-zinc-400 transition hover:bg-white/10 hover:text-white"
              >
                Close
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
