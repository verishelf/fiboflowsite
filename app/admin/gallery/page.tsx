import type { Metadata } from "next";
import { getGalleryItems } from "@/lib/data/queries";
import { GALLERY_CATEGORY_LABELS } from "@/lib/constants/categories";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Gallery",
  description: "Manage Revved Up Rally gallery content.",
  path: "/admin/gallery",
});

export default async function AdminGalleryPage() {
  const items = await getGalleryItems();

  return (
    <div className="mx-auto max-w-6xl space-y-10">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-white/40">Content</p>
        <h1 className="mt-2 font-display text-3xl uppercase tracking-[0.1em] text-off-white">
          Gallery
        </h1>
      </div>

      <div className="overflow-x-auto border border-white/10">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="px-4 py-3 text-[10px] uppercase tracking-[0.15em] text-white/40">Title</th>
              <th className="px-4 py-3 text-[10px] uppercase tracking-[0.15em] text-white/40">Category</th>
              <th className="px-4 py-3 text-[10px] uppercase tracking-[0.15em] text-white/40">Caption</th>
              <th className="px-4 py-3 text-[10px] uppercase tracking-[0.15em] text-white/40">Featured</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                <td className="px-4 py-4 text-off-white">{item.title ?? "—"}</td>
                <td className="px-4 py-4 text-white/60">
                  {GALLERY_CATEGORY_LABELS[item.category]}
                </td>
                <td className="px-4 py-4 text-white/50">{item.caption ?? "—"}</td>
                <td className="px-4 py-4 text-white/60">{item.featured ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
