// ══════════════════════════════════════════════════════════════════
// PATH IN REPO: components/sections/investors/InvestorLeadership.tsx
// ══════════════════════════════════════════════════════════════════
/**
 * IX — LEADERSHIP.
 *
 * ⚠️ RENDERS NOTHING UNTIL REAL PEOPLE ARE SUPPLIED.
 *
 * `LEADERSHIP` is an empty array in lib/investor-content.ts and this returns
 * `null` when it is. No placeholder cards, no "Founder & Chairman" over a grey
 * avatar, no lorem biography.
 *
 * This rule is stricter than the rest of the page, deliberately: every other
 * placeholder here is a missing NUMBER, but a leadership card is a claim about
 * an identifiable person's name, role and career. A plausible invented bio on
 * an investor page is a fabrication about a real human being, and a grey
 * placeholder card is the kind of thing that quietly ships. Empty cannot ship
 * by accident — the section simply is not there.
 *
 * To add: fill LEADERSHIP with name/role/photo/bio (80–100 words per the
 * strategy doc), photos under /public/images/investors/.
 */

import Image from "next/image";
import Reveal from "@/components/anim/Reveal";
import SectionHeading, { type SectionProps } from "./SectionHeading";
import { LEADERSHIP } from "@/lib/investor-content";
import {
  BODY_SM,
  CREAM_DEEP,
  GOLD,
  H3,
  HOVER_SCALE,
  HOVER_TRANSITION,
  PHOTO_FRAME_COLOR,
  PHOTO_FRAME_INSET,
  SECTION_PAD,
  TEXT_BODY,
  TEXT_LABEL,
  TEXT_MUTED,
  serif,
} from "./theme";

export default function InvestorLeadership({ numeral }: SectionProps) {
  if (LEADERSHIP.length === 0) return null;

  return (
    <section
      id="leadership"
      className={`flex w-full flex-col items-center text-center ${SECTION_PAD}`}
      style={{ backgroundColor: CREAM_DEEP }}
    >
      <SectionHeading
        numeral={numeral}
        label="Leadership"
        eyebrow="The Team"
        title="The people running the business"
      />

      <div className="mt-14 grid w-full max-w-300 grid-cols-1 gap-y-14 md:mt-20 md:grid-cols-3 md:gap-x-14">
        {LEADERSHIP.map((p) => (
          <Reveal key={p.name}>
            <div className="flex flex-col items-center text-center">
              <div className="group relative aspect-[4/5] w-full overflow-hidden bg-black/5">
                {p.photo && (
                  <Image
                    src={p.photo}
                    alt={p.name}
                    fill
                    className={`object-cover ${HOVER_TRANSITION} ${HOVER_SCALE}`}
                    sizes="(max-width: 768px) 100vw, 380px"
                  />
                )}
                <div
                  aria-hidden
                  className="pointer-events-none absolute z-10"
                  style={{ inset: PHOTO_FRAME_INSET, border: `1px solid ${PHOTO_FRAME_COLOR}` }}
                />
              </div>
              <h3 style={{ ...serif, color: TEXT_MUTED }} className={`mt-6 ${H3}`}>
                {p.name}
              </h3>
              <span aria-hidden className="mt-3 block h-px w-8" style={{ backgroundColor: GOLD }} />
              <p
                style={{ ...serif, color: TEXT_LABEL }}
                className="mt-3 text-[0.8125rem] uppercase tracking-[0.2em]"
              >
                {p.role}
              </p>
              <p style={{ ...serif, color: TEXT_BODY }} className={`mt-4 ${BODY_SM}`}>
                {p.bio}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
