"use client";

import CircleButton from "@/components/anim/CircleButton";

const serif = { fontFamily: "var(--font-cormorant-garamond)" } as const;

const SECTION_BG = "#ffffff";
const SECTION_PAD = "py-16 md:py-20";
const TEXT_COLOR = "#191919";
const BACK_HREF = "/venue";

type BackToVenueNavProps = {
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
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 md:grid md:grid-cols-3 md:items-center">
        <div className="flex justify-start">
          <CircleButton
            href={BACK_HREF}
            circleColor="#191919"
            arrowColor="#ffffff"
            circleSize="9.375rem"
            magnet={0.3}
            arrowDirection="left"
            className="rounded-full border border-[#191919] px-6 py-2.5 text-[#191919] text-[clamp(0.85rem,0.95vw,0.875rem)]"
          >
            Back
          </CircleButton>
        </div>

        <h2
          style={{ ...serif, color: TEXT_COLOR }}
          className="text-center font-medium text-[clamp(1.2rem,1.8vw,1.625rem)]"
        >
          {heading}
        </h2>

        <div />
      </div>
    </section>
  );
}
