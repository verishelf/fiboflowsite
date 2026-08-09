"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FOOTER_LINKS } from "@/lib/data/seed-data";
import { NewsletterForm } from "@/components/forms/NewsletterForm";

export function SiteFooter() {
  const pathname = usePathname();
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) return null;
  return (
    <footer className="border-t border-white/10 bg-black">
      <div className="section-padding mx-auto max-w-7xl">
        <div className="grid gap-16 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <p className="font-display text-2xl uppercase tracking-[0.2em] text-off-white">
              Revved Up Rally
            </p>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/50">
              An exclusive automotive rally experience for enthusiasts who demand
              more — curated routes, luxury destinations, and an exceptional community.
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-white/40">Navigate</p>
            <ul className="mt-6 space-y-3">
              {FOOTER_LINKS.slice(0, 8).map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 transition-colors hover:text-off-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-white/40">Newsletter</p>
            <p className="mt-6 text-sm text-white/50">
              Rally announcements and member updates.
            </p>
            <div className="mt-4">
              <NewsletterForm />
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-8 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} Revved Up Rally. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-6">
            {FOOTER_LINKS.slice(8).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-white/40 transition-colors hover:text-white/70"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
