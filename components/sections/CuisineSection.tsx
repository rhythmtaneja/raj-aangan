"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Reveal from "@/components/anim/Reveal";
import CircleButton from "@/components/anim/CircleButton";
import { prefersReducedMotion } from "@/components/anim/anim.config";
import ImageOverlay from "@/components/ui/ImageOverlay";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const serif = { fontFamily: "var(--font-cormorant-garamond)" } as const;

const BG_START_COLOR = "#d4dad3";
const BG_END_COLOR = "#ebe5db";
const COLOR_TRANSITION_START = "top bottom";
const COLOR_TRANSITION_END = "top top";

const TITLE_FONT_SIZE = "clamp(1.8rem, 4vw, 3.625rem)";
const TITLE_TRACKING = "0.15em";
const TITLE_COLOR = "#6b4f3a";
const TITLE_MARGIN_BOTTOM = "2.75rem";

const CARD_WIDTH = "27.5rem";
const CARD_HEIGHT = "27.5rem";
const CARD_GAP = "1.5rem";

const SCROLL_DURATION = 34;

const FRAME_INSET = "1.25rem";
const FRAME_COLOR = "rgba(255,255,255,0.7)";

const CUISINES = [
  {
    name: "Rajasthani",
    img: "/images/cuisine-rajasthani.jpg",
    price: "from ₹3499 / person",
  },
  {
    name: "Punjabi",
    img: "/images/cuisine-punjabi.jpg",
    price: "from ₹3499 / person",
  },
  {
    name: "Dessert",
    img: "/images/cuisine-dessert.jpg",
    price: "from ₹3499 / person",
  },
  {
    name: "South Indian",
    img: "/images/cuisine-south-indian.jpg",
    price: "from ₹3499 / person",
  },
  {
    name: "Chinese",
    img: "/images/cuisine-chinese.jpg",
    price: "from ₹3499 / person",
  },
];

export default function CuisineSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const scrollAnim = useRef<gsap.core.Tween | null>(null);

  useGSAP(
    () => {
      const colorProxy = { c: BG_START_COLOR };
      gsap.to(colorProxy, {
        c: BG_END_COLOR,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: COLOR_TRANSITION_START,
          end: COLOR_TRANSITION_END,
          scrub: true,
        },
        onUpdate: () => {
          document.documentElement.style.setProperty("--page-bg", colorProxy.c);
        },
      });

      if (prefersReducedMotion()) return;

      const track = trackRef.current;
      if (!track) return;

      const measureAdvance = () => {
        const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
        return (track.scrollWidth + gap) / 2;
      };

      const build = () => {
        scrollAnim.current?.kill();
        gsap.set(track, { x: 0 });
        scrollAnim.current = gsap.to(track, {
          x: -measureAdvance(),
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
        scrollAnim.current?.kill();
      };
    },
    { scope: sectionRef },
  );

  const handleStripEnter = () => {
    scrollAnim.current?.pause();
  };
  const handleStripLeave = () => {
    scrollAnim.current?.resume();
  };

  const cards = [...CUISINES, ...CUISINES];

  return (
    <section
      ref={sectionRef}
      className="flex min-h-screen w-full flex-col items-center py-24"
      style={{ backgroundColor: `var(--page-bg, ${BG_END_COLOR})` }}
    >
      <Reveal>
        <h2
          className="px-6 font-semibold uppercase text-center"
          style={{
            ...serif,
            fontSize: TITLE_FONT_SIZE,
            letterSpacing: TITLE_TRACKING,
            color: TITLE_COLOR,
            marginBottom: TITLE_MARGIN_BOTTOM,
          }}
        >
          Our Cuisine
        </h2>
      </Reveal>

      <div
        className="w-full overflow-hidden py-4"
        onMouseEnter={handleStripEnter}
        onMouseLeave={handleStripLeave}
      >
        <div
          ref={trackRef}
          className="flex"
          style={{ gap: CARD_GAP, willChange: "transform" }}
        >
          {cards.map((c, i) => (
            <CuisineCard
              key={`${c.name}-${i}`}
              name={c.name}
              img={c.img}
              price={c.price}
            />
          ))}
        </div>
      </div>

      <Reveal>
        <div className="mt-12">
          <CircleButton
            href="#"
            circleColor="#191919"
            arrowColor="#ffffff"
            circleSize="9.375rem"
            magnet={0.4}
            className="rounded-full border border-[#191919] px-10 py-4 font-medium text-[#191919] text-[clamp(1rem,1.04vw,0.9375rem)]"
          >
            Create Booking
          </CircleButton>
        </div>
      </Reveal>
    </section>
  );
}

function CuisineCard({
  name,
  img,
  price,
}: {
  name: string;
  img: string;
  price: string;
}) {
  return (
    <div
      className="group relative shrink-0 overflow-hidden"
      style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
    >
      <Image
        src={img}
        alt={`${name} cuisine`}
        fill
        draggable={false}
        sizes="(max-width: 767px) 60vw, 31vw"
        className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
      />
      <ImageOverlay opacity={0.44} />

      <div
        aria-hidden
        className="pointer-events-none absolute z-10"
        style={{ inset: FRAME_INSET, border: `1px solid ${FRAME_COLOR}` }}
      />
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center text-white">
        <h3
          style={serif}
          className="font-semibold uppercase tracking-[0.15em] text-[clamp(1.5rem,2.6vw,2.3125rem)] [text-shadow:0_1px_8px_rgba(0,0,0,0.45)]"
        >
          {name}
        </h3>
        <p
          style={serif}
          className="mt-3 text-[clamp(0.9rem,1.15vw,1.0625rem)] [text-shadow:0_1px_8px_rgba(0,0,0,0.45)]"
        >
          {price}
        </p>
      </div>
    </div>
  );
}
