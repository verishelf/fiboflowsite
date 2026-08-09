import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  subtitle,
  align = "left",
  className,
}: SectionHeadingProps) {
  const body = description ?? subtitle;
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && (
        <p className="mb-4 text-xs uppercase tracking-[0.35em] text-white/50">
          {eyebrow}
        </p>
      )}
      <h2 className="font-display text-3xl font-light uppercase tracking-[0.12em] text-off-white md:text-5xl lg:text-6xl">
        {title}
      </h2>
      {body && (
        <p
          className={cn(
            "mt-6 max-w-2xl text-base leading-relaxed text-white/60 md:text-lg",
            align === "center" && "mx-auto",
          )}
        >
          {body}
        </p>
      )}
    </div>
  );
}
