import SiteHeader from "@/components/ui/SiteHeader";
import PackagesOverviewSection, {
  type PackageOverview,
} from "@/components/sections/venue/PackagesOverviewSection";
import PackagesDetailSection, {
  type PackageDetail,
} from "@/components/sections/venue/PackagesDetailSection";
import BackToVenueNav from "@/components/sections/venue/BackToVenueNav";
import FooterSection from "@/components/sections/FooterSection";

const OVERVIEW: PackageOverview[] = [
  { name: "Half Day Packages", image: "/images/pkg-gharana-halfday.jpg", href: "#half-day" },
  { name: "Full Day Packages", image: "/images/pkg-gharana-fullday.jpg", href: "#full-day" },
  { name: "Multi - day Package", image: "/images/pkg-gharana-multiday.jpg", href: "#multi-day" },
];

const DETAILS: PackageDetail[] = [
  {
    title: "HALF-DAY CELEBRATION PACKAGE",
    description: "Perfect for intimate gatherings, engagement ceremonies, bridal showers, anniversaries, mehendi functions, and corporate events. Package Inclusions:",
    inclusions: [
      "Exclusive venue access for up to 6 hours",
      "Elegant seating and table arrangements",
      "Basic floral décor and venue styling",
      "Dedicated event coordinator",
      "Welcome drinks for guests",
      "Professional sound system with microphones",
      "Bridal/Groom preparation room",
      "Guest parking and security assistance",
      "Housekeeping and venue maintenance support",
      "Vendor access and coordination",
    ],
    image1: "/images/pkg-gharana-halfday-1.jpg",
    image2: "/images/pkg-gharana-halfday-2.jpg",
  },
  {
    title: "FULL-DAY WEDDING PACKAGE",
    description: "A complete wedding experience crafted for couples seeking a seamless and memorable celebration.",
    inclusions: [
      "Exclusive access to the venue from morning till midnight",
      "Separate spaces for wedding ceremony and reception",
      "Dedicated wedding planning assistance",
      "Bridal suite and groom lounge access",
      "Stage setup and ceremony backdrop",
      "Premium seating arrangements",
      "Ambient lighting throughout the venue",
      "Sound system for ceremonies and speeches",
      "Guest welcome and hospitality desk",
      "Valet parking and security arrangements",
      "Power backup and technical support",
      "Coordination with decorators, photographers, entertainers, and caterers",
    ],
    image1: "/images/pkg-gharana-fullday-1.jpg",
    image2: "/images/pkg-gharana-fullday-2.jpg",
  },
  {
    title: "MULTI-DAY DESTINATION WEDDING PACKAGE",
    description: "An immersive wedding experience designed for couples dreaming of a royal destination celebration.",
    inclusions: [
      "Exclusive venue access for 2–4 days",
      "Accommodation options for wedding guests",
      "Multiple event spaces for various functions",
      "Welcome dinner arrangements",
      "Mehendi ceremony venue",
      "Haldi celebration setup",
      "Sangeet and cocktail evening venue",
      "Wedding ceremony venue",
      "Grand reception arrangements",
      "Farewell brunch setup",
      "Dedicated wedding planning team",
      "Guest hospitality and concierge services",
      "Vendor management and coordination",
      "Customized décor concepts for each event",
    ],
    image1: "/images/pkg-gharana-multiday-1.jpg",
    image2: "/images/pkg-gharana-multiday-2.jpg",
  },
];

export default function RajGharanaPackagesPage() {
  return (
    <main className="relative bg-white">
      <SiteHeader variant="minimal" colorScheme="dark" />

      <div className="pt-28 md:pt-32">
        <PackagesOverviewSection title="Raj Gharana Package" packages={OVERVIEW} />

        <div className="mt-16 md:mt-24">
          <PackagesDetailSection
            numeral="I"
            title="Raj GHARANA"
            packages={DETAILS}
          />
        </div>
      </div>

      {/* Back button above the footer */}
      <BackToVenueNav />

      <FooterSection />
    </main>
  );
}
