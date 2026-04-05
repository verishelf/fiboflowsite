"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  fetchTradingPositions,
  fetchTradingOrderHistory,
  fetchTradingOpenOrders,
  cancelTradingOrder,
  fiboflowApiEnabled,
  formatFiboflowError,
} from "@/lib/trading";
import type { AlpacaOrder, AlpacaPosition } from "@/lib/alpaca";
import { useStore } from "@/store/useStore";

function formatCurrency(n: string | number) {
  const num = typeof n === "string" ? parseFloat(n) : n;
  if (Number.isNaN(num)) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(num);
}

/** Fiboflow blotter rows sometimes store `error:{...json}` in status — surface the broker message. */
function parseOrderStatus(raw: string): { label: string; detail?: string } {
  const s = raw.trim();
  if (!s.toLowerCase().startsWith("error:")) {
    return { label: s };
  }
  const jsonPart = s.slice(6).trim();
  try {
    const o = JSON.parse(jsonPart) as { message?: string };
    if (o.message) {
      return { label: "Rejected", detail: o.message };
    }
  } catch {
    /* ignore */
  }
  return { label: "Error", detail: jsonPart.length > 180 ? `${jsonPart.slice(0, 180)}…` : jsonPart };
}

function csvEscape(s: string): string {
  return `"${s.replace(/"/g, '""')}"`;
}

