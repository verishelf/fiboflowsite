"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  fetchTradingPositions,
  fetchTradingOrderHistory,
} from "@/lib/trading";
import type { AlpacaOrder, AlpacaPosition } from "@/lib/alpaca";

function formatCurrency(n: string | number) {
  const num = typeof n === "string" ? parseFloat(n) : n;
  if (Number.isNaN(num)) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(num);
}

export default function PortfolioPage() {
  const [positions, setPositions] = useState<AlpacaPosition[]>([]);
  const [orders, setOrders] = useState<AlpacaOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [pos, ord] = await Promise.all([
        fetchTradingPositions().catch(() => []),
        fetchTradingOrderHistory(40).catch(() => []),
      ]);
      setPositions(Array.isArray(pos) ? pos : []);
      setOrders(Array.isArray(ord) ? ord : []);
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
        <p className="mb-4 text-sm font-medium text-white">Trade history</p>
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
                orders.map((o) => (
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
                    <td className="py-3 text-zinc-400">{o.status}</td>
                    <td className="py-3">
                      {o.filled_avg_price
                        ? formatCurrency(o.filled_avg_price)
                        : "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
