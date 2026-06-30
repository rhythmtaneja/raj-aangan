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

// ─ Background color SCROLL transition (continues the chain from Featured) ─
const BG_START_COLOR = "#dac8b0"; // = FeaturedSection's BG_END_COLOR
const BG_END_COLOR   = "#d4dad3"; // light sage at the section's resting state

const COLOR_TRANSITION_START = "top bottom";
const COLOR_TRANSITION_END   = "top top";

// ─ Background color HOVER override (per-word accent) ──
// When a word is hovered, --page-bg snaps to that word's accent. When the
// cursor leaves, --page-bg eases back to the current scroll-scrubbed colour.
// Set the accent per word in the SERVICES array below.
const HOVER_BG_DURATION = 0.55;
const HOVER_BG_EASE     = "power2.out";

// ─ Word styling ──
// FONT_SIZE bigger → bigger words (reference max ~220px)
// GAP bigger        → words spread further apart
const WORD_FONT_SIZE      = "clamp(3rem, 9.5vw, 220px)";
const WORD_GAP            = "clamp(1rem, 4vw, 100px)";
const WORD_LINE_HEIGHT    = 1;

const IDLE_COLOR             = "#8a8a8a";   // resting grey
const ACTIVE_COLOR           = "#ffffff";   // white when hovered
const IDLE_LETTER_SPACING    = "0em";
const ACTIVE_LETTER_SPACING  = "0.04em";

const WORD_COLOR_DURATION = 0.5;
const WORD_COLOR_EASE     = "power2.out";

// ─ Hover image (one per word — INSTANT appearance, no scale ramp) ──
// IMAGE_WIDTH larger than zone width (~33vw) so it spills into neighbours,
// covering the adjacent word text (matches the reference exactly).
const IMAGE_WIDTH  = "44vw";  // ↑ for more spill, ↓ to stay within zone
const IMAGE_HEIGHT = "72vh";

// SHORT durations so the image feels "already there" rather than fading in.
const IMAGE_FADE_IN_DUR  = 0.22;
const IMAGE_FADE_OUT_DUR = 0.35;

// ─ Cursor parallax (image drifts with the cursor inside its zone) ──
const PARALLAX_STRENGTH        = 50;  // px max drift in any direction
const PARALLAX_FOLLOW_DURATION = 0.7;

// ═══════════════════════════════════════════════════════════════════════════

