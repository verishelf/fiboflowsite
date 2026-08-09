"use server";

import { createClient } from "@/lib/supabase/server";
import { getMemberForUser, requireAuth } from "@/lib/auth";
import { sendEmail } from "@/lib/email";
import { rallyRegistrationConfirmedTemplate } from "@/lib/email/templates";
import type { ActionResult } from "@/types/actions";

export async function registerForRally(
  rallyId: string,
  vehicleId?: string,
): Promise<ActionResult> {
  try {
    const user = await requireAuth();
    const member = await getMemberForUser(user.id);
    if (!member || member.status !== "active") {
      return { success: false, error: "Active membership required" };
    }

    const supabase = await createClient();
    const { error } = await supabase.from("rally_registrations").insert({
      rally_id: rallyId,
      member_id: member.id,
      vehicle_id: vehicleId || null,
      status: "pending",
    });

    if (error) {
      if (error.code === "23505") {
        return { success: false, error: "Already registered for this rally" };
      }
      return { success: false, error: error.message };
    }

    const profile = member.profile as { first_name?: string; email?: string };
    const { data: rally } = await supabase
      .from("rallies")
      .select("name")
      .eq("id", rallyId)
      .single();

    if (profile.email && rally) {
      await sendEmail({
        to: profile.email,
        subject: "Rally Registration Confirmed",
        html: rallyRegistrationConfirmedTemplate({
          name: profile.first_name ?? "Member",
          rallyName: rally.name,
        }),
      });
    }

    return { success: true };
  } catch {
    return { success: false, error: "Unauthorized" };
  }
}
