// ══════════════════════════════════════════════════════════════════
// PATH IN REPO: components/anim/CircleButton.tsx
// ══════════════════════════════════════════════════════════════════

"use client";

/**
 * CircleButton.tsx
 * ---------------------------------------------------------------------------
 * Signature button used site-wide. Pill outline + label at rest → on hover
 * the border fades to transparent, label fades out, ball grows from centre,
 * arrow appears, ball follows cursor magnetically, ARROW follows cursor
 * *within* the ball for a "pointing at your cursor" feel.
 *
 * UPDATE — Jul 2026:
 *   • Default size bumped 84 → 140 (matches resortkaskady reference).
 *   • Enter / leave animation slower & smoother (see DUR_* constants).
 *   • NEW: arrow has its own magnetic layer, moves *more* than the ball so
 *     the chevron actively tracks the cursor inside the circle. Tunable
 *     via `arrowMagnet` prop (default 0.35).
 *   • Fixed TS error: no more ref-inside-spread cast. Two clean render
 *     branches, ref narrowed at each call site.
 *
 * PROPS (unchanged public API + arrowMagnet added):
 *   href, className, circleColor, arrowColor, circleSize, magnet,
 *   arrowDirection, asStatic, onClick, arrowMagnet (NEW)
 * ---------------------------------------------------------------------------
 */

import { useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { prefersReducedMotion } from "./anim.config";

gsap.registerPlugin(useGSAP);

// ─── TUNE THESE KNOBS ────────────────────────────────────────────────
// Default ball diameter. Reference site is ~140px. Override per-instance
// with the `circleSize` prop.
const DEFAULT_CIRCLE_SIZE = "8.75rem";

// How far the whole ball drifts toward the cursor. 0 = locked centre, 1 =
// ball snaps to cursor. Reference feels ~0.35–0.45. Override with `magnet`.
const DEFAULT_MAGNET = 0.4;

// How far the ARROW drifts toward the cursor *within* the ball, on top of
// the ball's own drift. Higher = arrow visibly points at the cursor. Keep
// lower than magnet so the arrow stays inside the ball. Override with
// `arrowMagnet`.
const DEFAULT_ARROW_MAGNET = 0.35;

// ─── Enter / leave choreography ──────────────────────────────────────
// RETIMED (Aug 2026) to remove three overlaps the client saw as "lag" —
// in every case two states were legitimately on screen at once:
//
//   1. ENTER: the label faded out over 0.45s while the ball grew over
//      0.6s. The label sits at z-10, ABOVE the ball, so for ~0.3s you
//      read the old text printed on top of the new circle. The label now
//      clears in 0.16s, well before the ball covers its area.
//   2. LEAVE: the arrow faded over 0.3s on `power1.in` — an ease that
//      barely moves early — while the ball collapsed over the same 0.3s
//      on `circ.inOut`, which is fastest in the middle. Halfway through,
//      the ball was at 50% scale with the arrow still at ~75% opacity:
//      a chevron floating over/outside a shrunken ball. The arrow now
//      leaves FIRST and fast, and the ball waits a beat for it.
//   3. LEAVE: the label faded back in starting at 0.1s, i.e. while the
//      ball was still clearly visible — the two "mixed up" again. It now
//      waits until the ball is essentially closed.
//
// Read the two sequences as timelines (t = seconds from the event):
//   ENTER   label out 0→0.16 | border out 0→0.25 | ball 0→0.55 | arrow 0.14→0.49
//   LEAVE   arrow out 0→0.16 | ball 0.05→0.35    | border+label 0.26→0.56
const DUR_CIRCLE_OPEN = 0.55;       // ball grows from 0 → 1
const DUR_CIRCLE_CLOSE = 0.3;       // ball shrinks 1 → 0
const DUR_BORDER_FADE_OUT = 0.25;   // pill outline fading away on enter
const DUR_BORDER_FADE_IN = 0.3;     // pill outline coming back on leave
const DUR_LABEL_FADE_OUT = 0.16;    // resting label clearing out of the ball's way
const DUR_LABEL_FADE_IN = 0.3;      // resting label returning
const DUR_ARROW_ENTER = 0.35;       // arrow fade-in after ball opens
const DUR_ARROW_EXIT = 0.16;        // arrow fade-out — must beat the ball out
const DELAY_ARROW_AFTER_BALL = 0.14;// arrow waits this long after ball starts opening
const DELAY_CIRCLE_CLOSE = 0.05;    // ball lets the arrow clear before collapsing
const DELAY_BORDER_LABEL_ON_LEAVE = 0.26; // ...and the label waits for the ball

const EASE_CIRCLE_OPEN = "circ.out"; // fast, premium expansion that settles
const EASE_CIRCLE_CLOSE = "power2.inOut";
const EASE_SOFT = "power2.out";

// How quickly the magnetic drift catches up to the cursor. Lower = snappier,
// higher = lazier/silkier. Reference site feels ~0.55–0.7s.
const DUR_MAGNET_BODY = 0.6;        // wrap (whole ball) drift
const DUR_MAGNET_ARROW = 0.45;      // arrow drift within ball
// ─────────────────────────────────────────────────────────────────────

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
  /** Ball diameter in px or a CSS size value. */
  circleSize?: number | string;
  /** Magnetic pull for the whole ball, 0–1. */
  magnet?: number;
  /** Magnetic pull for the arrow *within* the ball, 0–1. */
  arrowMagnet?: number;
  /** Chevron direction shown on hover. Defaults to "right". */
  arrowDirection?: ArrowDirection;
  /** Render as <span> instead of <a> — use when nested inside another Link. */
  asStatic?: boolean;
  /** Click handler passed to the root. */
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
};

