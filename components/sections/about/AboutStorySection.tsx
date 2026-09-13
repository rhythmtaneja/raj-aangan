"use client";

import Image from "next/image";
import NumeralMarker from "@/components/ui/NumeralMarker";
import Reveal from "@/components/anim/Reveal";

const serif = { fontFamily: "var(--font-cormorant-garamond)" } as const;

// ═══════════════════════════════════════════════════════════════════════════
// ─── TUNE THESE KNOBS ──────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════

// ─ Section bg (darker navy, matches reference image 2) ──
// MUST match HERO_BLEND_TO_COLOR in AboutHero.tsx. If they diverge, a colour
// seam appears at the hero → story boundary.
const SECTION_BG = "#081b24"; // ↓ closer to "#040e14" for near-black navy
//  ↑ closer to "#0f3a4a" to lighten
const TEXT_COLOR = "#ffffff";
const IMAGE_HOVER_TRANSITION = "transition-transform duration-[1200ms] ease-out";
const IMAGE_HOVER_SCALE = "group-hover:scale-105";

// ─ Trust title & paragraph (LEFT column, now CENTRED) ──
const STORY_TITLE = "One of Jaipur's most trusted names in luxury events and premium catering";
const TITLE_ITALIC_PORTION = "most trusted";
const STORY_PARAGRAPH =
  "At Raj Aangan Events & Caterers, we believe every celebration tells its own story. From intimate gatherings to grand royal weddings, we bring together heritage elegance, exceptional cuisine, and meticulous planning to create moments that last a lifetime. With a passion for creating unforgettable experiences, we handle every detail with care—from elegant décor and seamless event coordination to customized catering that delights every guest.";
const STORY_PARAGRAPH_FONT_SIZE = "clamp(1.0625rem, 1.35vw, 1.25rem)";
// Gap between numeral and title (bigger = more breathing room above heading)
const NUMERAL_TO_TITLE_GAP = "3.5rem";

const TEXT_STACK_GAP = "2.25rem";

// ─ Photo on the RIGHT of the top 2-col section ──
const TOP_PHOTO = "/images/about-story-1.jpg";
const TOP_PHOTO_ASPECT = "aspect-[4/5]";
// Nudge the top photo down slightly if you want it to start BELOW the numeral.
// Leave at "0" to align photo top exactly with numeral top.
const TOP_PHOTO_TOP_OFFSET = "0";

// ─ Sticky bullet box (LEFT, stays in place in SECOND row) ──
const BULLETS = [
  "Luxury with Hospitality",
  "Attention to Detail",
  "Guest Experience First",
  "Creativity & Innovation",
  "Commitment & Reliability",
];

// ─── BULLET BOX DIMENSIONS ──────────────────────────────────────
// These three knobs stretch the box. Bump them to match the tall reference
// (image 6). All three combine: padding adds outer air, gap spreads items,
// min-height forces a floor even with few items.
//
//   BOX_PADDING_Y  = top+bottom inner padding      (was py-14 ≈ 3.5rem)
//   BOX_ITEM_GAP   = space between each bullet     (was gap-6 ≈ 1.5rem)
//   BOX_MIN_HEIGHT = minimum overall box height    (new — the "stretch")
//
// If you want it even taller: bump BOX_MIN_HEIGHT to "48rem" / "56rem".
// If it looks too airy: drop BOX_ITEM_GAP to "2rem" and BOX_MIN_HEIGHT to "32rem".
const BOX_PADDING_Y = "5.5rem";
const BOX_ITEM_GAP = "2rem";
const BOX_MIN_HEIGHT = "28rem";

// ─ Scrolling photo stack (RIGHT, scrolls past the sticky box) ──
const PHOTOS = [
  "/images/about-story-2.jpg",
  "/images/about-story-3.jpg",
];

// ─ Bullet-box frame styling ──
const BOX_OUTER_OFFSET = "0.875rem";
const BOX_INNER_INSET = "0.75rem";
const BOX_OUTER_COLOR = "rgba(255,255,255,0.30)";
const BOX_INNER_COLOR = "rgba(255,255,255,0.50)";

