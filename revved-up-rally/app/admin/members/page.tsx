import type { Metadata } from "next";
import { getMembers } from "@/lib/data/admin-queries";
import { createPageMetadata } from "@/lib/metadata";
import { cn } from "@/lib/utils";
import type { MemberStatus } from "@/types/database";

export const metadata: Metadata = createPageMetadata({
  title: "Members",
  description: "Manage Revved Up Rally members.",
  path: "/admin/members",
});

const STATUS_STYLES: Record<MemberStatus, string> = {
  active: "text-emerald-400 border-emerald-500/30",
  pending_payment: "text-amber-400 border-amber-500/30",
  expired: "text-white/40 border-white/20",
  suspended: "text-red-400 border-red-500/30",
};

export default async function AdminMembersPage() {
  const members = await getMembers();

  return (
    <div className="mx-auto max-w-6xl space-y-10">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-white/40">Membership</p>
        <h1 className="mt-2 font-display text-3xl uppercase tracking-[0.1em] text-off-white">
          Members
        </h1>
      </div>

      <div className="overflow-x-auto border border-white/10">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="px-4 py-3 text-[10px] uppercase tracking-[0.15em] text-white/40">Member</th>
              <th className="px-4 py-3 text-[10px] uppercase tracking-[0.15em] text-white/40">Number</th>
              <th className="px-4 py-3 text-[10px] uppercase tracking-[0.15em] text-white/40">Plan</th>
              <th className="px-4 py-3 text-[10px] uppercase tracking-[0.15em] text-white/40">Status</th>
              <th className="px-4 py-3 text-[10px] uppercase tracking-[0.15em] text-white/40">Joined</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => {
              const profile = member.profile as { firstName?: string; lastName?: string; email?: string };
              return (
                <tr key={member.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="px-4 py-4">
                    <p className="text-off-white">
                      {profile.firstName} {profile.lastName}
                    </p>
                    <p className="text-xs text-white/40">{profile.email}</p>
                  </td>
                  <td className="px-4 py-4 font-mono text-white/60">
                    {member.membership_number ?? "—"}
                  </td>
                  <td className="px-4 py-4 uppercase text-white/60">
                    {member.membership_plan_id}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={cn(
                        "inline-block border px-2 py-0.5 text-[10px] uppercase tracking-[0.1em]",
                        STATUS_STYLES[member.status],
                      )}
                    >
                      {member.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-white/50">
                    {member.joined_at
                      ? new Date(member.joined_at).toLocaleDateString()
                      : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
