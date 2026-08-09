"use client";

import { useState } from "react";
import type { Application, ApplicationStatus } from "@/types/database";
import { ApplicationActions } from "@/components/admin/ApplicationActions";
import { cn } from "@/lib/utils";

interface ApplicationsTableProps {
  initialApplications: Application[];
}

const STATUS_STYLES: Record<ApplicationStatus, string> = {
  pending: "text-amber-400 border-amber-500/30",
  approved: "text-emerald-400 border-emerald-500/30",
  rejected: "text-red-400 border-red-500/30",
  waitlisted: "text-blue-400 border-blue-500/30",
};

export function ApplicationsTable({ initialApplications }: ApplicationsTableProps) {
  const [applications, setApplications] = useState(initialApplications);

  function handleStatusChange(id: string, status: ApplicationStatus) {
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status, reviewed_at: new Date().toISOString() } : app)),
    );
  }

  return (
    <div className="overflow-x-auto border border-white/10">
      <table className="w-full min-w-[900px] text-left text-sm">
        <thead>
          <tr className="border-b border-white/10 bg-white/5">
            <th className="px-4 py-3 text-[10px] uppercase tracking-[0.15em] text-white/40">Applicant</th>
            <th className="px-4 py-3 text-[10px] uppercase tracking-[0.15em] text-white/40">Plan</th>
            <th className="px-4 py-3 text-[10px] uppercase tracking-[0.15em] text-white/40">Status</th>
            <th className="px-4 py-3 text-[10px] uppercase tracking-[0.15em] text-white/40">Submitted</th>
            <th className="px-4 py-3 text-[10px] uppercase tracking-[0.15em] text-white/40">Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr key={app.id} className="border-b border-white/5 hover:bg-white/[0.02]">
              <td className="px-4 py-4">
                <p className="text-off-white">
                  {app.first_name} {app.last_name}
                </p>
                <p className="text-xs text-white/40">{app.email}</p>
              </td>
              <td className="px-4 py-4 uppercase text-white/60">{app.membership_plan_id}</td>
              <td className="px-4 py-4">
                <span
                  className={cn(
                    "inline-block border px-2 py-0.5 text-[10px] uppercase tracking-[0.1em]",
                    STATUS_STYLES[app.status],
                  )}
                >
                  {app.status}
                </span>
              </td>
              <td className="px-4 py-4 text-white/50">
                {new Date(app.created_at).toLocaleDateString()}
              </td>
              <td className="px-4 py-4">
                <ApplicationActions application={app} onStatusChange={handleStatusChange} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
