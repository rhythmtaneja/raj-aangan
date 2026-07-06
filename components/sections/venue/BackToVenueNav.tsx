// ══════════════════════════════════════════════════════════════════
// PATH IN REPO: components/sections/venue/BackToVenueNav.tsx
// ══════════════════════════════════════════════════════════════════

"use client";

import CircleButton from "@/components/anim/CircleButton";

const serif = { fontFamily: "var(--font-cormorant-garamond)" } as const;

// ═══════════════════════════════════════════════════════════════════════════
// ─── TUNE THESE KNOBS ──────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════
//
// Sits at the bottom of every /venue sub-page, above the Footer.
// Same 3-column pattern as GalleryBackNav on /gallery:
//   COL 1 (left)   → Back CircleButton (arrowDirection="left") → /venue
//   COL 2 (center) → "Back to Venue" heading (or custom via prop)
//   COL 3 (right)  → empty (for horizontal balance)
//
// ═══════════════════════════════════════════════════════════════════════════

const SECTION_BG   = "#ffffff";
const SECTION_PAD  = "py-16 md:py-20";
const TEXT_COLOR   = "#191919";
const BACK_HREF    = "/venue"; // where the button navigates

// ═══════════════════════════════════════════════════════════════════════════

type BackToVenueNavProps = {
  /** Optional heading shown in the centre column. Defaults to "Back to Venue". */
  heading?: string;
};

export default function BackToVenueNav({
  heading = "Back to Venue",
}: BackToVenueNavProps) {
  return (
    <section
      className={`relative w-full px-6 md:px-12 ${SECTION_PAD}`}
      style={{ backgroundColor: SECTION_BG }}
    >
      <div className="mx-auto grid max-w-6xl grid-cols-3 items-center gap-4">
        {/* LEFT — Back CircleButton */}
        <div className="flex justify-start">
          <CircleButton
            href={BACK_HREF}
            circleColor="#191919"
            arrowColor="#ffffff"
            circleSize={56}
            magnet={0.3}
            arrowDirection="left"
            className="rounded-full border border-[#191919] px-6 py-2.5 text-[#191919] text-[clamp(0.85rem,0.95vw,17px)]"
          >
            Back
          </CircleButton>
        </div>

        {/* CENTER — heading, truly centered in the row */}
        <h2
          style={{ ...serif, color: TEXT_COLOR }}
          className="text-center font-medium text-[clamp(1.2rem,1.8vw,34px)]"
        >
          {heading}
        </h2>

        {/* RIGHT — empty for balance */}
        <div />
      </div>
    </section>
  );
}
