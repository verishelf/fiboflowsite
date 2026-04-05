"use client";

import { useCallback, useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { fiboflowApiEnabled } from "@/lib/fiboflow-api";
import { fetchTradingPortfolioHistory } from "@/lib/trading";

type Period = "1D" | "1W" | "1M";

const PERIODS: { id: Period; label: string }[] = [
  { id: "1D", label: "1D" },
  { id: "1W", label: "1W" },
  { id: "1M", label: "1M" },
];

function sparklineDPath(
  equity: number[],
  width: number,
  height: number
): string | null {
  if (equity.length < 2) return null;
  let min = Math.min(...equity);
  let max = Math.max(...equity);
  if (!Number.isFinite(min) || !Number.isFinite(max)) return null;
  if (Math.abs(max - min) < 1e-9) {
    min -= 1e-6;
    max += 1e-6;
  }
  const padX = 6;
  const padY = 8;
  const w = width - padX * 2;
  const h = height - padY * 2;
  const d = equity.map((v, i) => {
    const x = padX + (i / (equity.length - 1)) * w;
    const t = (v - min) / (max - min);
    const y = padY + h - t * h;
    return `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
  });
  return d.join(" ");
}

function formatCompactUsd(n: number): string {
  if (!Number.isFinite(n)) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: n >= 1000 ? 0 : 2,
  }).format(n);
}

export function EquityCurveCard() {
  const [period, setPeriod] = useState<Period>("1D");
  const [series, setSeries] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [hint, setHint] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!fiboflowApiEnabled()) {
      setSeries([]);
      setHint(null);
      return;
    }
    setLoading(true);
    setHint(null);
    try {
      const ph = await fetchTradingPortfolioHistory({ period });
      const raw = ph?.equity;
      const nums = Array.isArray(raw)
        ? raw.map((v) => Number(v)).filter((x) => Number.isFinite(x))
        : [];
      setSeries(nums);
      if (nums.length === 0) {
        setHint(
          ph?.detail ??
            (String(ph?.status ?? "").toLowerCase() === "error"
              ? "Portfolio history unavailable."
              : "No equity points for this range yet.")
        );
      }
    } catch {
      setSeries([]);
      setHint("Could not load portfolio history.");
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    void load();
  }, [load]);

  const ff = fiboflowApiEnabled();
  const w = 640;
  const h = 120;
  const path = sparklineDPath(series, w, h);
  const first = series[0];
  const last = series.length ? series[series.length - 1] : NaN;
  const delta =
    series.length > 1 && Number.isFinite(first) && Number.isFinite(last)
      ? last - first
      : null;

  if (!ff) {
    return (
      <Card className="border border-white/[0.06]">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
              Equity curve
            </p>
            <p className="mt-1 text-sm text-zinc-400">
              Set{" "}
              <code className="rounded bg-white/5 px-1.5 py-0.5 text-xs text-zinc-300">
                NEXT_PUBLIC_FIBOFLOW_API_URL
              </code>{" "}
              and run the Fiboflow API to chart portfolio history on the overview.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            Equity curve
          </p>
          <p className="mt-1 text-sm text-zinc-400">
            From Fiboflow{" "}
            <code className="rounded bg-white/5 px-1 text-[11px] text-zinc-300">
              /portfolio/history
            </code>
          </p>
          {delta != null ? (
            <p
              className={`mt-2 text-lg font-semibold tabular-nums ${
                delta >= 0 ? "text-emerald-400" : "text-red-400"
              }`}
            >
              {delta >= 0 ? "+" : ""}
              {formatCompactUsd(delta)}
              <span className="ml-2 text-xs font-normal text-zinc-500">
                over range
              </span>
            </p>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {PERIODS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPeriod(p.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                period === p.id
                  ? "bg-blue-600/40 text-white ring-1 ring-blue-500/40"
                  : "bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-zinc-200"
              }`}
            >
              {p.label}
            </button>
          ))}
          <Button
            variant="secondary"
            type="button"
            className="!px-3 !py-1.5 !text-xs"
            onClick={() => void load()}
            isLoading={loading}
          >
            Refresh
          </Button>
        </div>
      </div>

      <div className="mt-4">
        {loading && series.length === 0 ? (
          <p className="py-8 text-center text-sm text-zinc-500">Loading…</p>
        ) : path ? (
          <svg
            className="h-[120px] w-full text-blue-400/90"
            viewBox={`0 0 ${w} ${h}`}
            preserveAspectRatio="none"
          >
            <path
              d={path}
              fill="none"
              strokeWidth="2"
              stroke="currentColor"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        ) : (
          <p className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-6 text-center text-sm text-zinc-500">
            {hint ?? "No chart data."}
          </p>
        )}
      </div>
    </Card>
  );
}
