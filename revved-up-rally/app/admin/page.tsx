import type { Metadata } from "next";
import { getAdminStats } from "@/lib/data/admin-queries";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Admin",
  description: "Revved Up Rally admin dashboard.",
  path: "/admin",
});

export default async function AdminPage() {
  const stats = await getAdminStats();

  return (
    <div className="mx-auto max-w-6xl space-y-10">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-white/40">Administration</p>
        <h1 className="mt-2 font-display text-3xl uppercase tracking-[0.1em] text-off-white">
          Overview
        </h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Pending Applications" value={stats.pendingApplications} />
        <StatCard label="Total Applications" value={stats.totalApplications} />
        <StatCard label="Active Members" value={stats.activeMembers} />
        <StatCard label="Total Members" value={stats.totalMembers} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Published Rallies" value={stats.publishedRallies} />
        <StatCard label="Destinations" value={stats.destinations} />
        <StatCard label="Sponsors" value={stats.sponsors} />
        <StatCard label="Partners" value={stats.partners} />
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="border border-white/10 bg-charcoal p-6">
      <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">{label}</p>
      <p className="mt-2 font-display text-3xl text-off-white">{value}</p>
    </div>
  );
}
