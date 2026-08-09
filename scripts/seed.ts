#!/usr/bin/env tsx
/**
 * Seed script for Revved Up Rally development data.
 * Requires SUPABASE_SERVICE_ROLE_KEY and NEXT_PUBLIC_SUPABASE_URL.
 *
 * Usage: npm run seed
 */

import { createClient } from "@supabase/supabase-js";
import { MEMBERSHIP_PLANS } from "../lib/pricing/membership-plans";
import {
  SEED_DESTINATIONS,
  SEED_GALLERY,
  SEED_PARTNERS,
  SEED_RALLIES,
  SEED_SPONSORS,
} from "../lib/data/seed-data";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function seed() {
  console.log("Seeding membership plans...");
  for (const [index, plan] of MEMBERSHIP_PLANS.entries()) {
    await supabase.from("membership_plans").upsert({
      id: plan.id,
      name: plan.name,
      price_annual: plan.priceAnnual,
      badge: plan.badge ?? null,
      description: plan.description,
      features: plan.features,
      sort_order: index,
    });
  }

  console.log("Seeding rallies...");
  for (const rally of SEED_RALLIES) {
    const { id: _id, ...rest } = rally;
    await supabase.from("rallies").upsert({ ...rest, id: _id }, { onConflict: "slug" });
  }

  console.log("Seeding destinations...");
  for (const dest of SEED_DESTINATIONS) {
    const { id: _id, ...rest } = dest;
    await supabase.from("destinations").upsert({ ...rest, id: _id }, { onConflict: "slug" });
  }

  console.log("Seeding sponsors...");
  for (const sponsor of SEED_SPONSORS) {
    const { id: _id, ...rest } = sponsor;
    await supabase.from("sponsors").upsert({ ...rest, id: _id }, { onConflict: "slug" });
  }

  console.log("Seeding partners...");
  for (const partner of SEED_PARTNERS) {
    const { id: _id, ...rest } = partner;
    await supabase.from("partners").upsert({ ...rest, id: _id }, { onConflict: "slug" });
  }

  console.log("Seeding gallery...");
  for (const item of SEED_GALLERY) {
    const { id: _id, ...rest } = item;
    await supabase.from("gallery").upsert({ ...rest, id: _id });
  }

  console.log("Seed complete.");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
