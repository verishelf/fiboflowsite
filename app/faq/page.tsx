import Link from "next/link";
import type { Metadata } from "next";
import { BrandLogo } from "@/components/brand/BrandLogo";

export const metadata: Metadata = {
  title: "FAQ — FiboFlow",
  description:
    "Frequently asked questions: paper vs live, where keys live, Fiboflow vs direct Alpaca.",
};

const items: { q: string; a: string }[] = [
  {
    q: "Is FiboFlow a broker?",
    a: "No. It is a trading terminal UI. Your relationship is with Alpaca (and optionally your own Fiboflow server). This is not investment advice.",
  },
  {
    q: "Paper vs live — what’s the difference?",
    a: "Paper uses Alpaca’s simulated environment. Live sends real orders with real capital. The app and Fiboflow both respect the mode you choose in Settings / server configuration—double-check before trading.",
  },
  {
    q: "Where do my API keys live?",
    a: "You can save them in the browser (masked after save) or supply them via NEXT_PUBLIC_* variables in .env.local for local/dev deploys. Keys are sent to Alpaca or your Fiboflow backend from the browser per your configuration—review security for public deployments.",
  },
  {
    q: "Do I need the Fiboflow API?",
    a: "No. Without NEXT_PUBLIC_FIBOFLOW_API_URL, the app talks to Alpaca directly from the browser for account, positions, orders, and basic data. Fiboflow adds the desktop FastAPI stack (automation, portfolio history on the overview chart, etc.).",
  },
  {
    q: "Why don’t I see working orders when Fiboflow is on?",
    a: "Open-order list and cancel use Alpaca’s REST API with your browser credentials. The Fiboflow server may be using different keys; manage working orders in Alpaca’s dashboard or extend your API if you need proxy support.",
  },
  {
    q: "Why are limit/stop orders disabled with Fiboflow?",
    a: "The bundled Fiboflow /trade route is wired for market-style flow. Use direct Alpaca mode for limit, stop, and stop-limit in this web app.",
  },
];

export default function FaqPage() {
  return (
    <div className="relative min-h-screen bg-[#02040a] text-zinc-100">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,rgba(59,130,246,0.18),transparent_55%)]" />
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
        <h1 className="text-3xl font-semibold tracking-tight text-white">FAQ</h1>
        <p className="mt-3 text-sm text-zinc-400">
          Quick answers about keys, modes, and the optional Fiboflow stack.
        </p>
        <dl className="mt-10 space-y-8">
          {items.map((item) => (
            <div key={item.q}>
              <dt className="text-base font-semibold text-white">{item.q}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-zinc-400">
                {item.a}
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-12 text-xs text-zinc-600">
          <Link href="/docs" className="text-zinc-500 hover:text-zinc-400">
            Docs
          </Link>
          {" · "}
          <Link href="/changelog" className="text-zinc-500 hover:text-zinc-400">
            Changelog
          </Link>
        </p>
      </main>
    </div>
  );
}
