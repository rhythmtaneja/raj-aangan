import AboutHero from "@/components/sections/about/AboutHero";
import AboutStorySection from "@/components/sections/about/AboutStorySection";
import VideoSection from "@/components/sections/about/VideoSection";
import IntroSection from "@/components/sections/IntroSection";
import WhatWeOfferSection from "@/components/sections/about/WhatWeOfferSection";
import FooterSection from "@/components/sections/FooterSection";

export default function AboutPage() {
  return (
    <main className="bg-[#191919]">
      {/* 1. Hero — navbar already there, title letter-by-letter reveal */}
      <AboutHero />

      {/* 2. Trust block + sticky bullet box / scrolling photos */}
      <AboutStorySection />

      {/* 3. Video block with hover-to-circle play button */}
      <VideoSection />

      {/*
        4. About-Us intro — IntroSection reused with different copy.
           Same component as the homepage uses, just different props.
           Matches figma image 2.
      */}
      <IntroSection
        numeral="II"
        label="ABOUT US"
        title="Luxury event planning,heritage venues & exceptional catering crafted with"
        italicTail="the warmth of Rajasthan"
        buttonText="BEGIN YOUR JOURNEY"
      />

      {/* 5. "What We Offer" — staggered service cards (reference images 5/6) */}
      <WhatWeOfferSection />

      {/* 6. Shared footer (same import as homepage — single source of truth) */}
      <FooterSection />
    </main>
  );
}
