"use client";

import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/anim/Reveal";

const serif = { fontFamily: "var(--font-cormorant-garamond)" } as const;

// ═══════════════════════════════════════════════════════════════════════════
// ─── TUNE THESE KNOBS ──────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════

const TOP_BG    = "#ffffff";
const MIDDLE_BG = "#0f2f3b"; // dark navy — matches VenuePackagesSection

const TITLE_COLOR = "#191919";

const TOP_PAD    = "py-12 md:py-14";
const MIDDLE_PAD = "py-14 md:py-16";

const CARD_ASPECT = "aspect-square";
const FRAME_INSET = "10px";
const FRAME_COLOR = "rgba(255,255,255,0.55)";

// ═══════════════════════════════════════════════════════════════════════════

export type PackageOverview = {
  name:  string;
  image: string;
  /** Optional anchor / route the card should link to. */
  href?: string;
};

type PackagesOverviewSectionProps = {
  /** Section title, e.g. "Raj Aangan Package" / "Raj Gharana Package". */
  title:    string;
  /** 2-4 packages. Renders as a horizontal grid. */
  packages: PackageOverview[];
};

export default function PackagesOverviewSection({
  title,
  packages,
}: PackagesOverviewSectionProps) {
  const cols = packages.length === 4 ? "md:grid-cols-4" : "md:grid-cols-3";

  return (
    <section className="relative w-full">
      {/* TOP — white title band */}
      <div className={`w-full ${TOP_PAD}`} style={{ backgroundColor: TOP_BG }}>
        <Reveal>
          <h2
            style={{ ...serif, color: TITLE_COLOR }}
            className="text-center font-medium text-[clamp(1.6rem,2.8vw,48px)]"
          >
            {title}
          </h2>
        </Reveal>
      </div>

      {/* MIDDLE — navy card strip */}
      <div
        className={`w-full ${MIDDLE_PAD} px-6 md:px-12`}
        style={{ backgroundColor: MIDDLE_BG }}
      >
        <div className={`mx-auto grid w-full max-w-6xl grid-cols-1 gap-8 sm:grid-cols-2 ${cols}`}>
          {packages.map((p) => (
            <Reveal key={p.name}>
              <OverviewCard {...p} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function OverviewCard({ name, image, href }: PackageOverview) {
  const Wrapper = href ? Link : "div";
  const wrapperProps = href ? { href } : {};

  return (
    // @ts-expect-error — conditional element
    <Wrapper {...wrapperProps} className="group flex flex-col">
      <div className={`relative ${CARD_ASPECT} w-full overflow-hidden`}>
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, 25vw"
          className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute z-10"
          style={{ inset: FRAME_INSET, border: `1px solid ${FRAME_COLOR}` }}
        />
      </div>
      <p
        style={serif}
        className="mt-5 text-center text-white leading-tight text-[clamp(0.95rem,1.1vw,20px)]"
      >
        {name}
      </p>
    </Wrapper>
  );
}
