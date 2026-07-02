"use client";

import { useRef } from "react";
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

// ─ Title ──
const TITLE_TEXT      = "Blog";
const TITLE_FONT_SIZE = "clamp(3rem, 8vw, 160px)";

// ─ Subtitle (single line beneath the title) ──
const SUBTITLE_TEXT      = "Where every event becomes a cherished memory worth sharing.";
const SUBTITLE_FONT_SIZE = "clamp(1rem, 1.6vw, 32px)";
const SUBTITLE_MAX_W     = "40rem";

// ─ Letter-by-letter reveal ──
// STAGGER larger because "Blog" is short — spreads the reveal over more time.
const LETTER_STAGGER     = 0.09;
const LETTER_DURATION    = 0.9;
const LETTER_INITIAL_Y   = 28;
const LETTER_START_DELAY = 0.4;

// ─ Subtitle + CTA fade-in timing ──
const SUBTITLE_DELAY = 1.1;
const CTA_DELAY      = 1.9;

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

export default function BlogHero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      const letters  = root.current?.querySelectorAll<HTMLElement>(".hero-letter");
      const subtitle = root.current?.querySelector<HTMLElement>(".blog-hero-subtitle");
      const cta      = root.current?.querySelector<HTMLElement>(".blog-hero-cta");

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
      if (subtitle) {
        gsap.set(subtitle, { autoAlpha: 0, y: 20 });
        gsap.to(subtitle, {
          autoAlpha: 1,
          y: 0,
          duration: 1.0,
          ease: "power2.out",
          delay: SUBTITLE_DELAY,
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
      {/*
        No dedicated bg <Image> here — the constant page backdrop set at the
        <main> level shows through. Hero is just SiteHeader + centred content.
      */}
      <SiteHeader />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-white">
        <h1
          style={{ ...serif, fontSize: TITLE_FONT_SIZE }}
          className="font-medium leading-[1.1]"
        >
          <Letters text={TITLE_TEXT} />
        </h1>

        <p
          className="blog-hero-subtitle mt-6"
          style={{
            ...serif,
            fontSize: SUBTITLE_FONT_SIZE,
            maxWidth: SUBTITLE_MAX_W,
          }}
        >
          {SUBTITLE_TEXT}
        </p>

        <div className="blog-hero-cta mt-14">
          <CircleButton
            href="#posts"
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
