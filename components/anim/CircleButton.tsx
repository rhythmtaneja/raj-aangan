"use client";

/**
 * CircleButton.tsx
 * ---------------------------------------------------------------------------
 * The reference site's signature button: at rest it's a bordered pill with a
 * label. On hover a coloured ball grows from the centre (circ.inOut), the
 * label fades, the BORDER also fades to transparent (so the outline pill
 * disappears cleanly — only the ball + arrow remain), and the ball follows
 * the cursor magnetically.
 *
 * arrowDirection prop controls the chevron on hover:
 *   "right" (default) — most CTAs / navigational buttons
 *   "down"            — scroll-down cues (e.g. about-page hero CTA)
 *   "left"            — back navigation (e.g. gallery's Back button)
 * ---------------------------------------------------------------------------
 */

import { useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { prefersReducedMotion } from "./anim.config";

gsap.registerPlugin(useGSAP);

type ArrowDirection = "right" | "down" | "left";

type CircleButtonProps = {
  children: ReactNode;
  href?: string;
  /** Pill styling: border, padding, text colour, font. */
  className?: string;
  /** The ball colour (reference sage = #6c7c7b; for light bgs use #191919). */
  circleColor?: string;
  /** Arrow + (optional) hovered-label colour. */
  arrowColor?: string;
  /** Ball diameter in px. */
  circleSize?: number;
  /** Magnetic pull, 0–1 (how far the ball drifts toward the cursor). */
  magnet?: number;
  /** Chevron direction shown on hover. Defaults to "right". */
  arrowDirection?: ArrowDirection;
};

/** Resting offset for the arrow (where it starts before entering to centre). */
function restingOffset(direction: ArrowDirection): { x: number; y: number } {
  if (direction === "down")  return { x: 0,  y: -6 };
  if (direction === "left")  return { x: -6, y: 0  };
  return { x: 6, y: 0 }; // right (default)
}

export default function CircleButton({
  children,
  href = "#",
  className,
  circleColor = "#6c7c7b",
  arrowColor = "#ffffff",
  circleSize = 84,
  magnet = 0.4,
  arrowDirection = "right",
}: CircleButtonProps) {
  const root = useRef<HTMLAnchorElement>(null);
  const wrap = useRef<HTMLSpanElement>(null);
  const circle = useRef<HTMLSpanElement>(null);
  const arrow = useRef<HTMLSpanElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  const originalBorderColor = useRef<string>("rgba(0,0,0,0)");

  const xTo = useRef<((v: number) => void) | null>(null);
  const yTo = useRef<((v: number) => void) | null>(null);

  const rest = restingOffset(arrowDirection);

  useGSAP(
    () => {
      if (root.current) {
        originalBorderColor.current =
          window.getComputedStyle(root.current).borderTopColor || "rgba(0,0,0,0)";
      }

      gsap.set(circle.current, { scale: 0, transformOrigin: "center center" });
      gsap.set(arrow.current, { autoAlpha: 0, x: rest.x, y: rest.y });

      if (prefersReducedMotion()) return;

      xTo.current = gsap.quickTo(wrap.current, "x", { duration: 0.5, ease: "power3" });
      yTo.current = gsap.quickTo(wrap.current, "y", { duration: 0.5, ease: "power3" });
    },
    { scope: root, dependencies: [arrowDirection] }
  );

  const enter = () => {
    if (prefersReducedMotion()) return;

    gsap.to(root.current, {
      borderColor: "rgba(0,0,0,0)",
      duration: 0.3,
      ease: "power2.out",
      overwrite: "auto",
    });
    gsap.to(label.current, { autoAlpha: 0, duration: 0.25, ease: "power1.out", overwrite: "auto" });

    gsap.to(circle.current, { scale: 1, duration: 0.5, ease: "circ.inOut", overwrite: "auto" });
    gsap.to(arrow.current, {
      autoAlpha: 1,
      x: 0,
      y: 0,
      duration: 0.35,
      ease: "power2.out",
      delay: 0.06,
      overwrite: "auto",
    });
  };

  const leave = () => {
    if (prefersReducedMotion()) return;

    gsap.to(root.current, {
      borderColor: originalBorderColor.current,
      duration: 0.4,
      ease: "power2.out",
      delay: 0.1,
      overwrite: "auto",
    });
    gsap.to(label.current, {
      autoAlpha: 1,
      duration: 0.3,
      ease: "power1.out",
      delay: 0.1,
      overwrite: "auto",
    });

    gsap.to(circle.current, { scale: 0, duration: 0.45, ease: "circ.inOut", overwrite: "auto" });
    gsap.to(arrow.current, {
      autoAlpha: 0,
      x: rest.x,
      y: rest.y,
      duration: 0.25,
      ease: "power1.in",
      overwrite: "auto",
    });

    xTo.current?.(0);
    yTo.current?.(0);
  };

  const move = (e: React.MouseEvent) => {
    if (!root.current || prefersReducedMotion()) return;
    const r = root.current.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    xTo.current?.(dx * magnet);
    yTo.current?.(dy * magnet);
  };

  return (
    <a
      ref={root}
      href={href}
      onMouseEnter={enter}
      onMouseLeave={leave}
      onMouseMove={move}
      className={"relative inline-flex items-center justify-center isolate " + (className ?? "")}
    >
      <span
        ref={wrap}
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center"
      >
        <span
          ref={circle}
          className="absolute rounded-full"
          style={{ width: circleSize, height: circleSize, background: circleColor }}
        />
        <span ref={arrow} className="absolute" style={{ color: arrowColor }}>
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {arrowDirection === "down" ? (
              <path d="M6 9l6 6 6-6" />
            ) : arrowDirection === "left" ? (
              <path d="M15 6l-6 6 6 6" />
            ) : (
              <path d="M9 6l6 6-6 6" />
            )}
          </svg>
        </span>
      </span>

      <span ref={label} className="relative z-10">
        {children}
      </span>
    </a>
  );
}
