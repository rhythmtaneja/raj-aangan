"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { prefersReducedMotion } from "@/components/anim/anim.config";
import useIsPhone from "@/components/anim/useIsPhone";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const serif = { fontFamily: "var(--font-cormorant-garamond)" } as const;

// ═══════════════════════════════════════════════════════════════════════════
// ─── TUNE THESE KNOBS ──────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════
//
// SAME PATTERN AS EntertainmentCollage on /events — pinned bg + scrolling
// card strip. Only difference: 10 cards in 7 rows here vs 9 in 6 there.
//
// If you tune values here, also consider matching them in EntertainmentCollage
// so both pinned-scroll sections feel consistent.
//
// ═══════════════════════════════════════════════════════════════════════════

// ─ Background ──
const BG_IMAGE = "/images/venue-details-bg.jpg"; // wedding venue photo
const OVERLAY_OPACITY = 0.55;

// ─ Card dimensions — DESKTOP ──
const CARD_WIDTH_VW = 22; // slightly narrower than Events (26) since more cards
const CARD_HEIGHT_VH = 45; // slightly shorter — content per card is smaller
const ROW_SPACING_VH = 32;

// ─ Card dimensions — PHONE ────────────────────────────────────────────────
// 22vw is 86px on a 390px screen: "Accomodation" alone overflowed the card and
// every description broke to one word per line (phone-changes/cards-length1).
// Phones drop the 3-column stagger entirely and show ONE centred column, so a
// card can take most of the screen width and you meet them one at a time as
// the strip scrolls. The pinned-scroll mechanic itself is unchanged.
const CARD_WIDTH_VW_PHONE = 78;
const CARD_HEIGHT_VH_PHONE = 46;
// With one column there is no stagger to keep neighbours apart, so the spacing
// must clear a full card plus a gap or consecutive cards would overlap.
const CARD_GAP_VH_PHONE = 10;
const ROW_SPACING_VH_PHONE = CARD_HEIGHT_VH_PHONE + CARD_GAP_VH_PHONE;

// ─ Column positions (% across viewport) ──
const COL_LEFT_PCT = 20;
const COL_CENTER_PCT = 50;
const COL_RIGHT_PCT = 80;

// ─ Strip motion range ──
const INITIAL_Y_VH = 80; // first card peeks in from bottom
const FINAL_LAST_CARD_TOP_VH = 15; // last card sits high before release

// ─ Scrub smoothness ──
const SCRUB: number | boolean = 1;

// ─ Card styling ──
const CARD_BG = "#ffffff";
const CARD_TEXT = "#000000ff";
const CARD_DESC_TEXT = "#000000ff";
const CARD_SHADOW = "0 20px 50px rgba(0,0,0,0.30)";
const CARD_FRAME_INSET = "0.625rem";
const CARD_FRAME_BORDER = "1px solid rgba(0, 0, 0, 0.47)";

// ═══════════════════════════════════════════════════════════════════════════

type Column = "left" | "center" | "right";
type Card = { title: string; description: string; row: number; col: Column };

// Layout:
//   Row 0: [_______C_______]  Facility
//   Row 1: [L_____________R]  Accommodation / Rooms
//   Row 2: [_______C_______]  Parking
//   Row 3: [L_____________R]  Dinning Setup / Welcome
//   Row 4: [_______C_______]  Seating Setup
//   Row 5: [L_____________R]  Seating Arrangement / Service Areas
//   Row 6: [_______C_______]  Guest Capacity
// = 1+2+1+2+1+2+1 = 10 cards.
const CARDS: Card[] = [
  { title: "Facility", description: "Air-Cooled Banquet Hall", row: 0, col: "center" },
  { title: "Accomodation", description: "Dedicated Bridal & Family Accommodation", row: 1, col: "left" },
  { title: "Rooms", description: "26 Luxury Heritage Rooms", row: 1, col: "right" },
  { title: "Parking", description: "Spacious Parking for Approx. 250+ Cars", row: 2, col: "center" },
  { title: "Dinning Setup", description: "Fine Dining Setup Facilities", row: 3, col: "left" },
  { title: "Welcome", description: "Two Traditional Rajasthani Darban for Royal Guest Welcome", row: 3, col: "right" },
  { title: "Seating Setup", description: "Bridal Couch & Mandap Seating Setup", row: 4, col: "center" },
  { title: "Seating Arrangement", description: "Guest Lounge & Seating Arrangements", row: 5, col: "left" },
  { title: "Service Areas", description: "Dedicated Vendor & Service Areas", row: 5, col: "right" },
  { title: "Guest Capacity", description: "Indoor Capacity: Up to 250-300 Guests. Outdoor Capacity: Up to 600-800 Guests", row: 6, col: "center" },
];

function colPct(col: Column): number {
  if (col === "left") return COL_LEFT_PCT;
  if (col === "right") return COL_RIGHT_PCT;
  return COL_CENTER_PCT;
}

