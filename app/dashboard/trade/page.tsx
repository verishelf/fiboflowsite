"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { TradingChart } from "@/components/charts/TradingChart";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select, type SelectOption } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import {
  submitTradingMarketOrder,
  fetchTradingLastTrade,
  fiboflowApiEnabled,
  formatFiboflowError,
} from "@/lib/trading";
import { useStore } from "@/store/useStore";

/** Liquid US equities / ETFs — Alpaca-friendly; chart uses NASDAQ: prefix when no exchange. */
const TRADE_SYMBOL_OPTIONS: readonly SelectOption[] = [
  { value: "AAPL", label: "AAPL — Apple" },
  { value: "MSFT", label: "MSFT — Microsoft" },
  { value: "GOOGL", label: "GOOGL — Alphabet" },
  { value: "AMZN", label: "AMZN — Amazon" },
  { value: "META", label: "META — Meta" },
  { value: "NVDA", label: "NVDA — Nvidia" },
  { value: "TSLA", label: "TSLA — Tesla" },
  { value: "AMD", label: "AMD — AMD" },
  { value: "NFLX", label: "NFLX — Netflix" },
  { value: "SPY", label: "SPY — S&P 500 ETF" },
  { value: "QQQ", label: "QQQ — Nasdaq 100 ETF" },
  { value: "IWM", label: "IWM — Russell 2000 ETF" },
  { value: "JPM", label: "JPM — JPMorgan" },
  { value: "V", label: "V — Visa" },
  { value: "DIS", label: "DIS — Disney" },
  { value: "COIN", label: "COIN — Coinbase" },
  { value: "PLTR", label: "PLTR — Palantir" },
  { value: "MSTR", label: "MSTR — MicroStrategy" },
] as const;

const DEFAULT_SYMBOL = TRADE_SYMBOL_OPTIONS[0]!.value;

function useChartHeight(): number {
  const [px, setPx] = useState(520);

  useEffect(() => {
    const measure = () => {
      const vh = typeof window !== "undefined" ? window.innerHeight : 800;
      const vw = typeof window !== "undefined" ? window.innerWidth : 1200;
      const verticalReserve = vw >= 1024 ? 200 : 260;
      const h = Math.floor(vh - verticalReserve);
      setPx(Math.min(1200, Math.max(420, h)));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return px;
}

export default function TradePage() {
  const pushToast = useStore((s) => s.pushToast);
  const chartHeight = useChartHeight();

  const [symbol, setSymbol] = useState(DEFAULT_SYMBOL);
  const [qty, setQty] = useState("1");
  const [submitting, setSubmitting] = useState(false);
  const [price, setPrice] = useState<number | null>(null);
  const [priceLoading, setPriceLoading] = useState(false);
  const priceHintShownFor = useRef<string | null>(null);

  const pollPrice = useCallback(async () => {
    setPriceLoading(true);
    try {
      const p = await fetchTradingLastTrade(symbol);
      setPrice(p);
      if (
        p == null &&
        priceHintShownFor.current !== symbol.toUpperCase()
      ) {
        priceHintShownFor.current = symbol.toUpperCase();
        pushToast({
          type: "info",
          message:
            "Live price unavailable (data plan or symbol). Chart still updates.",
        });
      }
    } finally {
      setPriceLoading(false);
    }
  }, [symbol, pushToast]);

  useEffect(() => {
    void pollPrice();
    const id = setInterval(() => void pollPrice(), 10_000);
    return () => clearInterval(id);
  }, [pollPrice]);

  const submit = async (side: "buy" | "sell") => {
    const sym = symbol.trim().toUpperCase();
    const q = parseFloat(qty);
    if (!sym || Number.isNaN(q) || q <= 0) {
      pushToast({ type: "error", message: "Pick a symbol and valid quantity." });
      return;
    }
    setSubmitting(true);
    try {
      await submitTradingMarketOrder({
        symbol: sym,
        qty: q,
        side,
      });
      pushToast({
        type: "success",
        message: `${side.toUpperCase()} ${q} ${sym} submitted${
          fiboflowApiEnabled() ? " via Fiboflow API" : ""
        }.`,
      });
      void pollPrice();
    } catch (e) {
      const msg = fiboflowApiEnabled()
        ? formatFiboflowError(e)
        : e && typeof e === "object" && "response" in e
          ? JSON.stringify(
              (e as { response?: { data?: unknown } }).response?.data ?? e
            )
          : e instanceof Error
            ? e.message
            : "Order failed";
      pushToast({ type: "error", message: msg });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-0 flex-col gap-4 lg:gap-5">
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="shrink-0"
      >
        <h1 className="text-xl font-semibold tracking-tight text-white md:text-2xl">
          Trade
        </h1>
        <p className="text-xs text-zinc-500 md:text-sm">
          Chart and order panel use the same symbol from the list below.
          {fiboflowApiEnabled() ? " Fiboflow API routing." : ""}
        </p>
      </motion.div>

      <div className="flex min-h-0 flex-1 flex-col gap-4 lg:flex-row lg:items-stretch lg:gap-5">
        <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col rounded-2xl lg:min-h-[calc(100dvh-11.5rem)]">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2 px-0.5">
            <p className="text-xs font-medium text-zinc-400">
              Chart:{" "}
              <span className="font-mono text-white">{symbol}</span>
              <span className="ml-2 text-emerald-400/90">· synced</span>
            </p>
          </div>
          <TradingChart
            symbol={symbol}
            height={chartHeight}
            allowSymbolChange={false}
          />
        </div>

        <Card className="flex w-full shrink-0 flex-col space-y-4 lg:w-[min(100%,18rem)] lg:max-w-[20rem] lg:self-stretch lg:sticky lg:top-24">
          <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 px-3 py-2">
            <p className="text-[11px] font-medium uppercase tracking-wide text-blue-200/90">
              Linked to chart
            </p>
            <p className="mt-0.5 font-mono text-sm text-white">{symbol}</p>
            <p className="mt-1 text-[10px] leading-snug text-zinc-500">
              Changing the symbol updates the chart and quote together.
            </p>
          </div>

          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-medium text-white">Order panel</p>
            <span className="text-xs text-zinc-500">
              {priceLoading
                ? "Price…"
                : price != null
                  ? `$${price.toFixed(2)}`
                  : "—"}
            </span>
          </div>

          <Select
            label="Symbol"
            value={symbol}
            onChange={setSymbol}
            options={TRADE_SYMBOL_OPTIONS}
          />
          <Input
            label="Quantity"
            type="text"
            value={qty}
            onChange={setQty}
            placeholder="Shares"
            inputMode="decimal"
          />

          <div className="grid grid-cols-2 gap-3">
            <Button
              className="w-full"
              onClick={() => void submit("buy")}
              isLoading={submitting}
            >
              Buy
            </Button>
            <Button
              variant="danger"
              className="w-full"
              onClick={() => void submit("sell")}
              isLoading={submitting}
            >
              Sell
            </Button>
          </div>

          <p className="mt-auto text-[11px] leading-relaxed text-zinc-500">
            Orders route per Settings / Fiboflow. Live = real risk — check the
            navbar mode.
          </p>
        </Card>
      </div>
    </div>
  );
}
