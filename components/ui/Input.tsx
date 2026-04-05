"use client";

import { useId } from "react";
import type { InputHTMLAttributes } from "react";

export type InputProps = {
  label: string;
  type?: "text" | "password";
  value: string;
  onChange: (value: string) => void;
} & Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "value" | "onChange"
>;

export function Input({
  label,
  type = "text",
  value,
  onChange,
  className = "",
  id,
  ...rest
}: InputProps) {
  const autoId = useId();
  const inputId =
    id ??
    (label.trim()
      ? label.replace(/\s+/g, "-").toLowerCase()
      : `input-${autoId.replace(/:/g, "")}`);

  return (
    <label className={`flex flex-col gap-1.5 text-sm ${className}`} htmlFor={inputId}>
      {label.trim() ? (
        <span className="font-medium text-zinc-300">{label}</span>
      ) : null}
      <input
        id={inputId}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input-focus-glow w-full rounded-2xl border border-white/10 bg-zinc-950/80 px-4 py-3 text-white placeholder:text-zinc-600 shadow-inner shadow-black/40 transition-shadow"
        {...rest}
      />
    </label>
  );
}
