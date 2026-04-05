import Link from "next/link";
import type { Metadata } from "next";
import { BrandLogo } from "@/components/brand/BrandLogo";

export const metadata: Metadata = {
  title: "Changelog — FiboFlow",
  description: "Recent updates to the FiboFlow web terminal and dashboard.",
};

const releases: { version: string; date: string; notes: string[] }[] = [
  {
    version: "Web terminal",
    date: "2026-04",
    notes: [
      "Overview: Fiboflow portfolio equity curve (1D / 1W / 1M) when NEXT_PUBLIC_FIBOFLOW_API_URL is set.",
      "Trade: persisted watchlist merged into symbol dropdown; order confirmation modal before submit.",
      "Trade: Alpaca limit, stop, and stop-limit orders in direct mode; Fiboflow remains market-only.",
      "Portfolio: working orders with cancel (direct Alpaca); trade history CSV export.",
      "Marketing: Docs, FAQ, and this changelog.",
    ],
  },
];

export default function ChangelogPage() {
  return (
    <div className="relative min-h-screen bg-[#02040a] text-zinc-100">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,rgba(16,185,129,0.1),transparent_50%)]" />
      </div>
      <header className="relative z-10 border-b border-white/[0.06]">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white">
            <BrandLogo size={28} className="h-7 w-7" />
            <span>Home</span>
          </Link>
          <Link href="/docs" className="text-sm text-blue-400 hover:text-blue-300">
            Docs
          </Link>
        </div>
      </header>
      <main className="relative z-10 mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <h1 className="text-3xl font-semibold tracking-tight text-white">
          Changelog
        </h1>
        <p className="mt-3 text-sm text-zinc-400">
          High-level product updates. For commit-level history, see your git log.
        </p>
        <div className="mt-10 space-y-12">
          {releases.map((r) => (
            <section key={r.version}>
              <div className="flex flex-wrap items-baseline gap-3">
                <h2 className="text-lg font-semibold text-white">{r.version}</h2>
                <time className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                  {r.date}
                </time>
              </div>
              <ul className="mt-4 list-inside list-disc space-y-2 text-sm text-zinc-400">
                {r.notes.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>
        <p className="mt-12 text-xs text-zinc-600">
          <Link href="/docs" className="text-zinc-500 hover:text-zinc-400">
            Docs
          </Link>
          {" · "}
          <Link href="/faq" className="text-zinc-500 hover:text-zinc-400">
            FAQ
          </Link>
        </p>
      </main>
    </div>
  );
}
