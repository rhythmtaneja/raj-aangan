"use client";

import { useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { MOVE, TRIGGER, prefersReducedMotion } from "./anim.config";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type ParallaxProps = {
  children: ReactNode;

  distance?: number;

  direction?: "up" | "down";
  className?: string;
};

export default function Parallax({
  children,
  distance = MOVE.parallax,
  direction = "up",
  className,
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;

      const d = direction === "up" ? distance : -distance;

      gsap.fromTo(
        el,
        { y: d },
        {
          y: -d,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: TRIGGER.parallaxStart,
            end: TRIGGER.parallaxEnd,
            scrub: true,
          },
        },
      );
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
