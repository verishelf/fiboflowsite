import type { Metadata } from "next";
import { getApplications } from "@/lib/data/admin-queries";
import { createPageMetadata } from "@/lib/metadata";
import { ApplicationsTable } from "@/components/admin/ApplicationsTable";

export const metadata: Metadata = createPageMetadata({
  title: "Applications",
  description: "Manage membership applications.",
  path: "/admin/applications",
});

export default async function AdminApplicationsPage() {
  const applications = await getApplications();

  return (
    <div className="mx-auto max-w-6xl space-y-10">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-white/40">Membership</p>
        <h1 className="mt-2 font-display text-3xl uppercase tracking-[0.1em] text-off-white">
          Applications
        </h1>
        <p className="mt-4 text-sm text-white/50">
          Review and manage membership applications. Approve, reject, or waitlist applicants.
        </p>
      </div>

      <ApplicationsTable initialApplications={applications} />
    </div>
  );
}
