import SiteHeader from "@/components/ui/SiteHeader";
import PartnersGridSection from "@/components/sections/venue/PartnersGridSection";
import BackToVenueNav from "@/components/sections/venue/BackToVenueNav";
import FooterSection from "@/components/sections/FooterSection";

export default function PartnersPage() {
  return (
    <main className="relative bg-white">
      <SiteHeader variant="minimal" colorScheme="dark" />

      <div className="pt-28 md:pt-32">
        <PartnersGridSection />
      </div>

      <BackToVenueNav />

      <FooterSection />
    </main>
  );
}
