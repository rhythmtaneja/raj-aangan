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
const TITLE_FONT_SIZE = "clamp(1.8rem, 4vw, 72px)";
const TITLE_TRACKING = "0.15em";
const TITLE_COLOR = "#6b4f3a";
const TITLE_MARGIN_BOTTOM = "4rem";

// ─ Auto-scrolling cards ──
// Fixed px sizes so the seamless loop math works — same approach as EventsHero.
// If you want responsive card widths later, we'd need to measure the track in
// a ResizeObserver and update the tween. Keeping this simple for now.
const CARD_WIDTH = 440;   // px
const CARD_HEIGHT = 440;  // px (square)
const CARD_GAP = 24;      // px between cards

// Seconds for one full loop of the ORIGINAL set. Higher = slower drift.
// EventsHero uses 40 for 7 cards; Cuisine has 6, so 34 keeps a similar pace.
const SCROLL_DURATION = 34;

// ─ Card frame (matches the site-wide inner-outline pattern) ──
const FRAME_INSET = "20px";
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
      const originalWidth = CUISINES.length * (CARD_WIDTH + CARD_GAP);

      gsap.set(track, { x: 0 });
      scrollAnim.current = gsap.to(track, {
        x: -originalWidth,
        duration: SCROLL_DURATION,
        ease: "none",
        repeat: -1,
      });
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
          style={{ gap: `${CARD_GAP}px`, willChange: "transform" }}
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
            circleSize={150}
            magnet={0.4}
            className="rounded-full border border-[#191919] px-10 py-4 font-medium text-[#191919] text-[clamp(1rem,1.04vw,20px)]"
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
        sizes="440px"
        className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-black/15" />
      {/* Inner outline frame — site-wide pattern, z-10 to stay above scaled image */}
      <div
        aria-hidden
        className="pointer-events-none absolute z-10"
        style={{ inset: FRAME_INSET, border: `1px solid ${FRAME_COLOR}` }}
      />
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center text-white">
        <h3
          style={serif}
          className="font-semibold uppercase tracking-[0.15em] text-[clamp(1.5rem,2.6vw,50px)] [text-shadow:0_1px_8px_rgba(0,0,0,0.45)]"
        >
          {name}
        </h3>
        <p
          style={serif}
          className="mt-3 text-[clamp(0.9rem,1.15vw,22px)] [text-shadow:0_1px_8px_rgba(0,0,0,0.45)]"
        >
          {price}
        </p>
      </div>
    </div>
  );
}
