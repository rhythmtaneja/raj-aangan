"use client";

import Reveal from "@/components/anim/Reveal";
import CircleButton from "@/components/anim/CircleButton";

const serif = { fontFamily: "var(--font-cormorant-garamond)" } as const;

// ═══════════════════════════════════════════════════════════════════════════
// ─── TUNE THESE KNOBS ──────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════

// ─ "About Resort" heading ──
// Bigger + centered per the reference. Push the max value up for even bigger.
const HEADING_TEXT = "About Resort";
const HEADING_FONT_SIZE = "clamp(2.5rem, 4vw, 110px)";
const HEADING_COLOR = "#ffffff";

// ─ Back button ──
const BACK_HREF = "/about";

// ═══════════════════════════════════════════════════════════════════════════

export default function GalleryBackNav() {
  return (
    <section className="w-full px-6 py-24 md:px-16">
      {/*
        Desktop: 3-column grid.
          col 1 = Back button (left)
          col 2 = About Resort heading (centered)
          col 3 = empty (balances the grid so col 2 sits at TRUE centre)
        Mobile: flex-col, stacked, Back on top.
      */}
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 md:grid md:grid-cols-3 md:items-center md:gap-8">
        <div className="justify-self-start">
          <CircleButton
            href={BACK_HREF}
            circleColor="#ffffff"
            arrowColor="#191919"
            circleSize={150}
            magnet={0.35}
            arrowDirection="left"
            className="rounded-full border border-white px-8 py-3 text-white text-[clamp(0.9rem,1.04vw,20px)]"
          >
            <span className="inline-flex items-center gap-2">
              <LeftArrowIcon />
              Back
            </span>
          </CircleButton>
        </div>

        <div className="text-center">
          <Reveal>
            <h3
              style={{ ...serif, fontSize: HEADING_FONT_SIZE, color: HEADING_COLOR }}
              className="font-semibold"
            >
              {HEADING_TEXT}
            </h3>
          </Reveal>
        </div>

        {/* Empty right column — keeps "About Resort" at true horizontal centre */}
        <div aria-hidden className="hidden md:block" />
      </div>
    </section>
  );
}

function LeftArrowIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 6l-6 6 6 6" />
    </svg>
  );
}
