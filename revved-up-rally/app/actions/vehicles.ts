"use server";

import { getCurrentUser, getMemberForUser } from "@/lib/auth";
import { vehicleSchema, type VehicleFormData } from "@/lib/validations/schemas";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import { devSuccess, type ActionResult } from "@/types/actions";

export async function addVehicle(
  input: VehicleFormData,
): Promise<ActionResult<{ vehicleId: string }>> {
  const parsed = vehicleSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.errors[0]?.message ?? "Invalid vehicle data",
    };
  }

  if (!isSupabaseConfigured()) {
    console.log("[dev] addVehicle:", parsed.data);
    return devSuccess("addVehicle", parsed.data, { vehicleId: "dev-vehicle-id" });
  }

  const user = await getCurrentUser();
  if (!user) {
    return { success: false, error: "You must be logged in to add a vehicle" };
  }

  const member = await getMemberForUser(user.id);
  if (!member) {
    return { success: false, error: "Active membership required" };
  }

  const data = parsed.data;
  const supabase = await createClient();

  if (data.isPrimary) {
    await supabase
      .from("vehicles")
      .update({ is_primary: false })
      .eq("member_id", member.id);
  }

  const { data: vehicle, error } = await supabase
    .from("vehicles")
    .insert({
      member_id: member.id,
      year: data.year,
      make: data.make,
      model: data.model,
      trim: data.trim ?? null,
      color: data.color ?? null,
      horsepower: data.horsepower ?? null,
      engine: data.engine ?? null,
      photo_url: data.photoUrl || null,
      is_primary: data.isPrimary ?? false,
    })
    .select("id")
    .single();

  if (error || !vehicle) {
    return {
      success: false,
      error: error?.message ?? "Failed to add vehicle",
    };
  }

  return { success: true, data: { vehicleId: vehicle.id } };
}

export async function deleteVehicle(vehicleId: string): Promise<ActionResult> {
  if (!vehicleId) {
    return { success: false, error: "Vehicle ID is required" };
  }

  if (!isSupabaseConfigured()) {
    console.log("[dev] deleteVehicle:", { vehicleId });
    return devSuccess("deleteVehicle", { vehicleId });
  }

  const user = await getCurrentUser();
  if (!user) {
    return { success: false, error: "You must be logged in" };
  }

  const member = await getMemberForUser(user.id);
  if (!member) {
    return { success: false, error: "Active membership required" };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("vehicles")
    .delete()
    .eq("id", vehicleId)
    .eq("member_id", member.id);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}
