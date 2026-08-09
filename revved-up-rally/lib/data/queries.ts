import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import {
  SEED_DESTINATIONS,
  SEED_GALLERY,
  SEED_PARTNERS,
  SEED_RALLIES,
  SEED_SPONSORS,
} from "@/lib/data/seed-data";
import type { Destination, GalleryItem, Partner, Rally, Sponsor } from "@/types/database";

async function queryOrFallback<T>(
  fetcher: () => Promise<T[]>,
  fallback: T[],
): Promise<T[]> {
  if (!isSupabaseConfigured()) return fallback;
  try {
    const data = await fetcher();
    return data.length > 0 ? data : fallback;
  } catch {
    return fallback;
  }
}

export async function getRallies(): Promise<Rally[]> {
  return queryOrFallback(async () => {
    const supabase = await createClient();
    const { data } = await supabase
      .from("rallies")
      .select("*")
      .eq("published", true)
      .order("start_date", { ascending: true });
    return (data ?? []) as Rally[];
  }, SEED_RALLIES);
}

export async function getRallyBySlug(slug: string): Promise<Rally | null> {
  if (!isSupabaseConfigured()) {
    return SEED_RALLIES.find((r) => r.slug === slug) ?? null;
  }
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("rallies")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();
    if (data) return data as Rally;
  } catch {
    // fall through
  }
  return SEED_RALLIES.find((r) => r.slug === slug) ?? null;
}

export async function getDestinations(): Promise<Destination[]> {
  return queryOrFallback(async () => {
    const supabase = await createClient();
    const { data } = await supabase
      .from("destinations")
      .select("*")
      .order("sort_order", { ascending: true });
    return (data ?? []) as Destination[];
  }, SEED_DESTINATIONS);
}

export async function getSponsors(): Promise<Sponsor[]> {
  return queryOrFallback(async () => {
    const supabase = await createClient();
    const { data } = await supabase
      .from("sponsors")
      .select("*")
      .order("sort_order", { ascending: true });
    return (data ?? []) as Sponsor[];
  }, SEED_SPONSORS);
}

export async function getPartners(): Promise<Partner[]> {
  return queryOrFallback(async () => {
    const supabase = await createClient();
    const { data } = await supabase
      .from("partners")
      .select("*")
      .order("sort_order", { ascending: true });
    return (data ?? []) as Partner[];
  }, SEED_PARTNERS);
}

export async function getGalleryItems(category?: string): Promise<GalleryItem[]> {
  return queryOrFallback(async () => {
    const supabase = await createClient();
    let query = supabase.from("gallery").select("*").order("sort_order", { ascending: true });
    if (category && category !== "all") {
      query = query.eq("category", category);
    }
    const { data } = await query;
    return (data ?? []) as GalleryItem[];
  }, category && category !== "all"
    ? SEED_GALLERY.filter((g) => g.category === category)
    : SEED_GALLERY);
}
