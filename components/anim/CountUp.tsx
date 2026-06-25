"use client";

/**
 * CountUp.tsx
 * ---------------------------------------------------------------------------
 * Counts a number up from 0 when it scrolls into view (the "numeral counters
 * animate in" item from the plan). Formats with thousands separators, so
 * 10000 renders as "10,000". Add a suffix like "+" for "10,000+".
 * ---------------------------------------------------------------------------
 */

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { prefersReducedMotion } from "./anim.config";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type CountUpProps = {
  end: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
};

export default function CountUp({
  end,
  suffix = "",
  prefix = "",
  duration = 1.6,
  className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(prefersReducedMotion() ? end : 0);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;

      const obj = { v: 0 };
      gsap.to(obj, {
        v: end,
        duration,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "restart none restart none" },
        onUpdate: () => setDisplay(Math.round(obj.v)),
      });
    },
    { scope: ref }
  );

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}
