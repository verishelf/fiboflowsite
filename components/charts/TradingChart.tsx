"use client";

import { useEffect, useId, useRef } from "react";
import { tradingViewSymbolForInstrument } from "@/lib/instruments";

type TradingChartProps = {
  symbol: string;
  /** Pixel height passed to TradingView (should match container for crisp layout). */
  height?: number;
  className?: string;
  /**
   * When false, symbol only changes from your app (stays synced with order panel).
   * When true, users can pick another symbol inside TradingView (desync risk).
   */
  allowSymbolChange?: boolean;
};

declare global {
  interface Window {
    TradingView?: {
      widget: new (config: Record<string, unknown>) => { remove?: () => void };
    };
  }
}

export function TradingChart({
  symbol,
  height = 480,
  className = "",
  allowSymbolChange = false,
}: TradingChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<{ remove?: () => void } | null>(null);
  const containerId = `tv-${useId().replace(/:/g, "")}`;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = "";

    const existing = document.querySelector(
      'script[src="https://s3.tradingview.com/tv.js"]'
    ) as HTMLScriptElement | null;

    const init = () => {
      if (!containerRef.current || !window.TradingView) return;
      const tvSymbol = tradingViewSymbolForInstrument(symbol);
      widgetRef.current = new window.TradingView.widget({
        autosize: true,
        symbol: tvSymbol,
        interval: "60",
        timezone: "Etc/UTC",
        theme: "dark",
        style: "1",
        locale: "en",
        enable_publishing: false,
        allow_symbol_change: allowSymbolChange,
        container_id: containerId,
        height,
        hide_top_toolbar: false,
      }) as { remove?: () => void };
    };

    if (existing && window.TradingView) {
      init();
    } else {
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/tv.js";
      script.async = true;
      script.onload = init;
      document.body.appendChild(script);
    }

    return () => {
      try {
        widgetRef.current?.remove?.();
      } catch {
        /* TradingView widget teardown can throw during fast route changes */
      }
      widgetRef.current = null;
      try {
        container.innerHTML = "";
      } catch {
        /* ignore */
      }
    };
  }, [symbol, height, containerId, allowSymbolChange]);

  return (
    <div
      className={`relative flex min-h-0 w-full flex-1 flex-col overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/60 shadow-inner ${className}`}
    >
      <div
        id={containerId}
        ref={containerRef}
        className="w-full flex-1"
        style={{ height, minHeight: height }}
      />
    </div>
  );
}
