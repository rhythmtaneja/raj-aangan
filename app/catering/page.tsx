import CateringHero from "@/components/sections/catering/CateringHero";
import IntroSection from "@/components/sections/IntroSection";
import FooterSection from "@/components/sections/FooterSection";
import { getSiteImages } from "@/lib/site-images/queries";

export default async function CateringPage() {
  const siteImages = await getSiteImages();
  return (
    <main className="bg-white">
      <CateringHero bgImage={siteImages.cateringHeroImage ?? undefined} />

      <IntroSection
        numeral="I"
        title="At RAEC Resort, the world is on your plate every cuisine, every flavour,"
        italicTail="all in one place"
        buttonText="Explore cuisine"
        buttonHref="/menu-builder"
      />

      <FooterSection />
    </main>
  );
}
