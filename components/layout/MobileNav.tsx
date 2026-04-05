"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  LineChart,
  Briefcase,
  Bot,
  Settings,
} from "./NavIcons";

const items = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/dashboard/trade", label: "Trade", icon: LineChart },
  { href: "/dashboard/portfolio", label: "Port.", icon: Briefcase },
  { href: "/dashboard/bot", label: "AI", icon: Bot },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
] as const;

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="glass-card fixed bottom-3 left-3 right-3 z-40 flex items-center justify-between rounded-2xl px-1 py-2 md:hidden">
      {items.map((item) => {
        const active =
          pathname === item.href ||
          (item.href !== "/dashboard" && pathname.startsWith(item.href));
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            prefetch={false}
            className={`flex flex-1 flex-col items-center gap-0.5 rounded-xl py-1 text-[10px] ${
              active ? "text-white" : "text-zinc-500"
            }`}
          >
            <Icon className="h-5 w-5" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
