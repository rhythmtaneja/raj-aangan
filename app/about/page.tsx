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
      <AboutHero bgImage={siteImages.aboutHeroImage ?? undefined} />

      <AboutStorySection />

      <VideoSection poster={siteImages.videoSectionPoster ?? undefined} />

      <IntroSection
        numeral="II"
        label="ABOUT US"
        title="Luxury event planning,heritage venues "
        secondaryLines={[
          "& exceptional catering crafted with,",
          "the warmth of Rajasthan",
        ]}

        buttonText="BEGIN YOUR JOURNEY"
        buttonCircleSize="7.5rem"
        buttonClassName="rounded-full border border-[#191919] px-8 py-3 text-sm font-medium text-[#191919]"
      />

      <WhatWeOfferSection />

      <FooterSection />
    </main>
  );
}
