"use client";

import Image from "next/image";
import Reveal from "@/components/anim/Reveal";

const serif = { fontFamily: "var(--font-cormorant-garamond)" } as const;

// ═══════════════════════════════════════════════════════════════════════════
// ─── TUNE THESE KNOBS ──────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════
//
// Reusable "image on the left, title + bulleted list on the right" section.
// Used TWICE on the events page:
//   1. "Celebration we Curate"  — 2-column bullets, italic "we" in title
//   2. "Our Expertise"          — 1-column bullets
//
// Both instances share:
//   - White bg
//   - Image on the left with the site's inner-outline frame
//   - Hover zoom on the image (matches the site-wide pattern)
//   - Serif title on the right, bullets below
//
// ═══════════════════════════════════════════════════════════════════════════

const SECTION_BG   = "#ffffff";
const TITLE_COLOR  = "#191919";
const BULLET_COLOR = "#191919";
const SECTION_PAD  = "py-20 md:py-24";

// Image
const IMAGE_ASPECT = "aspect-square"; // matches Figma
const FRAME_INSET  = "14px";
const FRAME_COLOR  = "rgba(255,255,255,0.6)"; // reads against darker photos

// Bullet layout
const BULLET_GAP = "gap-y-5";

// ═══════════════════════════════════════════════════════════════════════════

type ExpertiseSectionProps = {
  /** Main title, e.g. "Celebration" or "Our Expertise". */
  title: string;
  /** Optional italic word rendered mid-title, e.g. "we" in "Celebration we Curate". */
  titleItalic?: string;
  /** Optional text after the italic word, e.g. "Curate". */
  titleAfter?: string;
  /** Image path. */
  image: string;
  /**
   * Bullets as an array of columns.
   *   Single-column: [["item1", "item2", ...]]
   *   Two-column:    [["colA-item1", "colA-item2"], ["colB-item1", "colB-item2"]]
   */
  columns: string[][];
};

export default function ExpertiseSection({
  title,
  titleItalic,
  titleAfter,
  image,
  columns,
}: ExpertiseSectionProps) {
  return (
    <section
      className={`relative w-full px-6 md:px-12 ${SECTION_PAD}`}
      style={{ backgroundColor: SECTION_BG }}
    >
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-12 md:grid-cols-2 md:items-center md:gap-16">
        {/* LEFT — Image with frame + hover zoom */}
        <Reveal>
          <div className={`group relative ${IMAGE_ASPECT} w-full overflow-hidden`}>
            <Image
              src={image}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, 600px"
              className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute z-10"
              style={{ inset: FRAME_INSET, border: `1px solid ${FRAME_COLOR}` }}
            />
          </div>
        </Reveal>

        {/* RIGHT — Title + bullets */}
        <div className="flex flex-col">
          <Reveal>
            <h2
              style={{ ...serif, color: TITLE_COLOR }}
              className="mb-8 font-medium leading-tight text-[clamp(1.75rem,2.8vw,52px)]"
            >
              {title}
              {titleItalic && (
                <>
                  {" "}
                  <em className="italic">{titleItalic}</em>
                </>
              )}
              {titleAfter && <> {titleAfter}</>}
            </h2>
          </Reveal>

          <Reveal>
            <div
              className={
                columns.length === 2
                  ? "grid grid-cols-1 sm:grid-cols-2 gap-x-8"
                  : "grid grid-cols-1"
              }
            >
              {columns.map((col, ci) => (
                <ul
                  key={ci}
                  className={`flex flex-col ${BULLET_GAP}`}
                  style={{ color: BULLET_COLOR }}
                >
                  {col.map((item) => (
                    <li
                      key={item}
                      style={serif}
                      className="flex items-start gap-3 leading-snug text-[clamp(0.95rem,1.15vw,22px)]"
                    >
                      <span aria-hidden className="mt-[0.35em] shrink-0 text-lg leading-none">
                        •
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
