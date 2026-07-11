"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import NumeralMarker from "@/components/ui/NumeralMarker";
import CircleButton from "@/components/anim/CircleButton";
import { prefersReducedMotion } from "@/components/anim/anim.config";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const serif = { fontFamily: "var(--font-cormorant-garamond)" } as const;

// ═══════════════════════════════════════════════════════════════════════════
// ─── TUNE THESE KNOBS ──────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════

// ─ BG color SCROLL scrub (chains from Featured, exits to next section) ─
const BG_START_COLOR = "#dac8b0"; // = FeaturedSection's BG_END_COLOR
const BG_END_COLOR = "#d4dad3";
const COLOR_TRANSITION_START = "top bottom";
const COLOR_TRANSITION_END = "top top";

// ─ BG color HOVER override (per-word accent) ──
const HOVER_BG_DURATION = 0.75;
const HOVER_BG_EASE = "power2.out";

// ─ Word row layout ──
// SMALLER FONT so all three fit on-screen. Bump the middle vw value if it
// still feels too small on your display: 6vw → 6.5vw for chunkier words.
const WORD_FONT_SIZE = "clamp(1.75rem, 6vw, 140px)";
const WORD_GAP = "clamp(1rem, 3vw, 60px)";
const WORD_LINE_HEIGHT = 1;

const IDLE_COLOR = "#8a8a8a";
const ACTIVE_COLOR = "#ffffff";
const IDLE_LETTER_SPACING = "0em";
const ACTIVE_LETTER_SPACING = "0.04em";

const WORD_COLOR_DURATION = 0.6;
const WORD_COLOR_EASE = "power2.out";

// ─ Per-word image (centred on each word's zone) ──
// Photo lives inside its word's zone and is centred on it. Because it's
// wider than the zone, it spills into neighbours — the hovered zone lifts
// to z-20 to cover their words. Matches the reference exactly.
// If it feels too spilly, drop IMAGE_WIDTH to 45vw; too shy → bump to 55vw.
const IMAGE_WIDTH = "50vw";
const IMAGE_HEIGHT = "70vh";

// SMOOTH crossfade. Both durations kept equal so the transition reads
// symmetrically. Push both to 0.9 for even more glide.
const IMAGE_FADE_IN_DUR = 0.6;
const IMAGE_FADE_OUT_DUR = 0.6;

// Directional entry: on first hover, image slides down from above (if
// cursor entered from the top) or up from below. Between words, it slides
// in from the direction of travel (Weddings → Events = enters from the
// left). Larger offset = more visible slide; smaller = more of a pure fade.
const IMAGE_ENTER_OFFSET = 50;
const IMAGE_ENTER_EASE = "power3.out";
const IMAGE_EXIT_EASE = "power2.inOut";

// ─ Cursor parallax (image drifts with cursor inside its own zone) ──
const PARALLAX_STRENGTH = 45;
const PARALLAX_FOLLOW_DURATION = 0.9;

// ═══════════════════════════════════════════════════════════════════════════

