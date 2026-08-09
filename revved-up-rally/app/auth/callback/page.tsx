import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AuthCallbackPage({
  searchParams,
}: PageProps<"/auth/callback">) {
  const params = await searchParams;
  const redirectTo =
    typeof params.redirect === "string" ? params.redirect : "/dashboard";

  const code = typeof params.code === "string" ? params.code : null;

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  redirect(redirectTo);
}
