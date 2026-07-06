// ══════════════════════════════════════════════════════════════════
// PATH IN REPO: components/sections/venue/VenuePropertiesSection.tsx
// ══════════════════════════════════════════════════════════════════

"use client";

import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/anim/Reveal";
import CircleButton from "@/components/anim/CircleButton";

const serif = { fontFamily: "var(--font-cormorant-garamond)" } as const;

// ═══════════════════════════════════════════════════════════════════════════
// ─── TUNE THESE KNOBS ──────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════

const SECTION_BG   = "#ffffff"; // matches VenueHero.HERO_BLEND_TO_COLOR
const SECTION_PAD  = "py-24 md:py-32";

// ─ Property card ──
const CARD_ASPECT = "aspect-square"; // matches Figma; try aspect-[4/5] for taller
const FRAME_INSET = "16px";
const FRAME_COLOR = "rgba(255,255,255,0.65)";

// ─ Overlay tint on card image so title reads clearly ──
const CARD_OVERLAY = "rgba(15,10,10,0.30)";

// ─ Gap between the two property cards ──
const CARD_GAP = "gap-8 md:gap-14";

// ═══════════════════════════════════════════════════════════════════════════

type Property = {
  name: string;
  image: string;
  href: string;
};

const PROPERTIES: Property[] = [
  {
    name:  "Raj Aangan Resort",
    image: "/images/venue-raj-aangan.jpg",
    href:  "/venue/raj-aangan",
  },
  {
    name:  "Raj Gharana",
    image: "/images/venue-raj-gharana.jpg",
    href:  "/venue/raj-gharana",
  },
];

export default function VenuePropertiesSection() {
  return (
    <section
      id="properties"
      className={`relative w-full px-6 ${SECTION_PAD} md:px-12`}
      style={{ backgroundColor: SECTION_BG }}
    >
      {/* Two property cards */}
      <div className={`mx-auto grid w-full max-w-6xl grid-cols-1 ${CARD_GAP} md:grid-cols-2`}>
        {PROPERTIES.map((p) => (
          <Reveal key={p.name}>
            <PropertyCard {...p} />
          </Reveal>
        ))}
      </div>

      {/* Our Venue Partners CTA (this one is standalone — not nested) */}
      <Reveal>
        <div className="mt-16 flex justify-center">
          <CircleButton
            href="/venue/partners"
            circleColor="#191919"
            arrowColor="#ffffff"
            circleSize={64}
            magnet={0.35}
            className="rounded-full border border-[#191919] px-8 py-3.5 text-[#191919] text-[clamp(0.95rem,1.1vw,20px)]"
          >
            Our Venue Partners
          </CircleButton>
        </div>
      </Reveal>
    </section>
  );
}

function PropertyCard({ name, image, href }: Property) {
  return (
    // Outer Link → whole card is clickable + accessible as a link.
    <Link href={href} className="group block">
      <div className={`relative ${CARD_ASPECT} w-full overflow-hidden`}>
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
        />
        {/* Dark overlay so title reads over any photo */}
        <div className="absolute inset-0" style={{ backgroundColor: CARD_OVERLAY }} />
        {/* Inner outline frame */}
        <div
          aria-hidden
          className="pointer-events-none absolute z-10"
          style={{ inset: FRAME_INSET, border: `1px solid ${FRAME_COLOR}` }}
        />
        {/* Centered title + Explore button — asStatic so no <a>-inside-<a> */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center text-white">
          <h3
            style={serif}
            className="font-semibold uppercase tracking-wide leading-tight text-[clamp(1.5rem,2.4vw,44px)] [text-shadow:0_2px_12px_rgba(0,0,0,0.55)]"
          >
            {name}
          </h3>
          <div className="mt-8">
            <CircleButton
              asStatic
              circleColor="#ffffff"
              arrowColor="#191919"
              circleSize={58}
              magnet={0.3}
              className="rounded-full border border-white/85 px-7 py-2.5 text-white text-[clamp(0.85rem,0.95vw,17px)]"
            >
              Explore
            </CircleButton>
          </div>
        </div>
      </div>
    </Link>
  );
}
