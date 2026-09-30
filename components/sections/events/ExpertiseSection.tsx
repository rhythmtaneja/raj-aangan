"use client";

import Image from "next/image";
import Reveal from "@/components/anim/Reveal";

const serif = { fontFamily: "var(--font-cormorant-garamond)" } as const;

const SECTION_BG = "#ffffff";
const TITLE_COLOR = "#191919";
const BULLET_COLOR = "#191919";
const SECTION_PAD = "py-20 md:py-24";

const IMAGE_ASPECT = "aspect-square";
const FRAME_INSET = "0.875rem";
const FRAME_COLOR = "rgba(255,255,255,0.6)";

const TEXT_COLUMN_OFFSET = "md:pl-8 md:pl-12";
const TITLE_SIZE = "text-[clamp(2rem,3.2vw,2.875rem)]";
const BULLET_SIZE = "text-[clamp(1.1rem,1.35vw,1.1875rem)]";
const BULLET_MARKER_SIZE = "text-xl";

const BULLET_GAP = "gap-y-5";

type ExpertiseSectionProps = {
  title: string;

  titleItalic?: string;

  titleAfter?: string;

  image: string;

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
        <Reveal>
          <div
            className={`group relative ${IMAGE_ASPECT} w-full overflow-hidden`}
          >
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

        <div className={`flex flex-col ${TEXT_COLUMN_OFFSET}`}>
          <Reveal>
            <h2
              style={{ ...serif, color: TITLE_COLOR }}
              className={`mb-8 font-medium leading-tight ${TITLE_SIZE}`}
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
                  ? "grid grid-cols-1 md:grid-cols-2 gap-x-8"
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
                      className={`flex items-start gap-3 leading-snug ${BULLET_SIZE}`}
                    >
                      <span
                        aria-hidden
                        className={`mt-[0.35em] shrink-0 leading-none ${BULLET_MARKER_SIZE}`}
                      >
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
