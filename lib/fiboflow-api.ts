/**
 * Client for the Desktop/Apps/fiboflow FastAPI server (same routes as Expo `lib/api.ts`).
 * Set NEXT_PUBLIC_FIBOFLOW_API_URL (e.g. http://127.0.0.1:8000). CORS on the server allows *.
 */
import axios, { isAxiosError, type AxiosInstance } from "axios";

export function getFiboflowBaseUrl(): string {
  return (process.env.NEXT_PUBLIC_FIBOFLOW_API_URL ?? "").trim().replace(/\/$/, "");
}

export function fiboflowApiEnabled(): boolean {
  return Boolean(getFiboflowBaseUrl());
}

function client(): AxiosInstance {
  const base = getFiboflowBaseUrl();
  return axios.create({
    baseURL: base,
    timeout: 45_000,
    headers: { "Content-Type": "application/json" },
  });
}

export type FiboflowAccount = {
  equity: string;
  cash: string;
  portfolio_value?: string;
  buying_power?: string;
  status?: string;
  paper_or_live?: string;
  detail?: string;
  /** Alpaca previous snapshot; enables session PnL in the web UI */
  last_equity?: string;
};

export type FiboflowPortfolioHistory = {
  status?: string;
  equity?: number[];
  timestamps?: string[];
  paper_or_live?: string;
  detail?: string;
};

export async function getFiboflowPortfolioHistory(params?: {
  period?: string;
  timeframe?: string;
}): Promise<FiboflowPortfolioHistory> {
  const { data } = await client().get<FiboflowPortfolioHistory>(
    "/portfolio/history",
    {
      params: {
        period: params?.period ?? "1D",
        ...(params?.timeframe ? { timeframe: params.timeframe } : {}),
      },
    }
  );
  return data ?? {};
}

export type FiboflowPosition = {
  symbol: string;
  qty: string;
  avg_entry_price?: string;
  market_value: string;
  unrealized_pl: string;
};

export type FiboflowTradeRow = {
  id?: string;
  symbol?: string;
  side?: string;
  qty?: number | string | null;
  price?: number | string | null;
  status?: string | null;
  created_at?: string;
  paper_or_live?: string;
  strategy?: string;
  external_id?: string | null;
};

export type FiboflowPublicSettings = {
  auto_trade?: boolean;
  paper_or_live?: string;
  risk_pct?: number;
  strategies?: Record<string, boolean>;
  strategy_engine?: Record<string, unknown>;
  live_eligible?: boolean;
  default_symbol?: string;
  auto_follow_ai_top_symbol?: boolean;
  ai_learning_enabled?: boolean;
  ai_learning?: {
    enabled?: boolean;
    openai_configured?: boolean;
  };
};

export type FiboflowTraderActivity = {
  poll_interval_sec?: number;
  events?: Array<Record<string, unknown>>;
};

export async function getFiboflowTraderActivity(): Promise<FiboflowTraderActivity> {
  const { data } = await client().get<FiboflowTraderActivity>("/trader/activity");
  return data ?? {};
}

export async function fiboflowHealth(): Promise<boolean> {
  try {
    await client().get("/health");
    return true;
  } catch {
    return false;
  }
}

export async function getFiboflowAccount(): Promise<FiboflowAccount> {
  const { data } = await client().get<FiboflowAccount>("/account");
  return data;
}

export async function getFiboflowPositions(): Promise<FiboflowPosition[]> {
  const { data } = await client().get<FiboflowPosition[]>("/positions");
  return Array.isArray(data) ? data : [];
}

export async function getFiboflowTrades(params?: {
  limit?: number;
}): Promise<FiboflowTradeRow[]> {
  const { data } = await client().get<FiboflowTradeRow[]>("/trades", {
    params: { limit: params?.limit ?? 500 },
  });
  return Array.isArray(data) ? data : [];
}

export async function postFiboflowTrade(body: {
  symbol: string;
  side: "BUY" | "SELL";
  qty: number;
  strategy?: string;
}): Promise<{ order?: Record<string, unknown>; mode?: string }> {
  const { data } = await client().post("/trade", {
    strategy: body.strategy ?? "manual_web",
    symbol: body.symbol,
    side: body.side,
    qty: body.qty,
  });
  return data as { order?: Record<string, unknown>; mode?: string };
}

export async function getFiboflowSettings(): Promise<FiboflowPublicSettings> {
  const { data } = await client().get<FiboflowPublicSettings>("/settings");
  return data;
}

export async function patchFiboflowSettings(
  body: Record<string, unknown>
): Promise<FiboflowPublicSettings> {
  const { data } = await client().post<FiboflowPublicSettings>("/settings", body);
  return data;
}

export async function postFiboflowLiveToggle(
  enabled: boolean
): Promise<FiboflowPublicSettings> {
  const { data } = await client().post<FiboflowPublicSettings>("/live-toggle", {
    enabled,
  });
  return data;
}

export async function postFiboflowAutoTrade(
  enabled: boolean
): Promise<FiboflowPublicSettings> {
  const { data } = await client().post<FiboflowPublicSettings>(
    "/auto-trade-toggle",
    { enabled }
  );
  return data;
}

export function formatFiboflowError(err: unknown): string {
  if (!isAxiosError(err)) {
    return err instanceof Error ? err.message : String(err);
  }
  const d = err.response?.data as
    | { detail?: unknown }
    | string
    | undefined;
  if (d && typeof d === "object" && "detail" in d) {
    const det = d.detail;
    if (typeof det === "string") return det;
    if (det && typeof det === "object" && "message" in det) {
      return String((det as { message: string }).message);
    }
    try {
      return JSON.stringify(det);
    } catch {
      return err.message;
    }
  }
  return err.message;
}
