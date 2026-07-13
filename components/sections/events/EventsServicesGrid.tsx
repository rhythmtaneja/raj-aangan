"use client";

import Image from "next/image";
import Reveal from "@/components/anim/Reveal";
import CircleButton from "@/components/anim/CircleButton";
import ImageOverlay from "@/components/ui/ImageOverlay";


const serif = { fontFamily: "var(--font-cormorant-garamond)" } as const;

// ═══════════════════════════════════════════════════════════════════════════
// ─── TUNE THESE KNOBS ──────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════

// ─ Section bg + title ──
// NOTE: In Figma this section is titled "Decor & Styling" but its cards are
// general services (Theme & Concept, Guest Hospitality etc.). Image 6 uses
// the same title with actual decor themes. Assuming a paste error — using
// "Our Services" as placeholder. Change SECTION_TITLE when confirmed.
const SECTION_BG = "#ffffff";
const SECTION_TITLE = "Our Services";        // ← confirm w/ Figma; may be "Decor & Styling"
const TITLE_COLOR = "#191919";

// ─ Card image ──
const CARD_ASPECT = "aspect-square"; // matches Figma; use aspect-[4/5] for taller

// ─ Frame on each card ──
const FRAME_INSET = "16px";
const FRAME_COLOR = "rgba(255,255,255,0.7)";

// ─ Grid gap ──
const GAP_X = "gap-x-8";
const GAP_Y = "gap-y-16";

// ═══════════════════════════════════════════════════════════════════════════

type Service = {
  title: string;
  description: string;
  image: string;
  href?: string;
};

const SERVICES: Service[] = [
  {
    title: "Theme & Concept Planning",
    description:
      "Transformed ideas into a clear design vision that guided the overall project development.",
    image: "/images/events-service-theme.jpg",
  },
  {
    title: "Venue styling & Decor Coordination",
    description:
      "Managed decor planning, floral arrangements, lighting, and thematic elements to enhance the venue's ambiance.",
    image: "/images/events-service-venue.jpg",
  },
  {
    title: "Food & Beverages Planning",
    description:
      "From your first consultation to the final farewell, we orchestrate your wedding with elegance, precision, and heart.",
    image: "/images/events-service-food.jpg",
  },
  {
    title: "Guest Hospitality Management",
    description:
      "From your first consultation to the final farewell, we orchestrate your wedding with elegance, precision, and heart.",
    image: "/images/events-service-hospitality.jpg",
  },
  {
    title: "Entertainment & Artist Coordination",
    description:
      "From your first consultation to the final farewell, we orchestrate your wedding with elegance, precision, and heart.",
    image: "/images/events-service-entertainment.jpg",
  },
  {
    title: "Vendor Sourcing & Management",
    description:
      "From your first consultation to the final farewell, we orchestrate your wedding with elegance, precision, and heart.",
    image: "/images/events-service-vendor.jpg",
  },
  {
    title: "Baraat & Bridal Entry Concepts",
    description:
      "From your first consultation to the final farewell, we orchestrate your wedding with elegance, precision, and heart.",
    image: "/images/events-service-baraat.jpg",
  },
  {
    title: "Function Flow & Timeline Planning",
    description:
      "From your first consultation to the final farewell, we orchestrate your wedding with elegance, precision, and heart.",
    image: "/images/events-service-flow.jpg",
  },
  {
    title: "On ground Event Coordination",
    description:
      "From your first consultation to the final farewell, we orchestrate your wedding with elegance, precision, and heart.",
    image: "/images/events-service-onground.jpg",
  },
];

export default function EventsServicesGrid() {
  return (
    <section
      id="services"
      className="relative w-full px-6 py-24 md:px-12"
      style={{ backgroundColor: SECTION_BG, color: TITLE_COLOR }}
    >
      <Reveal>
        <h2
          style={serif}
          className="mx-auto mb-16 max-w-4xl text-center font-medium text-[clamp(1.8rem,3vw,54px)]"
        >
          {SECTION_TITLE}
        </h2>
      </Reveal>

      <div className={`mx-auto grid w-full max-w-7xl grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ${GAP_X} ${GAP_Y}`}>
        {SERVICES.map((s) => (
          <Reveal key={s.title}>
            <ServiceCard {...s} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function ServiceCard({ title, description, image, href = "#" }: Service) {
  return (
    <div className="group flex flex-col">
      {/* Image card with text overlay + inner frame */}
      <div className={`relative ${CARD_ASPECT} w-full overflow-hidden`}>
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
        />
        <ImageOverlay opacity={0.44} />
        {/* Inner outline frame */}
        <div
          aria-hidden
          className="pointer-events-none absolute z-10"
          style={{ inset: FRAME_INSET, border: `1px solid ${FRAME_COLOR}` }}
        />
        {/* Text overlay */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center text-white">
          <h3
            style={serif}
            className="font-semibold leading-tight text-[clamp(1.15rem,1.5vw,28px)] [text-shadow:0_1px_10px_rgba(0,0,0,0.6)]"
          >
            {title}
          </h3>
          <p
            style={serif}
            className="mt-3 max-w-[240px] leading-snug text-[clamp(0.8rem,0.9vw,15px)] text-white/95 [text-shadow:0_1px_10px_rgba(0,0,0,0.6)]"
          >
            {description}
          </p>
        </div>
      </div>

      {/* "See our services" button below the card */}
      <div className="mt-6 flex justify-center">
        <CircleButton
          href={href}
          circleColor="#191919"
          arrowColor="#ffffff"
          circleSize={120}
          magnet={0.3}
          className="rounded-full border border-[#191919] px-6 py-2.5 text-[#191919] text-[clamp(0.85rem,0.95vw,17px)]"
        >
          See our services
        </CircleButton>
      </div>
    </div>
  );
}
