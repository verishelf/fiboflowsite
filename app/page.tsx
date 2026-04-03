"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const pillars = [
  {
    title: "One workspace",
    body: "Dashboard, charting, orders, positions, and automation controls in a single dark, glassmorphic terminal—built for focus, not clutter.",
  },
  {
    title: "Alpaca under the hood",
    body: "Connect paper or live Alpaca accounts. Trade US equities with market orders, view balances and open positions, and keep API keys masked after save.",
  },
  {
    title: "Optional Fiboflow engine",
    body: "Point the app at your Fiboflow FastAPI server to reuse the same AI scanner, strategy engine, and auto-trade loop as the desktop app—keys stay on the server.",
  },
];

const modules = [
  {
    name: "Overview",
    desc: "Equity, cash, session P&L, open positions, and a quick auto-trade toggle with auto-refresh while you watch.",
  },
  {
    name: "Trade",
    desc: "TradingView charts beside a clean order panel: symbol, size, buy/sell—routed through Alpaca or your Fiboflow API when configured.",
  },
  {
    name: "Portfolio",
    desc: "Holdings, unrealized P&L, and a trade blotter so you can reconcile what the broker shows with what you remember doing.",
  },
  {
    name: "AI / Bot",
    desc: "Automation presets, risk hints, kill-switch ideas, and—when Fiboflow is connected—live server status and AI stack controls.",
  },
  {
    name: "Settings",
    desc: "Paper vs live mode, optional browser-side keys or pure server auth, and environment-based credentials for developers.",
  },
];

const stack = [
  "Next.js (App Router) & TypeScript",
  "Tailwind CSS · Zustand · Axios",
  "Framer Motion · TradingView embed",
  "Alpaca Markets · Fiboflow FastAPI (optional)",
];

export default function Home() {
  const router = useRouter();

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/30 via-black to-black" />
      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 text-sm font-bold shadow-lg shadow-blue-600/30">
            FF
          </span>
          <span className="text-sm font-semibold tracking-tight text-white">
            FiboFlow
          </span>
        </div>
        <Link
          href="/dashboard"
          className="text-sm text-zinc-400 transition hover:text-white"
        >
          Open terminal
        </Link>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-6xl flex-1 px-6 pb-24 pt-8 md:pt-12">
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl"
        >
          <p className="mb-4 inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-zinc-300">
            Web trading terminal · Alpaca · Optional Fiboflow backend
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-white md:text-5xl md:leading-[1.08] lg:text-6xl">
            What{" "}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              FiboFlow
            </span>{" "}
            is
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-zinc-300 md:text-xl">
            FiboFlow is a browser-based trading terminal for people who already
            use—or want to use—<strong className="font-medium text-white">Alpaca</strong> for
            stocks. It gives you a modern, dark UI (glass cards, smooth motion,
            TradingView charts) to monitor your account, place trades, review
            history, and flip automation—either{" "}
            <strong className="font-medium text-white">directly from the browser</strong> with
            your keys, or{" "}
            <strong className="font-medium text-white">through your own Fiboflow API</strong> so
            secrets never leave your machine.
          </p>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-500">
            It is not a broker, not investment advice, and not a promise of
            returns. It is a control surface: clearer than raw API calls, lighter
            than installing a full desktop stack—unless you choose to pair it with
            one.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button
              className="w-full sm:w-auto"
              type="button"
              onClick={() => router.push("/dashboard")}
            >
              Open dashboard
            </Button>
            <Button
              variant="secondary"
              className="w-full sm:w-auto"
              type="button"
              onClick={() => router.push("/dashboard/settings")}
            >
              API &amp; mode setup
            </Button>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.5 }}
          className="mt-20"
        >
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
            Why it exists
          </h2>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-zinc-400">
            Most traders bounce between Alpaca’s website, spreadsheets, and custom
            scripts. FiboFlow pulls the everyday loop—see balance, chart a symbol,
            send an order, skim positions—into one responsive app you can deploy
            on Vercel or run locally, with an aesthetic closer to pro crypto
            terminals than a default admin template.
          </p>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {pillars.map((p, i) => (
              <Card key={p.title} className={i === 1 ? "md:mt-6" : ""}>
                <p className="text-sm font-semibold text-white">{p.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                  {p.body}
                </p>
              </Card>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="mt-20"
        >
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
            What’s inside the app
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-zinc-500">
            Each area maps to a route under{" "}
            <code className="text-zinc-400">/dashboard</code>—same sidebar on desktop,
            thumb-friendly nav on mobile.
          </p>
          <ul className="mt-8 space-y-4">
            {modules.map((m, i) => (
              <motion.li
                key={m.name}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.04 }}
                className="flex gap-4 rounded-2xl border border-white/6 bg-zinc-950/40 px-4 py-4 backdrop-blur-sm md:px-5"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/15 text-sm font-semibold text-blue-300">
                  {i + 1}
                </span>
                <div>
                  <p className="font-medium text-white">{m.name}</p>
                  <p className="mt-1 text-sm leading-relaxed text-zinc-400">
                    {m.desc}
                  </p>
                </div>
              </motion.li>
            ))}
          </ul>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mt-20 rounded-2xl border border-white/8 bg-zinc-900/30 p-6 md:p-8"
        >
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
            Stack &amp; deploy
          </h2>
          <ul className="mt-4 grid gap-2 text-sm text-zinc-400 sm:grid-cols-2">
            {stack.map((line) => (
              <li key={line} className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-cyan-500/80" />
                {line}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-xs leading-relaxed text-zinc-600">
            Configure Alpaca keys in Settings or via{" "}
            <code className="text-zinc-500">.env.local</code>. Set{" "}
            <code className="text-zinc-500">NEXT_PUBLIC_FIBOFLOW_API_URL</code> to
            connect the same FastAPI trading system as the Fiboflow desktop project.
          </p>
        </motion.section>
      </main>

      <footer className="relative z-10 border-t border-white/5 px-6 py-8">
        <div className="mx-auto max-w-6xl text-center text-xs leading-relaxed text-zinc-600">
          <p>
            FiboFlow is for education and personal tooling. Trading involves risk
            of loss. Nothing here is investment, tax, or legal advice.
          </p>
          <p className="mt-2">
            Deploy-ready on Vercel · Not a registered investment advisor
          </p>
        </div>
      </footer>
    </div>
  );
}
