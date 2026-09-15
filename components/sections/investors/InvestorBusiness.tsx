// ══════════════════════════════════════════════════════════════════
// PATH IN REPO: components/sections/investors/InvestorBusiness.tsx
// ══════════════════════════════════════════════════════════════════
/**
 * III — OUR BUSINESS. The four verticals from the client's layout.jpeg.
 *
 * Rebuilt as WhatWeOfferSection's staggered image cards: a photograph with the
 * inset white frame, a dark overlay, and the title + copy centred ON the
 * image — then alternate cards pushed down to break the grid. That card is
 * already this site's way of presenting "here are our services", which is
 * exactly what this section is, told to a different audience.
 *
 * Each card links to the marketing page for that vertical, so an investor can
 * check the claim against what the business actually sells, one click away.
 */

import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/anim/Reveal";
import ImageOverlay from "@/components/ui/ImageOverlay";
import SectionHeading, { type SectionProps } from "./SectionHeading";
import { BUSINESS } from "@/lib/investor-content";
import { CREAM_DEEP, GOLD, H3, NUMERAL_STEP, PHOTO_FRAME_COLOR, PHOTO_FRAME_INSET, SECTION_PAD, serif } from "./theme";

/* One image per vertical, drawn from what the site already ships. */
const IMAGES: Record<string, string> = {
  "01": "/images/offer-wedding-planning.jpg",
  "02": "/images/about-1.jpg",
  "03": "/images/about-story-1.jpg",
  "04": "/images/about-2.jpg",
};

const CARD_OVERLAY_OPACITY = 0.52;
/* Odd cards drop to build the staggered grid. = WhatWeOfferSection. */
const CARD_VERTICAL_OFFSET = "md:mt-28";

export default function InvestorBusiness({ numeral }: SectionProps) {
  return (
    <section
      id="business"
      className={`flex w-full flex-col items-center text-center ${SECTION_PAD}`}
      style={{ backgroundColor: CREAM_DEEP }}
    >
      <SectionHeading
        numeral={numeral}
        label="Our Business"
        eyebrow="Four Verticals"
        title="One operating platform"
        intro="Each vertical stands on its own revenue, and each creates demand for the others. That compounding is what separates an integrated operator from a single-service vendor."
      />

      <div className="mt-16 grid w-full max-w-300 grid-cols-1 gap-x-10 gap-y-12 md:mt-24 md:grid-cols-2 md:gap-x-28 md:gap-y-20">
        {BUSINESS.map((b, i) => (
          <Reveal key={b.num} className={i % 2 === 1 ? CARD_VERTICAL_OFFSET : undefined}>
            <Link href={b.href} className="group flex flex-col">
              <div className="relative aspect-[4/5] w-full overflow-hidden">
                <Image
                  src={IMAGES[b.num]}
                  alt={b.title}
                  fill
                  className="object-cover transition-transform duration-[1500ms] ease-out group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <ImageOverlay opacity={CARD_OVERLAY_OPACITY} />
                <div
                  aria-hidden
                  className="pointer-events-none absolute z-10"
                  style={{ inset: PHOTO_FRAME_INSET, border: `1px solid ${PHOTO_FRAME_COLOR}` }}
                />

                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-8 text-center text-white md:px-10">
                  <span
                    style={{ ...serif, color: GOLD }}
                    /* NUMERAL_STEP (theme.ts) plus the text-shadow the title
                       and body carry — the numeral sits over whatever the
                       photograph happens to be doing up there, which on a
                       daylight shot is near-white. */
                    className={`${NUMERAL_STEP} [text-shadow:0_1px_8px_rgba(0,0,0,0.55)]`}
                  >
                    {b.num}
                  </span>
                  <h3
                    style={serif}
                    className={`mt-3 [text-shadow:0_1px_8px_rgba(0,0,0,0.55)] ${H3}`}
                  >
                    {b.title}
                  </h3>
                  <p
                    style={serif}
                    className="mt-4 max-w-sm leading-relaxed text-[0.9375rem] [text-shadow:0_1px_8px_rgba(0,0,0,0.55)] md:text-[clamp(0.95rem,1.15vw,1.0625rem)]"
                  >
                    {b.body}
                  </p>
                  <span
                    style={serif}
                    className="mt-6 text-[0.8125rem] uppercase tracking-[0.2em] opacity-80 transition-opacity duration-300 group-hover:opacity-100"
                  >
                    View {b.title} →
                  </span>
                </div>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
