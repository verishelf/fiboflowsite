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
  type FiboflowPortfolioHistory,
} from "@/lib/fiboflow-api";
import type { AlpacaAccount, AlpacaPosition, AlpacaOrder } from "@/lib/alpaca";
import {
  fetchAccount as alpacaFetchAccount,
  fetchPositions as alpacaFetchPositions,
  fetchRecentOrders,
  fetchOpenOrders,
  cancelAlpacaOrder,
  placeOrder,
  fetchLastTrade,
  fetchLastCryptoTrade,
  type PlaceMarketOrderInput,
  type PlaceOrderInput,
} from "@/lib/alpaca";
import { isCryptoPairSymbol } from "@/lib/instruments";

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
    const strMoney = (v: unknown): string | undefined => {
      if (v === undefined || v === null) return undefined;
      const s = String(v).trim();
      return s === "" ? undefined : s;
    };
    return {
      equity: a.equity ?? "0",
      cash: a.cash ?? "0",
      portfolio_value: a.portfolio_value,
      buying_power: strMoney(a.buying_power),
      non_marginable_buying_power: strMoney(a.non_marginable_buying_power),
      regt_buying_power: strMoney(a.regt_buying_power),
      daytrading_buying_power: strMoney(a.daytrading_buying_power),
      effective_buying_power: strMoney(a.effective_buying_power),
      multiplier: strMoney(a.multiplier),
      last_equity: lastEquity,
      detail: a.detail,
      status: a.status,
      /** Which Alpaca keys / positions Fiboflow used for this snapshot */
      paper_or_live: a.paper_or_live,
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

export type { FiboflowPortfolioHistory };

/** Portfolio equity curve; only populated when Fiboflow API URL is set. */
export async function fetchTradingPortfolioHistory(params?: {
  period?: string;
  timeframe?: string;
}): Promise<FiboflowPortfolioHistory | null> {
  if (!fiboflowApiEnabled()) return null;
  try {
    return await getFiboflowPortfolioHistory(params);
  } catch {
    return null;
  }
}

/**
 * Working orders from Alpaca. Empty when routing through Fiboflow (server account may differ from browser keys).
 */
export async function fetchTradingOpenOrders(): Promise<AlpacaOrder[]> {
  if (fiboflowApiEnabled()) return [];
  return fetchOpenOrders();
}

export async function cancelTradingOrder(orderId: string): Promise<void> {
  if (fiboflowApiEnabled()) {
    throw new Error(
      "Cancel open orders in Alpaca or via Fiboflow when direct Alpaca mode is active."
    );
  }
  await cancelAlpacaOrder(orderId);
}

export async function submitTradingOrder(input: PlaceOrderInput) {
  if (fiboflowApiEnabled()) {
    if (input.type !== "market") {
      const err = new Error(
        "Fiboflow API routes market orders only. Use Alpaca-in-browser (clear NEXT_PUBLIC_FIBOFLOW_API_URL) for limit/stop, or submit a market order."
      );
      (err as Error & { code?: string }).code = "FIBOFLOW_MARKET_ONLY";
      throw err;
    }
    const side = input.side.toUpperCase() as "BUY" | "SELL";
    return postFiboflowTrade({
      symbol: input.symbol,
      side,
      qty: input.qty,
      strategy: "manual_web",
    });
  }
  return placeOrder(input);
}

export async function submitTradingMarketOrder(input: PlaceMarketOrderInput) {
  return submitTradingOrder({
    symbol: input.symbol,
    qty: input.qty,
    side: input.side,
    type: "market",
  });
}

/** Last trade via Alpaca Data API when browser has keys/env (Fiboflow server has no public quote route). */
export async function fetchTradingLastTrade(symbol: string): Promise<number | null> {
  if (isCryptoPairSymbol(symbol)) {
    return fetchLastCryptoTrade(symbol);
  }
  return fetchLastTrade(symbol);
}
