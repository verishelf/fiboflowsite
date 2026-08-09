import type { Metadata } from "next";
import Link from "next/link";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Dashboard",
  description: "Revved Up Rally member dashboard.",
  path: "/dashboard",
});

export default function DashboardLayout({ children }: LayoutProps<"/dashboard">) {
  return (
    <div className="-mt-16 flex min-h-screen bg-black">
      <aside className="hidden w-64 shrink-0 border-r border-white/10 bg-charcoal lg:block">
        <div className="sticky top-0 p-6">
          <Link
            href="/"
            className="font-display text-xs uppercase tracking-[0.25em] text-off-white"
          >
            Revved Up
          </Link>
          <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-white/40">
            Member Dashboard
          </p>
          <div className="mt-8">
            <DashboardNav />
          </div>
        </div>
      </aside>
      <div className="flex-1">
        <div className="border-b border-white/10 p-4 lg:hidden">
          <DashboardNav />
        </div>
        <div className="p-6 md:p-10">{children}</div>
      </div>
    </div>
  );
}
