"use client";

import type { Application, ApplicationStatus } from "@/types/database";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ApplicationActionsProps {
  application: Application;
  onStatusChange?: (id: string, status: ApplicationStatus) => void;
}

export function ApplicationActions({ application, onStatusChange }: ApplicationActionsProps) {
  const statuses: ApplicationStatus[] = ["approved", "rejected", "waitlisted"];

  return (
    <div className="flex flex-wrap gap-2">
      {statuses.map((status) => (
        <Button
          key={status}
          size="sm"
          variant={application.status === status ? "default" : "secondary"}
          className={cn(
            status === "rejected" && application.status !== status && "hover:border-red-500/30",
          )}
          onClick={() => onStatusChange?.(application.id, status)}
          disabled={application.status === status}
        >
          {status}
        </Button>
      ))}
    </div>
  );
}
