import type { Metadata } from "next";
import {
  getDashboardMember,
  getMemberMessages,
  getMemberVehicles,
} from "@/lib/data/admin-queries";
import { getPlanById, type MembershipPlanId } from "@/lib/pricing/membership-plans";
import { createPageMetadata } from "@/lib/metadata";
import { MemberCard } from "@/components/dashboard/MemberCard";

export const metadata: Metadata = createPageMetadata({
  title: "Dashboard",
  description: "Your Revved Up Rally member dashboard.",
  path: "/dashboard",
});

export default async function DashboardPage() {
  const member = await getDashboardMember();
  const vehicles = await getMemberVehicles(member.id);
  const messages = await getMemberMessages(member.id);
  const plan = getPlanById(member.membership_plan_id as MembershipPlanId);
  const profile = member.profile as { firstName?: string; lastName?: string };
  const unreadMessages = messages.filter((m) => !m.read_at).length;

  return (
    <div className="mx-auto max-w-5xl space-y-10">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-white/40">Welcome back</p>
        <h1 className="mt-2 font-display text-3xl uppercase tracking-[0.1em] text-off-white md:text-4xl">
          {profile.firstName} {profile.lastName}
        </h1>
      </div>

      <MemberCard member={member} />

      <div className="grid gap-6 sm:grid-cols-3">
        <StatCard label="Membership" value={plan?.name ?? member.membership_plan_id} />
        <StatCard label="Vehicles" value={String(vehicles.length)} />
        <StatCard label="Unread Messages" value={String(unreadMessages)} />
      </div>

      <div className="border border-white/10 bg-charcoal p-6">
        <h2 className="text-xs uppercase tracking-[0.25em] text-white/40">Quick Info</h2>
        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-[10px] uppercase tracking-[0.15em] text-white/30">Member Since</dt>
            <dd className="mt-1 text-sm text-off-white">
              {member.joined_at
                ? new Date(member.joined_at).toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })
                : "—"}
            </dd>
          </div>
          <div>
            <dt className="text-[10px] uppercase tracking-[0.15em] text-white/30">Status</dt>
            <dd className="mt-1 text-sm capitalize text-off-white">
              {member.status.replace("_", " ")}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-white/10 bg-charcoal p-6">
      <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">{label}</p>
      <p className="mt-2 font-display text-2xl uppercase tracking-[0.08em] text-off-white">
        {value}
      </p>
    </div>
  );
}
