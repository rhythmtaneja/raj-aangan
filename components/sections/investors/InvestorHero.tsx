// ══════════════════════════════════════════════════════════════════
// PATH IN REPO: components/sections/investors/InvestorHero.tsx
// ══════════════════════════════════════════════════════════════════
/**
 * Hero — rebuilt on the AboutHero / VenueHero pattern so it opens the way
 * every other page on this site opens.
 *
 * What it now shares with them: full-bleed photograph, dark scrim, CENTRED
 * Cormorant title, a serif tagline under it, a down-arrow CircleButton that
 * smooth-scrolls to the first section, and a gradient that blends the photo
 * into the cream of the section below so there is no hard seam.
 *
 * ⚠️ HERO_BLEND_TO_COLOR must match the background of the section that
 * follows (InvestorSnapshot, currently CREAM). If they diverge you get a
 * colour seam — the same coupling AboutHero documents against
 * AboutStorySection.
 *
 * The strategy doc asks for "a cinematic venue/event image rather than a
 * generic corporate stock image" (§3), which is what the site's own venue
 * photography already is.
 */

"use client";

import Image from "next/image";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import SiteHeader from "@/components/ui/SiteHeader";
import CircleButton from "@/components/anim/CircleButton";
import { prefersReducedMotion } from "@/components/anim/anim.config";
import { HERO } from "@/lib/investor-content";
import { CREAM, serif } from "./theme";

gsap.registerPlugin(useGSAP);

// ═══════════════════════════════════════════════════════════════════════════
// ─── TUNE THESE KNOBS ──────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════

const BG_IMAGE = "/images/about-story-1.jpg";
const OVERLAY_OPACITY = 0.58;

/* MUST match InvestorSnapshot's background. */
const HERO_BLEND_TO_COLOR = CREAM;
const HERO_BLEND_HEIGHT = "26vh";

const TITLE_FONT_SIZE = "clamp(2.25rem, 6.2vw, 5.25rem)";
const TAGLINE_FONT_SIZE = "clamp(1.0625rem, 1.6vw, 1.5rem)";

/* Word-by-word rise, the same shape as AboutHero's letter reveal but one unit
   coarser — the title here is a sentence, not a two-word page name, and
   per-letter on 7 words reads as a stutter. */
const WORD_STAGGER = 0.07;
const WORD_DURATION = 0.9;
const WORD_INITIAL_Y = 26;

// ═══════════════════════════════════════════════════════════════════════════

export default function InvestorHero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const words = root.current?.querySelectorAll<HTMLElement>(".hero-word");
      const rest = root.current?.querySelectorAll<HTMLElement>(".hero-fade");
      if (!words) return;

      if (prefersReducedMotion()) {
        gsap.set([...words, ...(rest ? Array.from(rest) : [])], { autoAlpha: 1, y: 0 });
        return;
      }

      gsap.set(words, { autoAlpha: 0, y: WORD_INITIAL_Y });
      if (rest) gsap.set(rest, { autoAlpha: 0, y: 18 });

      const tl = gsap.timeline({ delay: 0.15 });
      tl.to(words, {
        autoAlpha: 1,
        y: 0,
        duration: WORD_DURATION,
        stagger: WORD_STAGGER,
        ease: "power3.out",
      });
      if (rest) {
        tl.to(rest, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.12, ease: "power2.out" }, "-=0.5");
      }
    },
    { scope: root }
  );

  return (
    <section ref={root} className="relative flex min-h-[92vh] w-full flex-col overflow-hidden md:min-h-screen">
      <Image src={BG_IMAGE} alt="" aria-hidden fill priority className="object-cover" sizes="100vw" />
      <div aria-hidden className="absolute inset-0 bg-black" style={{ opacity: OVERLAY_OPACITY }} />

      <SiteHeader />

      {/*
        SiteHeader is `position: absolute; top: 0` and out of flow, so this
        block would start behind it. The top padding is the clearance: the
        header is the pill row alone on phone (~5rem — the links live in
        MobileNavDrawer) and the pill row plus the `hidden md:block` nav row on
        desktop (~190px). Both are rem-based, so rem keeps the clearance
        correct as the fluid root font-size scales the header.
      */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pb-20 pt-28 text-center md:pb-28 md:pt-[12.5rem]">
        <p
          className="hero-fade uppercase tracking-[0.28em] text-white/70 text-[0.6875rem] md:text-[0.8125rem]"
          style={serif}
        >
          {HERO.eyebrow}
        </p>
        <span aria-hidden className="hero-fade mt-4 block h-px w-16 bg-[#bf9a3f]" />

        <h1
          style={{ ...serif, fontSize: TITLE_FONT_SIZE }}
          className="mt-8 max-w-[20rem] text-balance font-semibold leading-[1.1] text-white md:mt-10 md:max-w-[52rem] md:[text-wrap:auto]"
        >
          {HERO.title.split(" ").map((w, i) => (
            <span key={i} className="hero-word inline-block will-change-transform">
              {w}
              {" "}
            </span>
          ))}
        </h1>

        <p
          style={{ ...serif, fontSize: TAGLINE_FONT_SIZE }}
          className="hero-fade mt-6 max-w-[22rem] leading-relaxed text-white/80 md:mt-8 md:max-w-[44rem]"
        >
          {HERO.intro}
        </p>

        <div className="hero-fade mt-10 md:mt-14">
          <CircleButton
            href="#snapshot"
            circleColor="#ffffff"
            arrowColor="#191919"
            circleSize="7.5rem"
            magnet={0.4}
            className="rounded-full border border-white/70 px-8 py-3 text-sm font-medium text-white"
          >
            Explore the business
          </CircleButton>
        </div>
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0"
        style={{
          height: HERO_BLEND_HEIGHT,
          background: `linear-gradient(to bottom, transparent, ${HERO_BLEND_TO_COLOR})`,
        }}
      />
    </section>
  );
}
