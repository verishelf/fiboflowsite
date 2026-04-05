"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { BrandLogo } from "@/components/brand/BrandLogo";
import {
  LayoutDashboard,
  LineChart,
  Briefcase,
  Bot,
  Settings,
} from "./NavIcons";

const items = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/trade", label: "Trade", icon: LineChart },
  { href: "/dashboard/portfolio", label: "Portfolio", icon: Briefcase },
  { href: "/dashboard/bot", label: "AI / Bot", icon: Bot },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
] as const;

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="glass-card fixed left-3 top-3 z-40 hidden h-[calc(100vh-1.5rem)] w-56 flex-col rounded-2xl p-3 md:flex lg:w-60">
      <div className="mb-6 flex items-center gap-2 px-2 pt-2">
        <BrandLogo size={36} className="h-9 w-9 shrink-0 shadow-lg shadow-blue-500/20" />
        <div>
          <p className="text-sm font-semibold tracking-tight text-white">
            FiboFlow
          </p>
          <p className="text-[11px] text-zinc-500">Pro terminal</p>
        </div>
      </div>
      <nav className="flex flex-1 flex-col gap-1">
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
              className="relative block"
            >
              {active ? (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.15 }}
                  className="absolute inset-0 rounded-xl bg-blue-600/15 ring-1 ring-blue-500/25"
                />
              ) : null}
              <span
                className={`relative z-10 flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                  active
                    ? "text-white"
                    : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
                }`}
              >
                <Icon className="h-4 w-4 opacity-90" />
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto border-t border-white/5 pt-3 text-[11px] text-zinc-500">
        Secure session · local only
      </div>
    </aside>
  );
}
