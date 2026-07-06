"use client";

import Image from "next/image";
import NumeralMarker from "@/components/ui/NumeralMarker";
import Reveal from "@/components/anim/Reveal";

const serif = { fontFamily: "var(--font-cormorant-garamond)" } as const;

// ═══════════════════════════════════════════════════════════════════════════
// ─── TUNE THESE KNOBS ──────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════
//
// Reusable page-body for resort detail pages:
//   • /venue/raj-aangan  → numeral="I",  label="RAJ AANGAN RESORT" (image 4)
//   • /venue/raj-gharana → numeral="II", label="RAJ GHARANA RESORT" (image 5)
//
// Layout:
//   Top     — centered numeral + label + big title
//   Intro   — [hero image | description paragraph]
//   Areas   — repeated 2-col rows [area image | area title + copy]
//
// ═══════════════════════════════════════════════════════════════════════════

const SECTION_BG   = "#ffffff";
const TEXT_COLOR   = "#191919";
const MUTED_COLOR  = "#4a4a4a";
const SECTION_PAD  = "py-16 md:py-24";

// Image styling on left column
const IMAGE_ASPECT = "aspect-[4/3]";
const FRAME_INSET  = "12px";
const FRAME_COLOR  = "rgba(255,255,255,0.55)";

// Vertical rhythm between rows
const ROW_GAP = "gap-y-16 md:gap-y-24";

// Column gap
const COL_GAP = "gap-8 md:gap-16";

// ═══════════════════════════════════════════════════════════════════════════

export type Area = {
  title:       string;
  description: string;
  image:       string;
  /**
   * Optional capacity block rendered below the description.
   * String array → each line rendered as a plain line.
   * For bulleted capacity breakdowns pass strings prefixed with "• ".
   */
  capacityLines?: string[];
};

type PropertyDetailSectionProps = {
  /** Roman numeral shown at top (e.g. "I", "II"). */
  numeral: string;
  /** Uppercase label alongside the numeral (e.g. "RAJ AANGAN RESORT"). */
  label:   string;
  /** Big serif page title. */
  title:   string;
  /** Hero image below the title. */
  heroImage: string;
  /** Description paragraph rendered next to the hero image. */
  intro:   string;
  /** Areas — each renders as a 2-col row. */
  areas:   Area[];
};

export default function PropertyDetailSection({
  numeral,
  label,
  title,
  heroImage,
  intro,
  areas,
}: PropertyDetailSectionProps) {
  return (
    <section
      className={`relative w-full px-6 md:px-12 ${SECTION_PAD}`}
      style={{ backgroundColor: SECTION_BG, color: TEXT_COLOR }}
    >
      {/* Numeral + label */}
      <Reveal>
        <div className="mb-10 flex items-center justify-center gap-5">
          <NumeralMarker numeral={numeral} />
          <span
            style={serif}
            className="uppercase tracking-[0.22em] text-[clamp(0.85rem,1vw,18px)]"
          >
            {label}
          </span>
        </div>
      </Reveal>

      {/* Title */}
      <Reveal>
        <h1
          style={serif}
          className="mx-auto mb-20 max-w-4xl text-center font-medium leading-tight text-[clamp(2rem,3.6vw,64px)]"
        >
          {title}
        </h1>
      </Reveal>

      {/* Intro row — hero image + description */}
      <Reveal>
        <div className={`mx-auto grid w-full max-w-6xl grid-cols-1 md:grid-cols-2 md:items-center ${COL_GAP} mb-20`}>
          <FramedImage src={heroImage} alt={label} />
          <p
            style={{ ...serif, color: MUTED_COLOR }}
            className="text-center leading-relaxed md:text-left text-[clamp(0.95rem,1.15vw,22px)]"
          >
            {intro}
          </p>
        </div>
      </Reveal>

      {/* Areas — repeated 2-col rows */}
      <div className={`mx-auto grid w-full max-w-6xl grid-cols-1 ${ROW_GAP}`}>
        {areas.map((area) => (
          <Reveal key={area.title}>
            <AreaRow area={area} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function AreaRow({ area }: { area: Area }) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 md:items-center ${COL_GAP}`}>
      <FramedImage src={area.image} alt={area.title} />
      <div className="flex flex-col">
        <h3
          style={serif}
          className="mb-4 font-semibold text-[clamp(1.25rem,1.65vw,32px)]"
        >
          {area.title}
        </h3>
        <p
          style={{ ...serif, color: MUTED_COLOR }}
          className="leading-relaxed text-[clamp(0.95rem,1.1vw,20px)]"
        >
          {area.description}
        </p>
        {area.capacityLines && area.capacityLines.length > 0 && (
          <div
            style={{ ...serif, color: MUTED_COLOR }}
            className="mt-4 leading-relaxed text-[clamp(0.95rem,1.1vw,20px)]"
          >
            {area.capacityLines.map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        )}
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
