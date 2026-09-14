// ══════════════════════════════════════════════════════════════════
// PATH IN REPO: components/sections/investors/InvestorRoadmap.tsx
// ══════════════════════════════════════════════════════════════════
/**
 * VIII — EXPANSION ROADMAP. Foundation → Capacity → Multi-city → Platform,
 * the structure the strategy doc recommends (§3).
 *
 * ⚠️ THE DATES ARE PLACEHOLDERS. The doc asks for "a visual timeline using
 * RAEC's actual dates and milestones" — RAEC has not given them, so `period`
 * is `null` on every phase and renders as an em-dash. Phase names and
 * descriptions are structural and safe to show; a date is a commitment, so it
 * is not invented here.
 *
 * On the navy (#0f2f3b) the contact page already uses, so the page's two dark
 * bands are the site's two dark tones rather than two shades of the same one.
 */

import Reveal from "@/components/anim/Reveal";
import SectionHeading, { type SectionProps } from "./SectionHeading";
import { ROADMAP } from "@/lib/investor-content";
import { BODY_SM, GOLD, H3, NAVY, SECTION_PAD, serif } from "./theme";

export default function InvestorRoadmap({ numeral }: SectionProps) {
  return (
    <section
      id="roadmap"
      className={`flex w-full flex-col items-center text-center ${SECTION_PAD}`}
      style={{ backgroundColor: NAVY }}
    >
      <SectionHeading
        light
        numeral={numeral}
        label="Roadmap"
        eyebrow="Expansion Roadmap"
        title="From a Jaipur operator to an integrated platform"
      />

      <ol className="mt-14 grid w-full max-w-300 grid-cols-1 gap-y-12 md:mt-20 md:grid-cols-4 md:gap-x-10">
        {ROADMAP.map((r) => (
          <li key={r.phase}>
            <Reveal>
              <div className="flex flex-col items-center px-2 text-center">
                <span
                  style={{ ...serif, color: GOLD }}
                  className="text-[0.8125rem] uppercase tracking-[0.24em]"
                >
                  {r.phase}
                </span>
                <span aria-hidden className="mt-3 block h-px w-8" style={{ backgroundColor: GOLD }} />
                <p
                  style={{ ...serif, color: "rgba(255,255,255,0.5)" }}
                  className="mt-3 text-[0.875rem] tabular-nums"
                >
                  {r.period ?? "—"}
                </p>
                <h3 style={{ ...serif, color: "#ffffff" }} className={`mt-3 ${H3}`}>
                  {r.title}
                </h3>
                <p
                  style={{ ...serif, color: "rgba(255,255,255,0.7)" }}
                  className={`mt-4 max-w-[22rem] ${BODY_SM}`}
                >
                  {r.body}
                </p>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  );
}
