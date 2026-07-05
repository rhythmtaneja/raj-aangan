"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import Reveal from "@/components/anim/Reveal";
import CircleButton from "@/components/anim/CircleButton";
import { prefersReducedMotion } from "@/components/anim/anim.config";

gsap.registerPlugin(useGSAP);

const serif = { fontFamily: "var(--font-cormorant-garamond)" } as const;

// ═══════════════════════════════════════════════════════════════════════════
// ─── TUNE THESE KNOBS ──────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════

// ─ Three horizontal bands (same split-bg pattern as WeddingPackagesSection) ──
const TOP_BG    = "#ffffff";
const MIDDLE_BG = "#0f2f3b"; // dark navy — should match ContactForm / WeddingPackages middle
const BOTTOM_BG = "#ffffff";

const TITLE_COLOR = "#191919";

// ─ Padding per band ──
const TOP_PAD    = "py-14";
const MIDDLE_PAD = "py-16";
const BOTTOM_PAD = "py-10";

// ─ Card sizing ──
const CARD_WIDTH  = 320; // px
const CARD_HEIGHT = 320; // px
const CARD_GAP    = 32;  // px between cards

// ─ Frame on each image ──
const FRAME_INSET = "12px";
const FRAME_COLOR = "rgba(255,255,255,0.55)";

// ─ Auto-scroll ──
// Seconds for one full loop of the ORIGINAL set. Higher = slower.
const SCROLL_DURATION = 40;

// ═══════════════════════════════════════════════════════════════════════════

type Theme = { name: string; image: string };

const THEMES: Theme[] = [
  { name: "Floral Design",     image: "/images/events-decor-floral.jpg"    },
  { name: "Modern Minimal",    image: "/images/events-decor-modern.jpg"    },
  { name: "Pastel Romance",    image: "/images/events-decor-pastel.jpg"    },
  { name: "Poolside Sundowner",image: "/images/events-decor-poolside.jpg"  },
  { name: "Garden",            image: "/images/events-decor-garden.jpg"    },
  { name: "Royal Rajput",      image: "/images/events-decor-royal.jpg"     },
];

export default function DecorStylingCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const track = trackRef.current;
      if (!track) return;

      const originalWidth = THEMES.length * (CARD_WIDTH + CARD_GAP);

      gsap.set(track, { x: 0 });
      gsap.to(track, {
        x: -originalWidth,
        duration: SCROLL_DURATION,
        ease: "none",
        repeat: -1,
      });
    },
    { scope: trackRef }
  );

  const cards = [...THEMES, ...THEMES];

  return (
    <section className="relative w-full">
      {/* TOP — white with title */}
      <div className={`w-full ${TOP_PAD}`} style={{ backgroundColor: TOP_BG }}>
        <Reveal>
          <h2
            style={{ ...serif, color: TITLE_COLOR }}
            className="text-center font-medium text-[clamp(1.9rem,3.2vw,58px)]"
          >
            Decor & Styling
          </h2>
        </Reveal>
      </div>

      {/* MIDDLE — dark navy with auto-scrolling cards */}
      <div
        className={`w-full ${MIDDLE_PAD} overflow-hidden`}
        style={{ backgroundColor: MIDDLE_BG }}
      >
        <div ref={trackRef} className="flex" style={{ gap: `${CARD_GAP}px`, paddingLeft: CARD_GAP }}>
          {cards.map((c, i) => (
            <ThemeCard key={i} name={c.name} image={c.image} />
          ))}
        </div>
      </div>

      {/* BOTTOM — white with CTA */}
      <div className={`w-full ${BOTTOM_PAD} px-6`} style={{ backgroundColor: BOTTOM_BG }}>
        <div className="mx-auto flex max-w-4xl items-center justify-center">
          <CircleButton
            href="#request-styling"
            circleColor="#191919"
            arrowColor="#ffffff"
            circleSize={60}
            magnet={0.3}
            className="rounded-full border border-[#191919] px-8 py-3 text-[#191919] text-[clamp(0.9rem,1.05vw,20px)]"
          >
            Request for styling
          </CircleButton>
        </div>
      </div>
    </section>
  );
}

function ThemeCard({ name, image }: Theme) {
  return (
    <div
      className="group shrink-0 flex flex-col items-center"
      style={{ width: CARD_WIDTH }}
    >
      <div
        className="relative overflow-hidden"
        style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
      >
        <Image
          src={image}
          alt={name}
          fill
          sizes="320px"
          className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute z-10"
          style={{ inset: FRAME_INSET, border: `1px solid ${FRAME_COLOR}` }}
        />
      </div>
      <p
        style={serif}
        className="mt-5 text-white text-[clamp(1rem,1.15vw,22px)]"
      >
        {name}
      </p>
    </div>
  );
}
