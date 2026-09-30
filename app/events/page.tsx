import EventsHero from "@/components/sections/events/EventsHero";
import IntroSection from "@/components/sections/IntroSection";
import EventsServicesGrid from "@/components/sections/events/EventsServicesGrid";
import WeddingPackagesSection from "@/components/sections/events/WeddingPackagesSection";
import ExpertiseSection from "@/components/sections/events/ExpertiseSection";
import DecorStylingCarousel from "@/components/sections/events/DecorStylingCarousel";
import EntertainmentCollage from "@/components/sections/events/EntertainmentCollage";
import FooterSection from "@/components/sections/FooterSection";

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
      <EventsHero />

      <IntroSection
        numeral="I"
        title="We believe a great celebration is the sum of a"
        secondaryLines={[
          "Thousand Thoughtful Details.",
          "Planned to Perfection",
        ]}
        buttonText="Explore"
        buttonHref="#services"
      />

      <EventsServicesGrid />

      <WeddingPackagesSection />

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

      <DecorStylingCarousel />

      <EntertainmentCollage />

      <FooterSection />
    </main>
  );
}
