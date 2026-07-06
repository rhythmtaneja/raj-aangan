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
// SAME PATTERN AS EntertainmentCollage on /events — pinned bg + scrolling
// card strip. Only difference: 10 cards in 7 rows here vs 9 in 6 there.
//
// If you tune values here, also consider matching them in EntertainmentCollage
// so both pinned-scroll sections feel consistent.
//
// ═══════════════════════════════════════════════════════════════════════════

// ─ Background ──
const BG_IMAGE       = "/images/venue-details-bg.jpg"; // wedding venue photo
const OVERLAY_OPACITY = 0.55;

// ─ Card dimensions ──
const CARD_WIDTH_VW  = 22; // slightly narrower than Events (26) since more cards
const CARD_HEIGHT_VH = 45; // slightly shorter — content per card is smaller
const ROW_SPACING_VH = 32;

// ─ Column positions (% across viewport) ──
const COL_LEFT_PCT   = 20;
const COL_CENTER_PCT = 50;
const COL_RIGHT_PCT  = 80;

// ─ Strip motion range ──
const INITIAL_Y_VH             = 80; // first card peeks in from bottom
const FINAL_LAST_CARD_TOP_VH   = 15; // last card sits high before release

// ─ Scrub smoothness ──
const SCRUB: number | boolean = 1;

// ─ Card styling ──
const CARD_BG           = "#ffffff";
const CARD_TEXT         = "#191919";
const CARD_DESC_TEXT    = "#4a4a4a";
const CARD_SHADOW       = "0 20px 50px rgba(0,0,0,0.30)";
const CARD_FRAME_INSET  = "10px";
const CARD_FRAME_BORDER = "1px solid rgba(0,0,0,0.12)";

// ═══════════════════════════════════════════════════════════════════════════
// Derived — 7 rows for 10 cards (1-2-1-2-1-2-1 pattern).
const ROW_COUNT       = 7;
const STRIP_HEIGHT_VH = (ROW_COUNT - 1) * ROW_SPACING_VH + CARD_HEIGHT_VH;
const LAST_ROW_TOP_VH = (ROW_COUNT - 1) * ROW_SPACING_VH;
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
  { title: "Facility",            description: "Air-Cooled Banquet Hall",                                      row: 0, col: "center" },
  { title: "Accomodation",        description: "Dedicated Bridal & Family Accommodation",                      row: 1, col: "left"   },
  { title: "Rooms",               description: "26 Luxury Heritage Rooms",                                     row: 1, col: "right"  },
  { title: "Parking",             description: "Spacious Parking for Approx. 250+ Cars",                       row: 2, col: "center" },
  { title: "Dinning Setup",       description: "Fine Dining Setup Facilities",                                 row: 3, col: "left"   },
  { title: "Welcome",             description: "Two Traditional Rajasthani Darban for Royal Guest Welcome",    row: 3, col: "right"  },
  { title: "Seating Setup",       description: "Bridal Couch & Mandap Seating Setup",                          row: 4, col: "center" },
  { title: "Seating Arrangement", description: "Guest Lounge & Seating Arrangements",                          row: 5, col: "left"   },
  { title: "Service Areas",       description: "Dedicated Vendor & Service Areas",                             row: 5, col: "right"  },
  { title: "Guest Capacity",      description: "Indoor Capacity: Up to 250-300 Guests. Outdoor Capacity: Up to 600-800 Guests", row: 6, col: "center" },
];

function colPct(col: Column): number {
  if (col === "left")  return COL_LEFT_PCT;
  if (col === "right") return COL_RIGHT_PCT;
  return COL_CENTER_PCT;
}

export default function VenueDetailsCollage() {
  const sectionRef = useRef<HTMLElement>(null);
  const stripRef   = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const strip   = stripRef.current;
      if (!section || !strip) return;

      const vh       = window.innerHeight;
      const initialY = vh * (INITIAL_Y_VH / 100);
      const finalY   = vh * ((FINAL_LAST_CARD_TOP_VH - LAST_ROW_TOP_VH) / 100);
      const scroll   = initialY - finalY;

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
    { scope: sectionRef }
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
        style={{ height: `${STRIP_HEIGHT_VH}vh` }}
      >
        {CARDS.map((c, i) => <CardBlock key={i} card={c} />)}
      </div>
    </section>
  );
}

function CardBlock({ card }: { card: Card }) {
  return (
    <div
      className="absolute px-6 py-8 md:px-8 md:py-10"
      style={{
        top:  `${card.row * ROW_SPACING_VH}vh`,
        left: `${colPct(card.col)}%`,
        transform: "translateX(-50%)",
        width:  `${CARD_WIDTH_VW}vw`,
        height: `${CARD_HEIGHT_VH}vh`,
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
          className="font-semibold leading-tight text-[clamp(1.15rem,1.5vw,28px)]"
        >
          {card.title}
        </h3>
        <p
          style={{ ...serif, color: CARD_DESC_TEXT }}
          className="mt-5 leading-snug text-[clamp(0.8rem,0.9vw,15px)]"
        >
          {card.description}
        </p>
      </div>
    </div>
  );
}
