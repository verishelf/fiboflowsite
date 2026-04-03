"use client";

import { motion } from "framer-motion";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";

type NativeButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  | "onAnimationStart"
  | "onAnimationEnd"
  | "onDragStart"
  | "onDrag"
  | "onDragEnd"
>;

const variants: Record<Variant, string> = {
  primary:
    "bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-900/40",
  secondary:
    "bg-zinc-800 text-zinc-100 border border-white/10 hover:bg-zinc-700",
  ghost: "text-zinc-300 hover:bg-white/5 border border-transparent",
  danger:
    "bg-red-600/90 text-white hover:bg-red-500 border border-red-500/30",
};

export type ButtonProps = NativeButtonProps & {
  children: ReactNode;
  variant?: Variant;
  isLoading?: boolean;
};

export function Button({
  children,
  className = "",
  variant = "primary",
  isLoading,
  disabled,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="inline-flex h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
      ) : null}
      {children}
    </motion.button>
  );
}
