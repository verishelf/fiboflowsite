import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/env";

export const SITE_NAME = "Revved Up Rally";

export const SITE_DESCRIPTION =
  "An exclusive automotive rally experience for enthusiasts who demand more — curated routes, luxury destinations, and a community built around exceptional machines.";

export function createPageMetadata({
  title,
  description,
  path = "",
}: {
  title: string;
  description: string;
  path?: string;
}): Metadata {
  const fullTitle = title === SITE_NAME ? title : `${title} | ${SITE_NAME}`;
  const url = `${getSiteUrl()}${path}`;

  return {
    title: fullTitle,
    description,
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
  };
}
