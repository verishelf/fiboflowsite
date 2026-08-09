import type { GalleryCategory, PartnerCategory, SponsorCategory } from "@/types/database";

export const SPONSOR_CATEGORY_LABELS: Record<SponsorCategory, string> = {
  automotive: "Automotive",
  performance: "Performance",
  luxury: "Luxury",
  travel: "Travel",
  hospitality: "Hospitality",
  technology: "Technology",
  lifestyle: "Lifestyle",
};

export const PARTNER_CATEGORY_LABELS: Record<PartnerCategory, string> = {
  hotels: "Hotels",
  restaurants: "Restaurants",
  detailing: "Detailing",
  performance_shops: "Performance Shops",
  dealerships: "Dealerships",
  automotive_brands: "Automotive Brands",
  luxury_lifestyle: "Luxury Lifestyle",
  travel: "Travel",
  photography: "Photography",
  media: "Media",
};

export const GALLERY_CATEGORY_LABELS: Record<GalleryCategory | "all", string> = {
  all: "All",
  rallies: "Rallies",
  cars: "Cars",
  people: "People",
  destinations: "Destinations",
  lifestyle: "Lifestyle",
};
