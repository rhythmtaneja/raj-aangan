"use client";

import { useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { prefersReducedMotion } from "./anim.config";

gsap.registerPlugin(useGSAP);

type MarqueeProps = {
  children: ReactNode;

  speed?: number;

  repeat?: number;
  className?: string;
};

export default function Marquee({
  children,
  speed = 60,
  repeat = 4,
  className,
}: MarqueeProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const track = ref.current?.firstElementChild as HTMLElement | null;
      if (!track || prefersReducedMotion()) return;
      const groupWidth = track.scrollWidth / 2;
      const duration = groupWidth / speed;
      gsap.to(track, { xPercent: -50, duration, ease: "none", repeat: -1 });
    },
    { scope: ref },
  );

  const Group = (
    <span style={{ display: "inline-flex", flexShrink: 0 }}>
      {Array.from({ length: repeat }).map((_, i) => (
        <span key={i} style={{ paddingRight: "0.35em", whiteSpace: "nowrap" }}>
          {children}
        </span>
      ))}
    </span>
  );

  return (
    <div
      ref={ref}
      className={className}
      style={{ overflow: "hidden", width: "100%" }}
    >
      <div style={{ display: "inline-flex", willChange: "transform" }}>
        {Group}
        {Group}
      </div>
    </div>
  );
}