const SERVICES = [
  // accent = the bg colour that washes in while this word is hovered
  { label: "Weddings", image: "/images/service-weddings.jpg", href: "#", accent: "#cdbfa6" },
  { label: "Events",   image: "/images/service-events.jpg",   href: "#", accent: "#d8c3bd" },
  { label: "Catering", image: "/images/service-catering.jpg", href: "#", accent: "#bfccbb" },
];

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const zoneRefs   = useRef<(HTMLDivElement | null)[]>([]);
  const imageRefs  = useRef<(HTMLDivElement | null)[]>([]);
  const wordRefs   = useRef<(HTMLSpanElement | null)[]>([]);

  // Two proxies so the scroll scrub and hover override don't fight:
  //   scrollProxy.c  = whatever the scroll-scrub is currently computing
  //   displayProxy.c = what's actually painted to --page-bg
  // When activeIdx === null, scroll updates flow through to display.
  // When activeIdx is a number, only the hover handlers write to --page-bg.
  const scrollProxy  = useRef({ c: BG_START_COLOR });
  const displayProxy = useRef({ c: BG_START_COLOR });
  const activeIdx    = useRef<number | null>(null);

  useGSAP(
    () => {
      // ─── (1) BG color SCROLL scrub ─────────────────────────────────────
      gsap.to(scrollProxy.current, {
        c: BG_END_COLOR,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: COLOR_TRANSITION_START,
          end:   COLOR_TRANSITION_END,
          scrub: true,
        },
        onUpdate: () => {
          // Only push to --page-bg if no word is hovered (hover wins).
          if (activeIdx.current === null) {
            displayProxy.current.c = scrollProxy.current.c;
            document.documentElement.style.setProperty("--page-bg", scrollProxy.current.c);
          }
        },
      });

      if (prefersReducedMotion()) {
        imageRefs.current.forEach((img) => { if (img) gsap.set(img, { autoAlpha: 0 }); });
        return;
      }

      // ─── (2) Hidden initial state for every per-word image ─────────────
      // xPercent/yPercent handle the centring so GSAP's x/y can be used for
      // parallax without blowing away the centering transform.
      imageRefs.current.forEach((img) => {
        if (!img) return;
        gsap.set(img, {
          autoAlpha: 0,
          xPercent: -50,
          yPercent: -50,
          x: 0,
          y: 0,
        });
      });
    },
    { scope: sectionRef }
  );

  // ─── Per-word hover handlers ──────────────────────────────────────────
  const handleEnter = (i: number) => {
    activeIdx.current = i;

    // Bring the hovered zone to the top of the stacking context so its image
    // (which spills past its bounds) covers the neighbour words.
    zoneRefs.current.forEach((z, idx) => {
      if (z) z.style.zIndex = idx === i ? "20" : "1";
    });

    const img  = imageRefs.current[i];
    const word = wordRefs.current[i];

    if (img) {
      gsap.to(img, {
        autoAlpha: 1,
        duration: IMAGE_FADE_IN_DUR,
        ease: "power1.out",
        overwrite: "auto",
      });
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

    // Animate displayed bg to this word's accent.
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

  const handleLeave = (i: number) => {
    const img  = imageRefs.current[i];
    const word = wordRefs.current[i];

    if (img) {
      gsap.to(img, {
        autoAlpha: 0,
        x: 0,
        y: 0,
        duration: IMAGE_FADE_OUT_DUR,
        ease: "power1.inOut",
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

    // Snap displayed bg back to whatever the scroll-scrub currently has.
    // activeIdx stays set until the animation completes, so the scroll
    // onUpdate doesn't fight us mid-transition.
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
        // Final hard-sync to the latest scroll value (in case the user
        // scrolled during the leave animation).
        displayProxy.current.c = scrollProxy.current.c;
        document.documentElement.style.setProperty("--page-bg", scrollProxy.current.c);
        // Restore zone z-index baseline.
        zoneRefs.current.forEach((z) => { if (z) z.style.zIndex = "1"; });
      },
    });
  };

  const handleMove = (e: React.MouseEvent<HTMLDivElement>, i: number) => {
    const zone = zoneRefs.current[i];
    const img  = imageRefs.current[i];
    if (!zone || !img) return;

    const rect = zone.getBoundingClientRect();
    const cx = rect.left + rect.width  / 2;
    const cy = rect.top  + rect.height / 2;
    const nx = (e.clientX - cx) / (rect.width  / 2);
    const ny = (e.clientY - cy) / (rect.height / 2);

    gsap.to(img, {
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
      {/* TOP — Roman numeral marker (kept above any spill imagery) */}
      <div className="mb-16" style={{ position: "relative", zIndex: 30 }}>
        <NumeralMarker numeral="II" />
      </div>

      {/*
        WORD ROW
        - Three flex-1 zones, words centred inside each.
        - Each zone owns its own image (absolute, spills outside zone bounds).
        - Hovered zone's z-index lifts so its image covers neighbour words.
        - Cursor parallax constrained to the hovered zone.
      */}
      <div
        className="relative flex w-full items-center justify-between"
        style={{ gap: WORD_GAP }}
      >
        {SERVICES.map((s, i) => (
          <div
            key={s.label}
            ref={(el) => { zoneRefs.current[i] = el; }}
            className="relative flex-1 flex items-center justify-center cursor-pointer"
            style={{ minHeight: IMAGE_HEIGHT, zIndex: 1 }}
            onMouseEnter={() => handleEnter(i)}
            onMouseLeave={() => handleLeave(i)}
            onMouseMove={(e) => handleMove(e, i)}
          >
            {/* Per-zone image — instantly visible on hover, can spill past zone */}
            <div
              ref={(el) => { imageRefs.current[i] = el; }}
              className="absolute pointer-events-none"
              style={{
                width: IMAGE_WIDTH,
                height: IMAGE_HEIGHT,
                left: "50%",
                top: "50%",
                willChange: "transform, opacity",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={s.image}
                alt={s.label}
                draggable={false}
                className="w-full h-full object-cover select-none"
              />
            </div>

            {/* The word — z-10 so it stays above its own image */}
            <a href={s.href} className="relative z-10 block">
              <span
                ref={(el) => { wordRefs.current[i] = el; }}
                className="font-semibold inline-block"
                style={{
                  ...serif,
                  fontSize: WORD_FONT_SIZE,
                  color: IDLE_COLOR,
                  letterSpacing: IDLE_LETTER_SPACING,
                  lineHeight: WORD_LINE_HEIGHT,
                }}
              >
                {s.label}
              </span>
            </a>
          </div>
        ))}
      </div>

      {/* BOTTOM — Explore button (CircleButton w/ dark ball) */}
      <div className="mt-16" style={{ position: "relative", zIndex: 30 }}>
        <CircleButton
          href="#"
          circleColor="#191919"
          arrowColor="#ffffff"
          circleSize={88}
          magnet={0.4}
          className="rounded-full border border-[#191919] px-10 py-4 font-medium text-[#191919] text-[clamp(1rem,1.25vw,24px)]"
        >
          Explore
        </CircleButton>
      </div>
    </section>
  );
}
