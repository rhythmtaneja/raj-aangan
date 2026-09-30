export type CaptionedImage = { url: string; caption?: string };

export type SiteImages = {
  homeHero: string | null;
  homeAboutRow1Left: string | null;
  homeAboutRow1Right: string | null;
  homeAboutRow2Left: string | null;
  homeAboutRow2Right: string | null;
  videoSectionPoster: string | null;

  galleryHeroImage: string | null;
  galleryResortImages: CaptionedImage[];
  galleryOutdoorImages: CaptionedImage[];
  galleryIndoorImages: CaptionedImage[];

  eventsHeroImages: CaptionedImage[];
  eventsWeddingCategoryImages: CaptionedImage[];
  eventsBirthdayCategoryImages: CaptionedImage[];
  eventsCorporateCategoryImages: CaptionedImage[];
  eventsSocialCategoryImages: CaptionedImage[];

  aboutHeroImage: string | null;
  aboutStoryImages: CaptionedImage[];

  venueHeroImage: string | null;
  venuePartnersImages: CaptionedImage[];
  venueRajAanganImages: CaptionedImage[];
  venueRajGharanaImages: CaptionedImage[];

  cateringHeroImage: string | null;

  contactHeroImage: string | null;
};
