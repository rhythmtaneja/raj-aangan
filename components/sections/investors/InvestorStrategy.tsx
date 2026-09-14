// ══════════════════════════════════════════════════════════════════
// PATH IN REPO: components/sections/investors/InvestorStrategy.tsx
// ══════════════════════════════════════════════════════════════════
/**
 * VI — GROWTH STRATEGY. The five-step progression from the strategy doc (§3):
 * Strengthen Jaipur → Expand Catering → Build Partnerships → Expand
 * Geographically → Build the RAEC Platform.
 *
 * The ORDER is the argument — each step is funded and de-risked by the one
 * before it — so the steps are numbered and stacked rather than laid out as an
 * equal grid, which would lose the sequence.
 *
 * ⚠️ NO ABSOLUTELY-POSITIONED NUMERALS HERE. The first version pinned each
 * numeral with `absolute left-0` inside a <Reveal>; Reveal animates with a
 * gsap transform, and a transformed element becomes the containing block for
 * its absolute descendants, so every numeral re-anchored on top of its own
 * heading. Centred flow layout has no such trap.
 */

import Reveal from "@/components/anim/Reveal";
import SectionHeading, { type SectionProps } from "./SectionHeading";
import { STRATEGY } from "@/lib/investor-content";
import { BODY_SM, CREAM_WARM, GOLD, H3, SECTION_PAD, TEXT_BODY, TEXT_MUTED, serif } from "./theme";

export default function InvestorStrategy({ numeral }: SectionProps) {
  return (
    <section
      id="strategy"
      className={`flex w-full flex-col items-center text-center ${SECTION_PAD}`}
      style={{ backgroundColor: CREAM_WARM }}
    >
      <SectionHeading
        numeral={numeral}
        label="Growth"
        eyebrow="Growth Strategy"
        title="What Raj Aangan builds next"
        intro="Sequenced deliberately: each stage is paid for by the one before it, so growth compounds from operations rather than depending on a single raise."
      />

      <ol className="mt-14 flex w-full max-w-[44rem] flex-col md:mt-20">
        {STRATEGY.map((s, i) => (
          <li key={s.step}>
            <Reveal>
              <div className="flex flex-col items-center text-center">
                {/* A hairline between steps reads as the progression the copy
                    describes, without drawing a literal timeline. */}
                {i > 0 && (
                  <span
                    aria-hidden
                    className="my-8 block h-10 w-px md:my-10 md:h-14"
                    style={{ backgroundColor: "rgba(191,154,63,0.35)" }}
                  />
                )}
                <span
                  style={{ ...serif, color: GOLD }}
                  className="text-[0.8125rem] uppercase tracking-[0.24em]"
                >
                  {s.step}
                </span>
                <h3 style={{ ...serif, color: TEXT_MUTED }} className={`mt-3 ${H3}`}>
                  {s.title}
                </h3>
                <p style={{ ...serif, color: TEXT_BODY }} className={`mt-4 max-w-[34rem] ${BODY_SM}`}>
                  {s.body}
                </p>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  );
}
