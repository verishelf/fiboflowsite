import { redirect } from "next/navigation";
import { getCurrentUser, isAdmin } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/env";
import { AdminNav } from "@/components/admin/AdminNav";

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  let demoMode = !isSupabaseConfigured();

  if (isSupabaseConfigured()) {
    try {
      const user = await getCurrentUser();
      if (!user) redirect("/");
      const admin = await isAdmin(user.id);
      if (!admin) redirect("/");
    } catch {
      demoMode = true;
    }
  }

  return (
    <div className="-mt-16 flex min-h-screen bg-black">
      <aside className="hidden w-64 shrink-0 border-r border-white/10 bg-charcoal lg:block">
        <div className="sticky top-0 p-6">
          <AdminNav />
        </div>
      </aside>
      <div className="flex-1">
        {demoMode && (
          <div className="border-b border-amber-500/30 bg-amber-500/10 px-6 py-3 text-center text-xs uppercase tracking-[0.15em] text-amber-400">
            Demo mode — Supabase auth not configured
          </div>
        )}
        <div className="border-b border-white/10 p-4 lg:hidden">
          <AdminNav />
        </div>
        <div className="p-6 md:p-10">{children}</div>
      </div>
    </div>
  );
}
