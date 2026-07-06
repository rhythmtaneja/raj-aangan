import VenueHero from "@/components/sections/venue/VenueHero";
import VenuePropertiesSection from "@/components/sections/venue/VenuePropertiesSection";
import VenueDetailsCollage from "@/components/sections/venue/VenueDetailsCollage";
import VenuePackagesSection from "@/components/sections/venue/VenuePackagesSection";
import FooterSection from "@/components/sections/FooterSection";

export default function VenuePage() {
  return (
    <main className="bg-white">
      {/* 1. Hero — "Venue" letter reveal + down arrow */}
      <VenueHero />

      {/* 2. Two property cards + Our Venue Partners CTA */}
      <VenuePropertiesSection />

      {/* 3. Pinned scroll collage — 10 detail cards (same pattern as Events) */}
      <VenueDetailsCollage />

      {/* 4. Venue packages — 2 property cards on navy */}
      <VenuePackagesSection />

      {/* 5. Shared footer */}
      <FooterSection />
    </main>
  );
}
