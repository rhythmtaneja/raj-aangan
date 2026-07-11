"use client";

import Image from "next/image";
import NumeralMarker from "@/components/ui/NumeralMarker";
import Reveal from "@/components/anim/Reveal";
import CircleButton from "@/components/anim/CircleButton";

const serif = { fontFamily: "var(--font-cormorant-garamond)" } as const;

// ═══════════════════════════════════════════════════════════════════════════
// ─── TUNE THESE KNOBS ──────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════

const SECTION_BG = "#fdfbf5"; // creamy off-white from figma
const TITLE_COLOR = "#191919";

// ─ Subtitle (italic emphasis on "Flawlessly") ──
const SUBTITLE_BEFORE = "End to End Celebration, ";
const SUBTITLE_ITALIC = "Flawlessly";
const SUBTITLE_AFTER = " Executed";

// ─ Card layout ──
// Cards alternate left/right. Even-index cards sit at the top of their row;
// odd-index cards offset DOWN by this amount to create the staggered pattern.
const CARD_VERTICAL_OFFSET = "md:mt-32";  // bump to mt-40 / mt-48 for more stagger

// ─ Card image ──
const CARD_ASPECT = "aspect-[4/5]"; // change to aspect-square / aspect-[3/4] for different proportions

// ═══════════════════════════════════════════════════════════════════════════

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
      {/* TOP — Roman numeral + label */}
      <Reveal>
        <div className="mb-10 flex items-center justify-center gap-5">
          <NumeralMarker numeral="III" />
          <span
            style={serif}
            className="uppercase tracking-[0.2em] text-[#444444] text-[clamp(1rem,1.25vw,24px)]"
          >
            What We Offer
          </span>
        </div>
      </Reveal>

      <Reveal>
        <h2
          style={serif}
          className="mx-auto mb-24 max-w-4xl text-center font-medium leading-[1.1] text-[clamp(1.8rem,3.2vw,62px)]"
        >
          {SUBTITLE_BEFORE}
          <em className="italic text-[#737272]">{SUBTITLE_ITALIC}</em>
          {SUBTITLE_AFTER}
        </h2>
      </Reveal>

      {/* Staggered card grid */}
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-x-10 gap-y-20 md:grid-cols-2">
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
      {/* Image with inner outline frame + overlaid text */}
      <div className={`relative ${CARD_ASPECT} w-full overflow-hidden`}>
        <Image
          src={image}
          alt={label}
          fill
          className="object-cover transition-transform duration-[1500ms] ease-out group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        {/* Inner outline frame — same pattern as FeaturedSection */}
        <div
          aria-hidden
          className="pointer-events-none absolute"
          style={{ inset: "20px", border: "1px solid rgba(255,255,255,0.7)" }}
        />
        {/* Centered text overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center text-white">
          <h3
            style={serif}
            className="font-semibold text-[clamp(1.4rem,2vw,38px)] [text-shadow:0_1px_8px_rgba(0,0,0,0.55)]"
          >
            {label}
          </h3>
          <p
            style={serif}
            className="mt-4 max-w-xs leading-relaxed text-[clamp(0.85rem,1vw,18px)] [text-shadow:0_1px_8px_rgba(0,0,0,0.55)]"
          >
            {description}
          </p>
        </div>
      </div>

      {/* Button BELOW the card */}
      <div className="mt-6 flex justify-center">
        <CircleButton
          href="#"
          circleColor="#191919"
          arrowColor="#ffffff"
          circleSize={150}
          magnet={0.35}
          className="rounded-full border border-[#191919] px-8 py-3 text-[#191919] text-[clamp(0.9rem,1.04vw,20px)]"
        >
          {button}
        </CircleButton>
      </div>
    </div>
  );
}
