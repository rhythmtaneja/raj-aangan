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
// PATTERN (matches resortkaskady.com/eventy/for-companies):
//
//   • Section pins to the viewport when its top hits the top of the screen.
//   • The background image STAYS PUT while the user keeps scrolling.
//   • A tall STRIP of cards translates UPWARD through the pinned viewport.
//   • Cards do NOT fade in — they are ALREADY in the strip at rest opacity.
//     They just scroll into view naturally (in from bottom → out from top).
//   • When the LAST card reaches the top area of the viewport, the section
//     unpins and the next section (Footer) takes over.
//
// This replaces the previous fade-in-collage model, which caused:
//   - cards taking a moment to appear
//   - cards being animated (unwanted opacity/y fades)
//   - cards visible under the footer at the pin release boundary
//
// ═══════════════════════════════════════════════════════════════════════════

// ─ Background ──────────────────────────────────────────────────────────────
const BG_IMAGE = "/images/events-entertainment-bg.jpg";

// ─ Static dark overlay (no scrubbing — fixed opacity) ──────────────────────
// Raise for a darker bg (better card legibility), lower to let bg breathe.
const OVERLAY_OPACITY = 0.55;

// ─ Card dimensions — DESKTOP ──
const CARD_WIDTH_VW = 22; // slightly narrower than Events (26) since more cards
const CARD_HEIGHT_VH = 45; // slightly shorter — content per card is smaller
const ROW_SPACING_VH = 32;

// ─ Card dimensions — PHONE ────────────────────────────────────────────────
// 22vw is 86px on a 390px screen, which broke "Rajasthani Folk Artists" out of
// its own card and set every description one word per line
// (phone-changes/cards-length2). Phones drop the 3-column stagger and show ONE
// centred column, meeting the cards one at a time as the strip scrolls. Kept
// identical to VenueDetailsCollage — the two pinned sections are meant to feel
// like the same component.
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

// Card layout — 6 rows, 9 cards in an alternating staggered pattern:
//   Row 0: [_______C_______]   1 card (center)
//   Row 1: [L_____________R]   2 cards (left + right)
//   Row 2: [_______C_______]
//   Row 3: [L_____________R]
//   Row 4: [_______C_______]
//   Row 5: [L_____________R]
// = 1 + 2 + 1 + 2 + 1 + 2 = 9 cards.
const CARDS: Card[] = [
  { title: "DJ & Sound", description: "Bringing every celebration to life with music and energy.", row: 0, col: "center" },
  { title: "Live Singers & Bands", description: "Captivating live performances that add charm, energy, and elegance to every celebration.", row: 1, col: "left" },
  { title: "Rajasthani Folk Artists", description: "Authentic folk performances celebrating Rajasthan's rich heritage.", row: 1, col: "right" },
  { title: "Dhol & Shehnai", description: "Traditional melodies and festive beats for grand celebrations.", row: 2, col: "center" },
  { title: "Welcome Performers", description: "Creating memorable first impressions with graceful and vibrant welcomes.", row: 3, col: "left" },
  { title: "Baraat Band", description: "Energetic music and festive beats for a grand wedding procession.", row: 3, col: "right" },
  { title: "Cultural Dance", description: "Graceful performances that celebrate tradition and culture.", row: 4, col: "center" },
  { title: "Celebrity Artist", description: "Star-studded performances that make every celebration extraordinary.", row: 5, col: "left" },
  { title: "Anchors & Emcees", description: "Engaging hosts who keep every celebration lively and seamless.", row: 5, col: "right" },
];

function colPct(col: Column): number {
  if (col === "left") return COL_LEFT_PCT;
  if (col === "right") return COL_RIGHT_PCT;
  return COL_CENTER_PCT;
}

/**
 * Everything the strip needs, resolved for one breakpoint. Mirror of the same
 * helper in VenueDetailsCollage — keep the two in step.
 *
 * The card coordinates are COMPUTED (inline `top` / `left` / `width` in vw and
 * vh), so no class or media query can reach them; this is one of the few
 * places on the site where the phone/desktop split has to happen in JS. See
 * components/anim/useIsPhone.ts.
 *
 * Phone gives each card its own row in a single centred column, so `row`/`col`
 * from the data are ignored and the array index becomes the row.
 *
 * `rowCount` is DERIVED from the data rather than hardcoded. The literal it
 * replaces said 7 while these cards only occupy 6 rows, which bought this
 * section a blank viewport of pinned scrolling after its last card.
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

export default function EntertainmentCollage() {
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

      // Initial strip position: first card peeks in from bottom.
      const initialY = vh * (INITIAL_Y_VH / 100);

      // Final strip position: last card's top lands at FINAL_LAST_CARD_TOP_VH.
      //   lastCardTop = strip.y + lastRowTopVh * (vh/100)
      //   => strip.y   = (FINAL_LAST_CARD_TOP_VH - lastRowTopVh) * (vh/100)
      const finalY = vh * ((FINAL_LAST_CARD_TOP_VH - layout.lastRowTopVh) / 100);

      // How much scroll distance the pin will consume.
      const scrollDistance = initialY - finalY;

      if (prefersReducedMotion()) {
        // With reduced motion, park the strip mid-range so all cards are
        // reachable without an animation.
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
          end: `+=${scrollDistance}`,
          pin: true,
          scrub: SCRUB,
          invalidateOnRefresh: true,
          // markers: true,  // ← uncomment to debug in dev
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
      {/* Static background — NEVER moves */}
      <div className="absolute inset-0">
        <Image
          src={BG_IMAGE}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
      </div>

      {/* Static dark overlay */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ backgroundColor: `rgba(0,0,0,${OVERLAY_OPACITY})` }}
      />

      {/* Cards STRIP — translates upward during the pinned scroll */}
      <div
        ref={stripRef}
        className="absolute inset-x-0 top-0 will-change-transform"
        style={{ height: `${layout.stripHeightVh}vh` }}
      >
        {CARDS.map((card, i) => (
          <CardBlock key={i} card={card} index={i} layout={layout} />
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
      className="absolute px-6 py-9 md:px-10 md:py-14"
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

      {/* Subtle inner frame — dark against the cream card bg */}
      <div
        aria-hidden
        className="pointer-events-none absolute"
        style={{ inset: CARD_FRAME_INSET, border: CARD_FRAME_BORDER }}
      />

      {/* Content — vertically centered */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center">
        <h3
          style={{ ...serif, color: CARD_TEXT }}
          className="font-bold leading-tight text-[clamp(1.3rem,1.7vw,1.5rem)]"
        >
          {card.title}
        </h3>
        <p
          style={{ ...serif, color: CARD_DESC_TEXT }}
          className="mt-6 leading-relaxed text-[clamp(0.9rem,1vw,0.875rem)]"
        >
          {card.description}
        </p>
      </div>
    </div>
  );
}
