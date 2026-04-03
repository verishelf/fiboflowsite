"use client";

import { motion } from "framer-motion";
import type { HTMLAttributes, ReactNode } from "react";

type NativeDivProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  | "onAnimationStart"
  | "onAnimationEnd"
  | "onDragStart"
  | "onDrag"
  | "onDragEnd"
>;

export type CardProps = NativeDivProps & {
  children: ReactNode;
  /** Extra highlight border for emphasis */
  highlight?: boolean;
};

export function Card({
  children,
  className = "",
  highlight,
  ...props
}: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={`glass-card rounded-2xl p-5 ${highlight ? "ring-1 ring-blue-500/30" : ""} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}
