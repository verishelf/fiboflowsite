"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useStore, type BotStrategy } from "@/store/useStore";
import { fiboflowApiEnabled, formatFiboflowError } from "@/lib/trading";
import {
  getFiboflowSettings,
  postFiboflowAutoTrade,
  getFiboflowTraderActivity,
  type FiboflowPublicSettings,
} from "@/lib/fiboflow-api";
import {
  enableLiveFullAiAutomation,
  haltAutomationAndPaper,
} from "@/lib/fiboflow-live-ai";

const strategies: { value: BotStrategy; label: string }[] = [
  { value: "fibonacci", label: "Fibonacci" },
  { value: "momentum", label: "Momentum" },
  { value: "scalping", label: "Scalping" },
];

export default function BotPage() {
  const isBotEnabled = useStore((s) => s.isBotEnabled);
  const toggleBot = useStore((s) => s.toggleBot);
  const setBotEnabled = useStore((s) => s.setBotEnabled);
  const setIsPaperTrading = useStore((s) => s.setIsPaperTrading);
  const botStrategy = useStore((s) => s.botStrategy);
  const setBotStrategy = useStore((s) => s.setBotStrategy);
  const stopLossPercent = useStore((s) => s.stopLossPercent);
  const tradeSizePercent = useStore((s) => s.tradeSizePercent);
  const setStopLossPercent = useStore((s) => s.setStopLossPercent);
  const setTradeSizePercent = useStore((s) => s.setTradeSizePercent);
  const killSwitchDrawdownPercent = useStore(
    (s) => s.killSwitchDrawdownPercent
  );
  const setKillSwitchDrawdownPercent = useStore(
    (s) => s.setKillSwitchDrawdownPercent
  );
  const pushToast = useStore((s) => s.pushToast);

  const [server, setServer] = useState<FiboflowPublicSettings | null>(null);
  const [loadingServer, setLoadingServer] = useState(false);
  const [busy, setBusy] = useState(false);
  const [ackLiveRisk, setAckLiveRisk] = useState(false);
  const [events, setEvents] = useState<Array<Record<string, unknown>>>([]);

  const refreshServer = useCallback(async () => {
    if (!fiboflowApiEnabled()) return;
    setLoadingServer(true);
    try {
      const [s, act] = await Promise.all([
        getFiboflowSettings(),
        getFiboflowTraderActivity().catch(() => ({ events: [] })),
      ]);
      setServer(s);
      setEvents((act.events ?? []).slice(0, 8));
    } catch (e) {
      pushToast({
        type: "error",
        message: formatFiboflowError(e),
      });
    } finally {
      setLoadingServer(false);
    }
  }, [pushToast]);

  useEffect(() => {
    void refreshServer();
    if (!fiboflowApiEnabled()) return;
    const id = setInterval(() => void refreshServer(), 20_000);
    return () => clearInterval(id);
  }, [refreshServer]);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
          Automation &amp; AI
        </h1>
        <p className="text-sm text-zinc-500">
          {fiboflowApiEnabled()
            ? "Drive the same FastAPI trading loop as the desktop app: AI scanner, strategy engine, and live Alpaca routing."
            : "Set NEXT_PUBLIC_FIBOFLOW_API_URL to enable server-side AI automation."}
        </p>
      </motion.div>

      <Card className="border border-amber-500/20 bg-amber-500/5">
        <p className="text-sm font-medium text-amber-100">
          Risk &amp; expectations
        </p>
        <p className="mt-2 text-xs leading-relaxed text-amber-200/80">
          Automated live trading can lose money, including your full balance. No
          model or scanner guarantees profit or &quot;max return.&quot; The
          controls below only change server settings — you are responsible for
          capital, taxes, and compliance. Start in paper mode until you trust
          the system.
        </p>
      </Card>

      {fiboflowApiEnabled() ? (
        <>
          <Card>
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-white">
                  Fiboflow server status
                </p>
                <p className="text-xs text-zinc-500">
                  {loadingServer ? "Refreshing…" : "Pulled from GET /settings"}
                </p>
              </div>
              <Button
                variant="secondary"
                type="button"
                onClick={() => void refreshServer()}
                isLoading={loadingServer}
              >
                Refresh
              </Button>
            </div>
            {server ? (
              <dl className="grid gap-2 text-xs text-zinc-400 sm:grid-cols-2">
                <div>
                  <dt className="text-zinc-500">Mode</dt>
                  <dd className="font-medium text-white">
                    {server.paper_or_live === "live" ? "Live" : "Paper"}
                  </dd>
                </div>
                <div>
                  <dt className="text-zinc-500">Live keys on server</dt>
                  <dd
                    className={
                      server.live_eligible
                        ? "text-emerald-400"
                        : "text-red-400"
                    }
                  >
                    {server.live_eligible ? "Configured" : "Missing"}
                  </dd>
                </div>
                <div>
                  <dt className="text-zinc-500">Auto-trade</dt>
                  <dd className="text-white">
                    {server.auto_trade ? "ON" : "OFF"}
                  </dd>
                </div>
                <div>
                  <dt className="text-zinc-500">AI learning (OpenAI)</dt>
                  <dd className="text-white">
                    {server.ai_learning?.openai_configured
                      ? server.ai_learning_enabled
                        ? "ON"
                        : "Off (toggle below)"
                      : "Not configured on server"}
                  </dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-zinc-500">Default / follow AI symbol</dt>
                  <dd className="text-white">
                    {server.auto_follow_ai_top_symbol !== false
                      ? "Following top AI scanner pick"
                      : "Fixed symbol"}{" "}
                    · {server.default_symbol ?? "—"}
                  </dd>
                </div>
              </dl>
            ) : (
              <p className="text-sm text-zinc-500">Could not load settings.</p>
            )}
          </Card>

          <Card highlight>
            <p className="text-sm font-medium text-white">
              Live + full AI stack
            </p>
            <p className="mt-1 text-xs leading-relaxed text-zinc-400">
              Enables <strong className="text-zinc-300">live</strong> via{" "}
              <code className="text-zinc-500">/live-toggle</code>, then posts{" "}
              <code className="text-zinc-500">/settings</code> with: auto-trade,
              all strategies (standard / fibonacci / hybrid / ai_scanner),
              follow top AI symbol, optional AI learning, and strategy engine in{" "}
              <strong className="text-zinc-300">AI + auto_execute</strong> with
              all modular toggles on (caps: ~10% risk/trade, 10% daily loss halt
              on the engine — see server merge rules).
            </p>
            <label className="mt-4 flex cursor-pointer items-start gap-3 text-xs text-zinc-300">
              <input
                type="checkbox"
                checked={ackLiveRisk}
                onChange={(e) => setAckLiveRisk(e.target.checked)}
                className="mt-0.5 rounded border-white/20 bg-zinc-900"
              />
              <span>
                I understand live automated trading risks substantial or total
                loss, and no feature here maximizes or guarantees profit.
              </span>
            </label>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <Button
                type="button"
                variant="danger"
                disabled={!ackLiveRisk || !server?.live_eligible}
                isLoading={busy}
                onClick={() => {
                  setBusy(true);
                  void enableLiveFullAiAutomation()
                    .then(() => {
                      setIsPaperTrading(false);
                      setBotEnabled(true);
                      setAckLiveRisk(false);
                      pushToast({
                        type: "success",
                        message:
                          "Live + AI automation armed on Fiboflow server. Monitor the desktop logs and Alpaca dashboard.",
                      });
                      return refreshServer();
                    })
                    .catch((e) => {
                      pushToast({
                        type: "error",
                        message: formatFiboflowError(e),
                      });
                    })
                    .finally(() => setBusy(false));
                }}
              >
                Enable live + AI automation
              </Button>
              <Button
                type="button"
                variant="secondary"
                isLoading={busy}
                onClick={() => {
                  setBusy(true);
                  void haltAutomationAndPaper()
                    .then(() => {
                      setIsPaperTrading(true);
                      setBotEnabled(false);
                      pushToast({
                        type: "success",
                        message:
                          "Switched to paper, auto-trade off, engine manual.",
                      });
                      return refreshServer();
                    })
                    .catch((e) => {
                      pushToast({
                        type: "error",
                        message: formatFiboflowError(e),
                      });
                    })
                    .finally(() => setBusy(false));
                }}
              >
                Emergency: paper &amp; halt
              </Button>
            </div>
          </Card>

          {events.length > 0 ? (
            <Card>
              <p className="mb-3 text-sm font-medium text-white">
                Recent loop activity
              </p>
              <ul className="space-y-2 text-xs text-zinc-400">
                {events.map((ev, i) => (
                  <li
                    key={i}
                    className="rounded-xl border border-white/5 bg-black/20 px-3 py-2"
                  >
                    <span className="text-zinc-500">
                      {String(ev.t ?? ev.note ?? "tick")}
                    </span>
                    {ev.symbol ? (
                      <span className="ml-2 text-zinc-300">
                        {String(ev.symbol)} · {String(ev.signal ?? "—")}
                      </span>
                    ) : null}
                  </li>
                ))}
              </ul>
            </Card>
          ) : null}
        </>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-white">Auto-trade toggle</p>
              <p className="text-xs text-zinc-500">
                {fiboflowApiEnabled()
                  ? "POST /auto-trade-toggle (does not switch paper/live by itself)"
                  : "Local preview only without Fiboflow API"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                const next = !isBotEnabled;
                if (fiboflowApiEnabled()) {
                  void postFiboflowAutoTrade(next)
                    .then(() => {
                      setBotEnabled(next);
                      pushToast({
                        type: "success",
                        message: next
                          ? "Auto-trade ON (Fiboflow server)"
                          : "Auto-trade OFF (Fiboflow server)",
                      });
                      return refreshServer();
                    })
                    .catch((e) => {
                      pushToast({
                        type: "error",
                        message: formatFiboflowError(e),
                      });
                    });
                } else {
                  toggleBot();
                  pushToast({
                    type: "info",
                    message: next ? "Automation ON (local)" : "OFF (local)",
                  });
                }
              }}
              className={`relative h-10 w-[4.25rem] rounded-full transition ${
                isBotEnabled ? "bg-emerald-500/80" : "bg-zinc-700"
              }`}
            >
              <motion.span
                layout
                className="absolute top-1 left-1 h-8 w-8 rounded-full bg-white shadow"
                animate={{ x: isBotEnabled ? 30 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />
            </button>
          </div>
          <p className="mt-4 text-xs text-zinc-500">
            Status:{" "}
            <span
              className={
                isBotEnabled ? "text-emerald-400" : "text-zinc-400"
              }
            >
              {isBotEnabled ? "ARMED" : "OFF"}
            </span>
          </p>
        </Card>

        <Card>
          <label className="text-sm font-medium text-zinc-300" htmlFor="strategy">
            UI strategy preset (local)
          </label>
          <select
            id="strategy"
            value={botStrategy}
            onChange={(e) =>
              setBotStrategy(e.target.value as BotStrategy)
            }
            className="input-focus-glow mt-2 w-full rounded-2xl border border-white/10 bg-zinc-950/80 px-4 py-3 text-sm text-white"
          >
            {strategies.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          <p className="mt-3 text-xs text-zinc-500">
            Server uses its own strategy matrix when Fiboflow API is on; this
            dropdown is for local notes and future wiring.
          </p>
        </Card>
      </div>

      <Card className="grid gap-6 md:grid-cols-2">
        <Input
          label="Stop loss % (local dashboard kill-switch context)"
          type="text"
          value={String(stopLossPercent)}
          onChange={(v) => setStopLossPercent(parseFloat(v) || 0)}
          inputMode="decimal"
        />
        <Input
          label="Trade size % (of equity, local)"
          type="text"
          value={String(tradeSizePercent)}
          onChange={(v) => setTradeSizePercent(parseFloat(v) || 0)}
          inputMode="decimal"
        />
      </Card>

      <Card>
        <Input
          label="Kill switch drawdown % (web dashboard)"
          type="text"
          value={String(killSwitchDrawdownPercent)}
          onChange={(v) =>
            setKillSwitchDrawdownPercent(parseFloat(v) || 1)
          }
          inputMode="decimal"
        />
        <p className="mt-2 text-xs text-zinc-500">
          Trips when peak equity on this dashboard exceeds threshold. Separate
          from server engine daily loss limits.
        </p>
      </Card>
    </div>
  );
}
