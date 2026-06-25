"use client";

/**
 * Reveal.tsx
 * Scroll-into-view reveal: fade + rise (+ optional scale-in). Replays whenever
 * the element re-enters the viewport (set replay={false} to play once).
 * Uses gsap.set() then .to() so elements always end visible under Strict Mode.
 */

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { EASE, DUR, MOVE, TRIGGER, prefersReducedMotion } from "./anim.config";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type RevealProps = {
  children: ReactNode;
  as?: ElementType;
  stagger?: boolean;
  staggerEach?: number;
  delay?: number;
  y?: number;
  /** Scale-in start (e.g. 0.7 for a zoom-toward-you). 1 = no scale. */
  scaleFrom?: number;
  /** Replay every time it re-enters view (default true). */
  replay?: boolean;
  className?: string;
};

export default function Reveal({
  children,
  as,
  stagger = false,
  staggerEach = 0.12,
  delay = 0,
  y = MOVE.reveal,
  scaleFrom = 1,
  replay = true,
  className,
}: RevealProps) {
  const Tag = (as ?? "div") as ElementType;
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const targets = stagger ? (Array.from(root.children) as HTMLElement[]) : [root];

      if (prefersReducedMotion()) {
        gsap.set(targets, { autoAlpha: 1, y: 0, scale: 1 });
        return;
      }

      gsap.set(targets, { autoAlpha: 0, y, scale: scaleFrom });
      gsap.to(targets, {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: DUR.reveal,
        delay,
        ease: EASE.out,
        stagger: stagger ? staggerEach : 0,
        scrollTrigger: {
          trigger: root,
          start: TRIGGER.revealStart,
          toggleActions: replay ? "restart none restart reverse" : "play none none none",
        },
      });
    },
    { scope: ref }
  );

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
