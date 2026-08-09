"use server";

import { vehicleSchema } from "@/lib/validations/schemas";
import { createClient } from "@/lib/supabase/server";
import { getMemberForUser, requireAuth } from "@/lib/auth";
import type { ActionResult } from "@/types/actions";

export async function addVehicle(data: unknown): Promise<ActionResult<{ id: string }>> {
  const parsed = vehicleSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message ?? "Invalid data" };
  }

  try {
    const user = await requireAuth();
    const member = await getMemberForUser(user.id);
    if (!member) {
      return { success: false, error: "Active membership required" };
    }

    const supabase = await createClient();
    const { data: row, error } = await supabase
      .from("vehicles")
      .insert({
        member_id: member.id,
        year: parsed.data.year,
        make: parsed.data.make,
        model: parsed.data.model,
        trim: parsed.data.trim || null,
        color: parsed.data.color || null,
        horsepower: parsed.data.horsepower || null,
        engine: parsed.data.engine || null,
        photo_url: parsed.data.photoUrl || null,
        is_primary: parsed.data.isPrimary ?? false,
      })
      .select("id")
      .single();

    if (error) return { success: false, error: error.message };
    return { success: true, data: { id: row.id } };
  } catch {
    return { success: false, error: "Unauthorized" };
  }
}

export async function deleteVehicle(id: string): Promise<ActionResult> {
  try {
    const user = await requireAuth();
    const member = await getMemberForUser(user.id);
    if (!member) return { success: false, error: "Active membership required" };

    const supabase = await createClient();
    const { error } = await supabase
      .from("vehicles")
      .delete()
      .eq("id", id)
      .eq("member_id", member.id);

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch {
    return { success: false, error: "Unauthorized" };
  }
}
