import Hero from "@/components/sections/Hero";
import IntroSection from "@/components/sections/IntroSection";
import FeaturedSection from "@/components/sections/FeaturedSection";
import ServicesSection from "@/components/sections/ServicesSection";
import CuisineSection from "@/components/sections/CuisineSection";

export default function Home() {
  return (
    <main className="bg-[#191919]">
      <Hero />
      <IntroSection />
      <FeaturedSection />
      <ServicesSection />
      <CuisineSection />
    </main>
  );
}
