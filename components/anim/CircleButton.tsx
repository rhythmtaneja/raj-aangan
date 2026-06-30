"use client";

/**
 * CircleButton.tsx
 * ---------------------------------------------------------------------------
 * The reference site's signature button: at rest it's a bordered pill with a
 * label. On hover a sage ball grows from the centre (circ.inOut), the label
 * fades, the BORDER also fades to transparent (so the outline pill disappears
 * cleanly — only the ball + arrow remain), and the ball follows the cursor
 * magnetically.
 *
 * Reuse this for EVERY button site-wide (Plan Your Event, Explore, More, etc.).
 * Tune with the props — nothing else to edit.
 *
 * NOTE: the border colour is read from computed style on mount, so however
 * you set the border in the className (border-white, border-[#191919], …)
 * the fade-in/out uses your colour automatically.
 * ---------------------------------------------------------------------------
 */

import { useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { prefersReducedMotion } from "./anim.config";

gsap.registerPlugin(useGSAP);

type CircleButtonProps = {
  children: ReactNode;
  href?: string;
  /** Pill styling: border, padding, text colour, font. */
  className?: string;
  /** The ball colour (reference sage = #6c7c7b; for light bgs use #191919). */
  circleColor?: string;
  /** Arrow + (optional) hovered-label colour. */
  arrowColor?: string;
  /** Ball diameter in px (a touch larger than the pill height reads as a "ball"). */
  circleSize?: number;
  /** Magnetic pull, 0–1 (how far the ball drifts toward the cursor). */
  magnet?: number;
  /**
   * Direction of the chevron that appears on hover.
   *   "right" (default) — used for navigational / CTA buttons.
   *   "down"            — used when the button scrolls the user downward
   *                       (e.g. the about-page hero down-arrow).
   */
  arrowDirection?: "right" | "down";
};

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
  const wrap = useRef<HTMLSpanElement>(null);    // magnetic layer (ball + arrow)
  const circle = useRef<HTMLSpanElement>(null);
  const arrow = useRef<HTMLSpanElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  // We capture the original border colour at mount so the leave animation
  // restores whatever colour the className specified (border-white, etc.).
  const originalBorderColor = useRef<string>("rgba(0,0,0,0)");

  const xTo = useRef<((v: number) => void) | null>(null);
  const yTo = useRef<((v: number) => void) | null>(null);

  useGSAP(
    () => {
      // Capture the className-driven border colour BEFORE we touch it.
      if (root.current) {
        originalBorderColor.current =
          window.getComputedStyle(root.current).borderTopColor || "rgba(0,0,0,0)";
      }

      gsap.set(circle.current, { scale: 0, transformOrigin: "center center" });
      // Resting position of the arrow: nudged in the OPPOSITE direction of travel
      // so it "enters" into its final spot on hover.
      if (arrowDirection === "down") {
        gsap.set(arrow.current, { autoAlpha: 0, y: -6, x: 0 });
      } else {
        gsap.set(arrow.current, { autoAlpha: 0, x: 6, y: 0 });
      }

      if (prefersReducedMotion()) return;

      xTo.current = gsap.quickTo(wrap.current, "x", { duration: 0.5, ease: "power3" });
      yTo.current = gsap.quickTo(wrap.current, "y", { duration: 0.5, ease: "power3" });
    },
    { scope: root }
  );

  const enter = () => {
    if (prefersReducedMotion()) return;

    // (1) Outline pill: border fades to transparent, label fades out.
    gsap.to(root.current, {
      borderColor: "rgba(0,0,0,0)",
      duration: 0.3,
      ease: "power2.out",
      overwrite: "auto",
    });
    gsap.to(label.current, { autoAlpha: 0, duration: 0.25, ease: "power1.out", overwrite: "auto" });

    // (2) Ball + arrow appear. Arrow animates IN along its travel axis.
    gsap.to(circle.current, { scale: 1, duration: 0.5, ease: "circ.inOut", overwrite: "auto" });
    if (arrowDirection === "down") {
      gsap.to(arrow.current, {
        autoAlpha: 1,
        y: 0,
        duration: 0.35,
        ease: "power2.out",
        delay: 0.06,
        overwrite: "auto",
      });
    } else {
      gsap.to(arrow.current, {
        autoAlpha: 1,
        x: 0,
        duration: 0.35,
        ease: "power2.out",
        delay: 0.06,
        overwrite: "auto",
      });
    }
  };

  const leave = () => {
    if (prefersReducedMotion()) return;

    // Restore the outline pill (border + label fade back in).
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

    // Collapse the ball + arrow back to their resting positions.
    gsap.to(circle.current, { scale: 0, duration: 0.45, ease: "circ.inOut", overwrite: "auto" });
    if (arrowDirection === "down") {
      gsap.to(arrow.current, {
        autoAlpha: 0,
        y: -6,
        duration: 0.25,
        ease: "power1.in",
        overwrite: "auto",
      });
    } else {
      gsap.to(arrow.current, {
        autoAlpha: 0,
        x: 6,
        duration: 0.25,
        ease: "power1.in",
        overwrite: "auto",
      });
    }

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
      {/* magnetic layer: ball + arrow (not clipped, so the ball reads as a ball) */}
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
              // Down chevron
              <path d="M6 9l6 6 6-6" />
            ) : (
              // Right chevron
              <path d="M9 6l6 6-6 6" />
            )}
          </svg>
        </span>
      </span>

      {/* resting label */}
      <span ref={label} className="relative z-10">
        {children}
      </span>
    </a>
  );
}
