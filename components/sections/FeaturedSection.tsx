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
const IMAGE_PADDING_Y = "8vh"; // top + bottom beige strip
const IMAGE_PADDING_X = "10vw"; // left + right beige strip

// ─ Service-list white card ──
const BOX_BG = "#ffffff";
const BOX_PADDING_X = "5rem";
const BOX_PADDING_Y = "5rem";
const BOX_MAX_W = "27rem";
const BOX_GAP = "1.75rem";
const LIST_LETTER_SPC = "0.2em";

// ─ Inner outline frame (sits INSIDE the white card, hugging the text) ──
// Positive value = how far the line is inset from the card's edge.
const BOX_INNER_FRAME_INSET = "16px";
const BOX_INNER_FRAME_COLOR = "rgba(0, 0, 0, 0.15)";

// ─ Outer outline frame (sits OUTSIDE the white card, picture-frame style) ──
// Positive value = how far the line extends beyond the card's edge.
const BOX_OUTER_FRAME_OFFSET = "14px";
const BOX_OUTER_FRAME_COLOR = "rgba(255, 255, 255, 0.43)";

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
        className="absolute inset-0"
        style={{
          padding: `${IMAGE_PADDING_Y} ${IMAGE_PADDING_X}`,
          willChange: "transform, opacity",
        }}
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
      <div
        className="relative z-10 mx-6"
        style={{
          backgroundColor: BOX_BG,
          padding: `${BOX_PADDING_Y} ${BOX_PADDING_X}`,
          maxWidth: BOX_MAX_W,
        }}
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
          className="relative flex flex-col items-center text-center"
          style={{ gap: BOX_GAP }}
        >
          {SERVICES.map((s) => (
            <li
              key={s}
              className="text-sm text-[#191919] uppercase"
              style={{
                fontFamily: "var(--font-raleway), sans-serif",
                letterSpacing: LIST_LETTER_SPC,
              }}
            >
              {s}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
