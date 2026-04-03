"use client";

import type { ReactNode } from "react";
import { Toaster } from "@/components/ui/Toaster";

export function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <Toaster />
    </>
  );
}
