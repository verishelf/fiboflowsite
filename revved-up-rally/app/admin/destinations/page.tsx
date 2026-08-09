import type { Metadata } from "next";
import { getDestinations } from "@/lib/data/queries";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Destinations",
  description: "Manage Revved Up Rally destinations.",
  path: "/admin/destinations",
});

export default async function AdminDestinationsPage() {
  const destinations = await getDestinations();

  return (
    <div className="mx-auto max-w-6xl space-y-10">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-white/40">Content</p>
        <h1 className="mt-2 font-display text-3xl uppercase tracking-[0.1em] text-off-white">
          Destinations
        </h1>
      </div>

      <div className="overflow-x-auto border border-white/10">
        <table className="w-full min-w-[600px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="px-4 py-3 text-[10px] uppercase tracking-[0.15em] text-white/40">Name</th>
              <th className="px-4 py-3 text-[10px] uppercase tracking-[0.15em] text-white/40">Slug</th>
              <th className="px-4 py-3 text-[10px] uppercase tracking-[0.15em] text-white/40">Featured</th>
              <th className="px-4 py-3 text-[10px] uppercase tracking-[0.15em] text-white/40">Order</th>
            </tr>
          </thead>
          <tbody>
            {destinations.map((dest) => (
              <tr key={dest.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                <td className="px-4 py-4 text-off-white">{dest.name}</td>
                <td className="px-4 py-4 font-mono text-xs text-white/50">{dest.slug}</td>
                <td className="px-4 py-4 text-white/60">{dest.featured ? "Yes" : "No"}</td>
                <td className="px-4 py-4 text-white/60">{dest.sort_order}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
