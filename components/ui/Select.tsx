"use client";

export type SelectOption = { value: string; label: string };

export type SelectProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly SelectOption[];
  className?: string;
  id?: string;
};

export function Select({
  label,
  value,
  onChange,
  options,
  className = "",
  id,
}: SelectProps) {
  const selectId = id ?? label.replace(/\s+/g, "-").toLowerCase();

  return (
    <label
      className={`flex flex-col gap-1.5 text-sm ${className}`}
      htmlFor={selectId}
    >
      <span className="font-medium text-zinc-300">{label}</span>
      <select
        id={selectId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input-focus-glow w-full cursor-pointer appearance-none rounded-2xl border border-white/10 bg-zinc-950/80 px-4 py-3 pr-10 text-white shadow-inner shadow-black/40 transition-shadow"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23a1a1aa' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 1rem center",
        }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-zinc-950">
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}
