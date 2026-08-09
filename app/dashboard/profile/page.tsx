import type { Metadata } from "next";
import { getDashboardMember } from "@/lib/data/admin-queries";
import { createPageMetadata } from "@/lib/metadata";
import { ProfileForm } from "@/components/dashboard/ProfileForm";

export const metadata: Metadata = createPageMetadata({
  title: "Profile",
  description: "Edit your Revved Up Rally member profile.",
  path: "/dashboard/profile",
});

export default async function ProfilePage() {
  const member = await getDashboardMember();

  return (
    <div className="mx-auto max-w-3xl space-y-10">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-white/40">Account</p>
        <h1 className="mt-2 font-display text-3xl uppercase tracking-[0.1em] text-off-white">
          Profile
        </h1>
        <p className="mt-4 text-sm text-white/50">
          Keep your contact information up to date for rally communications.
        </p>
      </div>

      <div className="border border-white/10 bg-charcoal p-6 md:p-8">
        <ProfileForm member={member} />
      </div>
    </div>
  );
}
