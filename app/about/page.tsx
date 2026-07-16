import AboutHero from "@/components/sections/about/AboutHero";
import AboutStorySection from "@/components/sections/about/AboutStorySection";
import VideoSection from "@/components/sections/about/VideoSection";
import IntroSection from "@/components/sections/IntroSection";
import WhatWeOfferSection from "@/components/sections/about/WhatWeOfferSection";
import FooterSection from "@/components/sections/FooterSection";
import { getSiteImages } from "@/lib/site-images/queries";

export default async function AboutPage() {
  const siteImages = await getSiteImages();
  return (
    <main className="bg-[#191919]">
      {/* 1. Hero — navbar already there, title letter-by-letter reveal */}
      <AboutHero bgImage={siteImages.aboutHeroImage ?? undefined} />

      {/* 2. Trust block + sticky bullet box / scrolling photos */}
      <AboutStorySection />

      {/* 3. Video block with hover-to-circle play button */}
      <VideoSection poster={siteImages.videoSectionPoster ?? undefined} />

      {/*
        4. About-Us intro — IntroSection reused with different copy.
           Same component as the homepage uses, just different props.
           Matches figma image 2.
      */}
      <IntroSection
        numeral="II"
        label="ABOUT US"
        title="Luxury event planning,heritage venues "
        secondaryLines={[
          "& exceptional catering crafted with,",
          "the warmth of Rajasthan"
        ]}
        // italicTail="the warmth of Rajasthan"
        buttonText="BEGIN YOUR JOURNEY"
        buttonCircleSize={120}
        buttonClassName="rounded-full border border-[#191919] px-8 py-3 text-sm font-medium text-[#191919]"
      />

      {/* 5. "What We Offer" — staggered service cards (reference images 5/6) */}
      <WhatWeOfferSection />

      {/* 6. Shared footer (same import as homepage — single source of truth) */}
      <FooterSection />
    </main>
  );
}
