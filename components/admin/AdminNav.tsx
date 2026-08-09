"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, Camera, Car, FileText, Handshake, LayoutDashboard, MapPin, Trophy, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const ADMIN_NAV = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/applications", label: "Applications", icon: FileText },
  { href: "/admin/members", label: "Members", icon: Users },
  { href: "/admin/rallies", label: "Rallies", icon: Car },
  { href: "/admin/destinations", label: "Destinations", icon: MapPin },
  { href: "/admin/sponsors", label: "Sponsors", icon: Trophy },
  { href: "/admin/partners", label: "Partners", icon: Handshake },
  { href: "/admin/gallery", label: "Gallery", icon: Camera },
] as const;

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="space-y-1">
      <div className="mb-6 px-4">
        <Link
          href="/"
          className="text-[10px] uppercase tracking-[0.3em] text-white/40 hover:text-white/70"
        >
          ← Back to Site
        </Link>
        <p className="mt-4 font-display text-sm uppercase tracking-[0.15em] text-off-white">
          Admin
        </p>
      </div>
      {ADMIN_NAV.map(({ href, label, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-[0.15em] transition-colors",
              active
                ? "border-l-2 border-off-white bg-white/5 text-off-white"
                : "border-l-2 border-transparent text-white/50 hover:text-white/80",
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
