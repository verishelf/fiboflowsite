"use server";

import { z } from "zod";
import { getCurrentUser, getMemberForUser } from "@/lib/auth";
import { sendEmail } from "@/lib/email";
import { rallyRegistrationConfirmedTemplate } from "@/lib/email/templates";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import { devSuccess, type ActionResult } from "@/types/actions";

const rallyRegistrationSchema = z.object({
  rallyId: z.string().uuid("Valid rally ID is required"),
  vehicleId: z.string().uuid().optional(),
});

export type RallyRegistrationInput = z.infer<typeof rallyRegistrationSchema>;

export async function registerForRally(
  input: RallyRegistrationInput,
): Promise<ActionResult<{ registrationId: string }>> {
  const parsed = rallyRegistrationSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.errors[0]?.message ?? "Invalid registration data",
    };
  }

  const { rallyId, vehicleId } = parsed.data;

  if (!isSupabaseConfigured()) {
    console.log("[dev] registerForRally:", { rallyId, vehicleId });
    return devSuccess("registerForRally", { rallyId, vehicleId }, {
      registrationId: "dev-registration-id",
    });
  }

  const user = await getCurrentUser();
  if (!user) {
    return { success: false, error: "You must be logged in to register" };
  }

  const member = await getMemberForUser(user.id);
  if (!member || member.status !== "active") {
    return { success: false, error: "Active membership required to register for rallies" };
  }

  const supabase = await createClient();

  const { data: rally } = await supabase
    .from("rallies")
    .select("id, name, published")
    .eq("id", rallyId)
    .maybeSingle();

  if (!rally?.published) {
    return { success: false, error: "Rally not found or not available" };
  }

  if (vehicleId) {
    const { data: vehicle } = await supabase
      .from("vehicles")
      .select("id")
      .eq("id", vehicleId)
      .eq("member_id", member.id)
      .maybeSingle();

    if (!vehicle) {
      return { success: false, error: "Selected vehicle not found" };
    }
  }

  const { data: registration, error } = await supabase
    .from("rally_registrations")
    .insert({
      rally_id: rallyId,
      member_id: member.id,
      vehicle_id: vehicleId ?? null,
      status: "confirmed",
    })
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505") {
      return { success: false, error: "You are already registered for this rally" };
    }
    return { success: false, error: error.message };
  }

  const profile = member.profile as { first_name?: string; email?: string };
  const email = profile.email ?? user.email;
  const name = profile.first_name ?? "Member";

  if (email) {
    await sendEmail({
      to: email,
      subject: "Rally Registration Confirmed — Revved Up Rally",
      html: rallyRegistrationConfirmedTemplate({
        name,
        rallyName: rally.name,
      }),
    });
  }

  return {
    success: true,
    data: { registrationId: registration.id },
  };
}
