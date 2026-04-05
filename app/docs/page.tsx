import Link from "next/link";
import type { Metadata } from "next";
import { BrandLogo } from "@/components/brand/BrandLogo";

export const metadata: Metadata = {
  title: "Docs — FiboFlow",
  description:
    "Self-host FiboFlow: environment variables, Alpaca keys, Fiboflow API, and deploy notes.",
};

export default function DocsPage() {
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
          <Link
            href="/dashboard/settings"
            prefetch={false}
            className="text-sm text-blue-400 hover:text-blue-300"
          >
            Settings
          </Link>
        </div>
      </header>
      <main className="relative z-10 mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <h1 className="text-3xl font-semibold tracking-tight text-white">
          Self-host &amp; configuration
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-zinc-400">
          FiboFlow runs as a Next.js app in your browser. Alpaca requests use
          keys from Settings or from{" "}
          <code className="rounded bg-white/5 px-1 text-zinc-300">.env.local</code>.
          The optional Fiboflow FastAPI mirrors the desktop engine and should be
          started separately.
        </p>

        <section className="mt-10 space-y-4">
          <h2 className="text-lg font-semibold text-white">Environment variables</h2>
          <p className="text-sm text-zinc-400">
            Copy <code className="text-zinc-300">.env.example</code> to{" "}
            <code className="text-zinc-300">.env.local</code> at the repo root.
            Prefixes are <code className="text-zinc-300">NEXT_PUBLIC_*</code> so
            the client can read them after you restart the dev server.
          </p>
          <ul className="list-inside list-disc space-y-2 text-sm text-zinc-400">
            <li>
              <strong className="text-zinc-300">Alpaca paper:</strong>{" "}
              <code className="text-zinc-500">NEXT_PUBLIC_ALPACA_PAPER_API_KEY</code>,{" "}
              <code className="text-zinc-500">NEXT_PUBLIC_ALPACA_PAPER_API_SECRET</code>
            </li>
            <li>
              <strong className="text-zinc-300">Alpaca live:</strong>{" "}
              <code className="text-zinc-500">NEXT_PUBLIC_ALPACA_LIVE_API_KEY</code>,{" "}
              <code className="text-zinc-500">NEXT_PUBLIC_ALPACA_LIVE_API_SECRET</code>
            </li>
            <li>
              <strong className="text-zinc-300">Fiboflow API (optional):</strong>{" "}
              <code className="text-zinc-500">NEXT_PUBLIC_FIBOFLOW_API_URL</code>{" "}
              (e.g. <code className="text-zinc-500">http://127.0.0.1:8000</code>) —
              CORS should allow your web origin; the bundled API uses permissive CORS
              for local dev.
            </li>
          </ul>
        </section>

        <section className="mt-10 space-y-4">
          <h2 className="text-lg font-semibold text-white">Deploy (e.g. Vercel)</h2>
          <p className="text-sm text-zinc-400">
            Add the same <code className="text-zinc-300">NEXT_PUBLIC_*</code> vars in
            the host dashboard. For Fiboflow, expose your API over HTTPS or tunnel
            (e.g. Cloudflare, ngrok) if the web app is not on localhost — browsers
            will block mixed content.
          </p>
        </section>

        <section className="mt-10 space-y-4">
          <h2 className="text-lg font-semibold text-white">Scripts</h2>
          <p className="text-sm text-zinc-400">
            See <code className="text-zinc-300">package.json</code> for{" "}
            <code className="text-zinc-500">dev:api</code> and{" "}
            <code className="text-zinc-500">dev:full</code> if your monorepo layout
            matches the paths referenced there.
          </p>
        </section>

        <p className="mt-12 text-xs text-zinc-600">
          <Link href="/faq" className="text-zinc-500 hover:text-zinc-400">
            FAQ
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
