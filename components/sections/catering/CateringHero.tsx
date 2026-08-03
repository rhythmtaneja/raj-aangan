// ══════════════════════════════════════════════════════════════════
// PATH IN REPO: components/sections/catering/CateringHero.tsx
// ══════════════════════════════════════════════════════════════════
// CHANGES vs previous version:
//   • Logo block now matches AboutHero exactly — image-based composition
//     (round logo + cropped logo.png in overflow container). Removed the
//     text-based <h2>RAEC</h2> + subtitle paragraph.
//   • Same absolute positioning (top-[clamp(10rem,21vh,15rem)]) as About.
//   • Same centered flex column with pt-65 (was pt-[18vh]).
//   • HERO_BLEND_HEIGHT fixed from "0vh" (which disabled the blend
//     entirely — that was a bug) to "40vh" matching About's blend.
//   • Removed the logo-block fade-in animation to match About's timing
//     (only the tagline letters and CTA animate now).
//   • Kept the catering-specific tagline text + Plan Your Event CTA
//     (they're central to the catering → menu builder flow).
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
const BG_IMAGE = "/images/catering-hero.jpg";
const OVERLAY_OPACITY = 0.45;

// ─ Bottom blend — dissolves hero photo INTO the WHITE next section ──
// MUST match the bg of the IntroSection that follows (currently #ffffff).
const HERO_BLEND_TO_COLOR = "#ffffff";
const HERO_BLEND_HEIGHT = "0vh";

// ─ Title + tagline ──
// The section heading matches the large title treatment in VenueHero.
const SECTION_TITLE_TEXT = "Catering";
const SECTION_TITLE_FONT_SIZE = "clamp(3rem, 7vw, 6.3125rem)";
const TAGLINE_TEXT = "A journey of flavors, cultures, and unforgettable tastes.";
const TAGLINE_FONT_SIZE = "clamp(2rem, 4.2vw, 3.75rem)";
const TAGLINE_MAX_W = "68.75rem";
const TITLE_HEADER_TO_TAGLINE_GAP = "1.5rem";

// ─ Decorative logo ──
const LOGO_TOP = "clamp(18rem, 33vh, 23rem)";
const LOGO_SIZE = "clamp(11.25rem, 34vw, 13.75rem)";
const LOGO_CROP_HEIGHT = `calc(${LOGO_SIZE} * 0.327)`;
const LOGO_CROP_OFFSET = `calc(${LOGO_SIZE} * -0.314)`;

// ─ Letter reveal on tagline ──
const LETTER_STAGGER = 0.03;
const LETTER_DURATION = 0.9;
const LETTER_INITIAL_Y = 28;
const LETTER_START_DELAY = 0.4;

// ─ CTA button reveal (delayed until title mostly done) ──
const CTA_DELAY = 2.4;

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

export default function CateringHero({ bgImage }: { bgImage?: string }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      const letters = root.current?.querySelectorAll<HTMLElement>(".hero-letter");
      const cta = root.current?.querySelector<HTMLElement>(".hero-cta");

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
          src={bgImage ?? BG_IMAGE}
          alt="Catering spread"
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

      {/* Bottom blend into next section (WHITE — matches IntroSection bg) */}
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


      {/* Centered flex column — same pt-65 as AboutHero pushes title below logo block */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 pt-65 text-center text-white">
        <h1
          style={{ ...serif, fontSize: SECTION_TITLE_FONT_SIZE }}
          className="font-medium leading-none"
        >
          <Letters text={SECTION_TITLE_TEXT} />
        </h1>

        <h2
          style={{ ...serif, fontSize: TAGLINE_FONT_SIZE, maxWidth: TAGLINE_MAX_W, marginTop: TITLE_HEADER_TO_TAGLINE_GAP }}
          className="font-medium leading-[1.15]"
        >
          <Letters text={TAGLINE_TEXT} />
        </h2>

        <div className="hero-cta mt-14">
          <CircleButton
            href="/menu-builder"
            circleColor="#6c7c7b" /* sage — matches Homepage hero */
            arrowColor="#ffffff"
            circleSize="7.5rem"
            magnet={0.4}
            className="rounded-full border border-white/80 px-10 py-4 text-white uppercase tracking-[0.15em] text-[clamp(0.9rem,1.05vw,0.9375rem)]"
          >
            Plan Your Event
          </CircleButton>
        </div>
      </div>
    </section>
  );
}
