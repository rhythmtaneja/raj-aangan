// ══════════════════════════════════════════════════════════════════
// PATH IN REPO: lib/site-images/queries.ts
// ══════════════════════════════════════════════════════════════════
// Fetches the `siteImages` singleton and resolves every field to CDN URLs.
// Always returns a full SiteImages object (nulls / empty arrays when a slot
// is unset or Sanity isn't configured) so consumers coalesce with their
// hardcoded /public fallbacks. Server-only.
// ═══════════════════════════════════════════════════════════════════════════

import "server-only";
import { client } from "@/sanity/client";
import { urlFor } from "@/sanity/image";
import { isSanityConfigured } from "@/sanity/env";
import type { CaptionedImage, SiteImages } from "./types";

const REVALIDATE = 30;

const EMPTY: SiteImages = {
  homeHero: null,
  homeAboutRow1Left: null,
  homeAboutRow1Right: null,
  homeAboutRow2Left: null,
  homeAboutRow2Right: null,
  videoSectionPoster: null,
  galleryHeroImage: null,
  galleryResortImages: [],
  galleryOutdoorImages: [],
  galleryIndoorImages: [],
  eventsHeroImages: [],
  eventsWeddingCategoryImages: [],
  eventsBirthdayCategoryImages: [],
  eventsCorporateCategoryImages: [],
  eventsSocialCategoryImages: [],
  aboutHeroImage: null,
  aboutStoryImages: [],
  venueHeroImage: null,
  venuePartnersImages: [],
  venueRajAanganImages: [],
  venueRajGharanaImages: [],
  cateringHeroImage: null,
  contactHeroImage: null,
};

function single(source: unknown, width = 2400): string | null {
  const b = urlFor(source);
  return b ? b.width(width).quality(80).auto("format").url() : null;
}

function gallery(arr: unknown, width = 1600): CaptionedImage[] {
  if (!Array.isArray(arr)) return [];
  return arr
    .map((item): CaptionedImage | null => {
      const b = urlFor(item);
      if (!b) return null;
      const caption =
        item && typeof item === "object" && "caption" in item
          ? (item as { caption?: string }).caption
          : undefined;
      return { url: b.width(width).quality(80).auto("format").url(), caption };
    })
    .filter((x): x is CaptionedImage => x !== null);
}

export async function getSiteImages(): Promise<SiteImages> {
  if (!isSanityConfigured) return EMPTY;
  try {
    const raw = await client.fetch<Record<string, unknown> | null>(
      `*[_type=="siteImages"][0]`,
      {},
      { next: { revalidate: REVALIDATE, tags: ["siteImages"] } },
    );
    if (!raw) return EMPTY;
    return {
      homeHero: single(raw.homeHero),
      homeAboutRow1Left: single(raw.homeAboutRow1Left, 1600),
      homeAboutRow1Right: single(raw.homeAboutRow1Right, 1600),
      homeAboutRow2Left: single(raw.homeAboutRow2Left, 1600),
      homeAboutRow2Right: single(raw.homeAboutRow2Right, 1600),
      videoSectionPoster: single(raw.videoSectionPoster),
      galleryHeroImage: single(raw.galleryHeroImage),
      galleryResortImages: gallery(raw.galleryResortImages),
      galleryOutdoorImages: gallery(raw.galleryOutdoorImages),
      galleryIndoorImages: gallery(raw.galleryIndoorImages),
      eventsHeroImages: gallery(raw.eventsHeroImages),
      eventsWeddingCategoryImages: gallery(raw.eventsWeddingCategoryImages),
      eventsBirthdayCategoryImages: gallery(raw.eventsBirthdayCategoryImages),
      eventsCorporateCategoryImages: gallery(raw.eventsCorporateCategoryImages),
      eventsSocialCategoryImages: gallery(raw.eventsSocialCategoryImages),
      aboutHeroImage: single(raw.aboutHeroImage),
      aboutStoryImages: gallery(raw.aboutStoryImages),
      venueHeroImage: single(raw.venueHeroImage),
      venuePartnersImages: gallery(raw.venuePartnersImages, 800),
      venueRajAanganImages: gallery(raw.venueRajAanganImages),
      venueRajGharanaImages: gallery(raw.venueRajGharanaImages),
      cateringHeroImage: single(raw.cateringHeroImage),
      contactHeroImage: single(raw.contactHeroImage),
    };
  } catch {
    return EMPTY;
  }
}
