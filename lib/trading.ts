/**
 * Unified trading layer: Fiboflow FastAPI (Desktop app server) when configured,
 * otherwise direct Alpaca from the browser (existing behavior).
 */
import {
  fiboflowApiEnabled,
  getFiboflowAccount,
  getFiboflowPortfolioHistory,
  getFiboflowPositions,
  getFiboflowTrades,
  postFiboflowTrade,
} from "@/lib/fiboflow-api";
import type { AlpacaAccount, AlpacaPosition, AlpacaOrder } from "@/lib/alpaca";
import {
  fetchAccount as alpacaFetchAccount,
  fetchPositions as alpacaFetchPositions,
  fetchRecentOrders,
  placeMarketOrder,
  fetchLastTrade,
  type PlaceMarketOrderInput,
} from "@/lib/alpaca";

export { fiboflowApiEnabled, formatFiboflowError } from "@/lib/fiboflow-api";

export async function fetchTradingAccount(): Promise<AlpacaAccount> {
  if (fiboflowApiEnabled()) {
    const a = await getFiboflowAccount();
    let lastEquity = a.last_equity;
    const canUseHistory =
      a.status !== "disconnected" && a.status !== "error";
    if (!lastEquity && canUseHistory) {
      try {
        const ph = await getFiboflowPortfolioHistory({ period: "1D" });
        if (
          ph.status === "ok" &&
          Array.isArray(ph.equity) &&
          ph.equity.length > 0
        ) {
          lastEquity = String(ph.equity[0]);
        }
      } catch {
        /* ignore */
      }
    }
    return {
      equity: a.equity ?? "0",
      cash: a.cash ?? "0",
      portfolio_value: a.portfolio_value,
      buying_power: a.buying_power,
      last_equity: lastEquity,
      detail: a.detail,
      status: a.status,
    };
  }
  return alpacaFetchAccount();
}

export async function fetchTradingPositions(): Promise<AlpacaPosition[]> {
  if (fiboflowApiEnabled()) {
    const rows = await getFiboflowPositions();
    return rows.map((p) => ({
      symbol: p.symbol,
      qty: p.qty,
      market_value: p.market_value,
      unrealized_pl: p.unrealized_pl,
      current_price: undefined,
    }));
  }
  return alpacaFetchPositions();
}

function tradeRowToOrderLike(t: import("@/lib/fiboflow-api").FiboflowTradeRow): AlpacaOrder {
  const id = String(t.id ?? t.external_id ?? `ff-${t.created_at ?? ""}-${t.symbol}`);
  return {
    id,
    symbol: String(t.symbol ?? ""),
    side: String(t.side ?? "").toLowerCase(),
    qty: String(t.qty ?? ""),
    status: String(t.status ?? "recorded"),
    submitted_at: t.created_at,
    filled_avg_price:
      t.price != null && t.price !== "" ? String(t.price) : undefined,
  };
}

export async function fetchTradingOrderHistory(limit = 40): Promise<AlpacaOrder[]> {
  if (fiboflowApiEnabled()) {
    const rows = await getFiboflowTrades({ limit });
    return rows.slice(0, limit).map(tradeRowToOrderLike);
  }
  return fetchRecentOrders(limit);
}

export async function submitTradingMarketOrder(input: PlaceMarketOrderInput) {
  if (fiboflowApiEnabled()) {
    const side = input.side.toUpperCase() as "BUY" | "SELL";
    return postFiboflowTrade({
      symbol: input.symbol,
      side,
      qty: input.qty,
      strategy: "manual_web",
    });
  }
  return placeMarketOrder(input);
}

/** Last trade via Alpaca Data API when browser has keys/env (Fiboflow server has no public quote route). */
export async function fetchTradingLastTrade(symbol: string): Promise<number | null> {
  return fetchLastTrade(symbol);
}
