import axios, { type AxiosInstance } from "axios";
import {
  useStore,
  getEffectiveApiKey,
  getEffectiveApiSecret,
} from "@/store/useStore";

export const ALPACA_PAPER_URL = "https://paper-api.alpaca.markets";
export const ALPACA_LIVE_URL = "https://api.alpaca.markets";
export const ALPACA_DATA_URL = "https://data.alpaca.markets";

export function getAlpacaBaseUrl(isPaper: boolean): string {
  return isPaper ? ALPACA_PAPER_URL : ALPACA_LIVE_URL;
}

/**
 * Builds an Axios instance whose base URL and auth headers always reflect
 * the latest Zustand state (plus optional NEXT_PUBLIC_* env fallbacks).
 */
export function createAlpacaClient(): AxiosInstance {
  const instance = axios.create();

  instance.interceptors.request.use((config) => {
    const { isPaperTrading } = useStore.getState();
    config.baseURL = getAlpacaBaseUrl(isPaperTrading);

    const key = getEffectiveApiKey();
    const secret = getEffectiveApiSecret();

    config.headers.set("APCA-API-KEY-ID", key);
    config.headers.set("APCA-API-SECRET-KEY", secret);

    return config;
  });

  return instance;
}

const clientSingleton = createAlpacaClient();

export function getAlpacaHttp(): AxiosInstance {
  return clientSingleton;
}

export type AlpacaAccount = {
  equity: string;
  cash: string;
  last_equity?: string;
  buying_power?: string;
  /** Alpaca: cash-only / non-margin dollars available for many orders */
  non_marginable_buying_power?: string;
  regt_buying_power?: string;
  daytrading_buying_power?: string;
  effective_buying_power?: string;
  /** "1" = cash account; Alpaca says buying_power should equal cash */
  multiplier?: string;
  portfolio_value?: string;
  /** Fiboflow API / broker disconnected message */
  detail?: string;
  status?: string;
  /** Set when data comes from Fiboflow `/account` */
  paper_or_live?: string;
};

function accountNum(s?: string | null): number {
  const n = parseFloat(String(s ?? "").replace(/,/g, ""));
  return Number.isFinite(n) ? n : 0;
}

/** Parse Alpaca money strings (or JSON numbers from proxies). */
export function parseAlpacaMoney(
  s: string | number | null | undefined
): number | null {
  if (s === null || s === undefined) return null;
  const t = String(s).trim().replace(/,/g, "");
  if (t === "") return null;
  const n = parseFloat(t);
  return Number.isFinite(n) ? n : null;
}

/** Format a single Alpaca currency field without rounding small balances to $0.00. */
export function formatAlpacaMoney(
  s: string | number | null | undefined
): string {
  const n = parseAlpacaMoney(s);
  if (n === null) return "—";
  const micro = Math.abs(n) > 0 && Math.abs(n) < 0.05;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: micro ? 4 : 2,
  }).format(n);
}

/**
 * Show Alpaca `/v2/account` buying power: primary `buying_power`, then other BP fields if absent.
 */
export function displayAlpacaBuyingPower(
  account: AlpacaAccount | null | undefined
): string {
  if (!account) return "—";
  const raw = account.buying_power;
  if (raw !== undefined && raw !== null && String(raw).trim() !== "") {
    return formatAlpacaMoney(raw);
  }
  const fallbacks: (string | undefined)[] = [
    account.non_marginable_buying_power,
    account.regt_buying_power,
    account.daytrading_buying_power,
    account.effective_buying_power,
  ];
  for (const v of fallbacks) {
    if (v !== undefined && v !== null && String(v).trim() !== "") {
      return formatAlpacaMoney(v);
    }
  }
  return "—";
}

/**
 * Alpaca exposes several “buying power” numbers. Margin `buying_power` can be tiny while
 * `non_marginable_buying_power` or cash reflects what you can actually spend on stocks/crypto.
 * Fiboflow proxies sometimes forward a misleading `buying_power` alone.
 */
export function pickBuyingPowerForOrders(account: AlpacaAccount): {
  valueStr: string;
  note?: string;
} {
  const cash = accountNum(account.cash);
  const bp = accountNum(account.buying_power);
  const mult = accountNum(account.multiplier ?? "1");
  const nm = account.non_marginable_buying_power;
  const nmN = nm != null ? accountNum(nm) : NaN;
  const regtN =
    account.regt_buying_power != null
      ? accountNum(account.regt_buying_power)
      : NaN;
  const effN =
    account.effective_buying_power != null
      ? accountNum(account.effective_buying_power)
      : NaN;

  if (!Number.isNaN(nmN) && nmN > bp + 0.005) {
    return {
      valueStr: nm!,
      note: `Non-margin buying power (Alpaca). Raw buying_power was ${bp.toFixed(2)}.`,
    };
  }
  if (!Number.isNaN(effN) && effN > bp + 0.005) {
    return { valueStr: account.effective_buying_power! };
  }
  if (!Number.isNaN(regtN) && regtN > bp + 0.005 && cash > bp + 0.01) {
    return {
      valueStr: account.regt_buying_power!,
      note: `Reg T buying power. Raw buying_power was ${bp.toFixed(2)}.`,
    };
  }
  if (mult <= 1 && cash > bp + 0.01) {
    return {
      valueStr: String(account.cash),
      note:
        "Using cash — for 1× accounts Alpaca ties buying power to cash; API buying_power looked wrong.",
    };
  }

  return { valueStr: account.buying_power ?? "0" };
}

