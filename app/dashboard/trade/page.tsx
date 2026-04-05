"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { TradingChart } from "@/components/charts/TradingChart";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select, type SelectOption } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import {
  submitTradingOrder,
  fetchTradingLastTrade,
  fetchTradingOpenOrders,
  cancelTradingOrder,
  fiboflowApiEnabled,
  formatFiboflowError,
} from "@/lib/trading";
import type {
  AlpacaOrder,
  AlpacaOrderSide,
  AlpacaOrderType,
} from "@/lib/alpaca";
import { isUsEquityRegularSessionOpen } from "@/lib/market-hours";
import {
  normalizeWatchlistSymbol,
  watchlistSymbolMatchesSession,
} from "@/lib/watchlist";
import { useStore } from "@/store/useStore";

/** Liquid US equities / ETFs — Alpaca-friendly; chart uses NASDAQ: prefix when no exchange. */
const TRADE_STOCK_OPTIONS: readonly SelectOption[] = [
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

/** Alpaca crypto spot (slash pairs); trades 24/7. */
const TRADE_CRYPTO_OPTIONS: readonly SelectOption[] = [
  { value: "BTC/USD", label: "BTC/USD — Bitcoin" },
  { value: "ETH/USD", label: "ETH/USD — Ethereum" },
  { value: "SOL/USD", label: "SOL/USD — Solana" },
  { value: "DOGE/USD", label: "DOGE/USD — Dogecoin" },
  { value: "LTC/USD", label: "LTC/USD — Litecoin" },
  { value: "BCH/USD", label: "BCH/USD — Bitcoin Cash" },
  { value: "LINK/USD", label: "LINK/USD — Chainlink" },
  { value: "AVAX/USD", label: "AVAX/USD — Avalanche" },
] as const;

const DEFAULT_STOCK = TRADE_STOCK_OPTIONS[0]!.value;
const DEFAULT_CRYPTO = TRADE_CRYPTO_OPTIONS[0]!.value;

const ORDER_TYPE_OPTIONS: { value: AlpacaOrderType; label: string }[] = [
  { value: "market", label: "Market" },
  { value: "limit", label: "Limit" },
  { value: "stop", label: "Stop" },
  { value: "stop_limit", label: "Stop limit" },
];

type SessionPref = "auto" | "stocks" | "crypto";

function useMergedTradeOptions(
  showCrypto: boolean,
  watchlistSymbols: string[]
): SelectOption[] {
  return useMemo(() => {
    const base = showCrypto ? TRADE_CRYPTO_OPTIONS : TRADE_STOCK_OPTIONS;
    const map = new Map(base.map((o) => [o.value, o]));
    const sessionWatch = watchlistSymbols.filter((s) =>
      watchlistSymbolMatchesSession(s, showCrypto)
    );
    const seen = new Set<string>();
    const out: SelectOption[] = [];
    const push = (o: SelectOption) => {
      if (seen.has(o.value)) return;
      seen.add(o.value);
      out.push(o);
    };
    for (const s of sessionWatch) {
      push(map.get(s) ?? { value: s, label: `${s} — watchlist` });
    }
    for (const o of base) push(o);
    return out;
  }, [showCrypto, watchlistSymbols]);
}

function useEquityRthOpen(): boolean {
  const [open, setOpen] = useState(() => isUsEquityRegularSessionOpen());
  useEffect(() => {
    const tick = () => setOpen(isUsEquityRegularSessionOpen());
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);
  return open;
}

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

function formatOrderError(e: unknown): string {
  if (fiboflowApiEnabled()) {
    return formatFiboflowError(e);
  }
  if (e && typeof e === "object" && "response" in e) {
    const r = (e as { response?: { data?: unknown } }).response?.data;
    if (r !== undefined) {
      try {
        return typeof r === "string" ? r : JSON.stringify(r);
      } catch {
        /* fall through */
      }
    }
  }
  return e instanceof Error ? e.message : "Order failed";
}

export default function TradePage() {
  const pushToast = useStore((s) => s.pushToast);
  const watchlistSymbols = useStore((s) => s.watchlistSymbols);
  const addWatchlistSymbol = useStore((s) => s.addWatchlistSymbol);
  const removeWatchlistSymbol = useStore((s) => s.removeWatchlistSymbol);
  const chartHeight = useChartHeight();
  const equityRthOpen = useEquityRthOpen();
  const [sessionPref, setSessionPref] = useState<SessionPref>("auto");

  const showCryptoSymbols =
    sessionPref === "crypto" ||
    (sessionPref === "auto" && !equityRthOpen);

  const [symbol, setSymbol] = useState(() =>
    isUsEquityRegularSessionOpen() ? DEFAULT_STOCK : DEFAULT_CRYPTO
  );
  const [qty, setQty] = useState("1");
  const [orderType, setOrderType] = useState<AlpacaOrderType>("market");
  const [limitPrice, setLimitPrice] = useState("");
  const [stopPrice, setStopPrice] = useState("");
  const [watchInput, setWatchInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [price, setPrice] = useState<number | null>(null);
  const [priceLoading, setPriceLoading] = useState(false);
  const priceHintShownFor = useRef<string | null>(null);
  const [confirmSide, setConfirmSide] = useState<AlpacaOrderSide | null>(null);
  const [openOrders, setOpenOrders] = useState<AlpacaOrder[]>([]);

  const ff = fiboflowApiEnabled();
  const selectOptions = useMergedTradeOptions(
    showCryptoSymbols,
    watchlistSymbols
  );

  useEffect(() => {
    if (ff && orderType !== "market") {
      setOrderType("market");
    }
  }, [ff, orderType]);

  useEffect(() => {
    setSymbol((s) => {
      if (showCryptoSymbols) {
        return s.includes("/") ? s : DEFAULT_CRYPTO;
      }
      return s.includes("/") ? DEFAULT_STOCK : s;
    });
  }, [showCryptoSymbols]);

  const loadOpenOrders = useCallback(async () => {
    if (ff) {
      setOpenOrders([]);
      return;
    }
    try {
      const rows = await fetchTradingOpenOrders();
      setOpenOrders(rows);
    } catch {
      setOpenOrders([]);
    }
  }, [ff]);

  useEffect(() => {
    void loadOpenOrders();
    if (ff) return;
    const id = setInterval(() => void loadOpenOrders(), 20_000);
    return () => clearInterval(id);
  }, [ff, loadOpenOrders]);

  const orderTypeSelectOptions: SelectOption[] = useMemo(() => {
    const opts = ff
      ? ORDER_TYPE_OPTIONS.filter((o) => o.value === "market")
      : ORDER_TYPE_OPTIONS;
    return opts.map((o) => ({ value: o.value, label: o.label }));
  }, [ff]);

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

  const validatePrices = (): {
    limit_price?: number;
    stop_price?: number;
    error?: string;
  } => {
    if (orderType === "market") return {};
    if (orderType === "limit") {
      const lp = parseFloat(limitPrice);
      if (Number.isNaN(lp) || lp <= 0) {
        return { error: "Enter a valid limit price." };
      }
      return { limit_price: lp };
    }
    if (orderType === "stop") {
      const sp = parseFloat(stopPrice);
      if (Number.isNaN(sp) || sp <= 0) {
        return { error: "Enter a valid stop price." };
      }
      return { stop_price: sp };
    }
    const lp = parseFloat(limitPrice);
    const sp = parseFloat(stopPrice);
    if (Number.isNaN(lp) || lp <= 0) {
      return { error: "Enter a valid limit price for stop-limit." };
    }
    if (Number.isNaN(sp) || sp <= 0) {
      return { error: "Enter a valid stop price for stop-limit." };
    }
    return { limit_price: lp, stop_price: sp };
  };

  const openConfirm = (side: AlpacaOrderSide) => {
    const sym = symbol.trim();
    const q = parseFloat(qty);
    if (!sym || Number.isNaN(q) || q <= 0) {
      pushToast({ type: "error", message: "Pick a symbol and valid quantity." });
      return;
    }
    const { error } = validatePrices();
    if (error) {
      pushToast({ type: "error", message: error });
      return;
    }
    setConfirmSide(side);
  };

  const executeConfirmed = async () => {
    if (!confirmSide) return;
    const sym = symbol.trim();
    const q = parseFloat(qty);
    const prices = validatePrices();
    if (prices.error) {
      pushToast({ type: "error", message: prices.error });
      setConfirmSide(null);
      return;
    }
    setSubmitting(true);
    try {
      await submitTradingOrder({
        symbol: sym,
        qty: q,
        side: confirmSide,
        type: orderType,
        limit_price: prices.limit_price,
        stop_price: prices.stop_price,
      });
      pushToast({
        type: "success",
        message: `${confirmSide.toUpperCase()} ${q} ${sym} (${orderType})${
          ff ? " via Fiboflow API" : ""
        } submitted.`,
      });
      setConfirmSide(null);
      void pollPrice();
      void loadOpenOrders();
    } catch (e) {
      pushToast({ type: "error", message: formatOrderError(e) });
    } finally {
      setSubmitting(false);
    }
  };

  const addWatch = () => {
    const norm = normalizeWatchlistSymbol(watchInput);
    if (!norm) {
      pushToast({
        type: "error",
        message:
          "Use a ticker (e.g. RBLX) or crypto pair BASE/USD (e.g. BTC/USD).",
      });
      return;
    }
    if (!watchlistSymbolMatchesSession(norm, showCryptoSymbols)) {
      pushToast({
        type: "error",
        message: showCryptoSymbols
          ? "Crypto watchlist entries must look like BTC/USD."
          : "Stock watchlist entries must be tickers without a slash.",
      });
      return;
    }
    addWatchlistSymbol(norm);
    setSymbol(norm);
    setWatchInput("");
    pushToast({ type: "success", message: `${norm} added to watchlist.` });
  };

  const onCancelOrder = async (id: string) => {
    setCancellingId(id);
    try {
      await cancelTradingOrder(id);
      pushToast({ type: "success", message: "Order cancelled." });
      void loadOpenOrders();
    } catch (e) {
      pushToast({ type: "error", message: formatOrderError(e) });
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="flex min-h-0 flex-col gap-4 lg:gap-5">
      {confirmSide ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/65 p-4 sm:items-center"
          role="presentation"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setConfirmSide(null);
          }}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-white/10 bg-zinc-950 p-5 shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-order-title"
          >
            <p
              id="confirm-order-title"
              className="text-base font-semibold text-white"
            >
              Confirm order
            </p>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              {confirmSide.toUpperCase()}{" "}
              <span className="font-mono text-zinc-200">{qty}</span>{" "}
              <span className="font-mono text-white">{symbol.trim()}</span>
              {orderType !== "market" ? (
                <>
                  {" "}
                  ·{" "}
                  <span className="text-zinc-300">
                    {orderType.replace(/_/g, "-")}
                  </span>
                  {validatePrices().limit_price != null ? (
                    <span className="text-zinc-400">
                      {" "}
                      limit {validatePrices().limit_price}
                    </span>
                  ) : null}
                  {validatePrices().stop_price != null ? (
                    <span className="text-zinc-400">
                      {" "}
                      stop {validatePrices().stop_price}
                    </span>
                  ) : null}
                </>
              ) : null}
              . This is not undoable.
            </p>
            <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button
                variant="secondary"
                type="button"
                className="w-full sm:w-auto"
                onClick={() => setConfirmSide(null)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="w-full sm:w-auto"
                variant={confirmSide === "sell" ? "danger" : "primary"}
                onClick={() => void executeConfirmed()}
                isLoading={submitting}
              >
                Submit {confirmSide.toUpperCase()}
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="shrink-0"
      >
        <h1 className="text-xl font-semibold tracking-tight text-white md:text-2xl">
          Trade
        </h1>
        <p className="text-xs text-zinc-500 md:text-sm">
          {sessionPref === "auto" ? (
            <>
              <span className="text-zinc-400">
                {equityRthOpen
                  ? "US stock market open — equities list."
                  : "US stock market closed — crypto list (24/7)."}
              </span>{" "}
              Override below if needed.
            </>
          ) : sessionPref === "crypto" ? (
            "Crypto pairs only (Alpaca format BASE/USD)."
          ) : (
            "US equities only — chart may be quiet outside RTH."
          )}
          {ff ? " Fiboflow API routing." : ""}
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {(
            [
              ["auto", "Auto"],
              ["stocks", "Stocks"],
              ["crypto", "Crypto"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setSessionPref(id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                sessionPref === id
                  ? "bg-blue-600/40 text-white ring-1 ring-blue-500/40"
                  : "bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-zinc-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
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

        <Card className="flex w-full shrink-0 flex-col space-y-4 lg:w-[min(100%,24rem)] lg:max-w-[26rem] lg:self-stretch lg:sticky lg:top-24">
          <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 px-3 py-2">
            <p className="text-[11px] font-medium uppercase tracking-wide text-blue-200/90">
              Linked to chart
            </p>
            <p className="mt-0.5 font-mono text-sm text-white">{symbol}</p>
            <p className="mt-1 text-[10px] leading-snug text-zinc-500">
              {showCryptoSymbols
                ? "Crypto trades 24/7; qty is coin amount (e.g. 0.01 BTC)."
                : "Equities: regular session Mon–Fri 9:30–4 ET (extended hours vary)."}
            </p>
          </div>

          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-medium text-white">Order panel</p>
            <span className="text-xs text-zinc-500">
              {priceLoading
                ? "Price…"
                : price != null
                  ? `$${price.toFixed(price < 1 ? 4 : 2)}`
                  : "—"}
            </span>
          </div>

          <Select
            label={showCryptoSymbols ? "Crypto pair" : "Symbol"}
            value={symbol}
            onChange={setSymbol}
            options={selectOptions}
          />

          <div>
            <p className="mb-1.5 text-sm font-medium text-zinc-300">Watchlist</p>
            <div className="flex gap-2">
              <Input
                label=""
                type="text"
                value={watchInput}
                onChange={setWatchInput}
                placeholder={showCryptoSymbols ? "e.g. MATIC/USD" : "e.g. RBLX"}
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addWatch();
                  }
                }}
              />
              <Button
                type="button"
                variant="secondary"
                className="shrink-0 self-end"
                onClick={addWatch}
              >
                Add
              </Button>
            </div>
            {watchlistSymbols.filter((s) =>
              watchlistSymbolMatchesSession(s, showCryptoSymbols)
            ).length > 0 ? (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {watchlistSymbols
                  .filter((s) =>
                    watchlistSymbolMatchesSession(s, showCryptoSymbols)
                  )
                  .map((s) => (
                    <span
                      key={s}
                      className="inline-flex items-center gap-1 rounded-lg bg-white/5 px-2 py-1 text-[11px] text-zinc-300"
                    >
                      <button
                        type="button"
                        className="font-mono text-white hover:text-blue-300"
                        onClick={() => setSymbol(s)}
                      >
                        {s}
                      </button>
                      <button
                        type="button"
                        className="text-zinc-500 hover:text-red-400"
                        aria-label={`Remove ${s}`}
                        onClick={() => removeWatchlistSymbol(s)}
                      >
                        ×
                      </button>
                    </span>
                  ))}
              </div>
            ) : (
              <p className="mt-1.5 text-[11px] text-zinc-600">
                Add symbols to pin them at the top of the dropdown.
              </p>
            )}
          </div>

          <Select
            label="Order type"
            value={orderType}
            onChange={(v) => setOrderType(v as AlpacaOrderType)}
            options={orderTypeSelectOptions}
          />
          {ff ? (
            <p className="text-[11px] leading-snug text-zinc-500">
              Fiboflow routes market orders only. For limit/stop, trade with
              direct Alpaca (clear{" "}
              <code className="text-zinc-400">NEXT_PUBLIC_FIBOFLOW_API_URL</code>
              ).
            </p>
          ) : null}

          {orderType === "limit" || orderType === "stop_limit" ? (
            <Input
              label="Limit price"
              type="text"
              value={limitPrice}
              onChange={setLimitPrice}
              placeholder="0.00"
              inputMode="decimal"
            />
          ) : null}
          {orderType === "stop" || orderType === "stop_limit" ? (
            <Input
              label="Stop price"
              type="text"
              value={stopPrice}
              onChange={setStopPrice}
              placeholder="0.00"
              inputMode="decimal"
            />
          ) : null}

          <Input
            label="Quantity"
            type="text"
            value={qty}
            onChange={setQty}
            placeholder={showCryptoSymbols ? "Coin amount" : "Shares"}
            inputMode="decimal"
          />

          <div className="grid grid-cols-2 gap-3">
            <Button
              className="w-full"
              onClick={() => openConfirm("buy")}
              disabled={submitting}
            >
              Buy
            </Button>
            <Button
              variant="danger"
              className="w-full"
              onClick={() => openConfirm("sell")}
              disabled={submitting}
            >
              Sell
            </Button>
          </div>

          {!ff ? (
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-medium text-zinc-300">
                  Open orders ({openOrders.length})
                </p>
                <Button
                  variant="secondary"
                  type="button"
                  className="!h-7 !px-2 !py-0 !text-[11px]"
                  onClick={() => void loadOpenOrders()}
                >
                  Refresh
                </Button>
              </div>
              {openOrders.length === 0 ? (
                <p className="mt-2 text-[11px] text-zinc-600">None working.</p>
              ) : (
                <ul className="mt-2 max-h-36 space-y-2 overflow-y-auto text-[11px]">
                  {openOrders.slice(0, 8).map((o) => (
                    <li
                      key={o.id}
                      className="flex items-start justify-between gap-2 border-b border-white/[0.04] pb-2 last:border-0"
                    >
                      <span className="text-zinc-400">
                        <span className="font-mono text-zinc-200">{o.symbol}</span>{" "}
                        {o.side} {o.qty}{" "}
                        <span className="text-zinc-500">
                          {o.type ?? "order"}
                        </span>
                      </span>
                      <button
                        type="button"
                        className="shrink-0 text-red-400/90 hover:text-red-300"
                        disabled={cancellingId === o.id}
                        onClick={() => void onCancelOrder(o.id)}
                      >
                        {cancellingId === o.id ? "…" : "Cancel"}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              <Link
                href="/dashboard/portfolio"
                className="mt-2 inline-block text-[11px] text-blue-400/90 hover:text-blue-300"
                prefetch={false}
              >
                Full blotter →
              </Link>
            </div>
          ) : (
            <p className="text-[11px] text-zinc-600">
              Working orders and cancel appear here in direct Alpaca mode (see
              Portfolio).
            </p>
          )}

          <p className="mt-auto text-[11px] leading-relaxed text-zinc-500">
            Orders route per Settings / Fiboflow. Live = real risk — check the
            navbar mode. Crypto requires Alpaca crypto trading; data quotes need
            a plan that includes crypto.
          </p>
        </Card>
      </div>
    </div>
  );
}
