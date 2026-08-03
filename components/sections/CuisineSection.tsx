// ══════════════════════════════════════════════════════════════════
// PATH IN REPO: components/sections/CuisineSection.tsx
// ══════════════════════════════════════════════════════════════════

// CHANGES vs previous version:
//   • DragSlider swapped for the same auto-scroll pattern used in
//     EventsHero: fixed-px card widths, array duplicated, single
//     gsap.to({ x: -originalWidth, repeat: -1, ease: "none" }) tween.
//   • Pause-on-hover added so the hover-zoom doesn't feel weird
//     with the card drifting underneath the cursor.
//   • Marquee "Cuisine" text that DragSlider owned is dropped. If you
//     want it back as a static/animated background text, easy add.
// ══════════════════════════════════════════════════════════════════

"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Reveal from "@/components/anim/Reveal";
import CircleButton from "@/components/anim/CircleButton";
import { prefersReducedMotion } from "@/components/anim/anim.config";
import ImageOverlay from "@/components/ui/ImageOverlay";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const serif = { fontFamily: "var(--font-cormorant-garamond)" } as const;

// ═══════════════════════════════════════════════════════════════════════════
// ─── TUNE THESE KNOBS ──────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════

// ─ Background color SCROLL transition (continues from ServicesSection) ──
const BG_START_COLOR = "#d4dad3"; // = ServicesSection's BG_END_COLOR
const BG_END_COLOR = "#ebe5db";
const COLOR_TRANSITION_START = "top bottom";
const COLOR_TRANSITION_END = "top top";

// ─ Heading "Our Cuisine" ──
const TITLE_FONT_SIZE = "clamp(1.8rem, 4vw, 3.625rem)";
const TITLE_TRACKING = "0.15em";
const TITLE_COLOR = "#6b4f3a";
const TITLE_MARGIN_BOTTOM = "2.75rem";

// ─ Auto-scrolling cards ──
// rem, NOT px: the whole desktop layout scales off the root font-size (see
// globals.css), so a px card would stay 440px while everything around it
// shrank — the card would balloon from 30% to 57% of the viewport across the
// browser-zoom range. The loop distance is measured from the live DOM below
// and re-measured on resize, so rem sizing costs nothing.
const CARD_WIDTH = "27.5rem";   // 440px at the 1440px reference
const CARD_HEIGHT = "27.5rem";  // square
const CARD_GAP = "1.5rem";      // 24px at the 1440px reference

// Seconds for one full loop of the ORIGINAL set. Higher = slower drift.
// EventsHero uses 40 for 7 cards; Cuisine has 6, so 34 keeps a similar pace.
const SCROLL_DURATION = 34;

// ─ Card frame (matches the site-wide inner-outline pattern) ──
const FRAME_INSET = "1.25rem";
const FRAME_COLOR = "rgba(255,255,255,0.7)";

// ═══════════════════════════════════════════════════════════════════════════

const CUISINES = [
  { name: "Rajasthani", img: "/images/cuisine-rajasthani.jpg", price: "from ₹3499 / person" },
  { name: "Punjabi", img: "/images/cuisine-punjabi.jpg", price: "from ₹3499 / person" },
  { name: "Dessert", img: "/images/cuisine-dessert.jpg", price: "from ₹3499 / person" },
  { name: "South Indian", img: "/images/cuisine-south-indian.jpg", price: "from ₹3499 / person" },
  { name: "Chinese", img: "/images/cuisine-chinese.jpg", price: "from ₹3499 / person" },
  // { name: "Italian",      img: "/images/cuisine-italian.jpg",       price: "from ₹3499 / person" },
];

