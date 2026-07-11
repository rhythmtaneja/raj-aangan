"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { prefersReducedMotion } from "@/components/anim/anim.config";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const serif = { fontFamily: "var(--font-cormorant-garamond)" } as const;

// ═══════════════════════════════════════════════════════════════════════════
// ─── TUNE THESE KNOBS ──────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════

// ─ Box dimensions (em = relative to BASE_FONT_SIZE below) ──
const BASE_FONT_SIZE = "18px"; // ↑ everything scales with this. Bump up to make WHOLE marker bigger.

const OUTER_W = "4.2em";   // bigger frame width
const OUTER_H = "5.4em";   // bigger frame height
const INNER_W = "3.2em";   // smaller frame width  (gap = (OUTER_W - INNER_W) / 2)
const INNER_H = "4.2em"; // smaller frame height (gap = (OUTER_H - INNER_H) / 2)

const GLYPH_SIZE = "1.4em"; // numeral character size

// ─ Box border colors (lighter = sits behind, darker = sits in front) ──
const OUTER_BORDER = "rgba(39, 30, 36, 0.15)";
const INNER_BORDER = "rgba(39, 30, 36, 0.35)";
const GLYPH_COLOR = "#271e24";

// ─ Box-pinch animation (boxes squeeze toward each other, then release) ──
const PINCH_DURATION = 0.4;   // seconds for each direction (yoyo doubles total)
const PINCH_EASE = "power2.inOut";
const OUTER_SHRINK_TO = 0.9;  // outer scaleX at the pinch peak (1 = no change)
const INNER_GROW_TO = 0.7;  // inner scaleX at the pinch peak (1 = no change)

// ─ Glyph slide-through animation (exits left → re-enters from right) ──
const GLYPH_EXIT_DURATION = 0.4;
const GLYPH_ENTER_DURATION = 0.7;
const GLYPH_SLIDE_DISTANCE = 130; // % of glyph width — 130 means it travels fully outside the inner box

// ─ When the animation fires while scrolling ──
const TRIGGER_START = "top 85%"; // marker scrolls into this position → animation plays

// ═══════════════════════════════════════════════════════════════════════════

export default function NumeralMarker({
  numeral,
  light = false,
}: {
  numeral: string;
  light?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const outer = root.querySelector<HTMLElement>(".numeral-outer-frame");
      const inner = root.querySelector<HTMLElement>(".numeral-inner-frame");
      const glyph = root.querySelector<HTMLElement>(".numeral-glyph");
      if (!outer || !inner || !glyph) return;

      // Reduced-motion: just show the resting state and bail.
      if (prefersReducedMotion()) {
        gsap.set([outer, inner], { scaleX: 1 });
        gsap.set(glyph, { autoAlpha: 1, xPercent: 0 });
        return;
      }

      // Resting state
      gsap.set([outer, inner], { scaleX: 1, transformOrigin: "center center" });
      gsap.set(glyph, { autoAlpha: 1, xPercent: 0 });

      // Fires on every scroll-in (down AND back up)
      const play = () => {
        // ── (1) The two frames pinch toward each other, then release.
        //        Height never animates (scaleY untouched).
        gsap.fromTo(
          outer,
          { scaleX: 1 },
          { scaleX: OUTER_SHRINK_TO, duration: PINCH_DURATION, ease: PINCH_EASE, yoyo: true, repeat: 1, overwrite: "auto" }
        );
        gsap.fromTo(
          inner,
          { scaleX: 1 },
          { scaleX: INNER_GROW_TO, duration: PINCH_DURATION, ease: PINCH_EASE, yoyo: true, repeat: 1, overwrite: "auto" }
        );

        // ── (2) Glyph exits left, fresh glyph slides in from right.
        //        The inner frame has overflow-hidden so it stays clipped.
        gsap
          .timeline({ overwrite: "auto" })
          .to(glyph, {
            xPercent: -GLYPH_SLIDE_DISTANCE,
            autoAlpha: 0,
            duration: GLYPH_EXIT_DURATION,
            ease: "power2.in",
          })
          .set(glyph, { xPercent: GLYPH_SLIDE_DISTANCE, autoAlpha: 0 })
          .to(glyph, {
            xPercent: 0,
            autoAlpha: 1,
            duration: GLYPH_ENTER_DURATION,
            ease: "power2.out",
          });
      };

      ScrollTrigger.create({
        trigger: root,
        start: TRIGGER_START,
        end: "bottom 15%",
        onEnter: play,
        onEnterBack: play,
      });
    },
    { scope: ref }
  );

  const outerBorderColor = light ? "rgba(255,255,255,0.25)" : OUTER_BORDER;
  const innerBorderColor = light ? "rgba(255,255,255,0.50)" : INNER_BORDER;
  const textColor = light ? "#ffffff" : GLYPH_COLOR;

  return (
    <div
      ref={ref}
      className="relative inline-flex leading-none"
      style={{ fontSize: BASE_FONT_SIZE }}
    >
      {/* OUTER FRAME — bigger, lighter border. Contains and centers the inner. */}
      <div
        className="numeral-outer-frame relative flex items-center justify-center border"
        style={{
          width: OUTER_W,
          height: OUTER_H,
          borderColor: outerBorderColor,
        }}
      >
        {/* INNER FRAME — smaller, darker border. Centered inside outer.
            overflow-hidden clips the glyph slide so it stays inside the box. */}
        <div
          className="numeral-inner-frame relative flex items-center justify-center overflow-hidden border"
          style={{
            width: INNER_W,
            height: INNER_H,
            borderColor: innerBorderColor,
          }}
        >
          <span
            className="numeral-glyph block font-bold leading-none"
            style={{
              ...serif,
              fontSize: GLYPH_SIZE,
              color: textColor,
            }}
          >
            {numeral}
          </span>
        </div>
      </div>
    </div>
  );
}
