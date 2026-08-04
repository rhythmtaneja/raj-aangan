"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { prefersReducedMotion } from "@/components/anim/anim.config";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// ═══════════════════════════════════════════════════════════════════════════
// ─── TUNE THESE KNOBS ──────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════

// ─ Background color transition (synced with IntroSection via --page-bg) ──
const BG_START_COLOR = "#ffffff";
const BG_END_COLOR = "#dac8b0"; // dark beige

const COLOR_TRANSITION_START = "top bottom";
const COLOR_TRANSITION_END = "top top";

// ─ Image entrance tilt-zoom (direction-aware) ──
const TILT_DEG_X = 10;
const TILT_DEG_Y = 10;
const INITIAL_SCALE = 0.85;
const TILT_DURATION = 3.5;
const TILT_EASE = "power3.out";
const TILT_TRIGGER = "top 70%";

// ─ Image slide transition ──
const SLIDE_INTERVAL = 5.0;
const SLIDE_DURATION = 1.2;
const SLIDE_EASE = "power2.inOut";

// ─ Image padding (beige strip around image — NOT full-bleed) ──
// Format: "vertical horizontal" — beige strip thickness on each axis.
// ↑ bigger = thicker beige border around the photo.
//
// PHONE vs DESKTOP: on a 390px screen the desktop values (10vw side strips)
// left the photo only ~312px wide while the white card below was ~342px — the
// card was WIDER than the photo it is supposed to sit on top of. Phones get
// much thinner strips so the photo reads as the backdrop, matching the
// reference. Applied via a media query in the component (see PHONE_MQ).
const IMAGE_PADDING_Y = "8vh"; // top + bottom beige strip
const IMAGE_PADDING_X = "10vw"; // left + right beige strip
const IMAGE_PADDING_Y_PHONE = "4vh";
const IMAGE_PADDING_X_PHONE = "5vw";

// ─ Service-list white card ──
// The phone card must stay comfortably INSIDE the photo above: smaller
// padding, smaller cap width.
const BOX_BG = "#ffffff";
const BOX_PADDING_X = "5rem";
const BOX_PADDING_Y = "5rem";
const BOX_MAX_W = "27rem";
const BOX_GAP = "1.75rem";
const LIST_LETTER_SPC = "0.2em";

// Every item must sit on ONE line. The card's content box is 272px wide
// (27rem card − 2×5rem padding); at the previous 0.875rem/14px the two long
// entries measured 276.8px and 290.4px, so both wrapped.
//
// 0.78125rem (12.5px) scales the longest to 290.4 × 12.5/14 ≈ 259px, leaving
// ~13px of slack. Letter-spacing is in `em` so it shrinks proportionally and
// the wide tracking is preserved. Phones are already fine — 0.6875rem inside
// a 240px content box works out to ~228px — so only the md+ size changes.
// If you re-word an item, keep it under ~26 characters or drop this a step.
const LIST_FONT_SIZE_DESKTOP = "0.78125rem";

// ─ Inner outline frame (sits INSIDE the white card, hugging the text) ──
// Positive value = how far the line is inset from the card's edge.
const BOX_INNER_FRAME_INSET = "1rem";
const BOX_INNER_FRAME_COLOR = "rgba(0, 0, 0, 0.55)";

// ─ Outer outline frame (sits OUTSIDE the white card, picture-frame style) ──
// Positive value = how far the line extends beyond the card's edge.
const BOX_OUTER_FRAME_OFFSET = "0.875rem";
const BOX_OUTER_FRAME_COLOR = "rgba(255, 255, 255, 0.82)";

// ─ Background images (drop these in /public/images/) ──
const BG_IMAGES = [
  "/images/service-catering.jpg",
  "/images/service-events.jpg",
  "/images/service-weddings.jpg",
];

// ─ Service list copy ──
const SERVICES = [
  "WEDDING PLANNING",
  "LUXURY CATERING",
  "SOCIAL & CORPORATE EVENTS",
  "DECOR & STYLING",
  "ENTERTAINMENT & EXPERIENCE",
];

// ═══════════════════════════════════════════════════════════════════════════

