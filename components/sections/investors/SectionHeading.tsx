// ══════════════════════════════════════════════════════════════════
// PATH IN REPO: components/sections/investors/SectionHeading.tsx
// ══════════════════════════════════════════════════════════════════
/**
 * The section opener used across /investors.
 *
 * This is NOT a new pattern — it is the one AboutSection and
 * WhatWeOfferSection already use, extracted so the investors page cannot drift
 * from it:
 *
 *        [ II ]  ABOUT US          ← NumeralMarker + uppercase serif label
 *                OUR STORY          ← small uppercase eyebrow
 *                ─────              ← gold hairline, w-16
 *        Raj Aangan Events…         ← large serif heading
 *
 * Centred, because every marketing section on this site is centred. The
 * previous version of this page left-aligned its headings, which was one of
 * the things that made it read as a different site.
 */

import NumeralMarker from "@/components/ui/NumeralMarker";
import Reveal from "@/components/anim/Reveal";
import { EYEBROW, GOLD, H2, NUMERAL_LABEL, TEXT_LABEL, serif } from "./theme";

/**
 * Every numbered section on /investors takes its numeral from the PAGE rather
 * than hardcoding one. Leadership and News hide themselves when their content
 * is empty, and hardcoded numerals would then read I, II … VIII, X, XII with
 * visible gaps. app/investors/page.tsx assigns them in render order instead.
 */
export type SectionProps = { numeral: string };

type Props = {
  /** Roman numeral for the marker, e.g. "III". */
  numeral: string;
  /** Uppercase label beside the numeral, e.g. "OUR BUSINESS". */
  label: string;
  /** Small uppercase eyebrow above the heading. */
  eyebrow?: string;
  title: string;
  /** Optional standfirst under the title. */
  intro?: string;
  /** Set on the dark bands so the type inverts. */
  light?: boolean;
  /** Heading colour. Defaults to gold on light, white on dark. */
  titleColor?: string;
};

export default function SectionHeading({
  numeral,
  label,
  eyebrow,
  title,
  intro,
  light,
  titleColor,
}: Props) {
  const labelColor = light ? "rgba(255,255,255,0.72)" : TEXT_LABEL;

  return (
    <div className="flex flex-col items-center text-center">
      <Reveal>
        <div className="flex items-center justify-center gap-4 md:gap-5">
          {/* `light` flips the marker's borders for the dark bands — the same
              prop AboutStorySection passes. */}
          <NumeralMarker numeral={numeral} light={light} />
          <span style={{ ...serif, color: labelColor }} className={NUMERAL_LABEL}>
            {label}
          </span>
        </div>
      </Reveal>

      {eyebrow && (
        <Reveal>
          <div className="mt-10 md:mt-14">
            <p className={EYEBROW} style={{ color: labelColor }}>
              {eyebrow}
            </p>
            {/* The gold hairline. = AboutSection's `h-px w-16 bg-[#bf9a3f]`. */}
            <span className="mx-auto mt-2 block h-px w-16" style={{ backgroundColor: GOLD }} />
          </div>
        </Reveal>
      )}

      <Reveal>
        <h2
          style={{ ...serif, color: titleColor ?? (light ? "#ffffff" : GOLD) }}
          className={`${eyebrow ? "mt-7 md:mt-8" : "mt-10 md:mt-14"} max-w-[20rem] text-balance md:max-w-[48rem] md:[text-wrap:auto] ${H2}`}
        >
          {title}
        </h2>
      </Reveal>

      {intro && (
        <Reveal>
          <p
            style={{ ...serif, color: light ? "rgba(255,255,255,0.78)" : "#2a2a2a" }}
            className="mt-5 max-w-[22rem] leading-relaxed text-[1.0625rem] md:mt-7 md:max-w-[46rem] md:text-[clamp(1.1rem,1.45vw,1.3125rem)]"
          >
            {intro}
          </p>
        </Reveal>
      )}
    </div>
  );
}
