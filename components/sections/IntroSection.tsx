"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import NumeralMarker from "@/components/ui/NumeralMarker";
import { prefersReducedMotion } from "@/components/anim/anim.config";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const serif = { fontFamily: "var(--font-cormorant-garamond)" } as const;

// ═══════════════════════════════════════════════════════════════════════════
// ─── TUNE THESE KNOBS ──────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════

// ─ Text tilt-zoom ──
const TILT_DEG          = 40;
const INITIAL_SCALE     = 0.78;
const TILT_DURATION     = 2.4;
const TILT_EASE         = "power3.out";

// ─ Word-by-word reveal (first time only) ──
const WORD_STAGGER       = 0.09;
const WORD_FADE_DURATION = 0.7;
const WORD_REVEAL_DELAY  = 0.2;

// ─ Subsequent en-bloc reveal ──
const ENBLOC_FADE_DURATION = 1.2;

// ─ Button sizing ──
const BUTTON_WIDTH  = "10em";
const BUTTON_HEIGHT = "4em";
const BUTTON_BORDER = "#737272";

// ─ When the animation fires ──
const TRIGGER_START = "top 70%";

// ─ BG color (read from CSS variable set by FeaturedSection) ──
// IntroSection just READS the var. The actual color transition is DRIVEN by
// FeaturedSection's scroll trigger. Both sections read the same var, so they
// show the same interpolated color simultaneously — no visible seam.
// Fallback = the initial white before the transition starts.
const BG_FALLBACK = "#ffffff";

// ═══════════════════════════════════════════════════════════════════════════

function Words({ text }: { text: string }) {
  const parts = text.split(" ");
  return (
    <>
      {parts.map((word, i) => (
        <span key={i} className="word inline-block will-change-transform">
          {word}
          {i < parts.length - 1 ? "\u00A0" : ""}
        </span>
      ))}
    </>
  );
}

export default function IntroSection() {
  const sectionRef   = useRef<HTMLElement>(null);
  const textBlockRef = useRef<HTMLDivElement>(null);
  const buttonRef    = useRef<HTMLAnchorElement>(null);

  const hasPlayedWordReveal = useRef(false);

  useGSAP(
    () => {
      const text = textBlockRef.current;
      const btn  = buttonRef.current;
      if (!text) return;

      const words = text.querySelectorAll<HTMLElement>(".word");

      if (prefersReducedMotion()) {
        gsap.set(text,  { autoAlpha: 1, rotateY: 0, scale: 1 });
        gsap.set(words, { autoAlpha: 1, y: 0 });
        if (btn) gsap.set(btn, { autoAlpha: 1, y: 0 });
        hasPlayedWordReveal.current = true;
        return;
      }

      const setHidden = () => {
        gsap.set(text, {
          transformPerspective: 1200,
          transformOrigin: "center center",
          rotateY: TILT_DEG,
          scale: INITIAL_SCALE,
          autoAlpha: 0,
        });
        gsap.set(words, { autoAlpha: 0, y: 18 });
        if (btn) gsap.set(btn, { autoAlpha: 0, y: 22 });
      };
      setHidden();

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: TRIGGER_START,
        onEnter: () => {
          const tl = gsap.timeline();
          tl.to(
            text,
            { autoAlpha: 1, rotateY: 0, scale: 1, duration: TILT_DURATION, ease: TILT_EASE },
            0
          );
          if (!hasPlayedWordReveal.current) {
            tl.to(words, {
              autoAlpha: 1, y: 0,
              duration: WORD_FADE_DURATION,
              stagger: WORD_STAGGER,
              ease: "power2.out",
            }, WORD_REVEAL_DELAY);
            hasPlayedWordReveal.current = true;
          } else {
            tl.to(words, {
              autoAlpha: 1, y: 0,
              duration: ENBLOC_FADE_DURATION,
              ease: "power2.out",
            }, 0);
          }
          if (btn) {
            tl.to(btn, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power2.out" }, "-=0.55");
          }
        },
        onLeaveBack: () => setHidden(),
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      // NOTE: bg-white removed. We now use a CSS variable so both this section
      // and FeaturedSection can be color-synced during the scroll transition.
      style={{ backgroundColor: `var(--page-bg, ${BG_FALLBACK})` }}
      className="relative flex min-h-screen w-full flex-col items-center justify-center px-6 py-32 text-center"
    >
      <div className="mb-20">
        <NumeralMarker numeral="I" />
      </div>

      <div
        ref={textBlockRef}
        className="flex flex-col items-center"
        style={{ willChange: "transform, opacity" }}
      >
        <h2
          style={serif}
          className="max-w-[1600px] font-semibold leading-[1.05] text-[#191919] text-[clamp(2rem,3.9vw,75px)]"
        >
          <Words text="A Royal Destination where celebrations come alive." />
        </h2>

        <div
          style={serif}
          className="mt-6 font-semibold leading-[1.15] text-[#8a8a8a]"
        >
          <p className="text-[clamp(1.5rem,3.39vw,65px)]">
            <Words text="Luxury Weddings · Refined Catering ·" />
          </p>
          <p className="text-[clamp(1.25rem,2.86vw,55px)]">
            <Words text="Memories Forever" />
          </p>
        </div>

        <a
          ref={buttonRef}
          href="#"
          style={{ ...serif, width: BUTTON_WIDTH, height: BUTTON_HEIGHT, borderColor: BUTTON_BORDER }}
          className="mt-20 flex items-center justify-center rounded-full border text-[#191919] text-[clamp(1rem,1.25vw,24px)] transition-colors duration-300 hover:bg-[#191919] hover:text-white"
        >
          View
        </a>
      </div>
    </section>
  );
}