export default function CuisineSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const scrollAnim = useRef<gsap.core.Tween | null>(null);

  useGSAP(
    () => {
      // BG scrub — unchanged from before.
      const colorProxy = { c: BG_START_COLOR };
      gsap.to(colorProxy, {
        c: BG_END_COLOR,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: COLOR_TRANSITION_START,
          end: COLOR_TRANSITION_END,
          scrub: true,
        },
        onUpdate: () => {
          document.documentElement.style.setProperty("--page-bg", colorProxy.c);
        },
      });

      if (prefersReducedMotion()) return;

      const track = trackRef.current;
      if (!track) return;

      // The track holds TWO copies of CUISINES. Moving by exactly one copy's
      // width lands the second copy where the first started — seamless loop.
      //
      // The distance MUST be measured, not computed from a constant: the cards
      // are rem-sized, so their pixel width changes with the root font-size
      // (i.e. with viewport width and browser zoom). A stale constant would
      // make the loop visibly jump.
      //   2 copies laid out with `gap` → scrollWidth = 2N*card + (2N-1)*gap
      //   one copy's advance          = N*card + N*gap = (scrollWidth + gap)/2
      const measureAdvance = () => {
        const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
        return (track.scrollWidth + gap) / 2;
      };

      const build = () => {
        scrollAnim.current?.kill();
        gsap.set(track, { x: 0 });
        scrollAnim.current = gsap.to(track, {
          x: -measureAdvance(),
          duration: SCROLL_DURATION,
          ease: "none",
          repeat: -1,
        });
      };

      build();

      // Re-measure when the root font-size changes under it (window resize,
      // browser zoom, device rotation).
      const ro = new ResizeObserver(build);
      ro.observe(track);
      return () => {
        ro.disconnect();
        scrollAnim.current?.kill();
      };
    },
    { scope: sectionRef }
  );

  // Pause the drift while the cursor is over the strip so hover-zoom
  // reads cleanly. Resumes when cursor leaves.
  const handleStripEnter = () => {
    scrollAnim.current?.pause();
  };
  const handleStripLeave = () => {
    scrollAnim.current?.resume();
  };

  // Duplicate for seamless loop
  const cards = [...CUISINES, ...CUISINES];

  return (
    <section
      ref={sectionRef}
      className="flex min-h-screen w-full flex-col items-center py-24"
      style={{ backgroundColor: `var(--page-bg, ${BG_END_COLOR})` }}
    >
      <Reveal>
        <h2
          className="px-6 font-semibold uppercase text-center"
          style={{
            ...serif,
            fontSize: TITLE_FONT_SIZE,
            letterSpacing: TITLE_TRACKING,
            color: TITLE_COLOR,
            marginBottom: TITLE_MARGIN_BOTTOM,
          }}
        >
          Our Cuisine
        </h2>
      </Reveal>

      {/* Auto-scrolling cards strip */}
      <div
        className="w-full overflow-hidden py-4"
        onMouseEnter={handleStripEnter}
        onMouseLeave={handleStripLeave}
      >
        <div
          ref={trackRef}
          className="flex"
          style={{ gap: CARD_GAP, willChange: "transform" }}
        >
          {cards.map((c, i) => (
            <CuisineCard key={`${c.name}-${i}`} name={c.name} img={c.img} price={c.price} />
          ))}
        </div>
      </div>

      <Reveal>
        <div className="mt-12">
          <CircleButton
            href="#"
            circleColor="#191919"
            arrowColor="#ffffff"
            circleSize="9.375rem"
            magnet={0.4}
            className="rounded-full border border-[#191919] px-10 py-4 font-medium text-[#191919] text-[clamp(1rem,1.04vw,0.9375rem)]"
          >
            Create Booking
          </CircleButton>
        </div>
      </Reveal>
    </section>
  );
}

function CuisineCard({ name, img, price }: { name: string; img: string; price: string }) {
  return (
    <div
      className="group relative shrink-0 overflow-hidden"
      style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
    >
      <Image
        src={img}
        alt={`${name} cuisine`}
        fill
        draggable={false}
        sizes="(max-width: 767px) 60vw, 31vw"
        className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
      />
      <ImageOverlay opacity={0.44} />
      {/* Inner outline frame — site-wide pattern, z-10 to stay above scaled image */}
      <div
        aria-hidden
        className="pointer-events-none absolute z-10"
        style={{ inset: FRAME_INSET, border: `1px solid ${FRAME_COLOR}` }}
      />
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center text-white">
        <h3
          style={serif}
          className="font-semibold uppercase tracking-[0.15em] text-[clamp(1.5rem,2.6vw,2.3125rem)] [text-shadow:0_1px_8px_rgba(0,0,0,0.45)]"
        >
          {name}
        </h3>
        <p
          style={serif}
          className="mt-3 text-[clamp(0.9rem,1.15vw,1.0625rem)] [text-shadow:0_1px_8px_rgba(0,0,0,0.45)]"
        >
          {price}
        </p>
      </div>
    </div>
  );
}
