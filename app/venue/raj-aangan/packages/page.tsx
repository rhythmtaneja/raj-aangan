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
  { name: "Customizable Package", image: "/images/pkg-aangan-customizable.jpg", href: "#customizable" },
  { name: "Complete Venue Buyout", image: "/images/pkg-aangan-buyout.jpg", href: "#venue-buyout" },
  { name: "Flexible Event Package", image: "/images/pkg-aangan-flexible.jpg", href: "#flexible-event" },
];

const DETAILS: PackageDetail[] = [
  {
    title: "CUSTOMIZABLE FULL-DAY WEDDING PACKAGE",
    description: "Designed for couples who want flexibility and personalization for their special day.",
    inclusions: [
      "Exclusive venue access for a full day",
      "Customized event layout planning",
      "Ceremony and reception setup",
      "Dedicated event manager",
      "Bridal preparation suite",
      "Premium seating arrangements",
      "Standard sound and lighting setup",
      "Guest welcome area",
      "Catering coordination support",
      "Vendor management assistance",
      "Parking and security facilities",
    ],
    image1: "/images/pkg-aangan-custom-1.jpg",
    image2: "/images/pkg-aangan-custom-2.jpg",
  },
  {
    title: "EXCLUSIVE RESORT BUYOUT PACKAGE",
    description: "Transform the entire resort into your private wedding destination.",
    inclusions: [
      "Exclusive access to the entire resort property",
      "Private accommodation for wedding guests",
      "Multiple indoor and outdoor event venues",
      "Dedicated hospitality team",
      "Private dining experiences",
      "Poolside event spaces",
      "Wedding and reception venues",
      "Personalized check-in experience",
      "Concierge services for guests",
      "Valet parking and security personnel",
      "Complete privacy throughout the celebration",
    ],
    image1: "/images/pkg-aangan-buyout-1.jpg",
    image2: "/images/pkg-aangan-buyout-2.jpg",
  },
  {
    title: "FLEXIBLE EVENT PACKAGE",
    description: "Tailored to suit weddings of all sizes, from intimate celebrations to grand affairs.",
    inclusions: [
      "Flexible event duration options",
      "Choice of indoor, outdoor, lawn, and banquet venues",
      "Personalized seating and layout arrangements",
      "Event coordination support",
      "Sound and lighting setup",
      "Catering management assistance",
      "Décor consultation",
      "Guest management services",
      "Parking and security support",
      "Vendor coordination",
    ],
    image1: "/images/pkg-aangan-flex-1.jpg",
    image2: "/images/pkg-aangan-flex-2.jpg",
  },
];

export default function RajAanganPackagesPage() {
  return (
    <main className="relative bg-white">
      <SiteHeader variant="minimal" colorScheme="dark" />

      <div className="pt-28 md:pt-32">
        <PackagesOverviewSection title="Raj Aangan Package" packages={OVERVIEW} />

        <div className="mt-16 md:mt-24">
          <PackagesDetailSection
            numeral="II"
            title="Raj AANGAN"
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
