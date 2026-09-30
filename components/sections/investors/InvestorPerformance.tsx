import Reveal from "@/components/anim/Reveal";
import SectionHeading, { type SectionProps } from "./SectionHeading";
import {
  PERFORMANCE_FALLBACK,
  PERFORMANCE_UNIT,
  PERFORMANCE_YEARS,
} from "@/lib/investor-content";
import {
  BODY,
  CREAM,
  GOLD,
  INK,
  SECTION_PAD,
  TEXT_BODY,
  TEXT_LABEL,
  TEXT_MUTED,
  serif,
} from "./theme";

export default function InvestorPerformance({ numeral }: SectionProps) {
  const years = PERFORMANCE_YEARS;
  const hasRevenue = years.some((y) => y.revenue !== null);
  const maxRevenue = Math.max(...years.map((y) => y.revenue ?? 0), 1);

  return (
    <section
      id="performance"
      className={`flex w-full flex-col items-center text-center ${SECTION_PAD}`}
      style={{ backgroundColor: CREAM }}
    >
      <SectionHeading
        numeral={numeral}
        label="Performance"
        eyebrow="Business Performance"
        title="Operating and financial results"
      />

      {years.length === 0 || !hasRevenue ? (
        <Reveal>
          <div className="mt-12 flex max-w-[40rem] flex-col items-center md:mt-16">
            <p style={{ ...serif, color: TEXT_BODY }} className={BODY}>
              {PERFORMANCE_FALLBACK}
            </p>
            <span
              aria-hidden
              className="mt-8 block h-px w-16"
              style={{ backgroundColor: GOLD }}
            />
            <a
              href="#enquiry"
              style={{ ...serif, color: TEXT_MUTED }}
              className="mt-8 text-[0.875rem] uppercase tracking-[0.2em] transition-opacity duration-300 hover:opacity-70"
            >
              Request data-room access →
            </a>
          </div>
        </Reveal>
      ) : (
        <Reveal>
          <div className="mt-12 w-full max-w-[44rem] md:mt-16">
            <p
              style={{ ...serif, color: TEXT_LABEL }}
              className="mb-8 text-[0.8125rem] uppercase tracking-[0.2em]"
            >
              Revenue · {PERFORMANCE_UNIT}
            </p>

            <ul className="flex flex-col gap-4 md:gap-5">
              {years.map((y) => (
                <li key={y.year} className="flex items-center gap-4 md:gap-6">
                  <span
                    style={{ ...serif, color: TEXT_MUTED }}
                    className="w-14 shrink-0 text-left text-[0.9375rem] md:w-20 md:text-[1.0625rem]"
                  >
                    {y.year}
                  </span>
                  <span
                    className="relative h-6 flex-1 md:h-8"
                    style={{ backgroundColor: "rgba(25,25,25,0.08)" }}
                  >
                    <span
                      className="absolute inset-y-0 left-0"
                      style={{
                        backgroundColor: INK,
                        width: `${((y.revenue ?? 0) / maxRevenue) * 100}%`,
                      }}
                    />
                  </span>
                  <span
                    style={{
                      ...serif,
                      color: y.revenue === null ? "#9a958d" : TEXT_MUTED,
                    }}
                    className="w-16 shrink-0 text-right text-[0.9375rem] tabular-nums md:w-24 md:text-[1.0625rem]"
                  >
                    {y.revenue ?? "—"}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-8 md:mt-16 md:grid-cols-4">
              {years
                .filter((y) => y.ebitdaMargin !== null || y.events !== null)
                .map((y) => (
                  <div
                    key={`m-${y.year}`}
                    className="flex flex-col items-center text-center"
                  >
                    <p
                      style={{ ...serif, color: TEXT_LABEL }}
                      className="text-[0.8125rem] uppercase tracking-[0.2em]"
                    >
                      {y.year}
                    </p>
                    {y.ebitdaMargin !== null && (
                      <p
                        style={{ ...serif, color: TEXT_MUTED }}
                        className="mt-2 text-[1.5rem] font-medium"
                      >
                        {y.ebitdaMargin}%
                      </p>
                    )}
                    {y.events !== null && (
                      <p
                        style={{ ...serif, color: TEXT_BODY }}
                        className="mt-1 text-[0.9375rem]"
                      >
                        {y.events} events
                      </p>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </Reveal>
      )}
    </section>
  );
}
