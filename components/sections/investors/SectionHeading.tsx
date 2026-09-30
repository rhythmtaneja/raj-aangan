import NumeralMarker from "@/components/ui/NumeralMarker";
import Reveal from "@/components/anim/Reveal";
import { EYEBROW, GOLD, H2, NUMERAL_LABEL, TEXT_LABEL, serif } from "./theme";

export type SectionProps = { numeral: string };

type Props = {
  numeral: string;

  label: string;

  eyebrow?: string;
  title: string;

  intro?: string;

  light?: boolean;

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
          <NumeralMarker numeral={numeral} light={light} />
          <span
            style={{ ...serif, color: labelColor }}
            className={NUMERAL_LABEL}
          >
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

            <span
              className="mx-auto mt-2 block h-px w-16"
              style={{ backgroundColor: GOLD }}
            />
          </div>
        </Reveal>
      )}

      <Reveal>
        <h2
          style={{ ...serif, color: titleColor ?? (light ? "#ffffff" : GOLD) }}
          className={`${eyebrow ? "mt-7 md:mt-8" : "mt-10 md:mt-14"} max-w-[min(34rem,82vw)] text-balance md:max-w-[48rem] md:[text-wrap:auto] ${H2}`}
        >
          {title}
        </h2>
      </Reveal>

      {intro && (
        <Reveal>
          <p
            style={{
              ...serif,
              color: light ? "rgba(255,255,255,0.78)" : "#2a2a2a",
            }}
            className="mt-5 max-w-[min(36rem,90vw)] leading-relaxed text-[1.0625rem] md:mt-7 md:max-w-[46rem] md:text-[clamp(1.1rem,1.45vw,1.3125rem)]"
          >
            {intro}
          </p>
        </Reveal>
      )}
    </div>
  );
}
