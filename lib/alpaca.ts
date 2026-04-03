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
  portfolio_value?: string;
  /** Fiboflow API / broker disconnected message */
  detail?: string;
  status?: string;
};

export async function fetchAccount(): Promise<AlpacaAccount> {
  const client = getAlpacaHttp();
  const { data } = await client.get<AlpacaAccount>("/v2/account");
  return data;
}

export type AlpacaOrderSide = "buy" | "sell";

export type PlaceMarketOrderInput = {
  symbol: string;
  qty: number;
  side: AlpacaOrderSide;
};

export async function placeMarketOrder(input: PlaceMarketOrderInput) {
  const client = getAlpacaHttp();
  const { data } = await client.post("/v2/orders", {
    symbol: input.symbol.toUpperCase(),
    qty: input.qty,
    side: input.side,
    type: "market",
    time_in_force: "day",
  });
  return data;
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
};

export async function fetchRecentOrders(limit = 25): Promise<AlpacaOrder[]> {
  const client = getAlpacaHttp();
  const { data } = await client.get<AlpacaOrder[]>("/v2/orders", {
    params: { status: "all", limit, direction: "desc" },
  });
  return data;
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