function downloadOrderHistoryCsv(rows: AlpacaOrder[]) {
  const headers = [
    "time",
    "symbol",
    "side",
    "qty",
    "status",
    "avg_fill",
    "type",
    "limit",
    "stop",
  ];
  const lines = [headers.join(",")];
  for (const o of rows) {
    lines.push(
      [
        csvEscape(o.submitted_at ?? ""),
        csvEscape(o.symbol),
        csvEscape(o.side),
        csvEscape(String(o.qty)),
        csvEscape(o.status),
        csvEscape(o.filled_avg_price ?? ""),
        csvEscape(o.type ?? ""),
        csvEscape(o.limit_price ?? ""),
        csvEscape(o.stop_price ?? ""),
      ].join(",")
    );
  }
  const blob = new Blob([lines.join("\n")], {
    type: "text/csv;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `fiboflow-blotter-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function PortfolioPage() {
  const pushToast = useStore((s) => s.pushToast);
  const [positions, setPositions] = useState<AlpacaPosition[]>([]);
  const [orders, setOrders] = useState<AlpacaOrder[]>([]);
  const [openOrders, setOpenOrders] = useState<AlpacaOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const ff = fiboflowApiEnabled();

  const load = async () => {
    setLoading(true);
    try {
      const [pos, ord, open] = await Promise.all([
        fetchTradingPositions().catch(() => []),
        fetchTradingOrderHistory(40).catch(() => []),
        ff ? Promise.resolve([] as AlpacaOrder[]) : fetchTradingOpenOrders().catch(() => []),
      ]);
      setPositions(Array.isArray(pos) ? pos : []);
      setOrders(Array.isArray(ord) ? ord : []);
      setOpenOrders(Array.isArray(open) ? open : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const totalUnrealized = positions.reduce(
    (acc, p) => acc + parseFloat(p.unrealized_pl ?? "0"),
    0
  );

  const onCancelOpen = async (orderId: string) => {
    setCancellingId(orderId);
    try {
      await cancelTradingOrder(orderId);
      pushToast({ type: "success", message: "Order cancelled." });
      await load();
    } catch (e) {
      pushToast({
        type: "error",
        message: e instanceof Error ? e.message : formatFiboflowError(e),
      });
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
            Portfolio
          </h1>
          <p className="text-sm text-zinc-500">
            Holdings, unrealized P&amp;L, and recent order flow.
          </p>
        </motion.div>
        <Button variant="secondary" onClick={() => void load()} isLoading={loading}>
          Refresh
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            Unrealized P&amp;L
          </p>
          <p
            className={`mt-2 text-3xl font-semibold ${
              totalUnrealized >= 0 ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {loading ? "…" : formatCurrency(totalUnrealized)}
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            Aggregated across {positions.length} positions
          </p>
        </Card>
        <Card>
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            Trade blotter size
          </p>
          <p className="mt-2 text-3xl font-semibold text-white">
            {loading ? "…" : orders.length}
          </p>
          <p className="mt-1 text-xs text-zinc-500">Most recent 40 orders</p>
        </Card>
      </div>

      {!ff ? (
        <Card>
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-white">Working orders</p>
              <p className="text-xs text-zinc-500">
                Open orders at Alpaca — cancel before they fill.
              </p>
            </div>
            <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-zinc-400">
              {loading ? "…" : `${openOrders.length} open`}
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="text-xs uppercase text-zinc-500">
                <tr>
                  <th className="pb-2">Symbol</th>
                  <th className="pb-2">Side</th>
                  <th className="pb-2">Qty</th>
                  <th className="pb-2">Type</th>
                  <th className="pb-2">Limit</th>
                  <th className="pb-2">Stop</th>
                  <th className="pb-2"> </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-6 text-center text-zinc-500">
                      Loading…
                    </td>
                  </tr>
                ) : openOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-zinc-500">
                      No working orders.
                    </td>
                  </tr>
                ) : (
                  openOrders.map((o) => (
                    <tr key={o.id} className="text-zinc-200">
                      <td className="py-3 font-medium text-white">{o.symbol}</td>
                      <td
                        className={`py-3 ${
                          o.side === "buy" ? "text-emerald-400" : "text-red-400"
                        }`}
                      >
                        {o.side.toUpperCase()}
                      </td>
                      <td className="py-3">{o.qty}</td>
                      <td className="py-3 text-zinc-400">{o.type ?? "—"}</td>
                      <td className="py-3 text-zinc-400">
                        {o.limit_price ?? "—"}
                      </td>
                      <td className="py-3 text-zinc-400">
                        {o.stop_price ?? "—"}
                      </td>
                      <td className="py-3 text-right">
                        <Button
                          variant="secondary"
                          type="button"
                          className="!h-8 !px-3 !py-0 !text-xs"
                          disabled={cancellingId === o.id}
                          onClick={() => void onCancelOpen(o.id)}
                        >
                          {cancellingId === o.id ? "…" : "Cancel"}
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <Card className="border border-white/[0.06] text-sm text-zinc-500">
          <p className="font-medium text-zinc-300">Working orders</p>
          <p className="mt-1 text-xs leading-relaxed">
            When using the Fiboflow API, open-order management is not wired here
            (browser keys may not match the server). Use Alpaca direct mode or
            your Fiboflow stack to cancel working orders.
          </p>
        </Card>
      )}

      <Card>
        <p className="mb-4 text-sm font-medium text-white">Holdings</p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="text-xs uppercase text-zinc-500">
              <tr>
                <th className="pb-2">Symbol</th>
                <th className="pb-2">Qty</th>
                <th className="pb-2">Market value</th>
                <th className="pb-2">Unrealized P&amp;L</th>
                <th className="pb-2">Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-zinc-500">
                    Loading holdings…
                  </td>
                </tr>
              ) : positions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-zinc-500">
                    No holdings yet.
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
                    <td className="py-3">
                      {formatCurrency(p.current_price ?? "0")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Card>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-medium text-white">Trade history</p>
          <Button
            variant="secondary"
            type="button"
            className="!h-9 !text-xs"
            disabled={loading || orders.length === 0}
            onClick={() => {
              downloadOrderHistoryCsv(orders);
              pushToast({
                type: "info",
                message: "Downloaded blotter CSV.",
              });
            }}
          >
            Export CSV
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="text-xs uppercase text-zinc-500">
              <tr>
                <th className="pb-2">Time</th>
                <th className="pb-2">Symbol</th>
                <th className="pb-2">Side</th>
                <th className="pb-2">Qty</th>
                <th className="pb-2">Status</th>
                <th className="pb-2">Avg fill</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-zinc-500">
                    Loading history…
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-zinc-500">
                    No recent orders.
                  </td>
                </tr>
              ) : (
                orders.map((o) => {
                  const st = parseOrderStatus(o.status);
                  return (
                    <tr key={o.id} className="text-zinc-200">
                      <td className="py-3 text-xs text-zinc-400">
                        {o.submitted_at
                          ? new Date(o.submitted_at).toLocaleString()
                          : "—"}
                      </td>
                      <td className="py-3 font-medium text-white">{o.symbol}</td>
                      <td
                        className={`py-3 ${
                          o.side === "buy" ? "text-emerald-400" : "text-red-400"
                        }`}
                      >
                        {o.side.toUpperCase()}
                      </td>
                      <td className="py-3">{o.qty}</td>
                      <td className="max-w-[14rem] py-3">
                        <span
                          className={
                            st.detail ? "font-medium text-amber-400" : "text-zinc-400"
                          }
                          title={st.detail ?? st.label}
                        >
                          {st.label}
                        </span>
                        {st.detail ? (
                          <p
                            className="mt-1 line-clamp-3 text-xs font-normal leading-snug text-zinc-500"
                            title={st.detail}
                          >
                            {st.detail}
                          </p>
                        ) : null}
                      </td>
                      <td className="py-3">
                        {o.filled_avg_price
                          ? formatCurrency(o.filled_avg_price)
                          : "—"}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
