import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const STORAGE_KEY = "fiboflow-settings-v1";

export type ToastMessage = {
  id: string;
  type: "success" | "error" | "info";
  message: string;
};

/** Which environment the saved apiKey/apiSecret belong to (so live mode never sends paper keys). */
export type CredentialsTarget = "paper" | "live";

type CredentialsSlice = {
  apiKey: string;
  apiSecret: string;
  isPaperTrading: boolean;
  isBotEnabled: boolean;
  /** When true, UI should show masked placeholders until user edits */
  credentialsSaved: boolean;
  /** Set when saving in Settings; missing in older persisted data → infer from key prefix */
  credentialsTarget: CredentialsTarget | null;
};

export type BotStrategy = "fibonacci" | "momentum" | "scalping";

type BotRiskSlice = {
  botStrategy: BotStrategy;
  stopLossPercent: number;
  tradeSizePercent: number;
};

type DrawdownSlice = {
  killSwitchDrawdownPercent: number;
  peakEquity: number;
  killSwitchTriggered: boolean;
};

type ToastSlice = {
  toasts: ToastMessage[];
};

type Store = CredentialsSlice &
  BotRiskSlice &
  DrawdownSlice &
  ToastSlice & {
    setApiCredentials: (key: string, secret: string, isPaper: boolean) => void;
    /** Paper vs live without changing stored keys (use with env or matching saved pair). */
    setIsPaperTrading: (isPaper: boolean) => void;
    toggleTradingMode: () => void;
    toggleBot: () => void;
    setBotEnabled: (enabled: boolean) => void;
    setBotStrategy: (strategy: BotStrategy) => void;
    setStopLossPercent: (value: number) => void;
    setTradeSizePercent: (value: number) => void;
    setKillSwitchDrawdownPercent: (value: number) => void;
    updatePeakEquity: (equity: number) => void;
    triggerKillSwitch: (reason: string) => void;
    resetKillSwitch: () => void;
    pushToast: (toast: Omit<ToastMessage, "id">) => void;
    dismissToast: (id: string) => void;
  };

const nanoid = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `toast-${Date.now()}-${Math.random().toString(16).slice(2)}`;

/** Avoid touching `localStorage` during SSR / server analysis (ReferenceError in Node). */
const persistStorage = createJSONStorage(() => {
  if (typeof window === "undefined") {
    return {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
    } as unknown as Storage;
  }
  return localStorage;
});

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      apiKey: "",
      apiSecret: "",
      isPaperTrading: true,
      isBotEnabled: false,
      credentialsSaved: false,
      credentialsTarget: null,

      botStrategy: "fibonacci",
      stopLossPercent: 2,
      tradeSizePercent: 5,

      killSwitchDrawdownPercent: 15,
      peakEquity: 0,
      killSwitchTriggered: false,

      toasts: [],

      setApiCredentials: (key, secret, isPaper) =>
        set({
          apiKey: key.trim(),
          apiSecret: secret.trim(),
          isPaperTrading: isPaper,
          credentialsSaved: Boolean(key.trim() && secret.trim()),
          credentialsTarget: isPaper ? "paper" : "live",
        }),

      setIsPaperTrading: (isPaper) => set({ isPaperTrading: isPaper }),

      toggleTradingMode: () =>
        set((s) => ({ isPaperTrading: !s.isPaperTrading })),

      toggleBot: () => set((s) => ({ isBotEnabled: !s.isBotEnabled })),

      setBotEnabled: (enabled) => set({ isBotEnabled: enabled }),

      setBotStrategy: (strategy) => set({ botStrategy: strategy }),
      setStopLossPercent: (value) =>
        set({ stopLossPercent: Math.min(100, Math.max(0, value)) }),
      setTradeSizePercent: (value) =>
        set({ tradeSizePercent: Math.min(100, Math.max(0, value)) }),

      setKillSwitchDrawdownPercent: (value) =>
        set({
          killSwitchDrawdownPercent: Math.min(100, Math.max(1, value)),
        }),

      updatePeakEquity: (equity) =>
        set((s) => {
          const peak = Math.max(s.peakEquity || 0, equity);
          const drawdownPct =
            peak > 0 ? ((peak - equity) / peak) * 100 : 0;
          const threshold = s.killSwitchDrawdownPercent;
          if (
            !s.killSwitchTriggered &&
            peak > 0 &&
            drawdownPct >= threshold
          ) {
            queueMicrotask(() => {
              get().pushToast({
                type: "error",
                message: `Kill switch: drawdown ${drawdownPct.toFixed(1)}% reached ${threshold}%. Automation disabled.`,
              });
            });
            return {
              peakEquity: peak,
              isBotEnabled: false,
              killSwitchTriggered: true,
            };
          }
          return { peakEquity: peak };
        }),

      triggerKillSwitch: (reason) => {
        set({ isBotEnabled: false, killSwitchTriggered: true });
        get().pushToast({
          type: "error",
          message: `Kill switch: ${reason}`,
        });
      },

      resetKillSwitch: () =>
        set({ killSwitchTriggered: false, peakEquity: 0 }),

      pushToast: (toast) =>
        set((s) => ({
          toasts: [
            ...s.toasts,
            { ...toast, id: nanoid() },
          ].slice(-5),
        })),

      dismissToast: (id) =>
        set((s) => ({
          toasts: s.toasts.filter((t) => t.id !== id),
        })),
    }),
    {
      name: STORAGE_KEY,
      storage: persistStorage,
      partialize: (state) => ({
        apiKey: state.apiKey,
        apiSecret: state.apiSecret,
        isPaperTrading: state.isPaperTrading,
        isBotEnabled: state.isBotEnabled,
        credentialsSaved: state.credentialsSaved,
        credentialsTarget: state.credentialsTarget,
        botStrategy: state.botStrategy,
        stopLossPercent: state.stopLossPercent,
        tradeSizePercent: state.tradeSizePercent,
        killSwitchDrawdownPercent: state.killSwitchDrawdownPercent,
        peakEquity: state.peakEquity,
        killSwitchTriggered: state.killSwitchTriggered,
      }),
    }
  )
);

