import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/env";
import { getRallies, getDestinations } from "@/lib/data/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();
  const [rallies, destinations] = await Promise.all([
    getRallies(),
    getDestinations(),
  ]);

  const staticPages = [
    "",
    "/apply",
    "/about",
    "/contact",
    "/destinations",
    "/gallery",
    "/partners",
    "/sponsors",
    "/sponsors/apply",
    "/terms",
    "/privacy",
    "/membership-agreement",
    "/code-of-conduct",
    "/rally-rules",
    "/rallies",
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const rallyPages = rallies.map((rally) => ({
    url: `${baseUrl}/rallies/${rally.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  const destinationPages = destinations.map((dest) => ({
    url: `${baseUrl}/destinations#${dest.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...rallyPages, ...destinationPages];
}
