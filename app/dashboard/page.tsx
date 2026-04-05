"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useStore } from "@/store/useStore";
import {
  fetchTradingAccount,
  fetchTradingPositions,
  fiboflowApiEnabled,
  formatFiboflowError,
} from "@/lib/trading";
import { postFiboflowAutoTrade } from "@/lib/fiboflow-api";
import {
  type AlpacaAccount,
  type AlpacaPosition,
  displayAlpacaBuyingPower,
} from "@/lib/alpaca";
import { EquityCurveCard } from "@/components/dashboard/EquityCurveCard";

function formatCurrency(n: string | number) {
  const num = typeof n === "string" ? parseFloat(n) : n;
  if (Number.isNaN(num)) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(num);
}

export default function DashboardPage() {
  const isBotEnabled = useStore((s) => s.isBotEnabled);
  const toggleBot = useStore((s) => s.toggleBot);
  const setBotEnabled = useStore((s) => s.setBotEnabled);
  const pushToast = useStore((s) => s.pushToast);
  const updatePeakEquity = useStore((s) => s.updatePeakEquity);
  const killSwitchTriggered = useStore((s) => s.killSwitchTriggered);
  const resetKillSwitch = useStore((s) => s.resetKillSwitch);

  const [account, setAccount] = useState<AlpacaAccount | null>(null);
  const [positions, setPositions] = useState<AlpacaPosition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchedAt, setLastFetchedAt] = useState<Date | null>(null);
  const [positionsError, setPositionsError] = useState<string | null>(null);

  const load = useCallback(
    async (opts?: { silent?: boolean }) => {
      const silent = opts?.silent === true;
      if (!silent) {
        setLoading(true);
        setError(null);
      }
      try {
        const acct = await fetchTradingAccount().catch(() => null);
        let pos: AlpacaPosition[] | null = null;
        let posErr: string | null = null;
        try {
          pos = await fetchTradingPositions();
        } catch (e) {
          posErr = fiboflowApiEnabled()
            ? formatFiboflowError(e)
            : e instanceof Error
              ? e.message
              : "Could not load positions";
        }
        setPositionsError(posErr);
        setAccount((prev) => (acct != null ? acct : prev));
        setPositions((prev) => (pos !== null ? pos : prev));
        if (acct != null) {
          setLastFetchedAt(new Date());
          const eq = parseFloat(acct.equity);
          if (!Number.isNaN(eq)) updatePeakEquity(eq);
        }
      } catch (e) {
        if (!silent) {
          setError(e instanceof Error ? e.message : "Unable to load account");
        }
      } finally {
        if (!silent) setLoading(false);
      }
    },
    [updatePeakEquity]
  );

  useEffect(() => {
    void load();
  }, [load]);

  /** Auto-refresh balances — Alpaca/Fiboflow only change when we refetch. */
  useEffect(() => {
    const intervalMs = fiboflowApiEnabled() ? 15_000 : 20_000;
    const tick = () => {
      if (typeof document !== "undefined" && document.visibilityState === "hidden") {
        return;
      }
      void load({ silent: true });
    };
    const id = setInterval(tick, intervalMs);
    const onFocus = () => void load({ silent: true });
    window.addEventListener("focus", onFocus);
    return () => {
      clearInterval(id);
      window.removeEventListener("focus", onFocus);
    };
  }, [load]);

  const equity = account ? parseFloat(account.equity) : NaN;
  const lastEquity = account?.last_equity
    ? parseFloat(account.last_equity)
    : NaN;
  const pnl =
    !Number.isNaN(equity) && !Number.isNaN(lastEquity)
      ? equity - lastEquity
      : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-semibold tracking-tight text-white md:text-3xl"
          >
            Overview
          </motion.h1>
          <p className="text-sm text-zinc-500">
            Balances refresh automatically every{" "}
            {fiboflowApiEnabled() ? "~15s" : "~20s"} while this tab is visible, and
            on window focus.
          </p>
        </div>
        <Button
          variant="secondary"
          onClick={() => {
            void load();
            pushToast({ type: "info", message: "Refreshing account data…" });
          }}
          isLoading={loading}
        >
          Refresh
        </Button>
      </div>

      {error ? (
        <Card className="border border-red-500/20 text-sm text-red-200">
          {error}. Configure keys in Settings, point{" "}
          <code className="text-red-100/80">NEXT_PUBLIC_FIBOFLOW_API_URL</code> at
          your Fiboflow API, or check network.
        </Card>
      ) : null}

      {!loading && account?.detail && account.status !== "ACTIVE" ? (
        <Card className="border border-amber-500/20 text-sm text-amber-100">
          {account.detail}
        </Card>
      ) : null}

      {killSwitchTriggered ? (
        <Card className="flex flex-col gap-3 border border-amber-500/25 bg-amber-500/5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-amber-100">
              Kill switch engaged
            </p>
            <p className="text-xs text-amber-200/80">
              Drawdown threshold tripped. Automation is off until you reset.
            </p>
          </div>
          <Button variant="secondary" onClick={resetKillSwitch}>
            Reset kill switch
          </Button>
        </Card>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card highlight>
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            Account balance
          </p>
          <p className="mt-2 text-3xl font-semibold text-white">
            {loading ? "…" : formatCurrency(account?.equity ?? "—")}
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            Cash {formatCurrency(account?.cash ?? "—")}
            {account ? (
              <>
                {" "}
                · Buying power (Alpaca){" "}
                {displayAlpacaBuyingPower(account)}
              </>
            ) : null}
          </p>
          {lastFetchedAt ? (
            <p className="mt-1 text-[10px] text-zinc-600">
              Last updated {lastFetchedAt.toLocaleTimeString()}
            </p>
          ) : null}
        </Card>

        <Card>
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            Session P&amp;L
          </p>
          <p
            className={`mt-2 text-3xl font-semibold ${
              pnl != null && pnl >= 0 ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {loading ? "…" : pnl == null ? "—" : formatCurrency(pnl)}
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            {fiboflowApiEnabled()
              ? "Vs. Alpaca last_equity or start of today’s portfolio curve"
              : "Vs. last equity snapshot"}
          </p>
        </Card>

        <Card className="md:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                AI automation
              </p>
              <p className="mt-1 text-sm text-zinc-300">
                {isBotEnabled ? "Running strategies" : "Manual only"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                const next = !isBotEnabled;
                if (fiboflowApiEnabled()) {
                  void postFiboflowAutoTrade(next)
                    .then(() => {
                      setBotEnabled(next);
                      pushToast({
                        type: "success",
                        message: next
                          ? "Auto-trade ON (Fiboflow server)."
                          : "Auto-trade OFF (Fiboflow server).",
                      });
                    })
                    .catch((e) => {
                      pushToast({
                        type: "error",
                        message: formatFiboflowError(e),
                      });
                    });
                } else {
                  toggleBot();
                  pushToast({
                    type: "info",
                    message: next
                      ? "Automation armed — configure Bot tab."
                      : "Automation paused.",
                  });
                }
              }}
              className={`relative h-9 w-16 rounded-full transition ${
                isBotEnabled ? "bg-emerald-500/80" : "bg-zinc-700"
              }`}
            >
              <motion.span
                layout
                className="absolute top-1 left-1 h-7 w-7 rounded-full bg-white shadow"
                animate={{ x: isBotEnabled ? 28 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />
            </button>
          </div>
        </Card>
      </div>

      <EquityCurveCard />

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-white">Active trades</p>
            <p className="text-xs text-zinc-500">
              {fiboflowApiEnabled()
                ? "Open positions (Fiboflow API → Alpaca)"
                : "Open positions from Alpaca"}
            </p>
          </div>
          <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-zinc-400">
            {positions.length} open
          </span>
        </div>
        {positionsError ? (
          <p className="mb-3 rounded-xl border border-amber-500/25 bg-amber-500/10 px-3 py-2 text-xs text-amber-100">
            <span className="font-medium">Positions request failed.</span>{" "}
            {positionsError}
            {fiboflowApiEnabled()
              ? " Start the Fiboflow API (`npm run dev:api` or Python uvicorn), confirm NEXT_PUBLIC_FIBOFLOW_API_URL, then Refresh."
              : " Check Alpaca keys in Settings, then Refresh."}
          </p>
        ) : null}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead className="text-xs uppercase text-zinc-500">
              <tr>
                <th className="pb-2">Symbol</th>
                <th className="pb-2">Qty</th>
                <th className="pb-2">Market value</th>
                <th className="pb-2">Unrealized P&amp;L</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-zinc-500">
                    Loading positions…
                  </td>
                </tr>
              ) : positions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-zinc-500">
                    No open positions.
                  </td>
                </tr>
              ) : (
                positions.map((p) => (
                  <tr key={p.symbol} className="text-zinc-200">
                    <td className="py-3 font-medium text-white">{p.symbol}</td>
                    <td className="py-3">{p.qty}</td>
                    <td className="py-3">
                      {formatCurrency(p.market_value ?? "0")}
                    </td>
                    <td
                      className={`py-3 ${
                        parseFloat(p.unrealized_pl ?? "0") >= 0
                          ? "text-emerald-400"
                          : "text-red-400"
                      }`}
                    >
                      {formatCurrency(p.unrealized_pl ?? "0")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {!loading &&
        !positionsError &&
        fiboflowApiEnabled() &&
        positions.length === 0 &&
        account?.status &&
        account.status !== "disconnected" &&
        account.status !== "error" ? (
          <p className="mt-3 text-[11px] leading-relaxed text-zinc-600">
            The API is responding. An empty list usually means no open holdings on this
            Alpaca account
            {account.paper_or_live
              ? ` (${account.paper_or_live === "live" ? "live" : "paper"})`
              : ""}
            , or your fills closed out. If you expected positions, check the same mode in
            the Alpaca dashboard and in the navbar (paper vs live) — Fiboflow follows
            server + UI mode.
          </p>
        ) : null}
      </Card>
    </div>
  );
}