const SERVICES = [
  { label: "Weddings", image: "/images/service-weddings.jpg", href: "#", accent: "#cdbfa6" },
  { label: "Events", image: "/images/service-events.jpg", href: "#", accent: "#d8c3bd" },
  { label: "Catering", image: "/images/service-catering.jpg", href: "#", accent: "#bfccbb" },
];

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const zoneRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imgWrapRefs = useRef<(HTMLDivElement | null)[]>([]);       // opacity + entry slide
  const imgParallaxRefs = useRef<(HTMLDivElement | null)[]>([]);   // cursor drift
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);

  // Two proxies so scroll scrub and hover accents don't fight over --page-bg.
  const scrollProxy = useRef({ c: BG_START_COLOR });
  const displayProxy = useRef({ c: BG_START_COLOR });
  const activeIdx = useRef<number | null>(null);

  useGSAP(
    () => {
      // ─── BG scroll scrub ───────────────────────────────────────────
      gsap.to(scrollProxy.current, {
        c: BG_END_COLOR,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: COLOR_TRANSITION_START,
          end: COLOR_TRANSITION_END,
          scrub: true,
        },
        onUpdate: () => {
          if (activeIdx.current === null) {
            displayProxy.current.c = scrollProxy.current.c;
            document.documentElement.style.setProperty("--page-bg", scrollProxy.current.c);
          }
        },
      });

      if (prefersReducedMotion()) {
        imgWrapRefs.current.forEach((w) => { if (w) gsap.set(w, { autoAlpha: 0 }); });
        return;
      }

      // ─── Hidden initial state ──────────────────────────────────────
      // Outer wrap owns opacity + entry x/y offset.
      // xPercent/yPercent do the centering, leaving x/y free for animation.
      imgWrapRefs.current.forEach((w) => {
        if (!w) return;
        gsap.set(w, {
          autoAlpha: 0,
          xPercent: -50,
          yPercent: -50,
          x: 0,
          y: 0,
        });
      });

      // Inner parallax layer stays at 0,0 — mouseMove drives it.
      imgParallaxRefs.current.forEach((p) => {
        if (!p) return;
        gsap.set(p, { x: 0, y: 0 });
      });
    },
    { scope: sectionRef }
  );

  // ─── Word enter: called on each zone's mouseenter ─────────────────────
  // Handles BOTH first entry into the section AND transitions between words.
  // No per-zone mouseleave — that's on the row (see handleRowLeave).
  const handleWordEnter = (e: React.MouseEvent<HTMLDivElement>, i: number) => {
    const prevIdx = activeIdx.current;
    if (prevIdx === i) return;
    activeIdx.current = i;

    // Bump this zone above the others so its (large, spilling) image can
    // cover the neighbours' words. Non-hovered zones stay at z-1.
    // Within the hovered zone: image at auto z, word (anchor) at z-10 →
    // hovered word reads on top of its own image.
    zoneRefs.current.forEach((z, idx) => {
      if (z) z.style.zIndex = idx === i ? "20" : "1";
    });

    // ─ Determine entry direction ─
    let fromX = 0;
    let fromY = 0;
    if (prevIdx === null) {
      // First entry to section: slide from the edge the cursor crossed.
      const sectionRect = sectionRef.current?.getBoundingClientRect();
      if (sectionRect) {
        const relY = (e.clientY - sectionRect.top) / sectionRect.height;
        fromY = relY < 0.5 ? -IMAGE_ENTER_OFFSET : IMAGE_ENTER_OFFSET;
      }
    } else if (prevIdx < i) {
      // Moving right → new image slides in from the left.
      fromX = -IMAGE_ENTER_OFFSET;
    } else {
      // Moving left → new image slides in from the right.
      fromX = IMAGE_ENTER_OFFSET;
    }

    const wrap = imgWrapRefs.current[i];
    const word = wordRefs.current[i];
    const parallax = imgParallaxRefs.current[i];

    if (wrap) {
      gsap.set(wrap, { x: fromX, y: fromY });
      if (parallax) gsap.set(parallax, { x: 0, y: 0 });
      gsap.to(wrap, {
        autoAlpha: 1,
        x: 0,
        y: 0,
        duration: IMAGE_FADE_IN_DUR,
        ease: IMAGE_ENTER_EASE,
        overwrite: "auto",
      });
    }

    // ─ Fade out the previous word's image, matching direction of travel ─
    if (prevIdx !== null && prevIdx !== i) {
      const prevWrap = imgWrapRefs.current[prevIdx];
      const prevWord = wordRefs.current[prevIdx];
      if (prevWrap) {
        const outX = prevIdx < i ? -IMAGE_ENTER_OFFSET : IMAGE_ENTER_OFFSET;
        gsap.to(prevWrap, {
          autoAlpha: 0,
          x: outX,
          y: 0,
          duration: IMAGE_FADE_OUT_DUR,
          ease: IMAGE_EXIT_EASE,
          overwrite: "auto",
        });
      }
      if (prevWord) {
        gsap.to(prevWord, {
          color: IDLE_COLOR,
          letterSpacing: IDLE_LETTER_SPACING,
          duration: WORD_COLOR_DURATION,
          ease: WORD_COLOR_EASE,
          overwrite: "auto",
        });
      }
    }

    if (word) {
      gsap.to(word, {
        color: ACTIVE_COLOR,
        letterSpacing: ACTIVE_LETTER_SPACING,
        duration: WORD_COLOR_DURATION,
        ease: WORD_COLOR_EASE,
        overwrite: "auto",
      });
    }

    // BG wash to this word's accent
    gsap.to(displayProxy.current, {
      c: SERVICES[i].accent,
      duration: HOVER_BG_DURATION,
      ease: HOVER_BG_EASE,
      overwrite: "auto",
      onUpdate: () => {
        document.documentElement.style.setProperty("--page-bg", displayProxy.current.c);
      },
    });
  };

  // ─── Row leave: the ONLY place the section resets to idle ─────────────
  // Individual zones no longer have mouseleave handlers — moving between
  // words never triggers a full reset. Only leaving the whole row does.
  const handleRowLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const idx = activeIdx.current;
    if (idx === null) return;

    const wrap = imgWrapRefs.current[idx];
    const word = wordRefs.current[idx];

    // Detect which edge the cursor exited through so the image glides out
    // in that direction — no snap.
    let outX = 0;
    let outY = IMAGE_ENTER_OFFSET;
    const rect = rowRef.current?.getBoundingClientRect();
    if (rect) {
      const dx = (e.clientX - rect.left) / rect.width - 0.5;
      const dy = (e.clientY - rect.top) / rect.height - 0.5;
      if (Math.abs(dx) > Math.abs(dy)) {
        outX = dx > 0 ? IMAGE_ENTER_OFFSET : -IMAGE_ENTER_OFFSET;
        outY = 0;
      } else {
        outY = dy > 0 ? IMAGE_ENTER_OFFSET : -IMAGE_ENTER_OFFSET;
        outX = 0;
      }
    }

    if (wrap) {
      gsap.to(wrap, {
        autoAlpha: 0,
        x: outX,
        y: outY,
        duration: IMAGE_FADE_OUT_DUR,
        ease: IMAGE_EXIT_EASE,
        overwrite: "auto",
      });
    }
    if (word) {
      gsap.to(word, {
        color: IDLE_COLOR,
        letterSpacing: IDLE_LETTER_SPACING,
        duration: WORD_COLOR_DURATION,
        ease: WORD_COLOR_EASE,
        overwrite: "auto",
      });
    }

    // Ease BG back to the scroll-scrub value
    gsap.to(displayProxy.current, {
      c: scrollProxy.current.c,
      duration: HOVER_BG_DURATION,
      ease: HOVER_BG_EASE,
      overwrite: "auto",
      onUpdate: () => {
        document.documentElement.style.setProperty("--page-bg", displayProxy.current.c);
      },
      onComplete: () => {
        activeIdx.current = null;
        displayProxy.current.c = scrollProxy.current.c;
        document.documentElement.style.setProperty("--page-bg", scrollProxy.current.c);
        // Reset zone z-index baseline
        zoneRefs.current.forEach((z) => { if (z) z.style.zIndex = "1"; });
      },
    });
  };

  // ─── Cursor parallax ─────────────────────────────────────────────────
  // Normalised against the ZONE (image is inside the zone), so drift feels
  // anchored to the word you're hovering.
  const handleMove = (e: React.MouseEvent<HTMLDivElement>, i: number) => {
    const zone = zoneRefs.current[i];
    const parallax = imgParallaxRefs.current[i];
    if (!zone || !parallax) return;

    const rect = zone.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const nx = (e.clientX - cx) / (rect.width / 2);
    const ny = (e.clientY - cy) / (rect.height / 2);

    gsap.to(parallax, {
      x: nx * PARALLAX_STRENGTH,
      y: ny * PARALLAX_STRENGTH,
      duration: PARALLAX_FOLLOW_DURATION,
      ease: "power3.out",
      overwrite: "auto",
    });
  };

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen w-full flex-col items-center justify-center px-6 py-32 text-center overflow-hidden"
      style={{ backgroundColor: `var(--page-bg, ${BG_START_COLOR})` }}
    >
      {/* TOP — Roman numeral marker */}
      <div className="mb-16" style={{ position: "relative", zIndex: 30 }}>
        <NumeralMarker numeral="II" />
      </div>

      {/*
        WORD ROW
        Stacking:
          z-1  : non-hovered zones (their images and words sit here)
          z-20 : hovered zone (its image spills into neighbours, covers their words)
          z-10 (relative to zone): the word/anchor — sits above its own zone's image
          z-30 : numeral + explore button (always on top)
        Row-level onMouseLeave is the single source of truth for "we're done".
      */}
      <div
        ref={rowRef}
        className="relative flex w-full items-center justify-between"
        style={{ gap: WORD_GAP }}
        onMouseLeave={handleRowLeave}
      >
        {SERVICES.map((s, i) => (
          <div
            key={s.label}
            ref={(el) => { zoneRefs.current[i] = el; }}
            className="relative flex-1 flex items-center justify-center cursor-pointer"
            style={{ minHeight: IMAGE_HEIGHT, zIndex: 1 }}
            onMouseEnter={(e) => handleWordEnter(e, i)}
            onMouseMove={(e) => handleMove(e, i)}
          >
            {/* Per-zone image — centred on THIS word, spills past zone bounds */}
            <div
              ref={(el) => { imgWrapRefs.current[i] = el; }}
              className="absolute pointer-events-none"
              style={{
                width: IMAGE_WIDTH,
                height: IMAGE_HEIGHT,
                left: "50%",
                top: "50%",
                willChange: "transform, opacity",
              }}
            >
              <div
                ref={(el) => { imgParallaxRefs.current[i] = el; }}
                className="w-full h-full overflow-hidden"
                style={{ willChange: "transform" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={s.image}
                  alt={s.label}
                  draggable={false}
                  className="w-full h-full object-cover select-none"
                />
              </div>
            </div>

            {/* The word — z-10 within the zone so it stays above its own image */}
            <a href={s.href} className="relative block" style={{ zIndex: 10 }}>
              <span
                ref={(el) => { wordRefs.current[i] = el; }}
                className="font-semibold inline-block"
                style={{
                  ...serif,
                  fontSize: WORD_FONT_SIZE,
                  color: IDLE_COLOR,
                  letterSpacing: IDLE_LETTER_SPACING,
                  lineHeight: WORD_LINE_HEIGHT,
                  whiteSpace: "nowrap",
                }}
              >
                {s.label}
              </span>
            </a>
          </div>
        ))}
      </div>

      {/* BOTTOM — Explore button */}
      <div className="mt-16" style={{ position: "relative", zIndex: 30 }}>
        <CircleButton
          href="#"
          circleColor="#191919"
          arrowColor="#ffffff"
          circleSize={150}
          magnet={0.4}
          className="rounded-full border border-[#191919] px-10 py-4 font-medium text-[#191919] text-[clamp(1rem,1.25vw,24px)]"
        >
          Explore
        </CircleButton>
      </div>
    </section>
  );
}