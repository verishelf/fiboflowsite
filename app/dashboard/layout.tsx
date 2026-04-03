import type { ReactNode } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { MobileNav } from "@/components/layout/MobileNav";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-zinc-900 pb-24 md:pb-8">
      <Sidebar />
      <MobileNav />
      <main className="relative z-[1] md:ml-[15.5rem] lg:ml-[16.5rem]">
        <div className="mx-auto max-w-[min(90rem,calc(100vw-1.25rem))] px-4 pt-4 md:px-6 md:pt-6">
          <Navbar />
          {children}
        </div>
      </main>
    </div>
  );
}
