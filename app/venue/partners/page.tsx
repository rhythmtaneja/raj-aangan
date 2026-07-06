import SiteHeader from "@/components/ui/SiteHeader";
import PartnersGridSection from "@/components/sections/venue/PartnersGridSection";
import BackToVenueNav from "@/components/sections/venue/BackToVenueNav";
import FooterSection from "@/components/sections/FooterSection";

export default function PartnersPage() {
  return (
    <main className="relative bg-white">
      {/* Minimal header — just Menu + Booking pills. Dark scheme sits on white bg. */}
      <SiteHeader variant="minimal" colorScheme="dark" />

      {/* Space for the floating header */}
      <div className="pt-28 md:pt-32">
        <PartnersGridSection />
      </div>

      {/* Back button above the footer */}
      <BackToVenueNav />

      <FooterSection />
    </main>
  );
}