// ─ Sticky offset from viewport top ──
const STICKY_TOP_OFFSET = "8rem";
const BOTTOM_ROW_TOP_GAP = "mt-20";

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
        LEFT  = numeral + title + paragraph, all CENTRED horizontally within col
        RIGHT = tall photo aligned to top of the row (starts at numeral level)

        Key change: `md:items-start` instead of `md:items-center` — this
        aligns both columns to the TOP. Previously the shorter left column
        was vertically centred against the taller right photo, which made the
        photo appear to start ABOVE the numeral. Now they start together.
      */}
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-12 md:grid-cols-2 md:gap-20 md:items-start">
        <div className="flex flex-col items-center text-center" style={{ gap: TEXT_STACK_GAP }}>
          <Reveal>
            <div style={{ marginBottom: `calc(${NUMERAL_TO_TITLE_GAP} - ${TEXT_STACK_GAP})` }}>
              <NumeralMarker numeral="I" light />
            </div>
          </Reveal>

          <Reveal>
            <h2
              style={serif}
              className="font-semibold leading-[1.25] text-[clamp(1.6rem,2.6vw,2.3125rem)]"
            >
              {renderItalicEmphasis(STORY_TITLE, TITLE_ITALIC_PORTION)}
            </h2>
          </Reveal>

          <Reveal>
            <p
              style={{ ...serif, fontSize: STORY_PARAGRAPH_FONT_SIZE }}
              className="max-w-lg leading-relaxed text-white/85"
            >
              {STORY_PARAGRAPH}
            </p>
          </Reveal>
        </div>

        <Reveal>
          <div
            className={`group relative ${TOP_PHOTO_ASPECT} w-full overflow-hidden`}
            style={{ marginTop: TOP_PHOTO_TOP_OFFSET }}
          >
            <Image
              src={TOP_PHOTO}
              alt="Raj Aangan story"
              fill
              className={`object-cover ${IMAGE_HOVER_TRANSITION} ${IMAGE_HOVER_SCALE}`}
              sizes="(max-width: 768px) 100vw, 600px"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute z-10"
              style={{ inset: "1.25rem", border: "1px solid rgba(255,255,255,0.45)" }}
            />
          </div>
        </Reveal>
      </div>

      {/*
        BOTTOM ROW — 2-col grid.
        LEFT  = stretched bullet box that STICKS in place while user scrolls.
        RIGHT = photo column that scrolls past.

        ─ PHONE ORDER IS REVERSED, AND THAT IS THE POINT ───────────────────
        At one column the source order runs text → photo → BOX → photo →
        photo, so the bullet box lands sandwiched between images
        (phone-changes/about1.PNG, about2.PNG). The `order-*` pair below puts
        the two scrolling photos ahead of the box on phone, giving:

            text → photo → photo → photo → box

        i.e. the three photos group into one run and the box closes the
        section. Chosen over "box first" because the top photo still breaks
        up the paragraph early, the reader is not handed a paragraph and five
        bullets back-to-back, and a framed box is a better end-cap into
        VideoSection than a third photo would be.

        `md:order-none` puts both back to source order at the breakpoint, so
        the desktop sticky-box-beside-scrolling-photos layout is untouched.
      */}
      <div className={`mx-auto ${BOTTOM_ROW_TOP_GAP} grid w-full max-w-6xl grid-cols-1 gap-16 md:grid-cols-2 md:items-start`}>
        <div
          className="order-2 md:order-none md:sticky md:self-start"
          style={{ top: STICKY_TOP_OFFSET }}
        >
          <Reveal>
            <BulletBox bullets={BULLETS} />
          </Reveal>
        </div>

        <div className="order-1 flex flex-col gap-12 md:order-none">
          {PHOTOS.map((src, i) => (
            <Reveal key={src} className="w-full">
              <div className="group relative aspect-square w-full overflow-hidden">
                <Image
                  src={src}
                  alt={`Raj Aangan story ${i + 2}`}
                  fill
                  className={`object-cover ${IMAGE_HOVER_TRANSITION} ${IMAGE_HOVER_SCALE}`}
                  sizes="(max-width: 768px) 100vw, 600px"
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute z-10"
                  style={{ inset: "1.25rem", border: "1px solid rgba(255,255,255,0.45)" }}
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
    /* The three BOX_* knobs above are sized for the desktop column, where the
       box has to stand as tall as two scrolling photos beside it. At one
       column nothing is racing it, so 5.5rem of padding on a 28rem floor left
       the box roughly 40% empty air (phone-changes/about1.PNG). Phone gets its
       own tighter set of literals; the knobs come back at `md:` through these
       custom properties, so tuning them still only means editing the
       constants. */
    <div
      className="relative min-h-[19rem] px-7 py-14 md:min-h-[var(--box-min-h)] md:px-10 md:py-[var(--box-py)]"
      style={
        {
          "--box-py": BOX_PADDING_Y,
          "--box-min-h": BOX_MIN_HEIGHT,
          "--box-gap": BOX_ITEM_GAP,
        } as React.CSSProperties
      }
    >
      {/* Outer frame — extends beyond the box */}
      <div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          inset: `-${BOX_OUTER_OFFSET}`,
          border: `1px solid ${BOX_OUTER_COLOR}`,
        }}
      />
      {/* Inner frame — inset inside the box */}
      <div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          inset: BOX_INNER_INSET,
          border: `1px solid ${BOX_INNER_COLOR}`,
        }}
      />

      {/*
        h-full + justify-center fills the box vertically and distributes
        the bullets in the vertical middle with BOX_ITEM_GAP between them.
        Combined with the min-height above, this gives the tall/stretched
        look from reference image 6.
      */}
      <ul
        className="relative flex h-full flex-col items-center justify-center gap-6 text-center md:gap-[var(--box-gap)]"
      >
        {bullets.map((b) => (
          <li
            key={b}
            style={{ ...serif, color: "#ffffff" }}
            className="text-[clamp(1.1rem,1.45vw,1.3125rem)]"
          >
            {b}
          </li>
        ))}
      </ul>
    </div>
  );
}
