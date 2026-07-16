"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import SiteHeader from "@/components/ui/SiteHeader";
import CircleButton from "@/components/anim/CircleButton";
import { prefersReducedMotion } from "@/components/anim/anim.config";

gsap.registerPlugin(useGSAP);

const serif = { fontFamily: "var(--font-cormorant-garamond)" } as const;

// ═══════════════════════════════════════════════════════════════════════════
// ─── TUNE THESE KNOBS ──────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════

const BG_IMAGE = "/images/contact-hero.jpg";
const OVERLAY_OPACITY = 0.5;

// ─ Bottom fade — must match the AddressSection's SECTION_BG so the hero
//   dissolves smoothly into the next section instead of hard-cutting.
//   AddressSection is CREAM, so we fade to cream here (NOT to dark navy).
const HERO_BLEND_TO_COLOR = "#f5efe6"; // = AddressSection.SECTION_BG
const HERO_BLEND_HEIGHT = "0vh";
const HERO_BLEND_START = "0%";

// ─ Title ──
const TITLE_TEXT = "Contact Us";
const TITLE_FONT_SIZE = "clamp(2.5rem, 6vw, 120px)";

// ─ Subtitle beneath the title (from figma image 1) ──
const SUBTITLE_TEXT = "Let's start a conversation. Our team is here to help you create something extraordinary.";
const SUBTITLE_FONT_SIZE = "clamp(1rem, 1.5vw, 28px)";
const SUBTITLE_MAX_W = "42rem";

// ─ Letter-by-letter reveal ──
const LETTER_STAGGER = 0.05;
const LETTER_DURATION = 0.9;
const LETTER_INITIAL_Y = 28;
const LETTER_START_DELAY = 0.4;

// ─ Subtitle + CTA fade-in timing ──
const SUBTITLE_DELAY = 1.3;
const CTA_DELAY = 2.0;

// ═══════════════════════════════════════════════════════════════════════════

function Letters({ text }: { text: string }) {
  return (
    <>
      {text.split(" ").map((word, wi, words) => (
        <span key={wi} className="inline-block whitespace-nowrap">
          {word.split("").map((ch, ci) => (
            <span
              key={ci}
              className="hero-letter inline-block will-change-transform"
            >
              {ch}
            </span>
          ))}
          {wi < words.length - 1 && (
            <span className="hero-letter inline-block">&nbsp;</span>
          )}
        </span>
      ))}
    </>
  );
}

export default function ContactHero({ bgImage }: { bgImage?: string }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      const letters = root.current?.querySelectorAll<HTMLElement>(".hero-letter");
      const subtitle = root.current?.querySelector<HTMLElement>(".contact-hero-subtitle");
      const cta = root.current?.querySelector<HTMLElement>(".contact-hero-cta");

      if (letters && letters.length > 0) {
        gsap.set(letters, { autoAlpha: 0, y: LETTER_INITIAL_Y });
        gsap.to(letters, {
          autoAlpha: 1,
          y: 0,
          duration: LETTER_DURATION,
          stagger: LETTER_STAGGER,
          ease: "power2.out",
          delay: LETTER_START_DELAY,
        });
      }
      if (subtitle) {
        gsap.set(subtitle, { autoAlpha: 0, y: 20 });
        gsap.to(subtitle, {
          autoAlpha: 1,
          y: 0,
          duration: 1.0,
          ease: "power2.out",
          delay: SUBTITLE_DELAY,
        });
      }
      if (cta) {
        gsap.set(cta, { autoAlpha: 0, y: 20 });
        gsap.to(cta, {
          autoAlpha: 1,
          y: 0,
          duration: 1.0,
          ease: "power2.out",
          delay: CTA_DELAY,
        });
      }
    },
    { scope: root }
  );

  return (
    <section ref={root} className="relative h-screen w-full overflow-hidden">
      {/* Background photo */}
      <div className="absolute inset-0">
        <Image
          src={bgImage ?? BG_IMAGE}
          alt="Contact Us"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      {/* Dark overlay */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: `rgba(25, 25, 25, ${OVERLAY_OPACITY})` }}
      />

      {/* Bottom blend — dissolves the hero into the CREAM AddressSection */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0"
        style={{
          height: HERO_BLEND_HEIGHT,
          zIndex: 5,
          background: `linear-gradient(to bottom, transparent ${HERO_BLEND_START}, ${HERO_BLEND_TO_COLOR} 100%)`,
        }}
      />

      {/* Navbar */}
      <SiteHeader />

      {/* Centered title + subtitle + down-arrow CTA */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-white">
        <h1
          style={{ ...serif, fontSize: TITLE_FONT_SIZE }}
          className="font-medium leading-[1.1]"
        >
          <Letters text={TITLE_TEXT} />
        </h1>

        <p
          className="contact-hero-subtitle mt-6"
          style={{
            ...serif,
            fontSize: SUBTITLE_FONT_SIZE,
            maxWidth: SUBTITLE_MAX_W,
          }}
        >
          {SUBTITLE_TEXT}
        </p>

        <div className="contact-hero-cta mt-14">
          <CircleButton
            href="#address"
            circleColor="#ffffff"
            arrowColor="#191919"
            circleSize={120}
            magnet={0.35}
            arrowDirection="down"
            className="rounded-full border border-white px-7 py-3 text-white"
          >
            <DownArrowIcon />
          </CircleButton>
        </div>
      </div>
    </section>
  );
}

function DownArrowIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}
