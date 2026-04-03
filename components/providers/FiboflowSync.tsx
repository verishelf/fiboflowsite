"use client";

import { useEffect, useRef } from "react";
import { fiboflowApiEnabled, getFiboflowSettings } from "@/lib/fiboflow-api";
import { useStore } from "@/store/useStore";

/** After Zustand rehydrate, pull paper/live + auto_trade from Fiboflow API (matches desktop server). */
export function FiboflowSync() {
  const done = useRef(false);

  useEffect(() => {
    if (!fiboflowApiEnabled()) return;

    const syncFromServer = () => {
      if (done.current) return;
      done.current = true;
      void getFiboflowSettings()
        .then((s) => {
          if (s.paper_or_live === "paper" || s.paper_or_live === "live") {
            useStore.getState().setIsPaperTrading(s.paper_or_live === "paper");
          }
          useStore.getState().setBotEnabled(Boolean(s.auto_trade));
        })
        .catch(() => {
          done.current = false;
        });
    };

    const unsub = useStore.persist.onFinishHydration(syncFromServer);
    if (useStore.persist.hasHydrated()) {
      syncFromServer();
    }
    return unsub;
  }, []);

  return null;
}
