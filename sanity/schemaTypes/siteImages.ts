import { defineArrayMember, defineField, defineType } from "sanity";

// ── helpers ────────────────────────────────────────────────────────────────
const img = (name: string, title: string, description: string, group: string) =>
  defineField({
    name,
    title,
    type: "image",
    group,
    description,
    options: { hotspot: true },
  });

const captionedGallery = (
  name: string,
  title: string,
  description: string,
  group: string,
) =>
  defineField({
    name,
    title,
    type: "array",
    group,
    description,
    of: [
      defineArrayMember({
        type: "image",
        options: { hotspot: true },
        fields: [{ name: "caption", type: "string", title: "Caption" }],
      }),
    ],
  });

// ── siteImages: a single (singleton) document holding every swappable image
//    on the public site. Text stays in code; only images are editable here.
export default defineType({
  name: "siteImages",
  title: "Site Photos",
  type: "document",
  groups: [
    { name: "home", title: "Home", default: true },
    { name: "gallery", title: "Gallery" },
    { name: "events", title: "Events" },
    { name: "about", title: "About" },
    { name: "venue", title: "Venue" },
    { name: "catering", title: "Catering" },
    { name: "contact", title: "Contact" },
  ],
  fields: [
    // ── Home ──
    img("homeHero", "Home — Hero", "Large hero image at the top of the homepage first fold. ~2400×1600px.", "home"),
    img("homeAboutRow1Left", "Home — About Row 1 Left", "Left image of the first about row on the homepage.", "home"),
    img("homeAboutRow1Right", "Home — About Row 1 Right", "Right image of the first about row on the homepage.", "home"),
    img("homeAboutRow2Left", "Home — About Row 2 Left", "Left image of the second about row on the homepage.", "home"),
    img("homeAboutRow2Right", "Home — About Row 2 Right", "Right image of the second about row on the homepage.", "home"),
    img("videoSectionPoster", "Home — Video Poster", "Poster frame shown before the homepage video plays.", "home"),

    // ── Gallery ──
    img("galleryHeroImage", "Gallery — Hero", "Hero/backdrop image at the top of the gallery page.", "gallery"),
    captionedGallery("galleryResortImages", "Gallery — Resort", "Resort photos in the gallery grid.", "gallery"),
    captionedGallery("galleryOutdoorImages", "Gallery — Outdoor", "Outdoor photos in the gallery grid.", "gallery"),
    captionedGallery("galleryIndoorImages", "Gallery — Indoor", "Indoor photos in the gallery grid.", "gallery"),

    // ── Events ──
    captionedGallery("eventsHeroImages", "Events — Hero Marquee", "Auto-scrolling marquee images at the top of the events page.", "events"),
    captionedGallery("eventsWeddingCategoryImages", "Events — Wedding", "Wedding category images.", "events"),
    captionedGallery("eventsBirthdayCategoryImages", "Events — Birthday", "Birthday category images.", "events"),
    captionedGallery("eventsCorporateCategoryImages", "Events — Corporate", "Corporate category images.", "events"),
    captionedGallery("eventsSocialCategoryImages", "Events — Social", "Social / other category images.", "events"),

    // ── About ──
    img("aboutHeroImage", "About — Hero", "Hero image on the about page.", "about"),
    captionedGallery("aboutStoryImages", "About — Story Strip", "Scrolling photos strip in the about story section.", "about"),

    // ── Venue ──
    img("venueHeroImage", "Venue — Hero", "Hero image on the venue landing page.", "venue"),
    captionedGallery("venuePartnersImages", "Venue — Partners", "Partner property logos / images.", "venue"),
    captionedGallery("venueRajAanganImages", "Venue — Raj Aangan", "Raj Aangan property gallery.", "venue"),
    captionedGallery("venueRajGharanaImages", "Venue — Raj Gharana", "Raj Gharana property gallery.", "venue"),

    // ── Catering ──
    img("cateringHeroImage", "Catering — Hero", "Hero image on the catering page.", "catering"),

    // ── Contact ──
    img("contactHeroImage", "Contact — Hero", "Hero image on the contact page.", "contact"),
  ],
  preview: {
    prepare: () => ({ title: "Site Photos" }),
  },
});
