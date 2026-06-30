"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Reveal from "@/components/anim/Reveal";
import DragSlider from "@/components/anim/DragSlider";
import CircleButton from "@/components/anim/CircleButton";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const serif = { fontFamily: "var(--font-cormorant-garamond)" } as const;

// ═══════════════════════════════════════════════════════════════════════════
// ─── TUNE THESE KNOBS ──────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════

// ─ Background color SCROLL transition (continues from ServicesSection) ──
// Services ends at "#d4dad3" (sage) → Cuisine eases to its own beige.
// Both sections read the same --page-bg variable → no visible seam.
const BG_START_COLOR = "#d4dad3"; // = ServicesSection's BG_END_COLOR
const BG_END_COLOR   = "#ebe5db"; // Cuisine's resting beige

const COLOR_TRANSITION_START = "top bottom";
const COLOR_TRANSITION_END   = "top top";

// ─ Heading "Our Cuisine" ──
// ↑ FONT_SIZE bigger  → bigger title (reference "Stay packages" is ~140px)
// ↑ TRACKING bigger   → letters spread wider
// Change the className further down to swap uppercase ↔ titlecase.
const TITLE_FONT_SIZE     = "clamp(2.5rem, 7vw, 140px)";
const TITLE_TRACKING      = "0.15em";
const TITLE_COLOR         = "#6b4f3a";
const TITLE_MARGIN_BOTTOM = "4rem";

// ─ Slider horizontal padding (shift cards right/left) ──
// The slider's first card sits flush against this left padding. Bump it up
// to push the cards visually rightward (matches reference "Stay packages").
// Both default to a small inset — tweak just the LEFT to nudge cards right.
// Examples:
//   "pl-6 pr-6"            → minimal inset (24px each side)
//   "pl-[8vw] pr-6"        → cards start ~8% of viewport in (recommended)
//   "pl-[12vw] pr-[4vw]"   → even further right, less right-edge breathing room
const SLIDER_PADDING_CLASS = "pl-[8vw] pr-6";

// ─ Card gap (between cards) ──
const CARD_GAP = "1.5rem";

// ═══════════════════════════════════════════════════════════════════════════

const CUISINES = [
  { name: "Rajasthani",   img: "/images/cuisine-rajasthani.jpg",   price: "from ₹3499 / person" },
  { name: "Punjabi",      img: "/images/cuisine-punjabi.jpg",      price: "from ₹3499 / person" },
  { name: "Dessert",      img: "/images/cuisine-dessert.jpg",      price: "from ₹3499 / person" },
  { name: "South Indian", img: "/images/cuisine-south-indian.jpg", price: "from ₹3499 / person" },
  { name: "Chinese",      img: "/images/cuisine-chinese.jpg",      price: "from ₹3499 / person" },
  { name: "Italian",      img: "/images/cuisine-italian.jpg",      price: "from ₹3499 / person" },
];

export default function CuisineSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // BG color scrub — same pattern as Featured → Services.
      const colorProxy = { c: BG_START_COLOR };

      gsap.to(colorProxy, {
        c: BG_END_COLOR,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: COLOR_TRANSITION_START,
          end:   COLOR_TRANSITION_END,
          scrub: true,
        },
        onUpdate: () => {
          document.documentElement.style.setProperty("--page-bg", colorProxy.c);
        },
      });
    },
    { scope: sectionRef }
  );

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

      {/*
        Drag-to-scroll slider. "Cuisine" runs behind the cards as a marquee.
        Shift cards right by editing SLIDER_PADDING_CLASS above.
      */}
      <DragSlider
        marqueeWord="Cuisine"
        marqueeClassName="text-white opacity-30"
        gap={CARD_GAP}
        className={`w-full ${SLIDER_PADDING_CLASS} py-4`}
      >
        {CUISINES.map((c) => (
          <div
            key={c.name}
            className="group relative aspect-square w-[min(82vw,440px)] shrink-0 overflow-hidden"
          >
            <Image
              src={c.img}
              alt={`${c.name} cuisine`}
              fill
              draggable={false}
              className="object-cover transition-transform duration-1200 ease-out group-hover:scale-110"
              sizes="(max-width: 768px) 82vw, 440px"
            />
            <div className="absolute inset-0 bg-black/15" />
            <div className="pointer-events-none absolute inset-5 border border-white/70" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
              <h3
                style={serif}
                className="font-semibold uppercase tracking-[0.15em] text-[clamp(1.5rem,2.6vw,50px)] [text-shadow:0_1px_8px_rgba(0,0,0,0.45)]"
              >
                {c.name}
              </h3>
              <p
                style={serif}
                className="mt-3 text-[clamp(0.9rem,1.15vw,22px)] [text-shadow:0_1px_8px_rgba(0,0,0,0.45)]"
              >
                {c.price}
              </p>
            </div>
          </div>
        ))}
      </DragSlider>

      <Reveal>
        <div className="mt-12">
          <CircleButton
            href="#"
            circleColor="#191919"
            arrowColor="#ffffff"
            circleSize={88}
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
