// ══════════════════════════════════════════════════════════════════
// PATH IN REPO: components/sections/investors/InvestorMarket.tsx
// ══════════════════════════════════════════════════════════════════
/**
 * V — MARKET OPPORTUNITY.
 *
 * ⚠️ THIS SECTION REFUSES TO PUBLISH AN UNSOURCED STATISTIC.
 *
 * The strategy doc: "Every market statistic should be sourced from a credible,
 * current reference." (§3). A market-size number with no citation is the
 * easiest thing on an IR page to be caught out on, so the guard is enforced in
 * code rather than left to whoever edits the content file:
 *
 *   • `stat === null`            → em-dash placeholder.
 *   • `stat` set but no `source` → ALSO the em-dash, and the number is
 *                                  dropped on the floor.
 *
 * Filling in a number without a citation does not get it onto the page. Fill
 * `source` + `sourceUrl` alongside `stat`, or it stays hidden. See
 * `hasCitation` below.
 */

import Reveal from "@/components/anim/Reveal";
import SectionHeading, { type SectionProps } from "./SectionHeading";
import { MARKET, MARKET_INTRO, MARKET_PILLARS } from "@/lib/investor-content";
import { BODY_SM, CREAM, GOLD, H3, SECTION_PAD, TEXT_BODY, TEXT_LABEL, TEXT_MUTED, serif } from "./theme";

export default function InvestorMarket({ numeral }: SectionProps) {
  return (
    <section
      id="market"
      className={`flex w-full flex-col items-center text-center ${SECTION_PAD}`}
      style={{ backgroundColor: CREAM }}
    >
      <SectionHeading
        numeral={numeral}
        label="Market"
        eyebrow="Market Opportunity"
        title="Four demand pools, one operating base"
        intro={MARKET_INTRO}
      />

      {/* ─ Sourced statistics ─────────────────────────────────────────── */}
      <Reveal
        stagger
        staggerEach={0.08}
        className="mt-14 grid w-full max-w-300 grid-cols-2 gap-x-6 gap-y-10 md:mt-20 md:grid-cols-4 md:gap-x-10"
      >
        {MARKET.map((m) => {
          // Both must hold. See the header note — this is the guard.
          const hasCitation = Boolean(m.source && m.sourceUrl);
          const show = m.stat !== null && hasCitation;
          return (
            <div key={m.label} className="flex flex-col items-center text-center">
              <p
                style={{ ...serif, color: show ? TEXT_MUTED : "#9a958d" }}
                className="font-medium leading-none text-[1.625rem] md:text-[clamp(1.875rem,2.9vw,2.5rem)]"
              >
                {show ? m.stat : "—"}
              </p>
              <span aria-hidden className="mt-4 block h-px w-8" style={{ backgroundColor: GOLD }} />
              <p
                style={{ ...serif, color: TEXT_BODY }}
                className="mt-4 max-w-[11rem] text-[0.9375rem] leading-snug md:text-[1rem]"
              >
                {m.label}
              </p>
              {show ? (
                <a
                  href={m.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ ...serif, color: TEXT_LABEL }}
                  className="mt-2 text-[0.8125rem] underline underline-offset-2 opacity-70 transition-opacity hover:opacity-100"
                >
                  {m.source}
                </a>
              ) : (
                <p style={{ ...serif, color: TEXT_LABEL }} className="mt-2 text-[0.8125rem] opacity-60">
                  Awaiting sourced figure
                </p>
              )}
            </div>
          );
        })}
      </Reveal>

      {/* ─ The qualitative argument, which needs no statistics ─────────── */}
      <Reveal
        stagger
        staggerEach={0.1}
        className="mt-16 grid w-full max-w-300 grid-cols-1 gap-y-10 md:mt-24 md:grid-cols-2 md:gap-x-20 md:gap-y-14"
      >
        {MARKET_PILLARS.map((p) => (
          <div key={p.title} className="flex flex-col items-center text-center">
            <h3 style={{ ...serif, color: TEXT_MUTED }} className={H3}>
              {p.title}
            </h3>
            <span aria-hidden className="mt-3 block h-px w-10" style={{ backgroundColor: GOLD }} />
            <p style={{ ...serif, color: TEXT_BODY }} className={`mt-4 max-w-[26rem] ${BODY_SM}`}>
              {p.body}
            </p>
          </div>
        ))}
      </Reveal>
    </section>
  );
}
