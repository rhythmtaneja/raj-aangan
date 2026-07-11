"use client";

import Image from "next/image";
import Reveal from "@/components/anim/Reveal";
import CircleButton from "@/components/anim/CircleButton";

const serif = { fontFamily: "var(--font-cormorant-garamond)" } as const;

// ═══════════════════════════════════════════════════════════════════════════
// ─── TUNE THESE KNOBS ──────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════

// ─ Three horizontal bands ──
// Layout: white title strip → navy card strip → white CTA strip.
const TOP_BG = "#ffffff";
const MIDDLE_BG = "#0f2f3b"; // dark navy — same family as ContactForm bg
const BOTTOM_BG = "#ffffff";

const TITLE_COLOR = "#191919";

// ─ Vertical padding per band ──
const TOP_PAD = "py-16";
const MIDDLE_PAD = "py-14";
const BOTTOM_PAD = "py-12";

// ─ Card image ──
const CARD_ASPECT = "aspect-[3/4]"; // matches Figma package cards
const FRAME_INSET = "10px";
const FRAME_COLOR = "rgba(255,255,255,0.55)";

// ═══════════════════════════════════════════════════════════════════════════

type Pkg = { name: string; image: string };

const PACKAGES: Pkg[] = [
  { name: "Essence Package", image: "/images/events-pkg-essence.jpg" },
  { name: "Select Package", image: "/images/events-pkg-select.jpg" },
  { name: "Prestige Package", image: "/images/events-pkg-prestige.jpg" },
  { name: "Grandeur Package", image: "/images/events-pkg-grandeur.jpg" },
];

export default function WeddingPackagesSection() {
  return (
    <section className="relative w-full">
      {/* TOP — white with title */}
      <div className={`w-full ${TOP_PAD}`} style={{ backgroundColor: TOP_BG }}>
        <Reveal>
          <h2
            style={{ ...serif, color: TITLE_COLOR }}
            className="text-center font-medium text-[clamp(1.9rem,3.2vw,58px)]"
          >
            Wedding Packages
          </h2>
        </Reveal>
      </div>

      {/* MIDDLE — dark navy with 4 package cards in a row */}
      <div className={`w-full ${MIDDLE_PAD} px-6 md:px-12`} style={{ backgroundColor: MIDDLE_BG }}>
        <div className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
          {PACKAGES.map((p) => (
            <Reveal key={p.name}>
              <PackageCard {...p} />
            </Reveal>
          ))}
        </div>
      </div>

      {/* BOTTOM — white with two CTA buttons */}
      <div className={`w-full ${BOTTOM_PAD} px-6`} style={{ backgroundColor: BOTTOM_BG }}>
        <div className="mx-auto flex max-w-4xl flex-col items-center justify-center gap-6 sm:flex-row sm:gap-10">
          <CircleButton
            href="#plan-wedding"
            circleColor="#191919"
            arrowColor="#ffffff"
            circleSize={150}
            magnet={0.35}
            arrowDirection="right"
            className="rounded-full border border-[#191919] px-8 py-3.5 text-[#191919] text-[clamp(0.95rem,1.05vw,20px)]"
          >
            Plan Your wedding
          </CircleButton>

          <CircleButton
            href="/brochure.pdf"
            circleColor="#191919"
            arrowColor="#ffffff"
            circleSize={150}
            magnet={0.35}
            arrowDirection="down"
            className="rounded-full border border-[#191919] px-8 py-3.5 text-[#191919] text-[clamp(0.95rem,1.05vw,20px)]"
          >
            Download Brochure
          </CircleButton>
        </div>
      </div>
    </section>
  );
}

function PackageCard({ name, image }: Pkg) {
  return (
    <div className="group flex flex-col">
      <div className={`relative ${CARD_ASPECT} w-full overflow-hidden`}>
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
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
        className="mt-4 text-center text-white text-[clamp(0.95rem,1.05vw,20px)]"
      >
        {name}
      </p>
    </div>
  );
}