/**
 * Everything the strip needs, resolved for one breakpoint.
 *
 * The card coordinates are COMPUTED (inline `top` / `left` / `width` in vw and
 * vh), so there is no class or media query that can reach them — this is one
 * of the few places on the site where the phone/desktop split genuinely has to
 * happen in JS. See components/anim/useIsPhone.ts.
 *
 * Phone collapses the 3-column stagger to a single centred column and gives
 * each card its own row, so `row`/`col` from the data are ignored and the
 * array index becomes the row instead.
 *
 * `rowCount` is DERIVED from the data rather than hardcoded. It used to be a
 * literal, which silently over-counted the rows in EntertainmentCollage (7
 * declared, 6 actual) and bought that section a blank viewport of scrolling
 * after its last card.
 */
type StripLayout = {
  widthVw: number;
  heightVh: number;
  spacingVh: number;
  stripHeightVh: number;
  lastRowTopVh: number;
  rowOf: (card: Card, index: number) => number;
  leftPctOf: (card: Card) => number;
};

function stripLayout(cards: Card[], isPhone: boolean): StripLayout {
  const widthVw = isPhone ? CARD_WIDTH_VW_PHONE : CARD_WIDTH_VW;
  const heightVh = isPhone ? CARD_HEIGHT_VH_PHONE : CARD_HEIGHT_VH;
  const spacingVh = isPhone ? ROW_SPACING_VH_PHONE : ROW_SPACING_VH;

  const rowOf = (card: Card, index: number) => (isPhone ? index : card.row);
  const leftPctOf = (card: Card) => (isPhone ? COL_CENTER_PCT : colPct(card.col));

  const rowCount = cards.reduce((max, c, i) => Math.max(max, rowOf(c, i)), 0) + 1;
  const lastRowTopVh = (rowCount - 1) * spacingVh;

  return {
    widthVw,
    heightVh,
    spacingVh,
    stripHeightVh: lastRowTopVh + heightVh,
    lastRowTopVh,
    rowOf,
    leftPctOf,
  };
}

export default function VenueDetailsCollage() {
  const sectionRef = useRef<HTMLElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const isPhone = useIsPhone();
  const layout = stripLayout(CARDS, isPhone);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const strip = stripRef.current;
      if (!section || !strip) return;

      const vh = window.innerHeight;
      const initialY = vh * (INITIAL_Y_VH / 100);
      const finalY = vh * ((FINAL_LAST_CARD_TOP_VH - layout.lastRowTopVh) / 100);
      const scroll = initialY - finalY;

      if (prefersReducedMotion()) {
        gsap.set(strip, { y: (initialY + finalY) / 2 });
        return;
      }

      gsap.set(strip, { y: initialY });

      gsap.to(strip, {
        y: finalY,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: `+=${scroll}`,
          pin: true,
          scrub: SCRUB,
          invalidateOnRefresh: true,
        },
      });
    },
    // `revertOnUpdate` is REQUIRED, not tidiness: without it, crossing the
    // breakpoint would re-run this and leave the previous pinned ScrollTrigger
    // alive, so the section would be pinned twice with two strips fighting.
    { scope: sectionRef, dependencies: [layout.lastRowTopVh], revertOnUpdate: true }
  );

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{ height: "100vh" }}
    >
      <div className="absolute inset-0">
        <Image src={BG_IMAGE} alt="" fill sizes="100vw" className="object-cover" priority />
      </div>

      <div
        aria-hidden
        className="absolute inset-0"
        style={{ backgroundColor: `rgba(0,0,0,${OVERLAY_OPACITY})` }}
      />

      <div
        ref={stripRef}
        className="absolute inset-x-0 top-0 will-change-transform"
        style={{ height: `${layout.stripHeightVh}vh` }}
      >
        {CARDS.map((c, i) => (
          <CardBlock key={i} card={c} index={i} layout={layout} />
        ))}
      </div>
    </section>
  );
}

function CardBlock({
  card,
  index,
  layout,
}: {
  card: Card;
  index: number;
  layout: StripLayout;
}) {
  return (
    <div
      className="absolute px-6 py-8 md:px-8 md:py-10"
      style={{
        top: `${layout.rowOf(card, index) * layout.spacingVh}vh`,
        left: `${layout.leftPctOf(card)}%`,
        transform: "translateX(-50%)",
        width: `${layout.widthVw}vw`,
        height: `${layout.heightVh}vh`,
        backgroundColor: CARD_BG,
        boxShadow: CARD_SHADOW,
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute"
        style={{ inset: CARD_FRAME_INSET, border: CARD_FRAME_BORDER }}
      />
      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center">
        <h3
          style={{ ...serif, color: CARD_TEXT }}
          className="font-bold leading-tight text-[clamp(1.15rem,1.5vw,1.375rem)]"
        >
          {card.title}
        </h3>
        <p
          style={{ ...serif, color: CARD_DESC_TEXT }}
          className="mt-5 leading-snug text-[clamp(0.8rem,0.9vw,0.8125rem)]"
        >
          {card.description}
        </p>
      </div>
    </div>
  );
}
