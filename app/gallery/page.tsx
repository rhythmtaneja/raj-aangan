import GalleryHero from "@/components/sections/gallery/GalleryHero";
import GalleryGridSection from "@/components/sections/gallery/GalleryGridSection";
import GalleryBackNav from "@/components/sections/gallery/GalleryBackNav";
import FooterSection from "@/components/sections/FooterSection";
import { getSiteImages } from "@/lib/site-images/queries";

// ═══════════════════════════════════════════════════════════════════════════
// Page background colour.
// This is the single source of truth for the dark bg — GalleryHero's bottom
// gradient blends INTO this exact colour, so if you tune this, also update
// HERO_BLEND_TO_COLOR in GalleryHero.tsx to match. Otherwise the hero fade
// will land on the wrong colour and create a visible seam.
// ═══════════════════════════════════════════════════════════════════════════
const PAGE_BG = "#0a1e26"; // ↓ push toward "#050f14" for near-black
                            // ↑ push toward "#0f3a4a" to lighten

// ═══════════════════════════════════════════════════════════════════════════
// Image lists per section.
// Drop actual photos in /public/images/gallery/ using these filenames, or
// edit these arrays to point at your own paths.
// ═══════════════════════════════════════════════════════════════════════════

const RAEC_RESORT_IMAGES = [
  "/images/gallery/raec-1.jpg",
  "/images/gallery/raec-2.jpg",
  "/images/gallery/raec-3.jpg",
  "/images/gallery/raec-4.jpg",
];

const OUTDOOR_GARDEN_IMAGES = [
  "/images/gallery/outdoor-1.jpg",
  "/images/gallery/outdoor-2.jpg",
  "/images/gallery/outdoor-3.jpg",
  "/images/gallery/outdoor-4.jpg",
  "/images/gallery/outdoor-5.jpg",
];

const INDOOR_AREA_IMAGES = [
  "/images/gallery/indoor-1.jpg",
  "/images/gallery/indoor-2.jpg",
  "/images/gallery/indoor-3.jpg",
  "/images/gallery/indoor-4.jpg",
];

// ═══════════════════════════════════════════════════════════════════════════

export default async function GalleryPage() {
  const siteImages = await getSiteImages();
  return (
    <main style={{ backgroundColor: PAGE_BG }}>
      <GalleryHero bgImage={siteImages.galleryHeroImage ?? undefined} />

      <div id="gallery" className="pt-8">
        <GalleryGridSection
          title="RAEC Resort"
          images={
            siteImages.galleryResortImages.length
              ? siteImages.galleryResortImages.map((i) => i.url)
              : RAEC_RESORT_IMAGES
          }
        />

        <GalleryGridSection
          title="Outdoor Garden"
          images={
            siteImages.galleryOutdoorImages.length
              ? siteImages.galleryOutdoorImages.map((i) => i.url)
              : OUTDOOR_GARDEN_IMAGES
          }
          showMoreButton
        />

        <GalleryGridSection
          title="Indoor Area"
          images={
            siteImages.galleryIndoorImages.length
              ? siteImages.galleryIndoorImages.map((i) => i.url)
              : INDOOR_AREA_IMAGES
          }
          showMoreButton
        />
      </div>

      <GalleryBackNav />

      <FooterSection />
    </main>
  );
}
