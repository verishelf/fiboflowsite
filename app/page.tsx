"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { Button } from "@/components/ui/Button";

const navLinks = [
  { label: "Platform", href: "#platform" },
  { label: "Features", href: "#features" },
  { label: "Security", href: "#security" },
];

const stats = [
  { label: "Markets", value: "US equities" },
  { label: "Connectivity", value: "Alpaca API" },
  { label: "Modes", value: "Paper · Live" },
];

const highlights = [
  {
    title: "One command center",
    body: "Overview, charting, execution, portfolio, and automation—all in a focused dark terminal that stays fast on desktop and mobile.",
    accent: "from-blue-500/20 to-cyan-500/5",
  },
  {
    title: "Broker-grade routing",
    body: "Native Alpaca integration for balances, positions, and orders. Your keys stay masked in the browser after save, or stay on your server with Fiboflow.",
    accent: "from-emerald-500/15 to-teal-500/5",
  },
  {
    title: "Optional Fiboflow stack",
    body: "Point the app at your FastAPI backend to mirror the desktop engine—AI scanner, strategies, and auto-trade loop without duplicating config.",
    accent: "from-violet-500/15 to-blue-500/5",
  },
  {
    title: "Built for real schedules",
    body: "Auto-refresh while you watch, kill-switch minded controls in AI/Bot, and session context so you spend less time tab-hopping.",
    accent: "from-amber-500/12 to-orange-500/5",
  },
];

const steps = [
  {
    step: "01",
    title: "Connect Alpaca",
    body: "Choose paper or live in Settings. Paste keys or load them from env for a local deploy.",
  },
  {
    step: "02",
    title: "Open a workspace",
    body: "Chart in Trade, size a market order, and confirm positions update in Portfolio without leaving the app.",
  },
  {
    step: "03",
    title: "Scale with Fiboflow",
    body: "Set NEXT_PUBLIC_FIBOFLOW_API_URL and route automation through the same API you run on your desktop stack.",
  },
];

const footerCols = [
  {
    title: "Product",
    links: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Trade", href: "/dashboard/trade" },
      { label: "Settings", href: "/dashboard/settings" },
    ],
  },
  {
    title: "Docs",
    links: [
      { label: "Self-host", href: "/docs" },
      { label: "FAQ", href: "/faq" },
      { label: "Changelog", href: "/changelog" },
    ],
  },
  {
    title: "Developers",
    links: [
      { label: "Alpaca docs", href: "https://docs.alpaca.markets/", external: true },
      { label: "Deploy on Vercel", href: "https://vercel.com", external: true },
    ],
  },
];

