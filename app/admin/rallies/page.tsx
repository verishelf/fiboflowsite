import type { Metadata } from "next";
import { getRallies } from "@/lib/data/queries";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Rallies",
  description: "Manage Revved Up Rally events.",
  path: "/admin/rallies",
});

export default async function AdminRalliesPage() {
  const rallies = await getRallies();

  return (
    <div className="mx-auto max-w-6xl space-y-10">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-white/40">Content</p>
        <h1 className="mt-2 font-display text-3xl uppercase tracking-[0.1em] text-off-white">
          Rallies
        </h1>
      </div>

      <div className="overflow-x-auto border border-white/10">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="px-4 py-3 text-[10px] uppercase tracking-[0.15em] text-white/40">Name</th>
              <th className="px-4 py-3 text-[10px] uppercase tracking-[0.15em] text-white/40">Route</th>
              <th className="px-4 py-3 text-[10px] uppercase tracking-[0.15em] text-white/40">Year</th>
              <th className="px-4 py-3 text-[10px] uppercase tracking-[0.15em] text-white/40">Published</th>
            </tr>
          </thead>
          <tbody>
            {rallies.map((rally) => (
              <tr key={rally.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                <td className="px-4 py-4 text-off-white">{rally.name}</td>
                <td className="px-4 py-4 text-white/60">{rally.route}</td>
                <td className="px-4 py-4 text-white/60">{rally.year}</td>
                <td className="px-4 py-4">
                  <span
                    className={
                      rally.published
                        ? "text-[10px] uppercase tracking-[0.1em] text-emerald-400"
                        : "text-[10px] uppercase tracking-[0.1em] text-white/30"
                    }
                  >
                    {rally.published ? "Yes" : "No"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
