import NumeralMarker from "@/components/ui/NumeralMarker";
import HoverRevealList from "@/components/anim/HoverRevealList";

// ── Services trio ──────────────────────────────────────────────────────────
// On hover: word goes grey → WHITE, its letter-spacing opens slightly, the
// background washes to `accent`, and the image reveals + follows the cursor.
//
// EDIT YOURSELF:
//   • wash colour → change the `accent` hex on each item below
//   • images      → add to /public/images/: service-weddings.jpg,
//                   service-events.jpg, service-catering.jpg
//   • word spacing → change the section's `px-12` (bigger = words closer in)
const SERVICES = [
  { label: "Weddings", image: "/images/service-weddings.jpg", href: "#", accent: "#cdbfa6" },
  { label: "Events", image: "/images/service-events.jpg", href: "#", accent: "#d8c3bd" },
  { label: "Catering", image: "/images/service-catering.jpg", href: "#", accent: "#bfccbb" },
];

export default function ServicesSection() {
  return (
    <section className="relative w-full bg-white">
      <HoverRevealList
        items={SERVICES}
        layout="row"
        className="flex min-h-screen w-full flex-col items-center justify-center gap-16 px-12 py-24"
        labelStyle={{ fontFamily: "var(--font-cormorant-garamond)" }}
        labelClassName="font-semibold text-[#8a8a8a] text-[clamp(2.5rem,4.7vw,90px)]"
        activeLabelClassName="!text-white tracking-[0.06em]"
        dimmedLabelClassName="opacity-30"
        imageWidth={720}
        followStrength={0.06}
        top={<NumeralMarker numeral="II" />}
        bottom={
          <a
            href="#"
            className="rounded-full border border-[#191919] px-10 py-3 font-medium text-[#191919] text-[clamp(1rem,1.04vw,20px)] transition-colors duration-300 hover:bg-[#191919] hover:text-white"
          >
            Explore
          </a>
        }
      />
    </section>
  );
}
