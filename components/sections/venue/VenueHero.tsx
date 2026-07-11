// ══════════════════════════════════════════════════════════════════
// PATH IN REPO: components/sections/venue/VenueHero.tsx
// ══════════════════════════════════════════════════════════════════

"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import SiteHeader from "@/components/ui/SiteHeader";
import CircleButton from "@/components/anim/CircleButton";
import { prefersReducedMotion } from "@/components/anim/anim.config";

gsap.registerPlugin(useGSAP);

const serif = { fontFamily: "var(--font-cormorant-garamond)" } as const;

// ═══════════════════════════════════════════════════════════════════════════
// ─── TUNE THESE KNOBS ──────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════

// ─ Background ──
const BG_IMAGE = "/images/venue-hero.jpg";
const OVERLAY_OPACITY = 0.35;

// ─ Bottom blend — dissolves hero photo INTO the WHITE next section ──
// MUST match the bg of VenuePropertiesSection (currently #ffffff).
const HERO_BLEND_TO_COLOR = "#ffffff";
const HERO_BLEND_HEIGHT = "0vh";

// ─ Title ──
const TITLE_TEXT = "Venue";
const TITLE_FONT_SIZE = "clamp(3rem, 7vw, 130px)";

// ─ Letter reveal ──
const LETTER_STAGGER = 0.06;
const LETTER_DURATION = 0.9;
const LETTER_INITIAL_Y = 32;
const LETTER_START_DELAY = 0.4;

// ─ Down-arrow CTA ──
const CTA_DELAY = 1;

// ─ Smooth scroll target + timing when the down arrow is clicked ──
const SCROLL_TARGET_ID = "properties";
const SCROLL_DURATION = 1.5;   // seconds — used only when Lenis is available

// ═══════════════════════════════════════════════════════════════════════════

function Letters({ text }: { text: string }) {
  return (
    <>
      {text.split("").map((ch, i) => (
        <span key={i} className="hero-letter inline-block will-change-transform">
          {ch}
        </span>
      ))}
    </>
  );
}

/**
 * Intercepts the click on the down-arrow and smooth-scrolls to the next section.
 *   1. If Lenis is exposed on window.lenis → use its scrollTo (buttery smooth,
 *      matches the site's overall scroll feel).
 *   2. Otherwise fall back to native scrollIntoView({ behavior: "smooth" }).
 *
 * TIP: If you want option (1), expose the Lenis instance from your
 *      SmoothScroll.tsx like this after you create it:
 *          (window as any).lenis = lenis;
 */
function handleDownClick(e: React.MouseEvent) {
  e.preventDefault();
  const target = document.getElementById(SCROLL_TARGET_ID);
  if (!target) return;

  const w = window as unknown as { lenis?: { scrollTo: (t: HTMLElement, o?: { duration?: number }) => void } };
  if (w.lenis && typeof w.lenis.scrollTo === "function") {
    w.lenis.scrollTo(target, { duration: SCROLL_DURATION });
  } else {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

export default function VenueHero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      const letters = root.current?.querySelectorAll<HTMLElement>(".hero-letter");
      const cta = root.current?.querySelector<HTMLElement>(".venue-hero-cta");

      if (letters && letters.length > 0) {
        gsap.set(letters, { autoAlpha: 0, y: LETTER_INITIAL_Y });
        gsap.to(letters, {
          autoAlpha: 1,
          y: 0,
          duration: LETTER_DURATION,
          stagger: LETTER_STAGGER,
          ease: "power2.out",
          delay: LETTER_START_DELAY,
        });
      }
      if (cta) {
        gsap.set(cta, { autoAlpha: 0, y: 20 });
        gsap.to(cta, {
          autoAlpha: 1,
          y: 0,
          duration: 1.0,
          ease: "power2.out",
          delay: CTA_DELAY,
        });
      }
    },
    { scope: root }
  );

  return (
    <section ref={root} className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={BG_IMAGE}
          alt="Raj Aangan Venue"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      <div
        className="absolute inset-0"
        style={{ backgroundColor: `rgba(25,25,25,${OVERLAY_OPACITY})` }}
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0"
        style={{
          height: HERO_BLEND_HEIGHT,
          zIndex: 5,
          background: `linear-gradient(to bottom, transparent, ${HERO_BLEND_TO_COLOR} 100%)`,
        }}
      />

      <SiteHeader animateEntrance />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-white">
        <h1
          style={{ ...serif, fontSize: TITLE_FONT_SIZE }}
          className="font-medium leading-none"
        >
          <Letters text={TITLE_TEXT} />
        </h1>

        <div className="venue-hero-cta mt-14">
          <CircleButton
            href={`#${SCROLL_TARGET_ID}`}
            onClick={handleDownClick}
            circleColor="#ffffff"
            arrowColor="#191919"
            circleSize={120}
            magnet={0.35}
            arrowDirection="down"
            className="rounded-full border border-white px-8 py-3 text-white"
          >
            <DownArrowIcon />
          </CircleButton>
        </div>
      </div>
    </section>
  );
}

function DownArrowIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}
