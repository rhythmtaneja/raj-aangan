"use client";

import Image from "next/image";
import Reveal from "@/components/anim/Reveal";
import CircleButton from "@/components/anim/CircleButton";

const serif = { fontFamily: "var(--font-cormorant-garamond)" } as const;

// ═══════════════════════════════════════════════════════════════════════════
// ─── TUNE THESE KNOBS ──────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════

const SECTION_BG = "#ffffff";
const TEXT_COLOR = "#191919";
const MUTED_COLOR = "#8a8a8a";
const SECTION_PAD = "py-20 md:py-24";

// ─ Card image ──
const CARD_ASPECT = "aspect-[4/5]"; // matches figma tall card
const FRAME_INSET = "0.75rem";
const FRAME_COLOR = "rgba(255,255,255,0.55)";

// ═══════════════════════════════════════════════════════════════════════════

type Partner = {
  name: string;
  location: string;
  /** Free text — venues report rooms as "45", "55 + 25", "51+". */
  rooms: string;
  /** Free text — a range ("250–800") or "To be confirmed". */
  guests: string;
  description: string;
  image: string;
  href?: string;
};

// ⚠️ PLACEHOLDER PHOTOS — every `image` below is one of the three stock partner
// shots, cycled purely so the grid renders. Swap each one for the venue's real
// photo when it arrives; nothing else on the card needs to change.
export const PARTNERS: Partner[] = [
  {
    name: "Hotel New Haveli",
    location: "Mansarovar, Jaipur",
    rooms: "55 + 25",
    guests: "250–800",
    description: "A versatile Jaipur wedding destination with elegant banquet spaces and expansive outdoor lawns, ideal for weddings, receptions, and memorable multi-function celebrations.",
    image: "/images/partner-rajmahal.jpg",
  },
  {
    name: "Hotel Rudra Vilas",
    location: "Mansarovar, Jaipur",
    rooms: "45",
    guests: "300",
    description: "A royal-style wedding destination combining comfortable guest accommodation with a magnificent lawn, royal banquet hall, and dedicated spaces for intimate wedding functions.",
    image: "/images/partner-samode.jpg",
  },
  {
    name: "Kalyan Heritage and Paradise",
    location: "Jagatpura, Jaipur",
    rooms: "24",
    guests: "300–2,000",
    description: "A heritage-inspired Jaipur destination featuring landscaped gardens, banquet facilities, and comfortable accommodation, creating an elegant setting for weddings and celebrations.",
    image: "/images/partner-marriott.jpg",
  },
  {
    name: "The Andaaj Bagh",
    location: "Jagatpura, Jaipur",
    rooms: "36",
    guests: "500–700",
    description: "A spacious wedding destination near Jaipur Airport, offering a large lawn and banquet setting designed for grand weddings, receptions, and social celebrations.",
    image: "/images/partner-rajmahal.jpg",
  },
  {
    name: "Varmala Resort and Banquet",
    location: "Jagatpura, Jaipur",
    rooms: "75",
    guests: "1,000–1,200",
    description: "A destination-wedding resort combining generous banquet and lawn spaces with guest accommodation, making it well suited to large weddings and multi-day celebrations.",
    image: "/images/partner-samode.jpg",
  },
  {
    name: "Atlantics Luxury Banquet",
    location: "Sitapura, Jaipur",
    rooms: "2",
    guests: "To be confirmed",
    description: "A Jaipur banquet destination included in the Raj Aangan venue network, suited to celebrations and events. Guest capacity should be confirmed directly with the venue.",
    image: "/images/partner-marriott.jpg",
  },
  {
    name: "Chandan Van",
    location: "Sitapura, Jaipur",
    rooms: "2",
    guests: "1,500–4,500",
    description: "A large-format Jaipur event destination with expansive lawns and a substantial indoor hall, designed to accommodate grand weddings and high-guest-count celebrations.",
    image: "/images/partner-rajmahal.jpg",
  },
  {
    name: "JJ Valley Hotel",
    location: "Mansarovar, Jaipur",
    rooms: "26",
    guests: "100–1,500",
    description: "A comfortable Mansarovar wedding hotel with guest accommodation, an expansive outdoor lawn, and an indoor banquet space for weddings and pre-wedding functions.",
    image: "/images/partner-samode.jpg",
  },
  {
    name: "Harika Bagh Hotel & Resort",
    location: "Jagatpura, Jaipur",
    rooms: "51+",
    guests: "500–1,000",
    description: "A luxury wedding resort blending landscaped lawns, spacious banquet halls, guest accommodation, and complete event support for intimate ceremonies and grand celebrations.",
    image: "/images/partner-marriott.jpg",
  },
  {
    name: "The Victoria Palace",
    location: "Mansarovar, Jaipur",
    rooms: "35",
    guests: "200–750",
    description: "A Mansarovar wedding venue combining an air-conditioned banquet hall, outdoor lawn, and guest accommodation for weddings, receptions, and social celebrations.",
    image: "/images/partner-rajmahal.jpg",
  },
  {
    name: "Alankara Hotel & Resorts",
    location: "Dholai, Jaipur",
    rooms: "80",
    guests: "600–1,000",
    description: "A contemporary luxury resort blending European-inspired architecture with lush lawns, a grand banquet hall, poolside spaces, and 80 rooms for destination-style weddings.",
    image: "/images/partner-samode.jpg",
  },
  {
    name: "Maan Palace",
    location: "Jaipur",
    rooms: "70",
    guests: "500–2,000",
    description: "A large Jaipur wedding property featuring a grand lawn, multiple indoor halls, and extensive guest accommodation, suited to both intimate functions and large celebrations.",
    image: "/images/partner-marriott.jpg",
  },
  {
    name: "Anant Mahal",
    location: "Mansarovar, Jaipur",
    rooms: "100",
    guests: "750–1,500",
    description: "A royal-style Jaipur wedding property with expansive lawns, banquet spaces, poolside options, and approximately 100 guest rooms for elegant multi-function celebrations.",
    image: "/images/partner-rajmahal.jpg",
  },
  {
    name: "The Gopal Bagh Resort",
    location: "Mansarovar, Jaipur",
    rooms: "60",
    guests: "200–850",
    description: "A wedding-focused resort designed for elegant celebrations, offering a destination-style setting with guest accommodation and event spaces for intimate and larger gatherings.",
    image: "/images/partner-samode.jpg",
  },
  {
    name: "Hari Van – A Royal Wedding Destination",
    location: "Sanganer, Jaipur",
    rooms: "60",
    guests: "350–1,500",
    description: "A grand royal wedding destination featuring multiple banquet halls, an expansive lawn, guest accommodation, and event facilities for large-scale multi-function celebrations.",
    image: "/images/partner-marriott.jpg",
  },
  {
    name: "Khanaram Paradise",
    location: "Mansarovar, Jaipur",
    rooms: "15",
    guests: "To be confirmed",
    description: "A Jaipur venue included in the Raj Aangan partner network. It offers a dedicated setting for celebrations, with guest capacity to be confirmed directly before publishing.",
    image: "/images/partner-rajmahal.jpg",
  },
  {
    name: "Ganesh Bagh Marriage Hall",
    location: "Mansarovar, Jaipur",
    rooms: "6",
    guests: "250–2,000",
    description: "A large Jaipur marriage venue with an expansive lawn and indoor hall, suited to sizeable weddings, receptions, and social celebrations.",
    image: "/images/partner-samode.jpg",
  },
  {
    name: "Eden Garden & Resorts",
    location: "Mansarovar, Jaipur",
    rooms: "25",
    guests: "250–2,000",
    description: "A versatile Jaipur resort offering a grand lawn, banquet space, poolside setting, and guest accommodation for residential weddings and multi-function celebrations.",
    image: "/images/partner-marriott.jpg",
  },
  {
    name: "Kasturi Bagh – The Luxury Wedding Resort",
    location: "Jagatpura, Jaipur",
    rooms: "50",
    guests: "200–2,000",
    description: "A luxury wedding destination with spacious lawns, a large air-conditioned banquet hall, guest accommodation, and ample space for grand celebrations.",
    image: "/images/partner-rajmahal.jpg",
  },
  {
    name: "Abhaneri",
    location: "Jagatpura, Jaipur",
    rooms: "2",
    guests: "To be confirmed",
    description: "A heritage-oriented wedding venue in Jagatpura offering an intimate setting for celebrations. Guest capacity should be confirmed directly with the venue.",
    image: "/images/partner-samode.jpg",
  },
  {
    name: "FabHotel Prime Viona",
    location: "Mansarovar, Jaipur",
    rooms: "22",
    guests: "To be confirmed",
    description: "A hotel property in Mansarovar offering guest accommodation and standard hospitality facilities. Dedicated wedding capacity should be confirmed with the property.",
    image: "/images/partner-marriott.jpg",
  },
  {
    name: "Royal Crystal Resort",
    location: "Mansarovar, Jaipur",
    rooms: "32",
    guests: "500–1,500",
    description: "A spacious Dholai wedding resort with a large lawn, banquet hall, and 32 guest rooms, suited to grand weddings and destination-style celebrations.",
    image: "/images/partner-rajmahal.jpg",
  },
  {
    name: "Aura Banquet",
    location: "Mansarovar, Jaipur",
    rooms: "4",
    guests: "To be confirmed",
    description: "A dedicated Jaipur banquet venue included in the Raj Aangan partner network, suitable for celebrations and events. Guest capacity should be confirmed before publishing.",
    image: "/images/partner-samode.jpg",
  },
  {
    name: "Crown Heavens",
    location: "Jaisinghpura, Jaipur",
    rooms: "90+",
    guests: "To be confirmed",
    description: "A Jaipur venue included in the Raj Aangan partner network, offering a destination setting for celebrations. Guest capacity should be confirmed directly with the venue.",
    image: "/images/partner-marriott.jpg",
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
          className="mx-auto mb-16 max-w-4xl text-center font-medium text-[clamp(2rem,3.5vw,3.125rem)]"
        >
          Our Partners
        </h1>
      </Reveal>

      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-3">
        {PARTNERS.map((p) => (
          // h-full on both layers so every card in a row shares the row height
          // and the "View Property" pills line up despite uneven descriptions.
          <Reveal key={p.name} className="h-full">
            <PartnerCard {...p} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function PartnerCard({ name, location, rooms, guests, description, image, href = "#" }: Partner) {
  return (
    <div className="flex h-full flex-col">
      <div className={`group relative ${CARD_ASPECT} w-full shrink-0 overflow-hidden`}>
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
        className="mt-6 text-center font-semibold text-[clamp(1.15rem,1.4vw,1.25rem)]"
      >
        {name}
      </h3>
      <p
        style={{ ...serif, color: MUTED_COLOR }}
        className="mt-1 text-center italic text-[clamp(0.9rem,1vw,0.875rem)]"
      >
        {location}
      </p>

      {/* Capacity stats row */}
      <div className="mt-4 flex items-center justify-between gap-3 px-4 text-[clamp(0.9rem,1vw,0.875rem)]">
        <div className="flex items-center gap-2">
          <BedIcon className="h-5 w-5 shrink-0" />
          <span className="whitespace-nowrap">{rooms}</span>
        </div>
        <div className="flex items-center gap-2">
          <PeopleIcon className="h-5 w-5 shrink-0" />
          <span className="whitespace-nowrap">{guests}</span>
        </div>
      </div>

      <p
        style={serif}
        className="mt-4 text-center leading-relaxed text-[clamp(0.85rem,0.95vw,0.875rem)]"
      >
        {description}
      </p>

      {/* mt-auto pins the pill to the bottom of the equal-height card */}
      <div className="mt-auto flex justify-center pt-6">
        <CircleButton
          href={href}
          circleColor="#191919"
          arrowColor="#ffffff"
          circleSize="9.375rem"
          magnet={0.3}
          className="rounded-full border border-[#191919] px-6 py-2.5 text-[#191919] text-[clamp(0.85rem,0.95vw,0.875rem)]"
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
