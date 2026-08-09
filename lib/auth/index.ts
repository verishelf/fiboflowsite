import { createClient } from "@/lib/supabase/server";
import { createServiceClientSafe } from "@/lib/supabase/server";

export async function getCurrentUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function isAdmin(userId?: string): Promise<boolean> {
  if (!userId) return false;
  const service = createServiceClientSafe();
  if (!service) return false;

  const { data } = await service
    .from("admin_users")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();

  return Boolean(data);
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}

export async function requireAdmin() {
  const user = await requireAuth();
  const admin = await isAdmin(user.id);
  if (!admin) {
    throw new Error("Forbidden");
  }
  return user;
}

export async function getMemberForUser(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("members")
    .select("*, membership_plans(*)")
    .eq("user_id", userId)
    .maybeSingle();
  return data;
}
