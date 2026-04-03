"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { hasConfiguredAlpacaEnv, useStore } from "@/store/useStore";
import { fiboflowApiEnabled } from "@/lib/trading";
import { getFiboflowBaseUrl } from "@/lib/fiboflow-api";

export function Navbar() {
  const isPaperTrading = useStore((s) => s.isPaperTrading);
  const credentialsSaved = useStore((s) => s.credentialsSaved);

  return (
    <header className="glass-card sticky top-0 z-30 mb-6 flex items-center justify-between rounded-2xl px-4 py-3">
      <div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm font-medium text-white"
        >
          FiboFlow Terminal
        </motion.p>
        <p className="text-xs text-zinc-500">
          {fiboflowApiEnabled()
            ? `Fiboflow API · ${getFiboflowBaseUrl()}`
            : credentialsSaved || hasConfiguredAlpacaEnv()
              ? "Keys configured"
              : "Connect Alpaca in Settings"}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ring-1 ${
            isPaperTrading
              ? "bg-amber-500/10 text-amber-300 ring-amber-500/20"
              : "bg-emerald-500/10 text-emerald-300 ring-emerald-500/25"
          }`}
        >
          {isPaperTrading ? "Paper" : "Live"}
        </span>
        <Link
          href="/"
          className="text-xs text-zinc-500 transition hover:text-zinc-300"
        >
          Landing
        </Link>
      </div>
    </header>
  );
}
