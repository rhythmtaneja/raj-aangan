"use client";

import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/anim/Reveal";

const serif = { fontFamily: "var(--font-cormorant-garamond)" } as const;

// ═══════════════════════════════════════════════════════════════════════════
// ─── TUNE THESE KNOBS ──────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════

// ─ Split bg pattern (same family as WeddingPackagesSection on /events) ──
const TOP_BG = "#ffffff"; // white strip with title
const MIDDLE_BG = "#0f2f3b"; // dark navy card strip

const TITLE_COLOR = "#191919";

// ─ Padding ──
const TOP_PAD = "min-h-[220px] py-16 md:min-h-[252px] md:py-20";
const MIDDLE_PAD = "py-16 md:py-20";

// ─ Card image ──
const CARD_ASPECT = "aspect-square";
const FRAME_INSET = "10px";
const FRAME_COLOR = "rgba(255,255,255,0.55)";

// ═══════════════════════════════════════════════════════════════════════════

type Property = { name: string; image: string; href: string };

const PROPERTIES: Property[] = [
  {
    name: "Raj\u00A0Aangan", // \u00A0 = non-breaking space so it doesn't wrap
    image: "/images/venue-pkg-raj-aangan.jpg",
    href: "/venue/raj-aangan/packages",
  },
  {
    name: "Raj\u00A0Gharana",
    image: "/images/venue-pkg-raj-gharana.jpg",
    href: "/venue/raj-gharana/packages",
  },
];

export default function VenuePackagesSection() {
  return (
    <section className="relative w-full">
      {/* TOP — white title band */}
      <div
        className={`flex w-full items-center justify-center ${TOP_PAD}`}
        style={{ backgroundColor: TOP_BG }}
      >
        <Reveal>
          <h2
            style={{ ...serif, color: TITLE_COLOR }}
            className="text-center font-medium text-[clamp(1.9rem,3.2vw,58px)]"
          >
            Venue packages
          </h2>
        </Reveal>
      </div>

      {/* MIDDLE — navy strip with 2 clickable cards */}
      <div
        className={`w-full ${MIDDLE_PAD} px-6 md:px-12`}
        style={{ backgroundColor: MIDDLE_BG }}
      >
        <div className="mx-auto grid w-full max-w-4xl grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
          {PROPERTIES.map((p) => (
            <Reveal key={p.name}>
              <PackageCard {...p} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function PackageCard({ name, image, href }: Property) {
  return (
    <Link href={href} className="group flex flex-col">
      <div className={`relative ${CARD_ASPECT} w-full overflow-hidden`}>
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, 40vw"
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
        className="mt-6 text-center uppercase text-white leading-tight tracking-wide text-[clamp(1.15rem,1.5vw,28px)]"
      >
        {name}
      </p>
    </Link>
  );
}
