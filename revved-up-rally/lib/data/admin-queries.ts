import { createClient } from "@/lib/supabase/server";
import { createServiceClientSafe } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import {
  SEED_APPLICATIONS,
  SEED_MEMBERS,
  SEED_MESSAGES,
  SEED_VEHICLES,
  DEMO_MEMBER,
} from "@/lib/data/admin-seed";
import { SEED_RALLIES, SEED_DESTINATIONS, SEED_SPONSORS, SEED_PARTNERS, SEED_GALLERY } from "@/lib/data/seed-data";
import type { Application, Member, Message, Vehicle } from "@/types/database";

export async function getApplications(): Promise<Application[]> {
  if (!isSupabaseConfigured()) return SEED_APPLICATIONS;
  try {
    const service = createServiceClientSafe();
    if (!service) return SEED_APPLICATIONS;
    const { data } = await service
      .from("applications")
      .select("*")
      .order("created_at", { ascending: false });
    return (data?.length ? data : SEED_APPLICATIONS) as Application[];
  } catch {
    return SEED_APPLICATIONS;
  }
}

export async function getMembers(): Promise<Member[]> {
  if (!isSupabaseConfigured()) return SEED_MEMBERS;
  try {
    const service = createServiceClientSafe();
    if (!service) return SEED_MEMBERS;
    const { data } = await service
      .from("members")
      .select("*")
      .order("joined_at", { ascending: false });
    return (data?.length ? data : SEED_MEMBERS) as Member[];
  } catch {
    return SEED_MEMBERS;
  }
}

export async function getMemberVehicles(memberId?: string): Promise<Vehicle[]> {
  const id = memberId ?? DEMO_MEMBER.id;
  if (!isSupabaseConfigured()) {
    return SEED_VEHICLES.filter((v) => v.member_id === id);
  }
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("vehicles")
      .select("*")
      .eq("member_id", id)
      .order("is_primary", { ascending: false });
    if (data?.length) return data as Vehicle[];
  } catch {
    // fall through
  }
  return SEED_VEHICLES.filter((v) => v.member_id === id);
}

export async function getMemberMessages(memberId?: string): Promise<Message[]> {
  const id = memberId ?? DEMO_MEMBER.id;
  if (!isSupabaseConfigured()) {
    return SEED_MESSAGES.filter((m) => m.member_id === id);
  }
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("messages")
      .select("*")
      .eq("member_id", id)
      .order("created_at", { ascending: false });
    if (data?.length) return data as Message[];
  } catch {
    // fall through
  }
  return SEED_MESSAGES.filter((m) => m.member_id === id);
}

export async function getDashboardMember(): Promise<Member> {
  if (!isSupabaseConfigured()) return DEMO_MEMBER;
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from("members")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      if (data) return data as Member;
    }
  } catch {
    // fall through
  }
  return DEMO_MEMBER;
}

export async function getAdminStats() {
  const [applications, members, rallies, destinations, sponsors, partners, gallery] =
    await Promise.all([
      getApplications(),
      getMembers(),
      Promise.resolve(SEED_RALLIES),
      Promise.resolve(SEED_DESTINATIONS),
      Promise.resolve(SEED_SPONSORS),
      Promise.resolve(SEED_PARTNERS),
      Promise.resolve(SEED_GALLERY),
    ]);

  return {
    pendingApplications: applications.filter((a) => a.status === "pending").length,
    totalApplications: applications.length,
    activeMembers: members.filter((m) => m.status === "active").length,
    totalMembers: members.length,
    publishedRallies: rallies.filter((r) => r.published).length,
    destinations: destinations.length,
    sponsors: sponsors.length,
    partners: partners.length,
    galleryItems: gallery.length,
  };
}
