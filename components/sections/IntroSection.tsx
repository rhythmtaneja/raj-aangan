"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import NumeralMarker from "@/components/ui/NumeralMarker";
import CircleButton from "@/components/anim/CircleButton";
import { prefersReducedMotion } from "@/components/anim/anim.config";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const serif = { fontFamily: "var(--font-cormorant-garamond)" } as const;

// ═══════════════════════════════════════════════════════════════════════════
// ─── TUNE THESE KNOBS ──────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════

// ─ SPEED (Sep 2026) ───────────────────────────────────────────────────────
// Every duration in this block was roughly a third faster after the client
// flagged the arrival as sluggish (phone-changes/animation-speed.jpeg — the
// numeral and the copy have landed, and the CTA below them is still nowhere).
//
// The CTA was the real complaint, and it was not its own timing that was slow.
// It is appended at TILT_DURATION - BUTTON_LEAD, i.e. relative to the END of
// the whole timeline, and the longest tween in that timeline was the 6-second
// tilt — so the button did not begin until 5.45s after the section scrolled
// in, long after every word had finished. Shortening the tilt is what fixes
// the button; BUTTON_LEAD then decides how much it overlaps the words' tail.
//
// Rough budget now, from the moment the section hits TRIGGER_START:
//   words     0.15s → ~1.5s   (stagger × word count, then the fade)
//   tilt      0.00s →  2.2s
//   button    1.30s →  1.9s   (starts under the last few words)
// ───────────────────────────────────────────────────────────────────────────

// ─ Text tilt-zoom (entire text block enters with rotateY + scale) ──
const TILT_DEG = -35;
const INITIAL_SCALE = 0.78;
const TILT_DURATION = 2.2;
const TILT_EASE = "power3.out";

// ─ Word-by-word reveal (first scroll-in only) ──
const WORD_STAGGER = 0.05;
const WORD_FADE_DURATION = 0.85;
const WORD_REVEAL_DELAY = 0.15;

// ─ Subsequent en-bloc reveal (on re-enter) ──
const ENBLOC_FADE_DURATION = 0.6;

// ─ CTA ──
// How far BEFORE the end of the timeline the button starts. Larger = the
// button arrives earlier, overlapping more of the word reveal.
const BUTTON_DURATION = 0.6;
const BUTTON_LEAD = 0.9;

// ─ When the animation fires ──
const TRIGGER_START = "top 70%";

// ─ Italic tail styling (e.g. "the warmth of Rajasthan") ──
const ITALIC_TAIL_COLOR = "#737272";

// ─ Optional label next to numeral ──
const LABEL_COLOR = "#444444";

// ─ Bg fallback (this section reads --page-bg if set elsewhere) ──
const BG_FALLBACK = "#ffffff";

// ═══════════════════════════════════════════════════════════════════════════

function Words({ text, italicTail }: { text: string; italicTail?: string }) {
  const parts = text.split(" ");
  const italicParts = italicTail ? italicTail.split(" ") : [];

  return (
    <>
      {parts.map((word, i) => (
        <span key={`w-${i}`} className="word inline-block will-change-transform">
          {word}
          {i < parts.length - 1 || italicParts.length > 0 ? "\u00A0" : ""}
        </span>
      ))}
      {italicParts.map((word, i) => (
        <span
          key={`it-${i}`}
          className="word italic inline-block will-change-transform"
          style={{ color: ITALIC_TAIL_COLOR }}
        >
          {word}
          {i < italicParts.length - 1 ? "\u00A0" : ""}
        </span>
      ))}
    </>
  );
}

type IntroSectionProps = {
  /** Roman numeral shown in the marker (e.g. "I", "II"). */
  numeral: string;
  /** Optional uppercase label rendered alongside the numeral (e.g. "ABOUT US"). */
  label?: string;
  /** Main heading text. Word-by-word reveal applies. */
  title: string;
  /** Optional italic continuation appended to the title (e.g. "the warmth of Rajasthan"). */
  italicTail?: string;
  /** Optional secondary lines beneath the title (the homepage uses two). */
  secondaryLines?: string[];
  /** Button label. */
  buttonText: string;
  buttonHref?: string;
  buttonCircleSize?: number | string;
  buttonClassName?: string;
};