export async function fetchAccount(): Promise<AlpacaAccount> {
  const client = getAlpacaHttp();
  const { data } = await client.get<AlpacaAccount>("/v2/account");
  return data;
}

export type AlpacaOrderSide = "buy" | "sell";

export type AlpacaOrderTimeInForce = "day" | "gtc" | "ioc" | "fok";

export type AlpacaOrderType = "market" | "limit" | "stop" | "stop_limit";

export type PlaceMarketOrderInput = {
  symbol: string;
  qty: number;
  side: AlpacaOrderSide;
};

export type PlaceOrderInput = {
  symbol: string;
  qty: number;
  side: AlpacaOrderSide;
  type: AlpacaOrderType;
  time_in_force?: AlpacaOrderTimeInForce;
  limit_price?: number;
  stop_price?: number;
};

export async function placeOrder(input: PlaceOrderInput) {
  const client = getAlpacaHttp();
  const body: Record<string, unknown> = {
    symbol: input.symbol.includes("/")
      ? input.symbol.trim().toUpperCase()
      : input.symbol.toUpperCase(),
    qty: input.qty,
    side: input.side,
    type: input.type,
    time_in_force: input.time_in_force ?? "day",
  };
  if (
    (input.type === "limit" || input.type === "stop_limit") &&
    input.limit_price != null
  ) {
    body.limit_price = input.limit_price;
  }
  if (
    (input.type === "stop" || input.type === "stop_limit") &&
    input.stop_price != null
  ) {
    body.stop_price = input.stop_price;
  }
  const { data } = await client.post("/v2/orders", body);
  return data;
}

export async function placeMarketOrder(input: PlaceMarketOrderInput) {
  return placeOrder({
    symbol: input.symbol,
    qty: input.qty,
    side: input.side,
    type: "market",
  });
}

export type AlpacaPosition = {
  symbol: string;
  qty: string;
  market_value?: string;
  unrealized_pl?: string;
  unrealized_plpc?: string;
  current_price?: string;
};

export async function fetchPositions(): Promise<AlpacaPosition[]> {
  const client = getAlpacaHttp();
  const { data } = await client.get<AlpacaPosition[]>("/v2/positions");
  return data;
}

export type AlpacaOrder = {
  id: string;
  symbol: string;
  side: string;
  qty: string;
  filled_qty?: string;
  status: string;
  submitted_at?: string;
  filled_avg_price?: string;
  /** Alpaca `type` field (market, limit, stop, …) */
  type?: string;
  limit_price?: string;
  stop_price?: string;
};

export async function fetchRecentOrders(limit = 25): Promise<AlpacaOrder[]> {
  const client = getAlpacaHttp();
  const { data } = await client.get<AlpacaOrder[]>("/v2/orders", {
    params: { status: "all", limit, direction: "desc" },
  });
  return data;
}

export async function fetchOpenOrders(limit = 50): Promise<AlpacaOrder[]> {
  const client = getAlpacaHttp();
  const { data } = await client.get<AlpacaOrder[]>("/v2/orders", {
    params: { status: "open", limit, direction: "desc", nested: false },
  });
  return Array.isArray(data) ? data : [];
}

export async function cancelAlpacaOrder(orderId: string): Promise<void> {
  const client = getAlpacaHttp();
  await client.delete(`/v2/orders/${encodeURIComponent(orderId)}`);
}

export type AlpacaLastQuote = {
  symbol: string;
  bid?: number;
  ask?: number;
  bidSize?: number;
  askSize?: number;
};

/** Latest trade price via Alpaca Data API v2 (same API keys; plan-dependent access). */
export async function fetchLastTrade(symbol: string): Promise<number | null> {
  const key = getEffectiveApiKey();
  const secret = getEffectiveApiSecret();
  if (!key || !secret) return null;
  try {
    const { data } = await axios.get<{ trade?: { p?: number } }>(
      `${ALPACA_DATA_URL}/v2/stocks/${encodeURIComponent(symbol.toUpperCase())}/trades/latest`,
      {
        headers: {
          "APCA-API-KEY-ID": key,
          "APCA-API-SECRET-KEY": secret,
        },
      }
    );
    return data.trade?.p ?? null;
  } catch {
    return null;
  }
}

type CryptoLatestTrades = {
  trades?: Record<string, { p?: number } | undefined>;
};

/** Latest crypto trade via Alpaca Data API v1beta3 (symbol e.g. BTC/USD). */
export async function fetchLastCryptoTrade(symbol: string): Promise<number | null> {
  const key = getEffectiveApiKey();
  const secret = getEffectiveApiSecret();
  if (!key || !secret) return null;
  const sym = symbol.trim().toUpperCase();
  try {
    const { data } = await axios.get<CryptoLatestTrades>(
      `${ALPACA_DATA_URL}/v1beta3/crypto/us/latest/trades`,
      {
        params: { symbols: sym },
        headers: {
          "APCA-API-KEY-ID": key,
          "APCA-API-SECRET-KEY": secret,
        },
      }
    );
    const row = data.trades?.[sym];
    const p = row?.p;
    return typeof p === "number" && Number.isFinite(p) ? p : null;
  } catch {
    return null;
  }
}
