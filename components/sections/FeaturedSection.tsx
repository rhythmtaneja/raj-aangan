"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Reveal from "@/components/anim/Reveal";
import { prefersReducedMotion } from "@/components/anim/anim.config";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// ── ADD BACKGROUND PHOTOS HERE (they crossfade) ─────────────────────────────
const BG_IMAGES = [
  "/images/ballroom.jpg",
  // "/images/ballroom-2.jpg",
  // "/images/ballroom-3.jpg",
];

const SERVICES = ["Wedding Planning", "Luxury Catering", "Social & Corporate Events", "Decor & Styling", "Entertainment & Experience"];

export default function FeaturedSection() {
  const [active, setActive] = useState(0);
  const imgInner = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (BG_IMAGES.length < 2 || prefersReducedMotion()) return;
    const id = setInterval(() => setActive((a) => (a + 1) % BG_IMAGES.length), 3800);
    return () => clearInterval(id);
  }, []);

  // Image starts tilted ("edgy") and straightens when the section is reached.
  useGSAP(
    () => {
      const el = imgInner.current;
      if (!el || prefersReducedMotion()) return;
      gsap.fromTo(
        el,
        { rotate: -3, scale: 1.18, transformOrigin: "left center" },
        {
          rotate: 0,
          scale: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 80%", toggleActions: "restart none restart reverse" },
        }
      );
    },
    { scope: imgInner }
  );

  return (
    <section className="flex min-h-screen w-full items-center justify-center bg-[#ebe5db] px-6 py-24">
      <div className="relative aspect-16/10 w-full max-w-280">
        {/* overflow-hidden wrapper stays straight; the inner layer tilts/straightens */}
        <div className="absolute inset-0 overflow-hidden">
          <div ref={imgInner} className="relative h-full w-full">
            {BG_IMAGES.map((src, i) => (
              <Image
                key={src}
                src={src}
                alt="Banquet hall set for an event"
                fill
                className="object-cover transition-opacity duration-1000"
                style={{ opacity: i === active ? 1 : 0 }}
                sizes="(max-width: 1120px) 100vw, 1120px"
              />
            ))}
          </div>
        </div>

        {/* thin frame inset on the image */}
        <div className="pointer-events-none absolute inset-8 border border-white/80" />

        {/* centered service-list card */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Reveal className="relative">
            <div className="pointer-events-none absolute -left-4 -top-4 h-full w-full border border-white" />
            <div className="relative flex flex-col items-center justify-center border border-[#d6cfc2] bg-white px-16 py-12 text-center">
              <ul className="space-y-5 uppercase tracking-[0.18em] text-[#3f3f3f] text-[clamp(0.8rem,1.04vw,18px)]">
                {SERVICES.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
