import Reveal from "@/components/anim/Reveal";
import SectionHeading, { type SectionProps } from "./SectionHeading";
import { DATA_ROOM, DOCUMENTS } from "@/lib/investor-content";
import {
  BODY_SM,
  CREAM,
  GOLD,
  H3,
  SECTION_PAD,
  TEXT_BODY,
  TEXT_LABEL,
  TEXT_MUTED,
  serif,
} from "./theme";

const isLive = (href: string) => href !== "#" && href.trim() !== "";

export default function InvestorDocuments({ numeral }: SectionProps) {
  return (
    <section
      id="documents"
      className={`flex w-full flex-col items-center text-center ${SECTION_PAD}`}
      style={{ backgroundColor: CREAM }}
    >
      <SectionHeading
        numeral={numeral}
        label="Documents"
        eyebrow="Investor Resources"
        title="Company profile, presentation and reports"
      />

      <ul className="mt-14 w-full max-w-[46rem] md:mt-20">
        {DOCUMENTS.map((d) => {
          const live = isLive(d.href);

          const row = (
            <div className="flex flex-col items-center gap-2 py-7 text-center md:flex-row md:justify-between md:gap-8 md:py-8 md:text-left">
              <div className="min-w-0">
                <h3
                  style={{ ...serif, color: live ? TEXT_MUTED : "#9a958d" }}
                  className={H3}
                >
                  {d.title}
                </h3>
                <p
                  style={{ ...serif, color: live ? TEXT_BODY : "#9a958d" }}
                  className="mt-2 text-[0.9375rem] leading-snug md:text-[1rem]"
                >
                  {d.description}
                </p>
              </div>
              <span
                style={{ ...serif, color: live ? GOLD : TEXT_LABEL }}
                className="shrink-0 text-[0.8125rem] uppercase tracking-[0.2em] opacity-90"
              >
                {live ? (d.meta ? `${d.meta} ↓` : "Download ↓") : "Coming soon"}
              </span>
            </div>
          );

          return (
            <li
              key={d.title}
              className="border-t"
              style={{ borderColor: "rgba(25,25,25,0.12)" }}
            >
              <Reveal>
                {live ? (
                  <a
                    href={d.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block transition-opacity duration-300 hover:opacity-70"
                  >
                    {row}
                  </a>
                ) : (
                  <div aria-disabled>{row}</div>
                )}
              </Reveal>
            </li>
          );
        })}
      </ul>

      <Reveal>
        <div className="mt-14 flex max-w-[40rem] flex-col items-center md:mt-20">
          <h3 style={{ ...serif, color: TEXT_MUTED }} className={H3}>
            {DATA_ROOM.title}
          </h3>
          <span
            aria-hidden
            className="mt-3 block h-px w-16"
            style={{ backgroundColor: GOLD }}
          />
          <p
            style={{ ...serif, color: TEXT_BODY }}
            className={`mt-5 ${BODY_SM}`}
          >
            {DATA_ROOM.body}
          </p>
          <a
            href="#enquiry"
            style={{ ...serif, color: TEXT_MUTED }}
            className="mt-7 text-[0.875rem] uppercase tracking-[0.2em] transition-opacity duration-300 hover:opacity-70"
          >
            Request access →
          </a>
        </div>
      </Reveal>
    </section>
  );
}
