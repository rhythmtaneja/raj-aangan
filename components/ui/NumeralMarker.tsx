"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { prefersReducedMotion } from "@/components/anim/anim.config";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const serif = { fontFamily: "var(--font-cormorant-garamond)" } as const;

export default function NumeralMarker({ numeral, light = false }: { numeral: string; light?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const glyph = ref.current?.querySelector(".numeral-glyph");
      if (!glyph) return;
      if (prefersReducedMotion()) {
        gsap.set(glyph, { autoAlpha: 1, x: 0 });
        return;
      }
      // Only the numeral glyph animates (slides in + fades); the box stays put.
      gsap.set(glyph, { autoAlpha: 0, x: -26 });
      gsap.to(glyph, {
        autoAlpha: 1,
        x: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: { trigger: ref.current, start: "top 85%", toggleActions: "restart none restart reverse" },
      });
    },
    { scope: ref }
  );

  const border = light ? "border-white" : "border-[#737272]";
  const text = light ? "text-white" : "text-[#444444]";

  return (
    <div ref={ref} className="relative inline-flex">
      {/* outer (second) box, offset top-left */}
      <span className={`pointer-events-none absolute -left-2 -top-2 h-full w-full border ${border}`} />
      {/* inner box — overflow-hidden so the glyph slides in from behind the edge */}
      <div className={`relative inline-flex h-24 min-w-16 items-center justify-center overflow-hidden border px-4 ${border}`}>
        <span style={serif} className={`numeral-glyph font-semibold leading-none text-[clamp(2rem,3.65vw,70px)] ${text}`}>
          {numeral}
        </span>
      </div>
    </div>
  );
}
