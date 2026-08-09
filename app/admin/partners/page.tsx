import type { Metadata } from "next";
import { getPartners } from "@/lib/data/queries";
import { PARTNER_CATEGORY_LABELS } from "@/lib/constants/categories";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Partners",
  description: "Manage Revved Up Rally partners.",
  path: "/admin/partners",
});

export default async function AdminPartnersPage() {
  const partners = await getPartners();

  return (
    <div className="mx-auto max-w-6xl space-y-10">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-white/40">Partnerships</p>
        <h1 className="mt-2 font-display text-3xl uppercase tracking-[0.1em] text-off-white">
          Partners
        </h1>
      </div>

      <div className="overflow-x-auto border border-white/10">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="px-4 py-3 text-[10px] uppercase tracking-[0.15em] text-white/40">Name</th>
              <th className="px-4 py-3 text-[10px] uppercase tracking-[0.15em] text-white/40">Category</th>
              <th className="px-4 py-3 text-[10px] uppercase tracking-[0.15em] text-white/40">Benefits</th>
              <th className="px-4 py-3 text-[10px] uppercase tracking-[0.15em] text-white/40">Featured</th>
            </tr>
          </thead>
          <tbody>
            {partners.map((partner) => (
              <tr key={partner.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                <td className="px-4 py-4 text-off-white">{partner.name}</td>
                <td className="px-4 py-4 text-white/60">
                  {PARTNER_CATEGORY_LABELS[partner.category]}
                </td>
                <td className="px-4 py-4 text-white/50">{partner.benefits ?? "—"}</td>
                <td className="px-4 py-4 text-white/60">{partner.featured ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