export function maskSecret(value: string): string {
  if (!value) return "";
  const tail = value.slice(-4);
  return `****${tail}`;
}

/** Alpaca paper keys typically start with PK…, live with AK… */
function inferCredentialsTargetFromKey(key: string): CredentialsTarget | null {
  const k = key.trim().toUpperCase();
  if (k.startsWith("PK")) return "paper";
  if (k.startsWith("AK")) return "live";
  return null;
}

function resolvedCredentialsTarget(state: {
  credentialsTarget: CredentialsTarget | null;
  apiKey: string;
}): CredentialsTarget | null {
  if (state.credentialsTarget) return state.credentialsTarget;
  return inferCredentialsTargetFromKey(state.apiKey);
}

/** Use saved keys only when they match the active trading mode; otherwise env per mode. */
function storedCredentialsMatchMode(state: ReturnType<typeof useStore.getState>): boolean {
  if (!state.credentialsSaved || !state.apiKey || !state.apiSecret) return false;
  const target = resolvedCredentialsTarget(state);
  if (!target) return false;
  return (
    (target === "paper" && state.isPaperTrading) ||
    (target === "live" && !state.isPaperTrading)
  );
}

function envCredentialsForMode(isPaper: boolean): { key: string; secret: string } {
  if (isPaper) {
    return {
      key:
        process.env.NEXT_PUBLIC_ALPACA_PAPER_API_KEY ??
        process.env.NEXT_PUBLIC_ALPACA_API_KEY ??
        "",
      secret:
        process.env.NEXT_PUBLIC_ALPACA_PAPER_API_SECRET ??
        process.env.NEXT_PUBLIC_ALPACA_API_SECRET ??
        "",
    };
  }
  return {
    key:
      process.env.NEXT_PUBLIC_ALPACA_LIVE_API_KEY ??
      process.env.NEXT_PUBLIC_ALPACA_API_KEY ??
      "",
    secret:
      process.env.NEXT_PUBLIC_ALPACA_LIVE_API_SECRET ??
      process.env.NEXT_PUBLIC_ALPACA_API_SECRET ??
      "",
  };
}

/** True when `.env.local` defines both key + secret for this mode. */
export function hasEnvCredentialsForMode(isPaper: boolean): boolean {
  const { key, secret } = envCredentialsForMode(isPaper);
  return Boolean(key && secret);
}

/** True when locally saved keys are intended for the given mode (PK/AK + target). */
export function credentialsInStoreApplyToMode(isPaper: boolean): boolean {
  const state = useStore.getState();
  if (!state.credentialsSaved || !state.apiKey || !state.apiSecret) return false;
  const target = resolvedCredentialsTarget(state);
  if (!target) return false;
  return (
    (target === "paper" && isPaper) || (target === "live" && !isPaper)
  );
}

/** Keys from Zustand when they match the current mode; else env (paper vs live pairs). */
export function getEffectiveApiKey(): string {
  const state = useStore.getState();
  if (storedCredentialsMatchMode(state)) return state.apiKey;
  return envCredentialsForMode(state.isPaperTrading).key;
}

export function getEffectiveApiSecret(): string {
  const state = useStore.getState();
  if (storedCredentialsMatchMode(state)) return state.apiSecret;
  return envCredentialsForMode(state.isPaperTrading).secret;
}

/** True if any env-based Alpaca key is defined (for UI hints). */
export function hasConfiguredAlpacaEnv(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_ALPACA_API_KEY ||
      process.env.NEXT_PUBLIC_ALPACA_PAPER_API_KEY ||
      process.env.NEXT_PUBLIC_ALPACA_LIVE_API_KEY
  );
}
