import { cn } from "@/lib/utils";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
  children?: React.ReactNode;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  className,
  children,
}: PageHeaderProps) {
  return (
    <section className={cn("section-padding border-b border-white/10", className)}>
      <div className="mx-auto max-w-7xl">
        {eyebrow && (
          <p className="text-xs uppercase tracking-[0.35em] text-white/40">{eyebrow}</p>
        )}
        <h1 className="editorial-headline mt-4 text-off-white">{title}</h1>
        {description && (
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/60 md:text-lg">
            {description}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}
