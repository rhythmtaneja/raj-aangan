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

// ─ Text tilt-zoom (entire text block enters with rotateY + scale) ──
const TILT_DEG = -35;
const INITIAL_SCALE = 0.78;
const TILT_DURATION = 6;
const TILT_EASE = "power3.out";

// ─ Word-by-word reveal (first scroll-in only) ──
const WORD_STAGGER = 0.15;
const WORD_FADE_DURATION = 2;
const WORD_REVEAL_DELAY = 0.4;

// ─ Subsequent en-bloc reveal (on re-enter) ──
const ENBLOC_FADE_DURATION = 1.2;

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
  buttonCircleSize?: number;
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
  buttonCircleSize = 150,
  buttonClassName = "rounded-full border border-[#737272] px-10 py-4 text-[#191919] text-[clamp(1rem,1.25vw,24px)]",
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
            tl.to(btn, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power2.out" }, "-=0.55");
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
      className="relative flex min-h-screen w-full flex-col items-center justify-center px-6 py-32 text-center"
    >
      {/* Numeral + optional label, e.g. "II  ABOUT US" */}
      <div className="mb-20 flex items-center gap-5">
        <NumeralMarker numeral={numeral} />
        {label && (
          <span
            style={{ ...serif, color: LABEL_COLOR }}
            className="uppercase tracking-[0.2em] text-[clamp(1rem,1.25vw,24px)]"
          >
            {label}
          </span>
        )}
      </div>

      <div
        ref={textBlockRef}
        className="flex flex-col items-center"
        style={{ willChange: "transform, opacity" }}
      >
        <h2
          style={serif}
          className="max-w-[1600px] font-semibold leading-[1.05] text-[#191919] text-[clamp(2rem,3.9vw,75px)]"
        >
          <Words text={title} italicTail={italicTail} />
        </h2>

        {secondaryLines && secondaryLines.length > 0 && (
          <div
            style={serif}
            className="mt-6 font-semibold leading-[1.15] text-[#999999]"
          >
            {secondaryLines.map((line, i) => (
              <p
                key={i}
                className={
                  i === 0
                    ? "text-[#5e5e5e] text-[clamp(1.5rem,3.39vw,65px)]"
                    : "mt-6 text-[clamp(1.25rem,2.86vw,55px)]"
                }
              >
                <Words text={line} />
              </p>
            ))}
          </div>
        )}

        <div ref={buttonWrapRef} className="mt-20" style={{ willChange: "transform, opacity" }}>
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
