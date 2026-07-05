"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { prefersReducedMotion } from "@/components/anim/anim.config";

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

// ─ Card dimensions (viewport-relative so they scale on any screen) ─────────
// Reference cards are tall portrait rectangles ~4:7 ratio.
const CARD_WIDTH_VW = 26;  // ↑ = wider cards
const CARD_HEIGHT_VH = 65;  // ↑ = taller cards

// ─ Vertical spacing between adjacent card rows ─────────────────────────────
// Cards intentionally OVERLAP vertically (CARD_HEIGHT_VH > ROW_SPACING_VH).
// Safe because adjacent rows use different columns.
// ↓ = tighter stack (shorter pin); ↑ = more air (longer pin)
const ROW_SPACING_VH = 45;

// ─ Column centre positions (% across viewport) ─────────────────────────────
// Cards are horizontally centred on these anchors via translateX(-50%).
const COL_LEFT_PCT = 22;
const COL_CENTER_PCT = 50;
const COL_RIGHT_PCT = 78;

// ─ Strip motion range ──────────────────────────────────────────────────────
// INITIAL_Y_VH: strip's top position when pin starts (in vh from viewport top)
//   80 = first card peeks in from bottom (only ~20% visible initially)
//   Lower → cards further off-screen at start (more anticipation)
//   Higher → cards more visible at start (less anticipation)
const INITIAL_Y_VH = 80;

// FINAL_LAST_CARD_TOP_VH: where the LAST card's top lands at pin end
//   15 = last card ends near top of viewport (nice reading position)
//   Lower → longer pin, last card ends higher up
//   Higher → shorter pin, last card ends lower down (release sooner)
const FINAL_LAST_CARD_TOP_VH = 15;

// ─ Scrub smoothness ────────────────────────────────────────────────────────
// number = seconds of smoothing (1 feels premium; 0.3 tighter; 2 loose)
// true   = instant follow (no smoothing)
const SCRUB: number | boolean = 1;

// ─ Card styling ────────────────────────────────────────────────────────────
const CARD_BG = "#f5efe6";  // cream (matches blog/contact cards)
const CARD_TEXT = "#191919";
const CARD_DESC_TEXT = "#4a4a4a";
const CARD_SHADOW = "0 20px 50px rgba(0,0,0,0.35)";

// Subtle inner outline frame — dark since cards are cream (not on photos)
const CARD_FRAME_INSET = "12px";
const CARD_FRAME_BORDER = "1px solid rgba(0,0,0,0.15)";

// ═══════════════════════════════════════════════════════════════════════════
// Derived — leave alone; tune the knobs above.
const ROW_COUNT = 6;
const STRIP_HEIGHT_VH = (ROW_COUNT - 1) * ROW_SPACING_VH + CARD_HEIGHT_VH;
const LAST_ROW_TOP_VH = (ROW_COUNT - 1) * ROW_SPACING_VH;
// ═══════════════════════════════════════════════════════════════════════════

type Column = "left" | "center" | "right";
type Card = {
  title: string;
  description: string;
  row: number;   // 0..5
  col: Column;
};

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

export default function EntertainmentCollage() {
  const sectionRef = useRef<HTMLElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const strip = stripRef.current;
      if (!section || !strip) return;

      const vh = window.innerHeight;

      // Initial strip position: first card peeks in from bottom.
      const initialY = vh * (INITIAL_Y_VH / 100);

      // Final strip position: last card's top lands at FINAL_LAST_CARD_TOP_VH.
      //   lastCardTop = strip.y + LAST_ROW_TOP_VH * (vh/100)
      //   => strip.y   = (FINAL_LAST_CARD_TOP_VH - LAST_ROW_TOP_VH) * (vh/100)
      const finalY = vh * ((FINAL_LAST_CARD_TOP_VH - LAST_ROW_TOP_VH) / 100);

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
    { scope: sectionRef }
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
        style={{ height: `${STRIP_HEIGHT_VH}vh` }}
      >
        {CARDS.map((card, i) => (
          <CardBlock key={i} card={card} />
        ))}
      </div>
    </section>
  );
}

function CardBlock({ card }: { card: Card }) {
  return (
    <div
      className="absolute px-8 py-12 md:px-10 md:py-14"
      style={{
        top: `${card.row * ROW_SPACING_VH}vh`,
        left: `${colPct(card.col)}%`,
        transform: "translateX(-50%)",
        width: `${CARD_WIDTH_VW}vw`,
        height: `${CARD_HEIGHT_VH}vh`,
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
          className="font-semibold leading-tight text-[clamp(1.3rem,1.7vw,32px)]"
        >
          {card.title}
        </h3>
        <p
          style={{ ...serif, color: CARD_DESC_TEXT }}
          className="mt-6 leading-relaxed text-[clamp(0.9rem,1vw,17px)]"
        >
          {card.description}
        </p>
      </div>
    </div>
  );
}