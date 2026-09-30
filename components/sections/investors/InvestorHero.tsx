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

const BG_IMAGE = "/images/about-story-1.jpg";
const OVERLAY_OPACITY = 0.58;

const HERO_BLEND_TO_COLOR = CREAM;
const HERO_BLEND_HEIGHT = "26vh";

const TITLE_FONT_SIZE = "clamp(2.25rem, 6.2vw, 5.25rem)";
const TAGLINE_FONT_SIZE = "clamp(1.0625rem, 1.6vw, 1.5rem)";

const WORD_STAGGER = 0.07;
const WORD_DURATION = 0.9;
const WORD_INITIAL_Y = 26;

export default function InvestorHero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const words = root.current?.querySelectorAll<HTMLElement>(".hero-word");
      const rest = root.current?.querySelectorAll<HTMLElement>(".hero-fade");
      if (!words) return;

      if (prefersReducedMotion()) {
        gsap.set([...words, ...(rest ? Array.from(rest) : [])], {
          autoAlpha: 1,
          y: 0,
        });
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
        tl.to(
          rest,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: "power2.out",
          },
          "-=0.5",
        );
      }
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      className="relative flex min-h-[92vh] w-full flex-col overflow-hidden md:min-h-screen"
    >
      <Image
        src={BG_IMAGE}
        alt=""
        aria-hidden
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-black"
        style={{ opacity: OVERLAY_OPACITY }}
      />

      <SiteHeader />

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pb-20 pt-28 text-center md:pb-28 md:pt-[12.5rem]">
        <p
          className="hero-fade font-semibold uppercase tracking-[0.28em] text-white text-[0.8125rem] md:text-[0.9375rem]"
          style={{ ...serif, textShadow: "0 1px 12px rgba(0,0,0,0.45)" }}
        >
          {HERO.eyebrow}
        </p>
        <span
          aria-hidden
          className="hero-fade mt-4 block h-px w-16 bg-[#bf9a3f]"
        />

        <h1
          style={{ ...serif, fontSize: TITLE_FONT_SIZE }}
          className="mt-8 max-w-[min(34rem,82vw)] text-balance font-semibold leading-[1.1] text-white md:mt-10 md:max-w-[52rem] md:[text-wrap:auto]"
        >
          {HERO.title.split(" ").map((w, i) => (
            <span
              key={i}
              className="hero-word inline-block will-change-transform"
            >
              {w}
              {" "}
            </span>
          ))}
        </h1>

        <p
          style={{ ...serif, fontSize: TAGLINE_FONT_SIZE }}
          className="hero-fade mt-6 max-w-[min(36rem,90vw)] leading-relaxed text-white/80 md:mt-8 md:max-w-[44rem]"
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
