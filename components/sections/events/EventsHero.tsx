"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import SiteHeader from "@/components/ui/SiteHeader";
import { prefersReducedMotion } from "@/components/anim/anim.config";

gsap.registerPlugin(useGSAP);

const serif = { fontFamily: "var(--font-cormorant-garamond)" } as const;

// ═══════════════════════════════════════════════════════════════════════════
// ─── TUNE THESE KNOBS ──────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════

// ─ Section height ──
const SECTION_HEIGHT = "min-h-[70vh] sm:h-screen"; // responsive height

// ─ Background — replaces the "plain black strip" ──
// Suggestion: use a bokeh/lights or blurred venue photo. Blur + dark overlay
// gives the bg richness without stealing attention from the cards.
const BG_IMAGE     = "/images/events-hero-bg.jpg"; // <-- add your image here
const BG_BLUR      = "blur(6px)";    // set to "none" to disable blur
const BG_SCALE     = 1.08;           // scale slightly so blur edges don't show
const OVERLAY_TOP  = "rgba(15,12,10,0.55)";  // top of overlay (behind nav)
const OVERLAY_BOT  = "rgba(10,8,7,0.88)";    // bottom of overlay (behind cards)

// ─ Card sizing ──
// rem so the cards scale with the fluid root font-size (see globals.css).
// 21.25rem = 340px, 2rem = 32px at the 1440px reference.
const CARD_WIDTH  = "21.25rem";
const CARD_HEIGHT = "21.25rem";
const CARD_GAP    = "2rem"; // between cards

// ─ Card frame (matches the site-wide inner-outline pattern) ──
const FRAME_INSET = "0.75rem";
const FRAME_COLOR = "rgba(255,255,255,0.55)";

// ─ Auto-scroll speed ──
// Seconds for one full loop of the ORIGINAL set. Higher = slower.
// The array is duplicated, so the loop is seamless.
const SCROLL_DURATION = 40;

// ─ Vertical placement of the cards row (as % from top) ──
// Cards sit centred vertically within this band.
const CARDS_TOP    = "38%";
// NO fixed height. The band used to be `48%` of a viewport-height hero while
// the cards inside it are rem-sized — two different scales — which left the
// card LABEL with only ~3px of clearance and clipped it outright whenever the
// two drifted apart (that is why the category titles vanished on zoom). The
// band now sizes to its content, so the label can never be cut off.

// ═══════════════════════════════════════════════════════════════════════════

const CATEGORIES = [
  { label: "Birthday Function",  image: "/images/events-birthday.jpg" },
  { label: "Wedding Function",   image: "/images/events-wedding.jpg" },
  { label: "Conference",         image: "/images/events-conference.jpg" },
  { label: "Baby Shower",        image: "/images/events-babyshower.jpg" },
  { label: "Pre Wedding",        image: "/images/events-prewedding.jpg" },
  { label: "Corporate Event",    image: "/images/events-corporate.jpg" },
  { label: "Anniversary",        image: "/images/events-anniversary.jpg" },
];

export default function EventsHero() {
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const track = trackRef.current;
      if (!track) return;

      // The track holds TWO copies of CATEGORIES. Moving by exactly one copy's
      // worth of width lands the second copy exactly where the first started,
      // so the loop is seamless.
      //
      // MEASURED, not computed: the card width/gap are now rem, so their
      // rendered px size depends on the fluid root font-size (and on the
      // clamp's 30vw term at narrow widths). Deriving the distance from the
      // constants would desync the loop on any viewport where 1rem !== 16px.
      // EAGER, not `x: () => -measure()`. A function-based value is resolved on
      // the tween's first rendered frame; if that lands before layout settles it
      // caches 0 and the marquee animates 0 -> 0 forever. Measuring up front and
      // rebuilding on resize is both correct and zoom-proof.
      //
      // 2N cards in a `gap` row → scrollWidth = 2N*card + (2N-1)*gap, so one
      // copy's advance is N*(card+gap) = (scrollWidth + gap)/2. This used to be
      // a plain scrollWidth/2, which fell exactly one HALF-GAP short and made
      // the loop visibly jump back every cycle.
      const measureAdvance = () => {
        const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
        return (track.scrollWidth + gap) / 2;
      };

      let tween: gsap.core.Tween | null = null;
      const build = () => {
        const advance = measureAdvance();
        if (advance <= 0) return;            // layout not ready yet — RO will refire
        tween?.kill();
        gsap.set(track, { x: 0 });
        tween = gsap.to(track, {
          x: -advance,
          duration: SCROLL_DURATION,
          ease: "none",
          repeat: -1,
        });
      };

      build();

      // Rebuild when the rendered width changes (resize, browser zoom, fonts).
      const ro = new ResizeObserver(build);
      ro.observe(track);
      return () => {
        ro.disconnect();
        tween?.kill();
      };
    },
    { scope: trackRef }
  );

  // Duplicate for seamless loop
  const cards = [...CATEGORIES, ...CATEGORIES];

  return (
    <section className={`relative w-full ${SECTION_HEIGHT} overflow-hidden`}>
      {/* Blurred decorative background */}
      <div className="absolute inset-0">
        <Image
          src={BG_IMAGE}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={{ filter: BG_BLUR, transform: `scale(${BG_SCALE})` }}
        />
      </div>

      {/* Overlay — top-to-bottom gradient so nav area is lighter, cards area is darker */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to bottom, ${OVERLAY_TOP} 0%, ${OVERLAY_BOT} 65%, ${OVERLAY_BOT} 100%)`,
        }}
      />

      {/* Header */}
      <SiteHeader />

      {/* Auto-scrolling cards band */}
      <div
        className="absolute inset-x-0 flex items-center overflow-hidden"
        style={{ top: CARDS_TOP }}
      >
        <div ref={trackRef} className="flex" style={{ gap: CARD_GAP }}>
          {cards.map((c, i) => (
            <CategoryCard key={i} label={c.label} image={c.image} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoryCard({ label, image }: { label: string; image: string }) {
  return (
    <div
      className="group shrink-0 flex flex-col items-center"
      style={{ width: `clamp(12.5rem, 30vw, ${CARD_WIDTH})` }}
    >
      <div
        className="relative overflow-hidden"
        style={{ width: `clamp(12.5rem, 30vw, ${CARD_WIDTH})`, height: `clamp(12.5rem, 30vw, ${CARD_HEIGHT})` }}
      >
        <Image
          src={image}
          alt={label}
          fill
          sizes="340px"
          className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
        />
        {/* Inner outline frame — site-wide pattern */}
        <div
          aria-hidden
          className="pointer-events-none absolute z-10"
          style={{ inset: FRAME_INSET, border: `1px solid ${FRAME_COLOR}` }}
        />
      </div>
      <p
        style={serif}
        className="mt-6 text-white uppercase tracking-[0.25em] text-[clamp(0.85rem,1.05vw,0.9375rem)]"
      >
        {label}
      </p>
    </div>
  );
}
