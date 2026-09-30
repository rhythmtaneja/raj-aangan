"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { prefersReducedMotion } from "@/components/anim/anim.config";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const serif = { fontFamily: "var(--font-cormorant-garamond)" } as const;

const BASE_FONT_SIZE = "1.125rem";

const OUTER_W = "4.2em";
const OUTER_H = "5.4em";
const INNER_W = "3.2em";
const INNER_H = "4.2em";

const GLYPH_SIZE = "1.4em";

const OUTER_BORDER = "rgba(39, 30, 36, 0.25)";
const INNER_BORDER = "rgba(39, 30, 36, 0.54)";
const GLYPH_COLOR = "#271e24";

const PINCH_DURATION = 0.4;
const PINCH_EASE = "power2.inOut";
const OUTER_SHRINK_TO = 0.9;
const INNER_GROW_TO = 0.7;

const GLYPH_EXIT_DURATION = 0.4;
const GLYPH_ENTER_DURATION = 0.7;
const GLYPH_SLIDE_DISTANCE = 130;

const TRIGGER_START = "top 85%";

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

      if (prefersReducedMotion()) {
        gsap.set([outer, inner], { scaleX: 1 });
        gsap.set(glyph, { autoAlpha: 1, xPercent: 0 });
        return;
      }

      gsap.set([outer, inner], { scaleX: 1, transformOrigin: "center center" });
      gsap.set(glyph, { autoAlpha: 1, xPercent: 0 });

      const play = () => {
        gsap.fromTo(
          outer,
          { scaleX: 1 },
          {
            scaleX: OUTER_SHRINK_TO,
            duration: PINCH_DURATION,
            ease: PINCH_EASE,
            yoyo: true,
            repeat: 1,
            overwrite: "auto",
          },
        );
        gsap.fromTo(
          inner,
          { scaleX: 1 },
          {
            scaleX: INNER_GROW_TO,
            duration: PINCH_DURATION,
            ease: PINCH_EASE,
            yoyo: true,
            repeat: 1,
            overwrite: "auto",
          },
        );

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
    { scope: ref },
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
      <div
        className="numeral-outer-frame relative flex items-center justify-center border"
        style={{
          width: OUTER_W,
          height: OUTER_H,
          borderColor: outerBorderColor,
        }}
      >
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
