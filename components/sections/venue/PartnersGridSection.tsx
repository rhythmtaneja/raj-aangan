"use client";

import Image from "next/image";
import Reveal from "@/components/anim/Reveal";
import CircleButton from "@/components/anim/CircleButton";

const serif = { fontFamily: "var(--font-cormorant-garamond)" } as const;

// ═══════════════════════════════════════════════════════════════════════════
// ─── TUNE THESE KNOBS ──────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════

const SECTION_BG   = "#ffffff";
const TEXT_COLOR   = "#191919";
const MUTED_COLOR  = "#8a8a8a";
const SECTION_PAD  = "py-20 md:py-24";

// ─ Card image ──
const CARD_ASPECT = "aspect-[4/5]"; // matches figma tall card
const FRAME_INSET = "12px";
const FRAME_COLOR = "rgba(255,255,255,0.55)";

// ═══════════════════════════════════════════════════════════════════════════

type Partner = {
  name:        string;
  location:    string;
  rooms:       number;
  guests:      number;
  description: string;
  image:       string;
  href?:       string;
};

export const PARTNERS: Partner[] = [
  {
    name:        "Rajmahal Palace, Jaipur",
    location:    "Jaipur, Rajasthan",
    rooms:       50,
    guests:      250,
    description: "Set in the heart of Samode, this majestic destination combines royal heritage, natural beauty, and timeless elegance. With its stunning surroundings and regal ambiance, it creates the perfect backdrop for weddings, celebrations, and memorable occasions.",
    image:       "/images/partner-rajmahal.jpg",
  },
  {
    name:        "Samode Palace, Jaipur",
    location:    "Jaipur, Rajasthan",
    rooms:       50,
    guests:      250,
    description: "Set in the heart of Samode, this majestic destination combines royal heritage, natural beauty, and timeless elegance. With its stunning surroundings and regal ambiance, it creates the perfect backdrop for weddings, celebrations, and memorable occasions.",
    image:       "/images/partner-samode.jpg",
  },
  {
    name:        "Jaipur Marriott, Jaipur",
    location:    "Jaipur, Rajasthan",
    rooms:       50,
    guests:      250,
    description: "Set in the heart of Samode, this majestic destination combines royal heritage, natural beauty, and timeless elegance. With its stunning surroundings and regal ambiance, it creates the perfect backdrop for weddings, celebrations, and memorable occasions.",
    image:       "/images/partner-marriott.jpg",
  },
];

export default function PartnersGridSection() {
  return (
    <section
      className={`relative w-full px-6 md:px-12 ${SECTION_PAD}`}
      style={{ backgroundColor: SECTION_BG, color: TEXT_COLOR }}
    >
      <Reveal>
        <h1
          style={serif}
          className="mx-auto mb-16 max-w-4xl text-center font-medium text-[clamp(2rem,3.5vw,64px)]"
        >
          Our Partners
        </h1>
      </Reveal>

      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-3">
        {PARTNERS.map((p) => (
          <Reveal key={p.name}>
            <PartnerCard {...p} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function PartnerCard({ name, location, rooms, guests, description, image, href = "#" }: Partner) {
  return (
    <div className="flex flex-col">
      <div className={`group relative ${CARD_ASPECT} w-full overflow-hidden`}>
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute z-10"
          style={{ inset: FRAME_INSET, border: `1px solid ${FRAME_COLOR}` }}
        />
      </div>

      <h3
        style={serif}
        className="mt-6 text-center font-semibold text-[clamp(1.15rem,1.4vw,26px)]"
      >
        {name}
      </h3>
      <p
        style={{ ...serif, color: MUTED_COLOR }}
        className="mt-1 text-center italic text-[clamp(0.9rem,1vw,18px)]"
      >
        {location}
      </p>

      {/* Capacity stats row */}
      <div className="mt-4 flex items-center justify-between px-4 text-[clamp(0.9rem,1vw,18px)]">
        <div className="flex items-center gap-2">
          <BedIcon className="h-5 w-5" />
          <span>{rooms}</span>
        </div>
        <div className="flex items-center gap-2">
          <PeopleIcon className="h-5 w-5" />
          <span>{guests}</span>
        </div>
      </div>

      <p
        style={serif}
        className="mt-4 text-center leading-relaxed text-[clamp(0.85rem,0.95vw,17px)]"
      >
        {description}
      </p>

      <div className="mt-6 flex justify-center">
        <CircleButton
          href={href}
          circleColor="#191919"
          arrowColor="#ffffff"
          circleSize={54}
          magnet={0.3}
          className="rounded-full border border-[#191919] px-6 py-2.5 text-[#191919] text-[clamp(0.85rem,0.95vw,17px)]"
        >
          View Property
        </CircleButton>
      </div>
    </div>
  );
}

function BedIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12h20v6H2z" />
      <path d="M2 12V7a2 2 0 0 1 2-2h5v7" />
      <path d="M9 12h13" />
    </svg>
  );
}

function PeopleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="8" r="3" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M2 20c0-3 3-5 7-5s7 2 7 5" />
      <path d="M15 20c0-2.5 2-4 4.5-4S24 17.5 24 20" />
    </svg>
  );
}
