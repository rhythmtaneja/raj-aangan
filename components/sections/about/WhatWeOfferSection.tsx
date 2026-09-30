"use client";

import Image from "next/image";
import NumeralMarker from "@/components/ui/NumeralMarker";
import Reveal from "@/components/anim/Reveal";
import CircleButton from "@/components/anim/CircleButton";
import ImageOverlay from "@/components/ui/ImageOverlay";

const serif = { fontFamily: "var(--font-cormorant-garamond)" } as const;

const SECTION_BG = "#fdfbf5";
const TITLE_COLOR = "#191919";

const HEADER_TOP_NUDGE = "-2rem";
const EYEBROW_TO_SUBTITLE_GAP = "3.45rem";
const SUBTITLE_TO_CARDS_GAP = "6rem";

const SUBTITLE_BEFORE = "End to End Celebration, ";
const SUBTITLE_ITALIC = "Flawlessly";
const SUBTITLE_AFTER = " Executed";

const CARD_GRID_GAP_X = "gap-x-10 md:gap-x-20 md:gap-x-28";
const CARD_GRID_GAP_Y = "gap-y-20";

const CARD_VERTICAL_OFFSET = "md:mt-32";

const CARD_ASPECT = "aspect-[4/5]";
const CARD_OVERLAY_OPACITY = 0.44;

const SERVICES = [
  {
    label: "Wedding Planning",
    description:
      "From your first consultation to the final farewell, we orchestrate your wedding with elegance, precision, and heart.",
    image: "/images/offer-wedding-planning.jpg",
    button: "Plan Your Wedding",
  },
  {
    label: "Pre-Wedding Function",
    description:
      "Haldi, Mehendi, Sangeet — each function given its own magic, mood and memory worth treasuring forever.",
    image: "/images/offer-pre-wedding.jpg",
    button: "Explore Function",
  },
  {
    label: "Event & Celebrations",
    description:
      "Birthdays, anniversaries, private parties — we transform every occasion into something truly extraordinary.",
    image: "/images/offer-events.jpg",
    button: "Plan Your Event",
  },
  {
    label: "Decor & Styling",
    description:
      "From floral mandap to royal stage setups, our styling concept brings your vision to breathtaking life.",
    image: "/images/offer-decor.jpg",
    button: "See Decor",
  },
  {
    label: "Catering",
    description:
      "A culinary journey across Rajasthani flavours, live stations, and world cuisines crafted for every palate.",
    image: "/images/offer-catering.jpg",
    button: "View Menu",
  },
  {
    label: "Entertainment",
    description:
      "Folk artists, live performances, dhol, celebrity anchors — experiences your guests will never forget.",
    image: "/images/offer-entertainment.jpg",
    button: "See Acts",
  },
];

export default function WhatWeOfferSection() {
  return (
    <section
      className="relative w-full px-6 py-32"
      style={{ backgroundColor: SECTION_BG, color: TITLE_COLOR }}
    >
      <div style={{ transform: `translateY(${HEADER_TOP_NUDGE})` }}>
        <Reveal>
          <div
            className="flex items-center justify-center gap-5"
            style={{ marginBottom: EYEBROW_TO_SUBTITLE_GAP }}
          >
            <NumeralMarker numeral="III" />
            <span
              style={serif}
              className="leading-none uppercase tracking-[0.2em] text-[#444444] text-[clamp(1rem,1.25vw,1.125rem)]"
            >
              What We Offer
            </span>
          </div>
        </Reveal>

        <Reveal>
          <h2
            style={{ ...serif, marginBottom: SUBTITLE_TO_CARDS_GAP }}
            className="mx-auto max-w-4xl text-center font-medium leading-[1.1] text-[clamp(1.8rem,3.2vw,2.875rem)]"
          >
            {SUBTITLE_BEFORE}
            <em className="italic text-[#737272]">{SUBTITLE_ITALIC}</em>
            {SUBTITLE_AFTER}
          </h2>
        </Reveal>
      </div>

      <div
        className={`mx-auto grid w-full max-w-6xl grid-cols-1 md:grid-cols-2 ${CARD_GRID_GAP_X} ${CARD_GRID_GAP_Y}`}
      >
        {SERVICES.map((s, i) => (
          <Reveal key={s.label}>
            <div className={i % 2 === 1 ? CARD_VERTICAL_OFFSET : ""}>
              <OfferCard {...s} />
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function OfferCard({
  label,
  description,
  image,
  button,
}: {
  label: string;
  description: string;
  image: string;
  button: string;
}) {
  return (
    <div className="group flex flex-col">
      <div className={`relative ${CARD_ASPECT} w-full overflow-hidden`}>
        <Image
          src={image}
          alt={label}
          fill
          className="object-cover transition-transform duration-[1500ms] ease-out group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <ImageOverlay opacity={CARD_OVERLAY_OPACITY} />

        <div
          aria-hidden
          className="pointer-events-none absolute z-10"
          style={{
            inset: "1.25rem",
            border: "1px solid rgba(255,255,255,0.7)",
          }}
        />

        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-8 text-center text-white">
          <h3
            style={serif}
            className="font-semibold text-[clamp(1.4rem,2vw,1.8125rem)] [text-shadow:0_1px_8px_rgba(0,0,0,0.55)]"
          >
            {label}
          </h3>
          <p
            style={serif}
            className="mt-4 max-w-xs leading-relaxed text-[clamp(0.85rem,1vw,0.875rem)] [text-shadow:0_1px_8px_rgba(0,0,0,0.55)]"
          >
            {description}
          </p>
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <CircleButton
          href="#"
          circleColor="#191919"
          arrowColor="#ffffff"
          circleSize="9.375rem"
          magnet={0.35}
          className="rounded-full border border-[#191919] px-8 py-3 text-[#191919] text-[clamp(0.9rem,1.04vw,0.9375rem)]"
        >
          {button}
        </CircleButton>
      </div>
    </div>
  );
}
