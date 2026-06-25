"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import NumeralMarker from "@/components/ui/NumeralMarker";
import Marquee from "@/components/anim/Marquee";
import { prefersReducedMotion } from "@/components/anim/anim.config";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const serif = { fontFamily: "var(--font-cormorant-garamond)" } as const;

// ── ADD BACKGROUND PHOTOS HERE (they crossfade behind the cards) ────────────
const BG_IMAGES = [
  "/images/events-banner.jpg",
  "/images/events-2.jpg",
  "/images/events-3.jpg",
];

const CARDS = [
  { title: "Conference", body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt." },
  { title: "Event", body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt." },
  { title: "Catering", body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt." },
];

export default function EventsSection() {
  const [active, setActive] = useState(0);
  const track = useRef<HTMLDivElement>(null);
  const cards = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (BG_IMAGES.length < 2 || prefersReducedMotion()) return;
    const id = setInterval(() => setActive((a) => (a + 1) % BG_IMAGES.length), 3800);
    return () => clearInterval(id);
  }, []);

  // Cards scroll UP over the lower part of the pinned image (scrubbed to scroll).
  useGSAP(
    () => {
      const el = cards.current;
      if (!el || prefersReducedMotion()) return;
      gsap.fromTo(
        el,
        { yPercent: 90 }, // START: only the first card's top peeks at the image's lower edge
        {
          yPercent: -78, // END: cards have scrolled up through the lower area
          ease: "none",
          scrollTrigger: { trigger: track.current, start: "top top", end: "bottom bottom", scrub: true },
        }
      );
    },
    { scope: track }
  );

  return (
    <section className="w-full bg-[#f1ece3]">
      {/*
        ── TUNING KNOBS ──
        track height  (h-[260vh])  → longer = slower card scroll / more pin time
        image size    (h-[82vh] max-w-[1180px]) → the contained photo
        V Events pos  (top-[9%])    → heading height inside the image
        marquee pos   (top-[40%])   → where the running word sits (the gap)
        cards start   (bottom-[-2%]) + yPercent:8 in the GSAP above → first-card peek
        card gap      (gap-[8vh])    → space between cards (smaller = tighter)
      */}
      <div ref={track} className="relative h-[260vh]">
        <div className="sticky top-0 flex h-screen items-center justify-center">
          {/* Contained background image (with margins, like Featured) */}
          <div className="relative h-[82vh] w-[92%] max-w-[1180px] overflow-hidden">
            {BG_IMAGES.map((src, i) => (
              <Image key={src} src={src} alt="" fill priority={i === 0} sizes="92vw" className="object-cover transition-opacity duration-1000" style={{ opacity: i === active ? 1 : 0 }} />
            ))}
            <div className="absolute inset-0 bg-black/25" />

            {/* V Events — upper part of the image */}
            <div className="absolute inset-x-0 top-[9%] z-20 flex items-center justify-center gap-5">
              <NumeralMarker numeral="IV" light />
              <span style={serif} className="uppercase tracking-[0.3em] text-white text-[clamp(1.25rem,1.66vw,32px)]">
                Events
              </span>
            </div>

            {/* Running "Events" — in the gap between heading and cards */}
            <div className="absolute inset-x-0 top-[40%] z-10 -translate-y-1/2">
              <Marquee speed={70} repeat={4}>
                <span style={serif} className="px-6 font-semibold uppercase text-white/15 text-[clamp(70px,12vw,180px)]">
                  Events
                </span>
              </Marquee>
            </div>

            {/* Cards — anchored to the LOWER area, scrubbed upward */}
            <div className="absolute inset-x-0 bottom-[-2%] z-30 overflow-visible">
              <div ref={cards} className="mx-auto flex w-[88%] max-w-[560px] flex-col items-center gap-[8vh]">
                {CARDS.map((card) => (
                  <div key={card.title} className="relative w-full p-3">
                    <div className="pointer-events-none absolute inset-0 border border-white/60" />
                    <div className="relative flex flex-col items-center border border-[#d8d2c8] bg-[#f1ece3] px-8 py-10 text-center shadow-xl">
                      <h3 style={serif} className="text-[#2a2a2a] text-[clamp(1.5rem,2.4vw,44px)]">{card.title}</h3>
                      <p className="mt-4 max-w-md leading-relaxed text-[#555555] text-[clamp(0.85rem,1vw,17px)]">{card.body}</p>
                      <a href="#" className="mt-7 rounded-full border border-[#191919] px-7 py-2.5 text-sm font-medium text-[#191919] transition-colors duration-300 hover:bg-[#191919] hover:text-white">
                        More
                      </a>
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
