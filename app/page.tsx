import Hero from "@/components/sections/Hero";
import IntroSection from "@/components/sections/IntroSection";
import FeaturedSection from "@/components/sections/FeaturedSection";
import ServicesSection from "@/components/sections/ServicesSection";
import CuisineSection from "@/components/sections/CuisineSection";
import AboutSection from "@/components/sections/AboutSection";
import EventsSection from "@/components/sections/EventsSection";
import FooterSection from "@/components/sections/FooterSection";

export default function Home() {
  return (
    <main className="bg-[#191919]">
      <Hero />
      <IntroSection
        numeral="I"
        title="A Royal Destination where celebrations come alive."
        secondaryLines={[
          "Luxury Weddings · Refined Catering ·",
          "Memories Forever",
        ]}
        buttonText="View"
      />

      <FeaturedSection />
      <ServicesSection />
      <CuisineSection />
      <AboutSection />
      <EventsSection />
      <FooterSection />
    </main>
  );
}
