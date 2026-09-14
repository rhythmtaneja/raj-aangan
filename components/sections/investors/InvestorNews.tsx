// ══════════════════════════════════════════════════════════════════
// PATH IN REPO: components/sections/investors/InvestorNews.tsx
// ══════════════════════════════════════════════════════════════════
/**
 * XI — NEWS & ANNOUNCEMENTS.
 *
 * ⚠️ RENDERS NOTHING WHILE `NEWS` IS EMPTY, and it is empty.
 *
 * The strategy doc wants dated cards for "strategic partnerships, launches,
 * expansion, major contracts" because it "makes the business feel active and
 * growing" (§3). That effect is only legitimate if the events happened.
 * Inventing a partnership announcement to fill the section would be a false
 * statement of fact to investors — a different order of problem from a
 * placeholder metric — so there is no placeholder mode here at all.
 *
 * Add entries newest-first in lib/investor-content.ts and the section appears.
 */

import Link from "next/link";
import Reveal from "@/components/anim/Reveal";
import SectionHeading, { type SectionProps } from "./SectionHeading";
import { NEWS } from "@/lib/investor-content";
import { BODY_SM, CREAM_WARM, GOLD, H3, SECTION_PAD, TEXT_BODY, TEXT_LABEL, TEXT_MUTED, serif } from "./theme";

/** Fixed locale: `toLocaleDateString()` with no argument would hydrate
    differently for a visitor in another region. */
function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export default function InvestorNews({ numeral }: SectionProps) {
  if (NEWS.length === 0) return null;

  return (
    <section
      id="news"
      className={`flex w-full flex-col items-center text-center ${SECTION_PAD}`}
      style={{ backgroundColor: CREAM_WARM }}
    >
      <SectionHeading
        numeral={numeral}
        label="News"
        eyebrow="News & Announcements"
        title="Recent developments"
      />

      <ul className="mt-14 grid w-full max-w-300 grid-cols-1 gap-y-12 md:mt-20 md:grid-cols-2 md:gap-x-20">
        {NEWS.map((n) => {
          const body = (
            <div className="flex flex-col items-center text-center">
              <span
                style={{ ...serif, color: GOLD }}
                className="text-[0.8125rem] uppercase tracking-[0.24em]"
              >
                {n.category}
              </span>
              <time
                dateTime={n.date}
                style={{ ...serif, color: TEXT_LABEL }}
                className="mt-2 text-[0.875rem]"
              >
                {formatDate(n.date)}
              </time>
              <h3 style={{ ...serif, color: TEXT_MUTED }} className={`mt-4 ${H3}`}>
                {n.title}
              </h3>
              <p style={{ ...serif, color: TEXT_BODY }} className={`mt-4 max-w-[26rem] ${BODY_SM}`}>
                {n.body}
              </p>
            </div>
          );

          return (
            <li key={n.title}>
              <Reveal>
                {n.href ? (
                  <Link href={n.href} className="block transition-opacity duration-300 hover:opacity-70">
                    {body}
                  </Link>
                ) : (
                  body
                )}
              </Reveal>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
