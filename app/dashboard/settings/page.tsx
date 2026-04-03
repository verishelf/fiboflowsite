"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  useStore,
  maskSecret,
  hasEnvCredentialsForMode,
  credentialsInStoreApplyToMode,
} from "@/store/useStore";
import {
  fiboflowApiEnabled,
  formatFiboflowError,
} from "@/lib/trading";
import {
  getFiboflowBaseUrl,
  postFiboflowLiveToggle,
} from "@/lib/fiboflow-api";

export default function SettingsPage() {
  const apiKey = useStore((s) => s.apiKey);
  const apiSecret = useStore((s) => s.apiSecret);
  const isPaperTrading = useStore((s) => s.isPaperTrading);
  const credentialsSaved = useStore((s) => s.credentialsSaved);
  const setApiCredentials = useStore((s) => s.setApiCredentials);
  const setIsPaperTrading = useStore((s) => s.setIsPaperTrading);
  const pushToast = useStore((s) => s.pushToast);

  const [editing, setEditing] = useState(!credentialsSaved);
  const [keyInput, setKeyInput] = useState("");
  const [secretInput, setSecretInput] = useState("");
  const [mode, setMode] = useState(isPaperTrading);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setMode(isPaperTrading);
  }, [isPaperTrading]);

  useEffect(() => {
    if (!credentialsSaved) setEditing(true);
  }, [credentialsSaved]);

  const showMasked = credentialsSaved && !editing;
  const envOkForMode = hasEnvCredentialsForMode(mode);
  const storeOkForMode = credentialsInStoreApplyToMode(mode);

  const save = async () => {
    const k = keyInput.trim();
    const s = secretInput.trim();

    if ((k && !s) || (!k && s)) {
      pushToast({
        type: "error",
        message:
          "Enter both key and secret, or leave both empty to use .env.local / Fiboflow API.",
      });
      return;
    }

    setSaving(true);
    try {
      if (k && s) {
        setApiCredentials(k, s, mode);
        setKeyInput("");
        setSecretInput("");
        setEditing(false);
        if (fiboflowApiEnabled()) {
          try {
            await postFiboflowLiveToggle(!mode);
          } catch (e) {
            pushToast({
              type: "error",
              message: formatFiboflowError(e),
            });
            return;
          }
        }
        pushToast({
          type: "success",
          message: fiboflowApiEnabled()
            ? "Keys saved locally; Fiboflow server mode synced."
            : "Alpaca credentials saved locally (masked in UI).",
        });
        return;
      }

      if (fiboflowApiEnabled()) {
        await postFiboflowLiveToggle(!mode);
        setIsPaperTrading(mode);
        pushToast({
          type: "success",
          message: `Fiboflow server: ${mode ? "paper" : "live"} mode (${getFiboflowBaseUrl()}).`,
        });
        return;
      }

      if (storeOkForMode || envOkForMode) {
        setIsPaperTrading(mode);
        pushToast({
          type: "success",
          message: storeOkForMode
            ? "Trading mode updated."
            : `Using ${mode ? "paper" : "live"} API keys from .env.local.`,
        });
        return;
      }

      pushToast({
        type: "error",
        message:
          "No keys for this mode. Add NEXT_PUBLIC_ALPACA_LIVE_* to .env.local, set NEXT_PUBLIC_FIBOFLOW_API_URL to your Fiboflow API, or paste keys above.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
          API settings
        </h1>
        <p className="text-sm text-zinc-500">
          {fiboflowApiEnabled() ? (
            <>
              <strong className="text-zinc-300">Fiboflow API mode:</strong> orders and
              balances use the same FastAPI server as the Desktop/Apps fiboflow app (
              <code className="text-zinc-400">{getFiboflowBaseUrl()}</code>
              ). Alpaca keys live in <code className="text-zinc-400">server/.env</code>{" "}
              there. Optional browser keys below are only for direct Alpaca calls /
              quotes when needed.
            </>
          ) : (
            <>
              Keys stay in your browser (localStorage + Zustand). Set{" "}
              <code className="text-zinc-400">NEXT_PUBLIC_FIBOFLOW_API_URL</code> to
              use the desktop Fiboflow trading server instead. You can also set{" "}
              <code className="text-zinc-400">NEXT_PUBLIC_ALPACA_PAPER_*</code> and{" "}
              <code className="text-zinc-400">NEXT_PUBLIC_ALPACA_LIVE_*</code> in{" "}
              <code className="text-zinc-400">.env.local</code>.
            </>
          )}
        </p>
      </motion.div>

      {!fiboflowApiEnabled() && envOkForMode ? (
        <p className="rounded-2xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100/95">
          <span className="font-medium text-emerald-200">
            {mode ? "Paper" : "Live"} keys found in environment.
          </span>{" "}
          Leave the fields empty and tap <strong>Save</strong> to use{" "}
          {mode ? "paper" : "live"} mode with <code className="text-emerald-200/90">.env.local</code>.
        </p>
      ) : null}

      {fiboflowApiEnabled() ? (
        <p className="rounded-2xl border border-blue-500/25 bg-blue-500/10 px-4 py-3 text-sm text-blue-100/95">
          Paper/Live <strong>Save</strong> calls the Fiboflow server (
          <code className="text-blue-200/90">POST /live-toggle</code>
          ). Start the API from Desktop/Apps/fiboflow (e.g.{" "}
          <code className="text-blue-200/90">uvicorn</code> on port 8000).
        </p>
      ) : null}

      <Card className="space-y-5">
        {credentialsSaved ? (
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/10 bg-zinc-900/40 px-3 py-2 text-xs text-zinc-400">
            <span>
              {showMasked
                ? "Stored credentials are masked below."
                : "Replacing keys — enter new secrets end-to-end."}
            </span>
            {showMasked ? (
              <Button
                variant="ghost"
                className="!px-3 !py-1 text-xs"
                type="button"
                onClick={() => {
                  setEditing(true);
                  setKeyInput("");
                  setSecretInput("");
                }}
              >
                Edit keys
              </Button>
            ) : (
              <Button
                variant="ghost"
                className="!px-3 !py-1 text-xs"
                type="button"
                onClick={() => {
                  setEditing(false);
                  setKeyInput("");
                  setSecretInput("");
                }}
              >
                Cancel edit
              </Button>
            )}
          </div>
        ) : null}

        <Input
          label={
            fiboflowApiEnabled()
              ? "Browser API key (optional — for quotes / direct Alpaca)"
              : "API Key (optional if using .env.local)"
          }
          type={showMasked ? "text" : "password"}
          value={showMasked ? maskSecret(apiKey) : keyInput}
          onChange={(v) => {
            if (showMasked) return;
            setKeyInput(v);
          }}
          placeholder={showMasked ? "" : "Leave empty if using Fiboflow API only"}
          readOnly={showMasked}
          autoComplete="off"
        />

        <Input
          label={
            fiboflowApiEnabled()
              ? "Browser API secret (optional)"
              : "API Secret (optional if using .env.local)"
          }
          type={showMasked ? "text" : "password"}
          value={showMasked ? maskSecret(apiSecret) : secretInput}
          onChange={(v) => {
            if (showMasked) return;
            setSecretInput(v);
          }}
          placeholder={showMasked ? "" : "Leave empty if using Fiboflow API only"}
          readOnly={showMasked}
          autoComplete="off"
        />

        <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-zinc-950/60 px-4 py-3">
          <div>
            <p className="text-sm font-medium text-white">Paper trading</p>
            <p className="text-xs text-zinc-500">
              {mode
                ? "Paper endpoints (safe sandbox)"
                : "Live — server must have live keys in server/.env"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setMode((m) => !m)}
            className={`relative h-9 w-16 rounded-full transition ${
              mode ? "bg-amber-500/80" : "bg-emerald-500/80"
            }`}
            aria-pressed={mode}
          >
            <motion.span
              layout
              className="absolute top-1 left-1 h-7 w-7 rounded-full bg-white shadow"
              animate={{ x: mode ? 0 : 28 }}
              transition={{ type: "spring", stiffness: 500, damping: 35 }}
            />
          </button>
        </div>
        <p className="text-[11px] text-zinc-500">
          Toggle <strong>off</strong> for live. Paper:{" "}
          <code className="text-zinc-400">paper-api.alpaca.markets</code> · Live:{" "}
          <code className="text-zinc-400">api.alpaca.markets</code>
        </p>

        <Button
          className="w-full sm:w-auto"
          type="button"
          onClick={() => void save()}
          isLoading={saving}
        >
          Save
        </Button>
      </Card>
    </div>
  );
}
