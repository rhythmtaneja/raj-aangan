import VenueHero from "@/components/sections/venue/VenueHero";
import VenuePropertiesSection from "@/components/sections/venue/VenuePropertiesSection";
import CollaborationSection from "@/components/sections/venue/CollaborationSection";
import VenueDetailsCollage from "@/components/sections/venue/VenueDetailsCollage";
import VenuePackagesSection from "@/components/sections/venue/VenuePackagesSection";
import FooterSection from "@/components/sections/FooterSection";
import { getSiteImages } from "@/lib/site-images/queries";

export default async function VenuePage() {
  const siteImages = await getSiteImages();
  return (
    <main className="bg-white">
      <VenueHero bgImage={siteImages.venueHeroImage ?? undefined} />

      <VenuePropertiesSection />

      <CollaborationSection />

      <VenueDetailsCollage />

      <VenuePackagesSection />

      <FooterSection />
    </main>
  );
}
