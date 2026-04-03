/**
 * Orchestrates the same live + AI automation paths as Desktop/Apps/fiboflow (FastAPI).
 * This does not guarantee returns — it enables server-side auto-trade, AI scanner, and strategy engine.
 */
import {
  getFiboflowSettings,
  patchFiboflowSettings,
  postFiboflowLiveToggle,
} from "@/lib/fiboflow-api";

/** Enables all classic strategies + AI scanner; strategy engine in AI mode with auto_execute. */
export const FULL_AI_LIVE_SETTINGS: Record<string, unknown> = {
  auto_trade: true,
  auto_follow_ai_top_symbol: true,
  ai_learning_enabled: true,
  risk_pct: 0.1,
  strategies: {
    standard: true,
    fibonacci: true,
    hybrid: true,
    ai_scanner: true,
  },
  strategy_engine: {
    mode: "ai",
    auto_execute: true,
    toggles: {
      breakout: true,
      momentum: true,
      scalping: true,
      range: true,
      gap: true,
      pullback: true,
    },
    daily_loss_limit_pct: 10,
    max_risk_per_trade_pct: 0.1,
    rr_ratio: 2,
    enforce_liquidity: true,
  },
};

/**
 * Live Alpaca + auto-trade + AI scanner + modular engine (server trading loop).
 * @throws If server reports not live-eligible (missing live keys).
 */
export async function enableLiveFullAiAutomation(): Promise<void> {
  const before = await getFiboflowSettings();
  if (!before.live_eligible) {
    throw new Error(
      "Live keys missing on Fiboflow server. Set ALPACA_LIVE_KEY and ALPACA_LIVE_SECRET in server/.env."
    );
  }
  await postFiboflowLiveToggle(true);
  await patchFiboflowSettings(FULL_AI_LIVE_SETTINGS);
}

/** Paper mode, stop auto-trade, stop engine auto-execution (manual). */
export async function haltAutomationAndPaper(): Promise<void> {
  await postFiboflowLiveToggle(false);
  await patchFiboflowSettings({
    auto_trade: false,
    strategy_engine: {
      mode: "manual",
      auto_execute: false,
    },
  });
}
