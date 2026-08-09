import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <div className="flex min-h-screen flex-col pt-16">{children}</div>
      <SiteFooter />
    </>
  );
}
