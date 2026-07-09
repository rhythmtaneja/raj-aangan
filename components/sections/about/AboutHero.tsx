// ══════════════════════════════════════════════════════════════════
// PATH IN REPO: components/sections/about/AboutHero.tsx
// ══════════════════════════════════════════════════════════════════
// CHANGES vs previous version:
//   • Down-arrow CircleButton now smooth-scrolls to #story instead of
//     browser-default instant jump. Uses window.lenis.scrollTo if the
//     Lenis instance is exposed globally (see SmoothScroll.tsx setup
//     notes at the bottom of this file), else falls back to native
//     scrollIntoView({ behavior: "smooth" }).
//   • Same pattern already in use on VenueHero — see that file if you
//     want to change the smooth-scroll duration in one place.
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

const BG_IMAGE = "/images/about-hero.jpg";
const OVERLAY_OPACITY = 0.5;

// ─ Bottom fade — blends hero photo INTO AboutStorySection's bg colour ──
// MUST match SECTION_BG in AboutStorySection.tsx. If they diverge, a colour
// seam appears where the hero ends and the next section begins.
const HERO_BLEND_TO_COLOR = "#081b24"; // ← keep in sync with AboutStorySection.SECTION_BG
const HERO_BLEND_HEIGHT = "30vh";    // ↑ for longer, gentler blend

// ─ Title ──
const TITLE_TEXT = "One of the most premium resort for wedding & events";
const TITLE_FONT_SIZE = "clamp(2rem, 4.5vw, 86px)";
const TITLE_MAX_W = "1200px";

// ─ Letter-by-letter reveal ──
const LETTER_STAGGER = 0.03;
const LETTER_DURATION = 0.9;
const LETTER_INITIAL_Y = 28;
const LETTER_START_DELAY = 0.4;

// ─ Down-arrow CTA ──
const CTA_DELAY = 1.5;

// ─ Smooth-scroll target + timing when the down arrow is clicked ──
const SCROLL_TARGET_ID = "story";
const SCROLL_DURATION = 2.5;   // seconds — used only when Lenis is available

// ═══════════════════════════════════════════════════════════════════════════

function Letters({ text }: { text: string }) {
  return (
    <>
      {text.split(" ").map((word, wi, words) => (
        <span key={wi} className="inline-block whitespace-nowrap">
          {word.split("").map((ch, ci) => (
            <span
              key={ci}
              className="hero-letter inline-block will-change-transform"
            >
              {ch}
            </span>
          ))}
          {wi < words.length - 1 && (
            <span className="hero-letter inline-block">&nbsp;</span>
          )}
        </span>
      ))}
    </>
  );
}

/**
 * Intercepts the click on the down-arrow and smooth-scrolls to #story.
 *   1. If Lenis is exposed on window.lenis → use its scrollTo (buttery,
 *      matches the site's overall scroll feel).
 *   2. Otherwise fall back to native scrollIntoView({ behavior: "smooth" }).
 *
 * TIP: For (1) to work, expose Lenis globally from your SmoothScroll.tsx:
 *          (window as any).lenis = lenis;
 *      (See notes at the bottom of this file for the full one-time fix
 *       that makes ALL "#anchor" links across the site smooth-scroll.)
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

export default function AboutHero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      const letters = root.current?.querySelectorAll<HTMLElement>(".hero-letter");
      const cta = root.current?.querySelector<HTMLElement>(".about-hero-cta");

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
      {/* Background photo */}
      <div className="absolute inset-0">
        <Image
          src={BG_IMAGE}
          alt="Raj Aangan venue"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      {/* Dark overlay */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: `rgba(25, 25, 25, ${OVERLAY_OPACITY})` }}
      />

      {/*
        BOTTOM BLEND — dissolves the hero photo into AboutStorySection's dark
        navy so the transition is seamless.
      */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0"
        style={{
          height: HERO_BLEND_HEIGHT,
          zIndex: 5,
          background: `linear-gradient(to bottom, transparent, ${HERO_BLEND_TO_COLOR} 100%)`,
        }}
      />

      <SiteHeader />

      {/* Decorative RAEC logo block */}
      <div className="absolute inset-x-0 top-[clamp(10rem,21vh,15rem)] z-10 flex flex-col items-center">
        <Image src="/images/logo-round.png" alt="" width={58} height={58} priority />
        <div className="-mt-3 h-18 w-[min(50vw,220px)] overflow-hidden">
          <Image
            src="/images/logo.png"
            alt="Raj Aangan Events and Caterers"
            width={220}
            height={220}
            priority
            className="h-[220px] w-[220px] max-w-none -translate-y-[69px]"
          />
        </div>
      </div>

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 pt-65 text-center text-white">
        <h1
          style={{ ...serif, fontSize: TITLE_FONT_SIZE, maxWidth: TITLE_MAX_W }}
          className="font-medium leading-[1.1]"
        >
          <Letters text={TITLE_TEXT} />
        </h1>

        <div className="about-hero-cta mt-14">
          <CircleButton
            href={`#${SCROLL_TARGET_ID}`}
            onClick={handleDownClick}
            circleColor="#ffffff"
            arrowColor="#191919"
            circleSize={68}
            magnet={0.35}
            arrowDirection="down"
            className="rounded-full border border-white px-7 py-3 text-white"
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