export default function Home() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#02040a] text-zinc-100">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,rgba(59,130,246,0.22),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_100%_0%,rgba(16,185,129,0.08),transparent_45%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(2,4,10,0.9)_85%)]" />
      </div>

      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#02040a]/75 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <BrandLogo size={40} className="h-10 w-10 shrink-0" />
            <span className="text-[15px] font-semibold tracking-tight">
              FiboFlow
            </span>
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm text-zinc-400 transition hover:text-white"
              >
                {l.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/dashboard/settings"
              prefetch={false}
              className="hidden text-sm text-zinc-400 transition hover:text-white sm:inline"
            >
              Setup
            </Link>
            <Button
              type="button"
              className="rounded-full px-5 shadow-blue-600/30"
              onClick={() => router.push("/dashboard")}
            >
              Launch terminal
            </Button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="relative z-10 mx-auto max-w-6xl px-4 pb-20 pt-14 sm:px-6 sm:pt-20 md:pb-28">
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
              >
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
                  <BrandLogo
                    size={112}
                    className="h-24 w-24 shrink-0 drop-shadow-[0_0_28px_rgba(59,130,246,0.35)] sm:h-28 sm:w-28"
                    priority
                  />
                  <p className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-zinc-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                    Alpaca-ready · Web terminal · Optional Fiboflow API
                  </p>
                </div>
                <h1 className="text-[2.35rem] font-semibold leading-[1.05] tracking-tight sm:text-5xl sm:leading-[1.02] md:text-[3.25rem] lg:text-[3.5rem]">
                  <span className="text-white">Trade US markets</span>
                  <br />
                  <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-300 bg-clip-text text-transparent">
                    with exchange-grade clarity
                  </span>
                </h1>
                <p className="mt-6 max-w-xl text-base leading-relaxed text-zinc-400 sm:text-lg">
                  FiboFlow is a browser-based workstation for{" "}
                  <span className="text-zinc-200">Alpaca</span>—real-time charting,
                  one-tap orders, portfolio truth, and automation rails when you
                  connect your Fiboflow server. Not a broker. Not investment advice.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Button
                    type="button"
                    className="h-12 rounded-full px-8 text-[15px] shadow-blue-600/35"
                    onClick={() => router.push("/dashboard")}
                  >
                    Open dashboard
                  </Button>
                  <Button
                    variant="secondary"
                    type="button"
                    className="h-12 rounded-full border-white/10 bg-white/[0.06] px-8 text-[15px] hover:bg-white/[0.1]"
                    onClick={() => router.push("/dashboard/trade")}
                  >
                    Start trading view
                  </Button>
                </div>
                <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-white/[0.06] pt-10 sm:max-w-lg">
                  {stats.map((s) => (
                    <div key={s.label}>
                      <dt className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
                        {s.label}
                      </dt>
                      <dd className="mt-1 text-sm font-semibold text-white sm:text-base">
                        {s.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </motion.div>
            </div>

            {/* Hero visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.55 }}
              className="relative lg:mt-4"
            >
              <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-blue-500/15 via-transparent to-emerald-500/10 blur-2xl" />
              <div className="glass-card relative overflow-hidden rounded-2xl border border-white/[0.08] shadow-2xl shadow-black/60">
                <div className="flex items-center gap-2 border-b border-white/[0.06] bg-zinc-950/80 px-4 py-3">
                  <div className="flex gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="ml-2 text-[11px] text-zinc-500">
                    terminal.fiboflow · secure session
                  </span>
                </div>
                <div className="grid gap-0 md:grid-cols-[1fr_minmax(0,180px)]">
                  <div className="space-y-4 p-5">
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-[11px] text-zinc-500">Portfolio value</p>
                        <p className="text-2xl font-semibold tracking-tight text-white">
                          $128,430.52
                        </p>
                      </div>
                      <span className="rounded-lg bg-emerald-500/15 px-2 py-1 text-xs font-medium text-emerald-300">
                        +2.4% session
                      </span>
                    </div>
                    <div className="flex h-28 items-end gap-1">
                      {[40, 55, 48, 62, 58, 72, 68, 80, 76, 88, 92, 85].map(
                        (h, i) => (
                          <div
                            key={i}
                            className="flex-1 rounded-t-sm bg-gradient-to-t from-blue-600/40 to-cyan-400/90"
                            style={{ height: `${h}%` }}
                          />
                        ),
                      )}
                    </div>
                    <div className="flex gap-3">
                      <div className="flex-1 rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2">
                        <p className="text-[10px] text-zinc-500">Symbol</p>
                        <p className="text-sm font-medium text-white">SPY</p>
                      </div>
                      <div className="flex-1 rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2">
                        <p className="text-[10px] text-zinc-500">Side</p>
                        <p className="text-sm font-medium text-emerald-300">Buy</p>
                      </div>
                      <div className="flex-1 rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2">
                        <p className="text-[10px] text-zinc-500">Qty</p>
                        <p className="text-sm font-medium text-white">25</p>
                      </div>
                    </div>
                  </div>
                  <div className="hidden border-l border-white/[0.06] bg-zinc-950/50 p-4 md:block">
                    <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
                      Routes
                    </p>
                    <ul className="mt-3 space-y-2 text-xs text-zinc-300">
                      <li className="flex items-center gap-2">
                        <span className="h-1 w-1 rounded-full bg-blue-400" />
                        Alpaca market
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="h-1 w-1 rounded-full bg-violet-400" />
                        Fiboflow AI
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="h-1 w-1 rounded-full bg-zinc-600" />
                        TV charts
                      </li>
                    </ul>
                    <div className="mt-6 rounded-lg border border-white/[0.06] bg-blue-500/10 p-3">
                      <p className="text-[10px] text-blue-200/90">
                        Live automation idle · Ready when you are
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Platform strip */}
        <section
          id="platform"
          className="relative z-10 border-y border-white/[0.06] bg-white/[0.02] py-10"
        >
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-10 gap-y-4 px-4 sm:px-6">
            {["Alpaca Markets", "Next.js 16", "TradingView", "Fiboflow API"].map(
              (name) => (
                <span
                  key={name}
                  className="text-sm font-medium text-zinc-500 transition hover:text-zinc-300"
                >
                  {name}
                </span>
              ),
            )}
          </div>
        </section>

        {/* Features bento */}
        <section
          id="features"
          className="relative z-10 mx-auto max-w-6xl px-4 py-24 sm:px-6"
        >
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
              Platform
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Everything you need to run a session—nothing you don&apos;t.
            </h2>
            <p className="mt-4 text-base text-zinc-400">
              Designed like the pro crypto and fintech apps you already trust:
              dense data when you want it, calm surfaces when you don&apos;t.
            </p>
          </div>
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
            {highlights.map((h, i) => (
              <motion.article
                key={h.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.05, duration: 0.45 }}
                className={`glass-card group relative overflow-hidden rounded-2xl p-6 sm:p-8`}
              >
                <div
                  className={`pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-to-br ${h.accent} blur-[48px] opacity-70`}
                />
                <h3 className="relative text-lg font-semibold text-white">
                  {h.title}
                </h3>
                <p className="relative mt-3 text-sm leading-relaxed text-zinc-400">
                  {h.body}
                </p>
              </motion.article>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="relative z-10 mx-auto max-w-6xl px-4 pb-24 sm:px-6">
          <div className="rounded-3xl border border-white/[0.06] bg-gradient-to-b from-white/[0.04] to-transparent px-6 py-14 sm:px-10 sm:py-16">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
                Flow
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Up and running in three moves
              </h2>
            </div>
            <div className="mt-14 grid gap-8 md:grid-cols-3">
              {steps.map((s, i) => (
                <motion.div
                  key={s.step}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  className="relative text-center md:text-left"
                >
                  <span className="text-4xl font-bold tabular-nums text-white/[0.08]">
                    {s.step}
                  </span>
                  <h3 className="-mt-2 text-lg font-semibold text-white">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                    {s.body}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Security */}
        <section
          id="security"
          className="relative z-10 mx-auto max-w-6xl px-4 pb-24 sm:px-6"
        >
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                Security posture
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Your keys. Your infra. Your rules.
              </h2>
              <ul className="mt-8 space-y-4 text-sm text-zinc-400">
                <li className="flex gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                  Keys are never shown again after you save—only used client-side for Alpaca calls unless you offload to Fiboflow.
                </li>
                <li className="flex gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                  Bring your own deploy: run locally, on Vercel, or beside your FastAPI stack with the same env contract.
                </li>
                <li className="flex gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                  Risk disclaimer: trading can result in loss. FiboFlow provides tools, not recommendations.
                </li>
              </ul>
            </div>
            <div className="glass-card rounded-2xl p-8">
              <p className="text-sm font-medium text-white">
                Ready when your desk is
              </p>
              <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                Launch the dashboard, validate paper mode, then graduate to live
                only when your checklist says so. Settings holds paper/live
                toggles and Fiboflow URL in one place.
              </p>
              <Button
                type="button"
                className="mt-6 w-full rounded-full sm:w-auto sm:px-8"
                variant="secondary"
                onClick={() => router.push("/dashboard/settings")}
              >
                Configure keys &amp; mode
              </Button>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative z-10 mx-auto max-w-6xl px-4 pb-28 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl border border-blue-500/20 bg-gradient-to-br from-blue-600/25 via-zinc-900/80 to-emerald-900/20 px-6 py-14 text-center sm:px-12 sm:py-16"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_0%,rgba(59,130,246,0.35),transparent_50%)]" />
            <h2 className="relative text-2xl font-semibold tracking-tight text-white sm:text-3xl md:text-4xl">
              The modern surface for serious retail workflows
            </h2>
            <p className="relative mx-auto mt-4 max-w-lg text-sm text-zinc-300 sm:text-base">
              Join a terminal that feels closer to Crypto.com and Evedex than a
              stock admin panel—without leaving the Alpaca ecosystem.
            </p>
            <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                type="button"
                className="h-12 min-w-[200px] rounded-full px-8"
                onClick={() => router.push("/dashboard")}
              >
                Enter FiboFlow
              </Button>
              <Link
                href="/dashboard/portfolio"
                prefetch={false}
                className="inline-flex h-12 min-w-[200px] items-center justify-center rounded-full border border-white/20 bg-transparent px-8 text-sm font-medium text-white transition hover:bg-white/5"
              >
                View portfolio layout
              </Link>
            </div>
          </motion.div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/[0.06] bg-[#02040a]">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5">
              <BrandLogo size={36} className="h-9 w-9 shrink-0" />
              <span className="font-semibold text-white">FiboFlow</span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-zinc-500">
              Web trading terminal for Alpaca with optional Fiboflow automation.
              Education and tooling—not a registered investment advisor.
            </p>
          </div>
          {footerCols.map((col) => (
            <div key={col.title}>
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                {col.title}
              </p>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    {"external" in l && l.external ? (
                      <a
                        href={l.href}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-zinc-400 transition hover:text-white"
                      >
                        {l.label}
                      </a>
                    ) : (
                      <Link
                        href={l.href}
                        prefetch={false}
                        className="text-sm text-zinc-400 transition hover:text-white"
                      >
                        {l.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-white/[0.04] py-6 text-center text-xs text-zinc-600">
          © {new Date().getFullYear()} FiboFlow · Trading involves risk of loss
        </div>
      </footer>
    </div>
  );
}
