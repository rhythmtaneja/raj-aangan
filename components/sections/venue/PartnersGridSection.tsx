"use client";

import Image from "next/image";
import Reveal from "@/components/anim/Reveal";
import { PARTNERS, type Partner } from "@/lib/venue-partners";
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


/* Re-exported so the pre-existing import path keeps working. The data itself
   now lives in lib/venue-partners.ts — see that file for why. */
export { PARTNERS };
export type { Partner };

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
