import SiteHeader from "@/components/ui/SiteHeader";
import PropertyDetailSection, { type Area } from "@/components/sections/venue/PropertyDetailSection";
import BackToVenueNav from "@/components/sections/venue/BackToVenueNav";
import FooterSection from "@/components/sections/FooterSection";

const AREAS: Area[] = [
  {
    title: "Grand Wedding Lawn",
    description: "Designed for large-format celebrations, receptions, concerts, and destination-style weddings.",
    image: "/images/raj-aangan-area-lawn.jpg",
    capacityLines: ["Capacity: Up to 2,500 Guests"],
  },
  {
    title: "Elegant Banquet Hall",
    description: "An air-cooled indoor venue ideal for engagements, haldi ceremonies, mehendi functions, receptions, and corporate gatherings.",
    image: "/images/raj-aangan-area-hall.jpg",
    capacityLines: [
      "Capacity:",
      "• Banquet Style: 400 Guests",
      "• Theatre Style: 500 Guests",
      "• Floating Style: 600 Guests",
    ],
  },
  {
    title: "The Haveli Ralawata",
    description: "A heritage-style accommodation experience featuring 26 luxury rooms with dedicated bridal and family stay areas.",
    image: "/images/raj-aangan-area-haveli.jpg",
  },
  {
    title: "Poolside & Pavilion Area",
    description: "A sophisticated outdoor space for cocktail evenings, sundowner events, brunches, and intimate celebrations.",
    image: "/images/raj-aangan-area-poolside.jpg",
  },
];

export default function RajAanganResortPage() {
  return (
    <main className="relative bg-white">
      <SiteHeader variant="minimal" colorScheme="dark" />

      <div className="pt-28 md:pt-32">
        <PropertyDetailSection
          numeral="I"
          label="RAJ AANGAN RESORT"
          title="A Grand Heritage Venue for Weddings & Celebrations"
          heroImage="/images/raj-aangan-hero.jpg"
          intro="Raj Aangan Resorts is a spacious heritage-inspired event destination designed for luxury weddings, destination celebrations, social gatherings, and curated hospitality experiences."
          areas={AREAS}
        />
      </div>

      {/* Back button above the footer */}
      <BackToVenueNav />

      <FooterSection />
    </main>
  );
}
