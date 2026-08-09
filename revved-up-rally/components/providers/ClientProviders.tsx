"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

type ToastVariant = "default" | "success" | "error";

interface Toast {
  id: number;
  message: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  showToast: (message: string, variant?: ToastVariant) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ClientProviders");
  }
  return context;
}

interface ClientProvidersProps {
  children: ReactNode;
  enableToasts?: boolean;
}

export function ClientProviders({
  children,
  enableToasts = true,
}: ClientProvidersProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback(
    (message: string, variant: ToastVariant = "default") => {
      if (!enableToasts) return;

      const id = Date.now();
      setToasts((current) => [...current, { id, message, variant }]);
      window.setTimeout(() => {
        setToasts((current) => current.filter((toast) => toast.id !== id));
      }, 4000);
    },
    [enableToasts],
  );

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {enableToasts && toasts.length > 0 && (
        <div className="pointer-events-none fixed bottom-6 right-6 z-[90] flex flex-col gap-2">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={cn(
                "pointer-events-auto border px-4 py-3 text-sm uppercase tracking-[0.1em] shadow-lg backdrop-blur-md",
                toast.variant === "success" &&
                  "border-off-white/30 bg-black/90 text-off-white",
                toast.variant === "error" &&
                  "border-red-500/40 bg-black/90 text-red-300",
                toast.variant === "default" &&
                  "border-white/20 bg-black/90 text-white/80",
              )}
            >
              {toast.message}
            </div>
          ))}
        </div>
      )}
    </ToastContext.Provider>
  );
}
