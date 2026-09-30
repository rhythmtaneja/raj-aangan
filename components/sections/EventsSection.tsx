"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import NumeralMarker from "@/components/ui/NumeralMarker";
import Marquee from "@/components/anim/Marquee";
import CircleButton from "@/components/anim/CircleButton";
import { prefersReducedMotion } from "@/components/anim/anim.config";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const serif = { fontFamily: "var(--font-cormorant-garamond)" } as const;

const BG_IMAGES = [
  "/images/events-banner.jpg",
  "/images/events-2.jpg",
  "/images/events-3.jpg",
];

const CARDS = [
  {
    title: "Weddings",
    body: "Timeless celebrations, thoughtfully curated. From the first detail to the final guest, we make every moment unforgettable.",
  },
  {
    title: "Corporate",
    body: "Refined events, flawlessly executed. Bespoke experiences designed to bring people together and make an impression.",
  },
  {
    title: "Catering",
    body: "Exceptional cuisine, elegant presentation, impeccable service. A complete culinary experience for every occasion.",
  },
];

const CARD_SCROLL_TRACK_HEIGHT = "358vh";
const CARD_GAP = "14vh";

const CARD_INNER_FRAME_INSET = "1rem";
const CARD_INNER_FRAME_COLOR = "rgba(0, 0, 0, 0.37)";

export default function EventsSection() {
  const [active, setActive] = useState(0);
  const track = useRef<HTMLDivElement>(null);
  const cards = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (BG_IMAGES.length < 2 || prefersReducedMotion()) return;
    const id = setInterval(
      () => setActive((a) => (a + 1) % BG_IMAGES.length),
      3800,
    );
    return () => clearInterval(id);
  }, []);

  useGSAP(
    () => {
      const el = cards.current;
      if (!el || prefersReducedMotion()) return;
      gsap.fromTo(
        el,
        { yPercent: 90 },
        {
          yPercent: -78,
          ease: "none",
          scrollTrigger: {
            trigger: track.current,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
          },
        },
      );
    },
    { scope: track },
  );

  return (
    <section className="w-full bg-[#f1ece3]">
      <div
        ref={track}
        className="relative"
        style={{ height: CARD_SCROLL_TRACK_HEIGHT }}
      >
        <div className="sticky top-0 flex h-screen items-center justify-center">
          <div className="relative h-dvh w-full overflow-hidden md:h-[82vh] md:w-[92%] md:max-w-295">
            {BG_IMAGES.map((src, i) => (
              <Image
                key={src}
                src={src}
                alt=""
                fill
                priority={i === 0}
                sizes="92vw"
                className="object-cover transition-opacity duration-1000"
                style={{ opacity: i === active ? 1 : 0 }}
              />
            ))}
            <div className="absolute inset-0 bg-black/25" />

            <div className="absolute inset-x-0 top-[6%] z-20 flex items-center justify-center gap-5">
              <NumeralMarker numeral="IV" light />
              <span
                style={serif}
                className="font-bold uppercase tracking-[0.3em] text-white text-[clamp(1.45rem,2vw,1.8125rem)]"
              >
                Events
              </span>
            </div>

            <div className="absolute inset-x-0 top-[40%] z-10 -translate-y-1/2">
              <Marquee speed={70} repeat={4}>
                <span
                  style={serif}
                  className="px-6 font-semibold text-white/15 text-[clamp(4.375rem,12vw,10.8125rem)]"
                >
                  Events
                </span>
              </Marquee>
            </div>

            <div className="absolute inset-x-0 bottom-[-2%] z-30 overflow-visible">
              <div
                ref={cards}
                className="mx-auto flex w-[86%] max-w-145 flex-col items-center"
                style={{ gap: CARD_GAP }}
              >
                {CARDS.map((card) => (
                  <div key={card.title} className="relative w-full p-3">
                    <div className="pointer-events-none absolute inset-0 border border-white/60" />
                    <div className="relative flex min-h-[25rem] flex-col items-center justify-center border border-[#d8d2c8] bg-[#f1ece3] px-8 py-14 text-center shadow-xl">
                      <div
                        aria-hidden
                        className="pointer-events-none absolute"
                        style={{
                          inset: CARD_INNER_FRAME_INSET,
                          border: `1px solid ${CARD_INNER_FRAME_COLOR}`,
                        }}
                      />
                      <h3
                        style={serif}
                        className="font-bold leading-[1.05] text-[#242424] text-[clamp(2rem,3.15vw,2.8125rem)]"
                      >
                        {card.title}
                      </h3>
                      <p className="mt-5 max-w-lg leading-relaxed text-[#3f3f3f] text-[clamp(1rem,1.18vw,1.0625rem)]">
                        {card.body}
                      </p>
                      <CircleButton
                        href="#"
                        circleColor="#191919"
                        arrowColor="#ffffff"
                        circleSize="7.25rem"
                        magnet={0.4}
                        className="mt-9 rounded-full border border-[#191919] px-9 py-3.5 text-base font-medium text-[#191919]"
                      >
                        More
                      </CircleButton>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