export default function FeaturedSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const imgRefs = useRef<HTMLDivElement[]>([]);

  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        document.documentElement.style.setProperty("--page-bg", BG_END_COLOR);
        if (imageContainerRef.current) {
          gsap.set(imageContainerRef.current, {
            rotateX: 0, rotateY: 0, scale: 1, autoAlpha: 1,
          });
        }
        return;
      }

      // ─── (1) BG color scrub — syncs IntroSection + this section via --page-bg ───
      const colorProxy = { c: BG_START_COLOR };
      document.documentElement.style.setProperty("--page-bg", BG_START_COLOR);

      gsap.to(colorProxy, {
        c: BG_END_COLOR,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: COLOR_TRANSITION_START,
          end: COLOR_TRANSITION_END,
          scrub: true,
        },
        onUpdate: () => {
          document.documentElement.style.setProperty("--page-bg", colorProxy.c);
        },
      });

      // ─── (2) Image entrance tilt (direction-aware) ───
      const imageContainer = imageContainerRef.current;
      if (!imageContainer) return;

      const animateIn = (fromAbove: boolean) => {
        gsap.set(imageContainer, {
          transformPerspective: 1500,
          transformOrigin: "center center",
          rotateX: fromAbove ? TILT_DEG_X : -TILT_DEG_X,
          rotateY: fromAbove ? TILT_DEG_Y : -TILT_DEG_Y,
          scale: INITIAL_SCALE,
          autoAlpha: 0,
        });
        gsap.to(imageContainer, {
          rotateX: 0, rotateY: 0, scale: 1, autoAlpha: 1,
          duration: TILT_DURATION,
          ease: TILT_EASE,
        });
      };

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: TILT_TRIGGER,
        onEnter: () => animateIn(true),
        onEnterBack: () => animateIn(false),
      });

      // ─── (3) Image SLIDE transition ───
      const imgs = imgRefs.current.filter(Boolean);
      if (imgs.length > 1) {
        imgs.forEach((img, i) => {
          gsap.set(img, { xPercent: i === 0 ? 0 : 100, autoAlpha: 1 });
        });

        let current = 0;
        const slide = () => {
          const next = (current + 1) % imgs.length;
          const outgoing = current;

          gsap.to(imgs[outgoing], {
            xPercent: -100,
            duration: SLIDE_DURATION,
            ease: SLIDE_EASE,
          });
          gsap.fromTo(
            imgs[next],
            { xPercent: 100 },
            {
              xPercent: 0,
              duration: SLIDE_DURATION,
              ease: SLIDE_EASE,
              onComplete: () => {
                gsap.set(imgs[outgoing], { xPercent: 100 });
              },
            }
          );
          current = next;
        };

        const interval = setInterval(slide, SLIDE_INTERVAL * 1000);
        return () => clearInterval(interval);
      }
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden min-h-screen flex items-center justify-center"
      style={{ backgroundColor: `var(--page-bg, ${BG_END_COLOR})` }}
    >
      {/*
        IMAGE LAYER
        - The outer wrapper has padding so the beige bg shows around the image.
        - Inside it, a relative box (the actual "image area") holds the stacked
          images, all absolute-positioned and sliding via xPercent.
        - overflow-hidden on the inner box clips the slide motion cleanly.
      */}
      <div
        ref={imageContainerRef}
        className="absolute inset-0 p-[var(--fs-img-pad-phone)] md:p-[var(--fs-img-pad)]"
        style={
          {
            "--fs-img-pad-phone": `${IMAGE_PADDING_Y_PHONE} ${IMAGE_PADDING_X_PHONE}`,
            "--fs-img-pad": `${IMAGE_PADDING_Y} ${IMAGE_PADDING_X}`,
            willChange: "transform, opacity",
          } as React.CSSProperties
        }
      >
        <div className="relative w-full h-full overflow-hidden">
          {BG_IMAGES.map((src, i) => (
            <div
              key={src}
              ref={(el) => { if (el) imgRefs.current[i] = el; }}
              className="absolute inset-0 w-full h-full"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt=""
                draggable={false}
                className="w-full h-full object-cover select-none"
              />
            </div>
          ))}
        </div>
      </div>

      {/*
        WHITE CARD with two outline frames:
          - OUTER frame: offset OUTSIDE the card (picture-frame style)
          - INNER frame: inset INSIDE the card (around the text)
        Both are decorative absolute-positioned siblings of the text.
      */}
      {/*
        Phone: `mx-12` (48px) keeps the card well inside the photo's 5vw side
        strips, and the 19rem cap stops it stretching into a tablet-looking
        block at 767px (i.e. at 200% zoom).
      */}
      <div
        className="relative z-10 mx-12 max-w-[19rem] px-8 py-10 md:mx-6 md:max-w-[var(--fs-box-max)] md:px-[var(--fs-box-px)] md:py-[var(--fs-box-py)]"
        style={
          {
            backgroundColor: BOX_BG,
            "--fs-box-max": BOX_MAX_W,
            "--fs-box-px": BOX_PADDING_X,
            "--fs-box-py": BOX_PADDING_Y,
          } as React.CSSProperties
        }
      >
        {/* OUTER outline — extends beyond the card by BOX_OUTER_FRAME_OFFSET */}
        <div
          aria-hidden
          className="absolute pointer-events-none"
          style={{
            inset: `-${BOX_OUTER_FRAME_OFFSET}`,
            border: `1px solid ${BOX_OUTER_FRAME_COLOR}`,
          }}
        />

        {/* INNER outline — inset inward by BOX_INNER_FRAME_INSET (frames the text) */}
        <div
          aria-hidden
          className="absolute pointer-events-none"
          style={{
            inset: BOX_INNER_FRAME_INSET,
            border: `1px solid ${BOX_INNER_FRAME_COLOR}`,
          }}
        />

        <ul
          className="relative flex flex-col items-center gap-4 text-center md:gap-[var(--fs-box-gap)]"
          style={{ "--fs-box-gap": BOX_GAP } as React.CSSProperties}
        >
          {SERVICES.map((s) => (
            <li
              key={s}
              // `whitespace-nowrap` is the guarantee, not the sizing: if copy
              // ever outgrows the box it now overflows visibly instead of
              // silently reflowing to two lines again.
              // NOTE the `length:` hint. Plain `md:text-[var(--fs-list-size)]`
              // is ambiguous in Tailwind — it resolves to `color`, not
              // font-size, and silently leaves the phone size in place at
              // desktop. globals.css documents the same trap biting the
              // ServicesSection words once already.
              className="whitespace-nowrap text-[0.6875rem] text-[#191919] uppercase md:text-[length:var(--fs-list-size)]"
              style={
                {
                  fontFamily: "var(--font-raleway), sans-serif",
                  letterSpacing: LIST_LETTER_SPC,
                  "--fs-list-size": LIST_FONT_SIZE_DESKTOP,
                } as React.CSSProperties
              }
            >
              {s}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
