import type { Metadata } from "next";
import { getSponsors } from "@/lib/data/queries";
import { SPONSOR_CATEGORY_LABELS } from "@/lib/constants/categories";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Sponsors",
  description: "Manage Revved Up Rally sponsors.",
  path: "/admin/sponsors",
});

export default async function AdminSponsorsPage() {
  const sponsors = await getSponsors();

  return (
    <div className="mx-auto max-w-6xl space-y-10">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-white/40">Partnerships</p>
        <h1 className="mt-2 font-display text-3xl uppercase tracking-[0.1em] text-off-white">
          Sponsors
        </h1>
      </div>

      <div className="overflow-x-auto border border-white/10">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="px-4 py-3 text-[10px] uppercase tracking-[0.15em] text-white/40">Name</th>
              <th className="px-4 py-3 text-[10px] uppercase tracking-[0.15em] text-white/40">Category</th>
              <th className="px-4 py-3 text-[10px] uppercase tracking-[0.15em] text-white/40">Featured</th>
            </tr>
          </thead>
          <tbody>
            {sponsors.map((sponsor) => (
              <tr key={sponsor.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                <td className="px-4 py-4 text-off-white">{sponsor.name}</td>
                <td className="px-4 py-4 text-white/60">
                  {SPONSOR_CATEGORY_LABELS[sponsor.category]}
                </td>
                <td className="px-4 py-4 text-white/60">{sponsor.featured ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
