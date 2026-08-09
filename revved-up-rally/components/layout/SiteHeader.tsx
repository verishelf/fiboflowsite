"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/lib/data/seed-data";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isDashboard = pathname.startsWith("/dashboard");
  const isAdmin = pathname.startsWith("/admin");

  if (isDashboard || isAdmin) return null;

  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 md:px-12">
        <Link
          href="/"
          className="font-display text-sm uppercase tracking-[0.35em] text-off-white transition-opacity hover:opacity-70"
        >
          Revved Up
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-[10px] uppercase tracking-[0.25em] transition-colors hover:text-off-white",
                pathname === link.href || pathname.startsWith(link.href.replace("/#", "/"))
                  ? "text-off-white"
                  : "text-white/50",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard">Dashboard</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/apply">Apply</Link>
          </Button>
        </div>

        <button
          type="button"
          className="text-off-white lg:hidden"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-black lg:hidden">
          <nav className="flex flex-col px-6 py-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="border-b border-white/5 py-4 text-xs uppercase tracking-[0.25em] text-white/70"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-6 flex flex-col gap-3">
              <Button variant="secondary" asChild>
                <Link href="/dashboard" onClick={() => setOpen(false)}>
                  Dashboard
                </Link>
              </Button>
              <Button asChild>
                <Link href="/apply" onClick={() => setOpen(false)}>
                  Apply
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
