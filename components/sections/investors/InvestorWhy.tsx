import Reveal from "@/components/anim/Reveal";
import SectionHeading, { type SectionProps } from "./SectionHeading";
import { WHY } from "@/lib/investor-content";
import {
  BODY_SM,
  GOLD,
  H3,
  INK,
  NUMERAL_STEP,
  SECTION_PAD,
  serif,
} from "./theme";

export default function InvestorWhy({ numeral }: SectionProps) {
  return (
    <section
      id="why"
      className={`flex w-full flex-col items-center text-center ${SECTION_PAD}`}
      style={{ backgroundColor: INK }}
    >
      <SectionHeading
        light
        numeral={numeral}
        label="Why Raj Aangan"
        eyebrow="Investment Strengths"
        title="The case for the business"
      />

      <Reveal
        stagger
        staggerEach={0.1}
        className="mt-14 grid w-full max-w-300 grid-cols-1 gap-y-12 md:mt-20 md:grid-cols-3 md:gap-x-14 md:gap-y-16"
      >
        {WHY.map((w, i) => (
          <div
            key={w.title}
            className="flex flex-col items-center px-2 text-center"
          >
            <span style={{ ...serif, color: GOLD }} className={NUMERAL_STEP}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <span
              aria-hidden
              className="mt-3 block h-px w-8"
              style={{ backgroundColor: GOLD }}
            />
            <h3 style={{ ...serif, color: "#ffffff" }} className={`mt-5 ${H3}`}>
              {w.title}
            </h3>
            <p
              style={{ ...serif, color: "rgba(255,255,255,0.72)" }}
              className={`mt-4 max-w-[22rem] ${BODY_SM}`}
            >
              {w.body}
            </p>
          </div>
        ))}
      </Reveal>
    </section>
  );
}
