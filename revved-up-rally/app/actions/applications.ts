"use server";

import { applicationSchema } from "@/lib/validations/schemas";
import { createServiceClientSafe } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/rate-limit";
import { sendEmail } from "@/lib/email";
import { applicationReceivedTemplate } from "@/lib/email/templates";
import { getPlanById } from "@/lib/pricing/membership-plans";
import type { ActionResult } from "@/types/actions";

export async function submitApplication(
  data: unknown,
): Promise<ActionResult<{ id: string }>> {
  const parsed = applicationSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message ?? "Invalid data" };
  }

  const form = parsed.data;
  const limit = rateLimit(`apply:${form.email}`, 3, 3600_000);
  if (!limit.success) {
    return { success: false, error: "Too many applications. Please try again later." };
  }

  const supabase = createServiceClientSafe();
  const plan = getPlanById(form.membershipPlan);
  if (!plan) {
    return { success: false, error: "Invalid membership plan" };
  }

  const payload = {
    first_name: form.firstName,
    last_name: form.lastName,
    email: form.email,
    phone: form.phone,
    date_of_birth: form.dateOfBirth || null,
    city: form.city,
    state: form.state,
    country: form.country,
    instagram: form.instagram || null,
    occupation: form.occupation,
    company: form.company || null,
    hear_about_us: form.hearAboutUs,
    vehicle_info: {
      primaryVehicle: form.primaryVehicle,
      year: form.vehicleYear,
      make: form.vehicleMake,
      model: form.vehicleModel,
      trim: form.vehicleTrim,
      color: form.vehicleColor,
      additionalVehicles: form.additionalVehicles,
      vehiclesOwned: form.vehiclesOwned,
    },
    membership_plan_id: form.membershipPlan,
    application_answers: {
      whyJoin: form.whyJoin,
      rallyExperience: form.rallyExperience,
      participatedBefore: form.participatedBefore,
      previousRallies: form.previousRallies,
    },
    emergency_contact: {
      name: form.emergencyName,
      phone: form.emergencyPhone,
      relationship: form.emergencyRelationship,
    },
    status: "pending" as const,
  };

  if (!supabase) {
    console.info("[dev] Application submitted:", payload);
    await sendEmail({
      to: form.email,
      subject: "Application Received — Revved Up Rally",
      html: applicationReceivedTemplate({ name: form.firstName, planName: plan.name }),
    });
    return { success: true, data: { id: "dev-mode" } };
  }

  const { data: row, error } = await supabase
    .from("applications")
    .insert(payload)
    .select("id")
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  await sendEmail({
    to: form.email,
    subject: "Application Received — Revved Up Rally",
    html: applicationReceivedTemplate({ name: form.firstName, planName: plan.name }),
  });

  return { success: true, data: { id: row.id } };
}
