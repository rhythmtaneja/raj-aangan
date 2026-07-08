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

// ─ Background ──
const BG_IMAGE = "/images/catering-hero.jpg"; // catering spread/table
const OVERLAY_OPACITY = 0.45;

// ─ Bottom blend — dissolves hero photo INTO the WHITE next section ──
// MUST match the bg of the section that follows (IntroSection defaults to
// white via var(--page-bg, #ffffff)). If they diverge, seam appears.
const HERO_BLEND_TO_COLOR = "#ffffff";
const HERO_BLEND_HEIGHT = "0vh";

// ─ RAEC logo block (positioned in upper third) ──
const LOGO_BLOCK_TOP = "clamp(9rem, 20vh, 14rem)";
const LOGO_SIZE_PX = 82;
const LOGO_TEXT_SIZE = "clamp(2.5rem, 4vw, 64px)";
const LOGO_SUBTITLE_SIZE = "clamp(0.7rem, 0.85vw, 14px)";

// ─ Tagline ──
const TAGLINE_TEXT = "A journey of flavors, cultures, and unforgettable tastes.";
const TAGLINE_FONT_SIZE = "clamp(2rem, 4.2vw, 78px)";
const TAGLINE_MAX_W = "1100px";

// ─ Letter reveal on tagline ──
const LETTER_STAGGER = 0.03;
const LETTER_DURATION = 0.9;
const LETTER_INITIAL_Y = 28;
const LETTER_START_DELAY = 0.5;

// ─ Logo block entrance ──
const LOGO_START_DELAY = 0.2;

// ─ CTA button reveal (delayed until title mostly done) ──
const CTA_DELAY = 2.4;

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

export default function CateringHero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      const logoBlock = root.current?.querySelector<HTMLElement>(".hero-logo-block");
      const letters = root.current?.querySelectorAll<HTMLElement>(".hero-letter");
      const cta = root.current?.querySelector<HTMLElement>(".hero-cta");

      if (logoBlock) {
        gsap.set(logoBlock, { autoAlpha: 0, y: -18 });
        gsap.to(logoBlock, {
          autoAlpha: 1,
          y: 0,
          duration: 1.2,
          ease: "power2.out",
          delay: LOGO_START_DELAY,
        });
      }

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
          src={BG_IMAGE}
          alt="Catering spread"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      {/* Dark overlay for legibility */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: `rgba(25,25,25,${OVERLAY_OPACITY})` }}
      />

      {/* Bottom blend into next section (WHITE — matches IntroSection bg) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0"
        style={{
          height: HERO_BLEND_HEIGHT,
          zIndex: 5,
          background: `linear-gradient(to bottom, transparent, ${HERO_BLEND_TO_COLOR} 100%)`,
        }}
      />

      <SiteHeader animateEntrance />

      {/* RAEC logo block — positioned in upper third of the hero */}
      <div
        className="hero-logo-block absolute inset-x-0 z-10 flex flex-col items-center text-center text-white"
        style={{ top: LOGO_BLOCK_TOP }}
      >
        <Image
          src="/images/logo-round.png"
          alt="RAEC"
          width={LOGO_SIZE_PX}
          height={LOGO_SIZE_PX}
          priority
        />
        <h2
          style={{ ...serif, fontSize: LOGO_TEXT_SIZE }}
          className="mt-3 font-medium leading-none"
        >
          RAEC
        </h2>
        <p
          style={{ fontSize: LOGO_SUBTITLE_SIZE }}
          className="mt-2 uppercase tracking-[0.25em] text-white/90"
        >
          Raj Aangan Events and Caterers
        </p>
      </div>

      {/* Tagline + CTA, centered vertically with a nudge downward so it sits
          below the logo block */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 pt-[18vh] text-center text-white">
        <h1
          style={{ ...serif, fontSize: TAGLINE_FONT_SIZE, maxWidth: TAGLINE_MAX_W }}
          className="font-medium leading-[1.15]"
        >
          <Letters text={TAGLINE_TEXT} />
        </h1>

        <div className="hero-cta mt-14">
          <CircleButton
            href="/menu-builder"
            circleColor="#6c7c7b" /* sage — matches Homepage hero */
            arrowColor="#ffffff"
            circleSize={84}
            magnet={0.4}
            className="rounded-full border border-white/80 px-10 py-4 text-white uppercase tracking-[0.15em] text-[clamp(0.9rem,1.05vw,20px)]"
          >
            Plan Your Event
          </CircleButton>
        </div>
      </div>
    </section>
  );
}
