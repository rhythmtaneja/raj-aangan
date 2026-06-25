"use client";

/**
 * Parallax.tsx
 * ---------------------------------------------------------------------------
 * Scroll-tied (scrubbed) vertical parallax. Mirrors the reference site's
 * SCROLLING_IN_VIEW TRANSFORM_MOVE, where an element drifts on Y as it passes
 * through the viewport.
 *
 * Best used on section images. For a contained "zoom won't show edges" look,
 * give the inner image ~110% height and overflow-hidden on the wrapper.
 * ---------------------------------------------------------------------------
 */

import { useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { MOVE, TRIGGER, prefersReducedMotion } from "./anim.config";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type ParallaxProps = {
  children: ReactNode;
  /** Total travel in px across the full viewport pass (default 60). */
  distance?: number;
  /** Direction: "up" drifts content upward as you scroll down. */
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
            start: TRIGGER.parallaxStart, // element top enters bottom of viewport
            end: TRIGGER.parallaxEnd, // element bottom leaves top of viewport
            scrub: true, // tie progress to scroll position
          },
        }
      );
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
