"use client";

import Image from "next/image";
import NumeralMarker from "@/components/ui/NumeralMarker";
import Reveal from "@/components/anim/Reveal";

const serif = { fontFamily: "var(--font-cormorant-garamond)" } as const;

// ═══════════════════════════════════════════════════════════════════════════
// ─── TUNE THESE KNOBS ──────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════

// ─ Section bg (dark teal matches figma image 1) ──
const SECTION_BG = "#0f3a4a";
const TEXT_COLOR = "#ffffff";

// ─ Trust title (LEFT column of the top 2-col section) ──
const STORY_TITLE = "One of Jaipur's most trusted names in luxury events and premium catering";
const TITLE_ITALIC_PORTION = "most trusted";

// ─ Paragraph copy (below the title in the LEFT column) ──
const STORY_PARAGRAPH =
  "At Raj Aangan Events & Caterers, we believe every celebration tells its own story. From intimate gatherings to grand royal weddings, we bring together heritage elegance, exceptional cuisine, and meticulous planning to create moments that last a lifetime.";

// ─ Photo on the RIGHT of the top 2-col section ──
// Tall vertical photo (matches reference image 1).
const TOP_PHOTO = "/images/about-story-1.jpg";
const TOP_PHOTO_ASPECT = "aspect-[3/4]"; // try aspect-[4/5] for shorter

// ─ Sticky bullet box (LEFT, stays in place in the SECOND row) ──
const BULLETS = [
  "Luxury with Hospitality",
  "Attention to Detail",
  "Guest Experience First",
  "Creativity & Innovation",
  "Commitment & Reliability",
];

// ─ Scrolling photo stack (RIGHT, scrolls past the sticky box) ──
const PHOTOS = [
  "/images/about-story-2.jpg",
  "/images/about-story-3.jpg",
];

// ─ Bullet-box frame styling (matches FeaturedSection outline pattern) ──
const BOX_OUTER_OFFSET = "14px";
const BOX_INNER_INSET = "12px";
const BOX_OUTER_COLOR = "rgba(255,255,255,0.30)";
const BOX_INNER_COLOR = "rgba(255,255,255,0.50)";

// ─ Sticky offset from viewport top ──
const STICKY_TOP_OFFSET = "8rem";

// ═══════════════════════════════════════════════════════════════════════════

export default function AboutStorySection() {
  return (
    <section
      id="story"
      className="relative w-full px-6 py-32 md:px-12"
      style={{ backgroundColor: SECTION_BG, color: TEXT_COLOR }}
    >
      {/*
        TOP ROW — 2-col grid.
        LEFT  = numeral + title + paragraph
        RIGHT = tall photo
        Matches reference image 1 (the "Dear guests, we would like to welcome
        you in our wellness hotel Kaskady" + paragraph + photo layout).
      */}
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-12 md:grid-cols-2 md:gap-20 md:items-center">
        <div className="flex flex-col">
          <Reveal>
            <div className="mb-12">
              <NumeralMarker numeral="I" light />
            </div>
          </Reveal>

          <Reveal>
            <h2
              style={serif}
              className="font-semibold leading-[1.15] text-[clamp(1.8rem,2.8vw,54px)]"
            >
              {renderItalicEmphasis(STORY_TITLE, TITLE_ITALIC_PORTION)}
            </h2>
          </Reveal>

          <Reveal>
            <p
              style={serif}
              className="mt-8 leading-relaxed text-white/85 text-[clamp(0.95rem,1.15vw,22px)]"
            >
              {STORY_PARAGRAPH}
            </p>
          </Reveal>
        </div>

        <Reveal>
          <div className={`relative ${TOP_PHOTO_ASPECT} w-full overflow-hidden`}>
            <Image
              src={TOP_PHOTO}
              alt="Raj Aangan story"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 600px"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute"
              style={{ inset: "20px", border: "1px solid rgba(255,255,255,0.45)" }}
            />
          </div>
        </Reveal>
      </div>

      {/*
        BOTTOM ROW — 2-col grid.
        LEFT  = bullet box that STICKS in place.
        RIGHT = photo column that SCROLLS past it.
        Same pattern as homepage AboutSection (flipped: text sticks, photos scroll).
      */}
      <div className="mx-auto mt-32 grid w-full max-w-6xl grid-cols-1 gap-16 md:grid-cols-2 md:items-start">
        <div
          className="md:sticky md:self-start"
          style={{ top: STICKY_TOP_OFFSET }}
        >
          <Reveal>
            <BulletBox bullets={BULLETS} />
          </Reveal>
        </div>

        <div className="flex flex-col gap-12">
          {PHOTOS.map((src, i) => (
            <Reveal key={src}>
              <div className="relative aspect-square w-full overflow-hidden">
                <Image
                  src={src}
                  alt={`Raj Aangan story ${i + 2}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 600px"
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute"
                  style={{ inset: "20px", border: "1px solid rgba(255,255,255,0.45)" }}
                />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Helpers ─────────────────────────────────────────────────────────── */

function renderItalicEmphasis(text: string, italicPortion: string) {
  const idx = text.indexOf(italicPortion);
  if (idx === -1) return text;
  const before = text.slice(0, idx);
  const after = text.slice(idx + italicPortion.length);
  return (
    <>
      {before}
      <span className="italic">{italicPortion}</span>
      {after}
    </>
  );
}

function BulletBox({ bullets }: { bullets: string[] }) {
  return (
    <div className="relative px-10 py-14">
      <div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          inset: `-${BOX_OUTER_OFFSET}`,
          border: `1px solid ${BOX_OUTER_COLOR}`,
        }}
      />
      <div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          inset: BOX_INNER_INSET,
          border: `1px solid ${BOX_INNER_COLOR}`,
        }}
      />

      <ul className="relative flex flex-col items-center gap-6 text-center">
        {bullets.map((b) => (
          <li
            key={b}
            style={{ ...serif, color: "#ffffff" }}
            className="text-[clamp(1.1rem,1.45vw,28px)]"
          >
            {b}
          </li>
        ))}
      </ul>
    </div>
  );
}