export default function IntroSection({
  numeral,
  label,
  title,
  italicTail,
  secondaryLines,
  buttonText,
  buttonHref = "#",
  buttonCircleSize = "9.375rem",
  buttonClassName = "rounded-full border border-[#737272] px-10 py-4 text-[#191919] text-[clamp(1rem,1.25vw,1.125rem)]",
}: IntroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const textBlockRef = useRef<HTMLDivElement>(null);
  const buttonWrapRef = useRef<HTMLDivElement>(null);

  const hasPlayedWordReveal = useRef(false);

  useGSAP(
    () => {
      const text = textBlockRef.current;
      const btn = buttonWrapRef.current;
      if (!text) return;

      const words = text.querySelectorAll<HTMLElement>(".word");

      if (prefersReducedMotion()) {
        gsap.set(text, { autoAlpha: 1, rotateY: 0, scale: 1 });
        gsap.set(words, { autoAlpha: 1, y: 0 });
        if (btn) gsap.set(btn, { autoAlpha: 1, y: 0 });
        hasPlayedWordReveal.current = true;
        return;
      }

      const setHidden = () => {
        gsap.set(text, {
          transformPerspective: 1200,
          transformOrigin: "center center",
          rotateY: TILT_DEG,
          scale: INITIAL_SCALE,
          autoAlpha: 0,
        });
        gsap.set(words, { autoAlpha: 0, y: 18 });
        if (btn) gsap.set(btn, { autoAlpha: 0, y: 22 });
      };
      setHidden();

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: TRIGGER_START,
        onEnter: () => {
          const tl = gsap.timeline();
          tl.to(
            text,
            { autoAlpha: 1, rotateY: 0, scale: 1, duration: TILT_DURATION, ease: TILT_EASE },
            0
          );
          if (!hasPlayedWordReveal.current) {
            tl.to(words, {
              autoAlpha: 1, y: 0,
              duration: WORD_FADE_DURATION,
              stagger: WORD_STAGGER,
              ease: "power2.out",
            }, WORD_REVEAL_DELAY);
            hasPlayedWordReveal.current = true;
          } else {
            tl.to(words, {
              autoAlpha: 1, y: 0,
              duration: ENBLOC_FADE_DURATION,
              ease: "power2.out",
            }, 0);
          }
          if (btn) {
            tl.to(
              btn,
              { autoAlpha: 1, y: 0, duration: BUTTON_DURATION, ease: "power2.out" },
              `-=${BUTTON_LEAD}`
            );
          }
        },
        onLeaveBack: () => setHidden(),
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      style={{ backgroundColor: `var(--page-bg, ${BG_FALLBACK})` }}
      className="relative flex min-h-screen w-full flex-col items-center justify-center px-6 py-20 text-center md:px-6 md:py-32"
    >
      {/* Numeral + optional label, e.g. "II  ABOUT US" */}
      <div className="mb-8 flex items-center gap-4 md:mb-20 md:gap-5">
        <NumeralMarker numeral={numeral} />
        {label && (
          <span
            style={{ ...serif, color: LABEL_COLOR }}
            className="uppercase tracking-[0.2em] text-[clamp(1rem,1.25vw,1.125rem)]"
          >
            {label}
          </span>
        )}
      </div>

      {/*
        ─── PHONE: ONE MEASURE FOR THE WHOLE BLOCK ─────────────────────────
        This `max-w` is the fix for what the copy looked like on a phone
        (phone-changes/intosection.PNG). The three text runs used to be sized
        and capped independently: the h2 was capped at 19rem while the
        secondary lines had no cap at all and ran the full 100% - padding.
        Three different measures means three unrelated wrap points, so the
        block read as three loose fragments rather than one statement.

        Capping the PARENT gives all three the same measure, and the h2's own
        phone cap is dropped below so it inherits this one. `md:w-auto` +
        `md:max-w-none` restore the desktop shrink-to-fit box exactly — do not
        drop them, `w-full` alone would change where the desktop h2 wraps.
      */}
      <div
        ref={textBlockRef}
        className="flex w-full max-w-[21rem] flex-col items-center md:w-auto md:max-w-none"
        style={{ willChange: "transform, opacity" }}
      >
        <h2
          style={serif}
          /* `text-balance` is what stops the orphans — "…planning,heritage /
             venues" in the screenshot becomes two even lines. It is reset at
             `md:` because the desktop wrapping is signed off. */
          className="max-w-none text-balance font-semibold leading-[1.3] text-[#191919] text-[1.75rem] md:max-w-[100rem] md:[text-wrap:auto] md:leading-[1.05] md:text-[clamp(2rem,3.9vw,3.5rem)]"
        >
          <Words text={title} italicTail={italicTail} />
        </h2>

        {secondaryLines && secondaryLines.length > 0 && (
          <div
            style={serif}
            className="mt-5 font-semibold leading-[1.3] text-[#999999] md:mt-6 md:leading-[1.15]"
          >
            {secondaryLines.map((line, i) => (
              <p
                key={i}
                /*
                  Both clamps bottom out on a phone — 3.39vw and 2.86vw at
                  390px are ~13px and ~11px, so each line just sits at its
                  MIN. That min was 1.5rem for the first line, the exact size
                  the h2 used to be, so the heading and the line under it were
                  identically sized and the hierarchy disappeared. The phone
                  literals below rebuild the ladder (1.75 / 1.25 / 1.0625rem);
                  the clamps come back untouched at `md:`.
                */
                className={
                  i === 0
                    ? "text-balance text-[#5e5e5e] text-[1.25rem] md:[text-wrap:auto] md:text-[clamp(1.5rem,3.39vw,3.0625rem)]"
                    : "mt-3 text-balance text-[1.0625rem] md:mt-6 md:[text-wrap:auto] md:text-[clamp(1.25rem,2.86vw,2.5625rem)]"
                }
              >
                <Words text={line} />
              </p>
            ))}
          </div>
        )}

        <div ref={buttonWrapRef} className="mt-12 md:mt-20" style={{ willChange: "transform, opacity" }}>
          <CircleButton
            href={buttonHref}
            circleColor="#191919"
            arrowColor="#ffffff"
            circleSize={buttonCircleSize}
            magnet={0.4}
            className={buttonClassName}
          >
            {buttonText}
          </CircleButton>
        </div>
      </div>
    </section>
  );
}
