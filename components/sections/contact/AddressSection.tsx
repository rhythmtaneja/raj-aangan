"use client";

import Image from "next/image";
import Reveal from "@/components/anim/Reveal";
import CircleButton from "@/components/anim/CircleButton";

const serif = { fontFamily: "var(--font-cormorant-garamond)" } as const;

// ═══════════════════════════════════════════════════════════════════════════
// ─── TUNE THESE KNOBS ──────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════

// ─ Section bg — cream. MUST match HERO_BLEND_TO_COLOR in ContactHero.tsx
//   so the hero photo dissolves cleanly into this section.
const SECTION_BG = "#f5efe6";
const TEXT_COLOR = "#191919";

// ─ Content ──
const SMALL_LABEL_TEXT = "Address";
const TITLE_LINE_1 = "For Luxury";
const TITLE_LINE_2 = "Wedding & Event";
const ADDRESS_LINES = [
  "Raj Aangan Resort, The Haveli Ralawata,",
  "Near SBI Bank, Patrakar colony, Mansarover,",
  "Jaipur, Rajasthan",
];
const MAP_HREF = "https://maps.google.com/?q=Raj+Aangan+Resort+Jaipur"; // ← replace with real link

// ─ Typography ──
const SMALL_LABEL_SIZE = "clamp(1.25rem, 1.6vw, 28px)";
const TITLE_SIZE = "clamp(2.2rem, 4vw, 72px)";
const ADDRESS_SIZE = "clamp(1.15rem, 1.45vw, 26px)";

// ─ Photo ──
const PHOTO_SRC = "/images/contact-address.jpg";
const PHOTO_ASPECT = "aspect-[4/5]";

// ─ White inner outline frame (same pattern as gallery / about) ──
const FRAME_INSET = "14px";
const FRAME_COLOR = "rgba(255, 255, 255, 0.65)";

// ─ Hover zoom on the photo ──
const HOVER_SCALE = "group-hover:scale-105";
const HOVER_TRANSITION = "transition-transform duration-[800ms] ease-out";

// ═══════════════════════════════════════════════════════════════════════════

export default function AddressSection() {
  return (
    <section
      id="address"
      className="relative w-full px-6 pt-24 pb-12 md:px-16 md:pt-32 md:pb-16"
      style={{ backgroundColor: SECTION_BG, color: TEXT_COLOR }}
    >
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-16 md:grid-cols-2 md:gap-24">
        {/* LEFT — text stack, centered horizontally */}
        <div className="flex flex-col items-center text-center">
          <Reveal>
            <p
              style={{ ...serif, fontSize: SMALL_LABEL_SIZE }}
              className="mb-8 italic text-[#5a5a5a]"
            >
              {SMALL_LABEL_TEXT}
            </p>
          </Reveal>

          <Reveal>
            <h2
              style={{ ...serif, fontSize: TITLE_SIZE }}
              className="mb-10 font-semibold leading-[1.05]"
            >
              {TITLE_LINE_1}
              <br />
              {TITLE_LINE_2}
            </h2>
          </Reveal>

          <Reveal>
            <div
              style={{ fontSize: ADDRESS_SIZE }}
              className="mb-12 leading-relaxed text-[#3a3a3a]"
            >
              {ADDRESS_LINES.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </Reveal>

          <Reveal>
            <CircleButton
              href={MAP_HREF}
              circleColor="#191919"
              arrowColor="#ffffff"
              circleSize={120}
              magnet={0.35}
              className="rounded-full border border-[#191919] px-10 py-3.5 text-[#191919] text-[clamp(0.95rem,1.1vw,22px)]"
            >
              Open Map
            </CircleButton>
          </Reveal>
        </div>

        {/* RIGHT — photo with white frame + hover zoom */}
        <Reveal>
          <div className={`group relative ${PHOTO_ASPECT} w-full overflow-hidden`}>
            <Image
              src={PHOTO_SRC}
              alt="Raj Aangan luxury wedding venue"
              fill
              className={`object-cover ${HOVER_TRANSITION} ${HOVER_SCALE}`}
              sizes="(max-width: 768px) 100vw, 600px"
            />
            {/* Inner outline frame — sits above image so it stays put while zoom happens */}
            <div
              aria-hidden
              className="pointer-events-none absolute z-10"
              style={{
                inset: FRAME_INSET,
                border: `1px solid ${FRAME_COLOR}`,
              }}
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
