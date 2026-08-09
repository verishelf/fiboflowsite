"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Car,
  LayoutDashboard,
  MessageSquare,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/garage", label: "Garage", icon: Car },
  { href: "/dashboard/profile", label: "Profile", icon: User },
  { href: "/dashboard/messages", label: "Messages", icon: MessageSquare },
] as const;

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="space-y-1">
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-[0.2em] transition-colors",
              active
                ? "border-l-2 border-off-white bg-white/5 text-off-white"
                : "border-l-2 border-transparent text-white/50 hover:text-white/80",
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
