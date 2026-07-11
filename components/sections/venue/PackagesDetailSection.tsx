"use client";

import Image from "next/image";
import NumeralMarker from "@/components/ui/NumeralMarker";
import Reveal from "@/components/anim/Reveal";
import CircleButton from "@/components/anim/CircleButton";

const serif = { fontFamily: "var(--font-cormorant-garamond)" } as const;

// ═══════════════════════════════════════════════════════════════════════════
// ─── TUNE THESE KNOBS ──────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════
//
// Reusable detailed package listing:
//   • /venue/raj-aangan/packages  → numeral="II", title="Raj AANGAN" (image 10)
//   • /venue/raj-gharana/packages → numeral="I",  title="Raj GHARANA" (image 9)
//
// For EACH package:
//   [LEFT column: 2 stacked images]  [RIGHT column: title + desc + inclusions
//                                     + View package CTA]
//
// ═══════════════════════════════════════════════════════════════════════════

const SECTION_BG = "#ffffff";
const TEXT_COLOR = "#191919";
const MUTED_COLOR = "#4a4a4a";
const SECTION_PAD = "py-16 md:py-24";

const IMAGE_ASPECT = "aspect-[4/3]";
const FRAME_INSET = "10px";
const FRAME_COLOR = "rgba(255,255,255,0.55)";

const IMAGE_STACK_GAP = "gap-y-6";
const ROW_GAP = "gap-y-24 md:gap-y-32";
const COL_GAP = "gap-8 md:gap-16";

// ═══════════════════════════════════════════════════════════════════════════

export type PackageDetail = {
  title: string;
  description: string;
  inclusions: string[];   // bulleted list
  image1: string;
  image2: string;
  /** Where "View package" leads. Use "#" while individual pages aren't built. */
  href?: string;
};

type PackagesDetailSectionProps = {
  /** Numeral shown at top (e.g. "I", "II"). */
  numeral: string;
  /** Uppercase label alongside numeral (defaults to "OUR PACKAGES"). */
  label?: string;
  /** Big centered title, e.g. "Raj AANGAN" / "Raj GHARANA". */
  title: string;
  packages: PackageDetail[];
};

export default function PackagesDetailSection({
  numeral,
  label = "OUR PACKAGES",
  title,
  packages,
}: PackagesDetailSectionProps) {
  return (
    <section
      className={`relative w-full px-6 md:px-12 ${SECTION_PAD}`}
      style={{ backgroundColor: SECTION_BG, color: TEXT_COLOR }}
    >
      {/* Numeral + label */}
      <Reveal>
        <div className="mb-6 flex items-center justify-center gap-5">
          <NumeralMarker numeral={numeral} />
          <span
            style={serif}
            className="uppercase tracking-[0.22em] text-[clamp(0.85rem,1vw,18px)]"
          >
            {label}
          </span>
        </div>
      </Reveal>

      {/* Big title */}
      <Reveal>
        <h1
          style={serif}
          className="mx-auto mb-20 text-center font-medium text-[clamp(2.2rem,4vw,72px)]"
        >
          {title}
        </h1>
      </Reveal>

      {/* Packages */}
      <div className={`mx-auto grid w-full max-w-6xl grid-cols-1 ${ROW_GAP}`}>
        {packages.map((pkg) => (
          <Reveal key={pkg.title}>
            <PackageRow pkg={pkg} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function PackageRow({ pkg }: { pkg: PackageDetail }) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 md:items-start ${COL_GAP}`}>
      {/* LEFT — 2 stacked images */}
      <div className={`flex flex-col ${IMAGE_STACK_GAP}`}>
        <FramedImage src={pkg.image1} alt={pkg.title} />
        <FramedImage src={pkg.image2} alt={pkg.title} />
      </div>

      {/* RIGHT — text block */}
      <div className="flex flex-col">
        <h3
          style={serif}
          className="mb-5 font-semibold uppercase tracking-wide leading-tight text-[clamp(1.2rem,1.55vw,30px)]"
        >
          {pkg.title}
        </h3>

        <p
          style={{ ...serif, color: MUTED_COLOR }}
          className="leading-relaxed text-[clamp(0.95rem,1.1vw,20px)]"
        >
          {pkg.description}
        </p>

        {pkg.inclusions.length > 0 && (
          <ul className="mt-6 flex flex-col gap-y-2">
            {pkg.inclusions.map((item) => (
              <li
                key={item}
                style={{ ...serif, color: MUTED_COLOR }}
                className="flex items-start gap-3 leading-snug text-[clamp(0.9rem,1.05vw,19px)]"
              >
                <span aria-hidden className="mt-[0.4em] shrink-0 leading-none">
                  •
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-8 flex justify-start">
          <CircleButton
            href={pkg.href ?? "#"}
            circleColor="#191919"
            arrowColor="#ffffff"
            circleSize={150}
            magnet={0.3}
            className="rounded-full border border-[#191919] px-6 py-2.5 text-[#191919] text-[clamp(0.85rem,0.95vw,17px)]"
          >
            View package
          </CircleButton>
        </div>
      </div>
    </div>
  );
}

function FramedImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className={`group relative ${IMAGE_ASPECT} w-full overflow-hidden`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute z-10"
        style={{ inset: FRAME_INSET, border: `1px solid ${FRAME_COLOR}` }}
      />
    </div>
  );
}
