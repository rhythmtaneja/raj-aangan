"use client";

import Image from "next/image";
import Reveal from "@/components/anim/Reveal";
import CircleButton from "@/components/anim/CircleButton";

const serif = { fontFamily: "var(--font-cormorant-garamond)" } as const;

// ═══════════════════════════════════════════════════════════════════════════
// ─── TUNE THESE KNOBS ──────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════

// ─ Section title ──
const TITLE_FONT_SIZE = "clamp(2rem, 3.6vw, 68px)";
const TITLE_COLOR = "#ffffff";
const TITLE_TRACKING = "0.02em";
const TITLE_MARGIN_BOT = "3.5rem";

// ─ Image grid ──
const IMAGE_ASPECT = "aspect-[4/3]";
const IMAGE_GAP = "gap-10"; // ↑ from gap-8 — slightly more breathing room between photos
const RIGHT_COLUMN_OFFSET = "md:mt-24";

// ─ Inner outline frame (inside each image) ──
// Thin white line inset from the image edges, matches figma image 1.
// FRAME_INSET bigger = frame sits further inside the image.
// FRAME_COLOR opacity — 0.5 is subtle; push to 0.7 for stronger, 0.35 for whisper-soft.
const FRAME_INSET = "14px";
const FRAME_COLOR = "rgba(255, 255, 255, 0.55)";

// ─ Hover zoom ──
const HOVER_SCALE = "group-hover:scale-105";
const HOVER_TRANSITION = "transition-transform duration-[800ms] ease-out";

// ═══════════════════════════════════════════════════════════════════════════

type GalleryGridSectionProps = {
  title: string;
  images: string[];
  showMoreButton?: boolean;
  moreButtonHref?: string;
};

export default function GalleryGridSection({
  title,
  images,
  showMoreButton = false,
  moreButtonHref = "#",
}: GalleryGridSectionProps) {
  const leftImages = images.filter((_, i) => i % 2 === 0);
  const rightImages = images.filter((_, i) => i % 2 === 1);

  return (
    <section className="w-full px-6 py-16 md:px-16">
      <Reveal>
        <h2
          style={{
            ...serif,
            fontSize: TITLE_FONT_SIZE,
            color: TITLE_COLOR,
            letterSpacing: TITLE_TRACKING,
            marginBottom: TITLE_MARGIN_BOT,
          }}
          className="font-semibold uppercase"
        >
          {title}
        </h2>
      </Reveal>

      <div className={`mx-auto grid max-w-6xl grid-cols-1 md:grid-cols-2 ${IMAGE_GAP}`}>
        <div className={`flex flex-col ${IMAGE_GAP}`}>
          {leftImages.map((src, i) => (
            <Reveal key={`l-${i}`}>
              <GalleryImage src={src} alt={`${title} ${i + 1}`} />
            </Reveal>
          ))}
        </div>

        <div className={`flex flex-col ${IMAGE_GAP} ${RIGHT_COLUMN_OFFSET}`}>
          {rightImages.map((src, i) => (
            <Reveal key={`r-${i}`}>
              <GalleryImage src={src} alt={`${title} ${i + 1}`} />
            </Reveal>
          ))}
        </div>
      </div>

      {showMoreButton && (
        <div className="mt-16 flex justify-center">
          <CircleButton
            href={moreButtonHref}
            circleColor="#ffffff"
            arrowColor="#191919"
            circleSize={150}
            magnet={0.35}
            className="rounded-full border border-white px-8 py-3 text-white text-[clamp(0.9rem,1.04vw,20px)]"
          >
            More Photos
          </CircleButton>
        </div>
      )}
    </section>
  );
}

function GalleryImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className={`group relative ${IMAGE_ASPECT} w-full overflow-hidden`}>
      <Image
        src={src}
        alt={alt}
        fill
        className={`object-cover ${HOVER_TRANSITION} ${HOVER_SCALE}`}
        sizes="(max-width: 768px) 100vw, 50vw"
      />

      {/*
        Inner outline frame — thin white line inset from the image edges.
        Sits ABOVE the image (z-10) so it stays visible when the image
        zooms on hover (the image scales inside overflow-hidden; the
        frame stays fixed to the container).
      */}
      <div
        aria-hidden
        className="pointer-events-none absolute z-10"
        style={{
          inset: FRAME_INSET,
          border: `1px solid ${FRAME_COLOR}`,
        }}
      />
    </div>
  );
}
