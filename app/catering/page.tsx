import CateringHero from "@/components/sections/catering/CateringHero";
import IntroSection from "@/components/sections/IntroSection";
import FooterSection from "@/components/sections/FooterSection";

export default function CateringPage() {
  return (
    <main className="bg-white">
      {/* 1. Hero — RAEC logo block + letter-reveal tagline + Plan Your Event */}
      <CateringHero />

      {/*
        2. Intro — reuses the existing IntroSection component with catering copy.
        Matches image 2 in the Figma:
          - Numeral I
          - "At RAEC Resort, the world is on your plate every cuisine,
             every flavour," + italic "all in one place"
          - "Explore cusine" button (keeping the Figma spelling; flag if it
             should be "cuisine")
        The button routes to /menu-builder (the wizard we build in phase 2).
      */}
      <IntroSection
        numeral="I"
        title="At RAEC Resort, the world is on your plate every cuisine, every flavour,"
        italicTail="all in one place"
        buttonText="Explore cuisine"
        buttonHref="/menu-builder"
      />

      {/* 3. Shared footer */}
      <FooterSection />
    </main>
  );
}
