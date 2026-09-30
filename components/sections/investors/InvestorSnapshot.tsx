"use client";

import Reveal from "@/components/anim/Reveal";
import CountUp from "@/components/anim/CountUp";
import SectionHeading, { type SectionProps } from "./SectionHeading";
import { SNAPSHOT } from "@/lib/investor-content";
import {
  BODY_SM,
  CREAM,
  GOLD,
  SECTION_PAD,
  TEXT_BODY,
  TEXT_LABEL,
  TEXT_MUTED,
  serif,
} from "./theme";

export default function InvestorSnapshot({ numeral }: SectionProps) {
  return (
    <section
      id="snapshot"
      className={`flex w-full flex-col items-center text-center ${SECTION_PAD}`}
      style={{ backgroundColor: CREAM }}
    >
      <SectionHeading
        numeral={numeral}
        label="Investors"
        eyebrow="Investment Snapshot"
        title="The business at a glance"
      />

      <Reveal
        stagger
        staggerEach={0.08}
        className="mt-14 grid w-full max-w-300 grid-cols-2 gap-x-6 gap-y-12 md:mt-20 md:grid-cols-4 md:gap-x-10 md:gap-y-16"
      >
        {SNAPSHOT.map((m) => (
          <div
            key={m.label}
            className="flex flex-col items-center px-1 text-center"
          >
            <p
              style={{
                ...serif,
                color: m.count === null ? "#9a958d" : TEXT_MUTED,
              }}
              className="font-medium leading-none text-[1.75rem] md:text-[clamp(2rem,3.2vw,2.875rem)]"

              aria-label={
                m.count === null ? `${m.label}: not yet published` : undefined
              }
            >
              {m.count === null ? (
                "—"
              ) : (
                <CountUp end={m.count} suffix={m.suffix} />
              )}
            </p>

            <span
              aria-hidden
              className="mt-4 block h-px w-8"
              style={{ backgroundColor: GOLD }}
            />

            <p
              style={{ ...serif, color: TEXT_BODY }}
              className="mt-4 text-[0.9375rem] leading-snug md:text-[clamp(1rem,1.2vw,1.125rem)]"
            >
              {m.label}
            </p>
            {m.note && (
              <p
                style={{ ...serif, color: TEXT_LABEL }}
                className="mt-1 text-[0.8125rem] leading-snug opacity-70 md:text-[0.875rem]"
              >
                {m.note}
              </p>
            )}
          </div>
        ))}
      </Reveal>

      <Reveal>
        <p
          style={{ ...serif, color: TEXT_LABEL }}
          className={`mt-14 max-w-[34rem] opacity-80 md:mt-20 ${BODY_SM}`}
        >
          Figures shown as a dash have not yet been published. Verified
          operating and financial detail is shared with qualified investors on
          request.
        </p>
      </Reveal>
    </section>
  );
}
