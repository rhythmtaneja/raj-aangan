import EventsHero from "@/components/sections/events/EventsHero";
import IntroSection from "@/components/sections/IntroSection";
import EventsServicesGrid from "@/components/sections/events/EventsServicesGrid";
import WeddingPackagesSection from "@/components/sections/events/WeddingPackagesSection";
import ExpertiseSection from "@/components/sections/events/ExpertiseSection";
import DecorStylingCarousel from "@/components/sections/events/DecorStylingCarousel";
import EntertainmentCollage from "@/components/sections/events/EntertainmentCollage";
import FooterSection from "@/components/sections/FooterSection";

// ─── PAGE-LEVEL DATA ─────────────────────────────────────────────────────────
// Kept here (not inside the component) so copy is easy to find and edit.

const CURATE_COL_A = [
  "Roka",
  "Engagement",
  "Mehendi",
  "Haldi",
  "Sangeet",
  "Bhat",
  "Baraat",
];

const CURATE_COL_B = [
  "Wedding Ceremony",
  "Reception",
  "Cocktail",
  "Pool Party",
  "After Party",
  "Sundowner",
];

const EXPERTISE_ITEMS = [
  "Event timeline and flow planning",
  "Vendor coordination and supervision",
  "Guest arrival and hospitality management",
  "Stage, Sound, and lighting coordination",
  "On ground team management",
  "Emergency planning and contingency support",
  "Corporate events, conferences, dealer meets, gala dinners, and brand events",
];

export default function EventsPage() {
  return (
    <main className="bg-white">
      {/* 1. Auto-scrolling category hero (replaces the "black strip" bg) */}
      <EventsHero />

      {/* 2. Reused IntroSection with events copy */}
      <IntroSection
        numeral="I"
        title="We believe a great celebration is the sum of a thousand thoughtful details."
        secondaryLines={["Planned to Perfection"]}
        buttonText="Explore"
        buttonHref="#services"
      />

      {/* 3. 3×3 services grid with per-card CTAs */}
      <EventsServicesGrid />

      {/* 4. Wedding Packages — split white/navy/white layout */}
      <WeddingPackagesSection />

      {/* 5. Two Expertise blocks, image + bullets */}
      <ExpertiseSection
        title="Celebration"
        titleItalic="we"
        titleAfter="Curate"
        image="/images/events-curate.jpg"
        columns={[CURATE_COL_A, CURATE_COL_B]}
      />
      <ExpertiseSection
        title="Our Expertise"
        image="/images/events-expertise.jpg"
        columns={[EXPERTISE_ITEMS]}
      />

      {/* 6. Decor & Styling — auto-scrolling themed carousel */}
      <DecorStylingCarousel />

      {/* 7. Entertainment collage — pinned scroll with darkening bg */}
      <EntertainmentCollage />

      {/* 8. Footer — same shared component used site-wide */}
      <FooterSection />
    </main>
  );
}
