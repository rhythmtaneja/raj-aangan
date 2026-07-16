/** A gallery image resolved to a CDN URL plus optional caption. */
export type CaptionedImage = { url: string; caption?: string };

/**
 * Every swappable image on the public site, resolved to URLs. Single images
 * are `string | null` (null → consumer uses its hardcoded fallback). Gallery
 * arrays are `CaptionedImage[]` (empty → consumer uses its fallback list).
 */
export type SiteImages = {
  // Home
  homeHero: string | null;
  homeAboutRow1Left: string | null;
  homeAboutRow1Right: string | null;
  homeAboutRow2Left: string | null;
  homeAboutRow2Right: string | null;
  videoSectionPoster: string | null;
  // Gallery
  galleryHeroImage: string | null;
  galleryResortImages: CaptionedImage[];
  galleryOutdoorImages: CaptionedImage[];
  galleryIndoorImages: CaptionedImage[];
  // Events
  eventsHeroImages: CaptionedImage[];
  eventsWeddingCategoryImages: CaptionedImage[];
  eventsBirthdayCategoryImages: CaptionedImage[];
  eventsCorporateCategoryImages: CaptionedImage[];
  eventsSocialCategoryImages: CaptionedImage[];
  // About
  aboutHeroImage: string | null;
  aboutStoryImages: CaptionedImage[];
  // Venue
  venueHeroImage: string | null;
  venuePartnersImages: CaptionedImage[];
  venueRajAanganImages: CaptionedImage[];
  venueRajGharanaImages: CaptionedImage[];
  // Catering
  cateringHeroImage: string | null;
  // Contact
  contactHeroImage: string | null;
};
