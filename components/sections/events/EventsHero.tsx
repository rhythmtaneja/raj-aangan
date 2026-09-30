"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import SiteHeader from "@/components/ui/SiteHeader";
import { prefersReducedMotion } from "@/components/anim/anim.config";

gsap.registerPlugin(useGSAP);

const serif = { fontFamily: "var(--font-cormorant-garamond)" } as const;

const SECTION_HEIGHT = "min-h-[70vh] md:h-screen";

const BG_IMAGE = "/images/events-hero-bg.jpg";
const BG_BLUR = "blur(6px)";
const BG_SCALE = 1.08;
const OVERLAY_TOP = "rgba(15,12,10,0.55)";
const OVERLAY_BOT = "rgba(10,8,7,0.88)";

const CARD_WIDTH = "21.25rem";
const CARD_HEIGHT = "21.25rem";
const CARD_GAP = "2rem";

const FRAME_INSET = "0.75rem";
const FRAME_COLOR = "rgba(255,255,255,0.55)";

const SCROLL_DURATION = 40;

const CARDS_TOP = "38%";

const CATEGORIES = [
  { label: "Birthday Function", image: "/images/events-birthday.jpg" },
  { label: "Wedding Function", image: "/images/events-wedding.jpg" },
  { label: "Conference", image: "/images/events-conference.jpg" },
  { label: "Baby Shower", image: "/images/events-babyshower.jpg" },
  { label: "Pre Wedding", image: "/images/events-prewedding.jpg" },
  { label: "Corporate Event", image: "/images/events-corporate.jpg" },
  { label: "Anniversary", image: "/images/events-anniversary.jpg" },
];

export default function EventsHero() {
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const track = trackRef.current;
      if (!track) return;

      const measureAdvance = () => {
        const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
        return (track.scrollWidth + gap) / 2;
      };

      let tween: gsap.core.Tween | null = null;
      const build = () => {
        const advance = measureAdvance();
        if (advance <= 0) return;
        tween?.kill();
        gsap.set(track, { x: 0 });
        tween = gsap.to(track, {
          x: -advance,
          duration: SCROLL_DURATION,
          ease: "none",
          repeat: -1,
        });
      };

      build();

      const ro = new ResizeObserver(build);
      ro.observe(track);
      return () => {
        ro.disconnect();
        tween?.kill();
      };
    },
    { scope: trackRef },
  );

  const cards = [...CATEGORIES, ...CATEGORIES];

  return (
    <section className={`relative w-full ${SECTION_HEIGHT} overflow-hidden`}>
      <div className="absolute inset-0">
        <Image
          src={BG_IMAGE}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={{ filter: BG_BLUR, transform: `scale(${BG_SCALE})` }}
        />
      </div>

      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to bottom, ${OVERLAY_TOP} 0%, ${OVERLAY_BOT} 65%, ${OVERLAY_BOT} 100%)`,
        }}
      />

      <SiteHeader />

      <div
        className="absolute inset-x-0 flex items-center overflow-hidden"
        style={{ top: CARDS_TOP }}
      >
        <div ref={trackRef} className="flex" style={{ gap: CARD_GAP }}>
          {cards.map((c, i) => (
            <CategoryCard key={i} label={c.label} image={c.image} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoryCard({ label, image }: { label: string; image: string }) {
  return (
    <div
      className="group shrink-0 flex flex-col items-center"
      style={{ width: `clamp(12.5rem, 30vw, ${CARD_WIDTH})` }}
    >
      <div
        className="relative overflow-hidden"
        style={{
          width: `clamp(12.5rem, 30vw, ${CARD_WIDTH})`,
          height: `clamp(12.5rem, 30vw, ${CARD_HEIGHT})`,
        }}
      >
        <Image
          src={image}
          alt={label}
          fill
          sizes="340px"
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
        className="mt-6 text-white uppercase tracking-[0.25em] text-[clamp(0.85rem,1.05vw,0.9375rem)]"
      >
        {label}
      </p>
    </div>
  );
}