/** Resting offset for the arrow (where it starts before entering to centre). */
function restingOffset(direction: ArrowDirection): { x: number; y: number } {
  if (direction === "down") return { x: 0, y: -6 };
  if (direction === "left") return { x: -6, y: 0 };
  return { x: 6, y: 0 }; // right (default)
}

export default function CircleButton({
  children,
  href = "#",
  className,
  circleColor = "#6c7c7b",
  arrowColor = "#ffffff",
  circleSize = DEFAULT_CIRCLE_SIZE,
  magnet = DEFAULT_MAGNET,
  arrowMagnet = DEFAULT_ARROW_MAGNET,
  arrowDirection = "right",
  asStatic = false,
  onClick,
}: CircleButtonProps) {
  // Root ref is typed loosely; each render branch narrows it locally.
  const root = useRef<HTMLElement | null>(null);
  const wrap = useRef<HTMLSpanElement>(null);          // whole ball drift layer
  const arrowFollow = useRef<HTMLSpanElement>(null);   // NEW arrow-within-ball drift layer
  const circle = useRef<HTMLSpanElement>(null);
  const arrow = useRef<HTMLSpanElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const hit = useRef<HTMLSpanElement>(null);           // hover area matching the ball

  const originalBorderColor = useRef<string>("rgba(0,0,0,0)");

  // Magnetic drift handles
  const bodyXTo = useRef<((v: number) => void) | null>(null);
  const bodyYTo = useRef<((v: number) => void) | null>(null);
  const arrowFollowXTo = useRef<((v: number) => void) | null>(null);
  const arrowFollowYTo = useRef<((v: number) => void) | null>(null);

  const rest = restingOffset(arrowDirection);

  useGSAP(
    () => {
      if (root.current) {
        originalBorderColor.current =
          window.getComputedStyle(root.current).borderTopColor || "rgba(0,0,0,0)";
      }

      // Initial hidden state
      gsap.set(circle.current, { scale: 0, transformOrigin: "center center" });
      gsap.set(arrow.current, { autoAlpha: 0, x: rest.x, y: rest.y });
      gsap.set(arrowFollow.current, { x: 0, y: 0 });

      if (prefersReducedMotion()) return;

      // Body (whole ball) magnetic drift
      bodyXTo.current = gsap.quickTo(wrap.current, "x", {
        duration: DUR_MAGNET_BODY,
        ease: "power3",
      });
      bodyYTo.current = gsap.quickTo(wrap.current, "y", {
        duration: DUR_MAGNET_BODY,
        ease: "power3",
      });

      // Arrow magnetic drift *within* the ball (separate wrapper so it
      // doesn't fight the enter/leave x/y animation on the arrow itself).
      arrowFollowXTo.current = gsap.quickTo(arrowFollow.current, "x", {
        duration: DUR_MAGNET_ARROW,
        ease: "power3",
      });
      arrowFollowYTo.current = gsap.quickTo(arrowFollow.current, "y", {
        duration: DUR_MAGNET_ARROW,
        ease: "power3",
      });
    },
    { scope: root, dependencies: [arrowDirection] }
  );

  const enter = () => {
    if (prefersReducedMotion()) return;

    // Grow the hit area to the ball's own footprint. The ball is much bigger
    // than the pill (150px vs a ~56px-tall pill), so without this, sliding the
    // cursor onto the circle you can plainly see leaves the <a> and fires
    // mouseleave → the ball collapses and immediately reopens. That flicker
    // was the single worst part of the "lag". It is only enabled while
    // hovered, so the button's resting hit area is unchanged.
    if (hit.current) hit.current.style.pointerEvents = "auto";

    gsap.to(root.current, {
      borderColor: "rgba(0,0,0,0)",
      duration: DUR_BORDER_FADE_OUT,
      ease: EASE_SOFT,
      overwrite: "auto",
    });
    gsap.to(label.current, {
      autoAlpha: 0,
      duration: DUR_LABEL_FADE_OUT,
      ease: EASE_SOFT,
      overwrite: "auto",
    });

    gsap.to(circle.current, {
      scale: 1,
      duration: DUR_CIRCLE_OPEN,
      ease: EASE_CIRCLE_OPEN,
      force3D: true,
      overwrite: "auto",
    });
    gsap.to(arrow.current, {
      autoAlpha: 1,
      x: 0,
      y: 0,
      duration: DUR_ARROW_ENTER,
      ease: EASE_SOFT,
      delay: DELAY_ARROW_AFTER_BALL,
      overwrite: "auto",
    });
  };

  const leave = () => {
    if (prefersReducedMotion()) return;

    if (hit.current) hit.current.style.pointerEvents = "none";

    gsap.to(root.current, {
      borderColor: originalBorderColor.current,
      duration: DUR_BORDER_FADE_IN,
      ease: EASE_SOFT,
      delay: DELAY_BORDER_LABEL_ON_LEAVE,
      overwrite: "auto",
    });
    gsap.to(label.current, {
      autoAlpha: 1,
      duration: DUR_LABEL_FADE_IN,
      ease: EASE_SOFT,
      delay: DELAY_BORDER_LABEL_ON_LEAVE,
      overwrite: "auto",
    });

    // Arrow out FIRST (fast, front-loaded ease), ball a beat behind it.
    gsap.to(arrow.current, {
      autoAlpha: 0,
      x: rest.x,
      y: rest.y,
      duration: DUR_ARROW_EXIT,
      ease: EASE_SOFT,
      overwrite: "auto",
    });
    gsap.to(circle.current, {
      scale: 0,
      duration: DUR_CIRCLE_CLOSE,
      ease: EASE_CIRCLE_CLOSE,
      delay: DELAY_CIRCLE_CLOSE,
      force3D: true,
      overwrite: "auto",
    });

    // Reset both magnetic layers back to centre
    bodyXTo.current?.(0);
    bodyYTo.current?.(0);
    arrowFollowXTo.current?.(0);
    arrowFollowYTo.current?.(0);
  };

  const move = (e: React.MouseEvent) => {
    if (!root.current || prefersReducedMotion()) return;
    const r = root.current.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);

    // Whole ball drifts subtly toward the cursor
    bodyXTo.current?.(dx * magnet);
    bodyYTo.current?.(dy * magnet);

    // Arrow drifts *further* within the ball for the "pointing at cursor" feel
    arrowFollowXTo.current?.(dx * arrowMagnet);
    arrowFollowYTo.current?.(dy * arrowMagnet);
  };

  // Shared visual content — no root element wrapper.
  const content = (
    <>
      <span
        ref={wrap}
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center"
      >
        <span
          ref={circle}
          className="absolute rounded-full"
          style={{
            width: circleSize,
            height: circleSize,
            background: circleColor,
            willChange: "transform",
          }}
        />
        {/*
          Invisible hover area the size of the ball, switched on only while
          hovered (see `enter`). mouseenter/mouseleave are subtree-based, so a
          child that extends past the root's own box still counts as "inside"
          — which is what stops the ball from collapsing the moment you move
          onto it. It lives inside `wrap` so it drifts WITH the magnetised
          ball rather than staying pinned to the pill.
        */}
        <span
          ref={hit}
          aria-hidden
          className="absolute rounded-full"
          style={{ width: circleSize, height: circleSize, pointerEvents: "none" }}
        />
        {/* Extra wrapper so the arrow's magnetic drift is independent of its
            enter/leave x/y offset animation. */}
        <span ref={arrowFollow} className="absolute inline-flex">
          <span ref={arrow} className="inline-flex" style={{ color: arrowColor }}>
            <svg
              className="w-[1.625rem] h-[1.625rem]" width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.6}
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
      </span>

      <span ref={label} className="relative z-10">
        {children}
      </span>
    </>
  );

  const rootClassName =
    "relative inline-flex items-center justify-center isolate " + (className ?? "");

  // ─ Render root element ────────────────────────────────────────────────
  // Two clean branches — no cast gymnastics, no ref-inside-spread.
  if (asStatic) {
    return (
      <span
        ref={root as React.RefObject<HTMLSpanElement>}
        onMouseEnter={enter}
        onMouseLeave={leave}
        onMouseMove={move}
        onClick={onClick}
        className={rootClassName}
      >
        {content}
      </span>
    );
  }

  return (
    <a
      href={href}
      ref={root as React.RefObject<HTMLAnchorElement>}
      onMouseEnter={enter}
      onMouseLeave={leave}
      onMouseMove={move}
      onClick={onClick}
      className={rootClassName}
    >
      {content}
    </a>
  );
}
