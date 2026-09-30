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

const BG_IMAGE = "/images/catering-hero.jpg";
const OVERLAY_OPACITY = 0.45;

const HERO_BLEND_TO_COLOR = "#ffffff";
const HERO_BLEND_HEIGHT = "0vh";

const SECTION_TITLE_TEXT = "Catering";
const SECTION_TITLE_FONT_SIZE = "clamp(3rem, 7vw, 6.3125rem)";
const TAGLINE_TEXT =
  "A journey of flavors, cultures, and unforgettable tastes.";
const TAGLINE_FONT_SIZE = "clamp(2rem, 4.2vw, 3.75rem)";
const TAGLINE_MAX_W = "68.75rem";
const TITLE_HEADER_TO_TAGLINE_GAP = "1.5rem";

const LETTER_STAGGER = 0.03;
const LETTER_DURATION = 0.9;
const LETTER_INITIAL_Y = 28;
const LETTER_START_DELAY = 0.4;

const CTA_DELAY = 2.4;

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

export default function CateringHero({ bgImage }: { bgImage?: string }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      const letters =
        root.current?.querySelectorAll<HTMLElement>(".hero-letter");
      const cta = root.current?.querySelector<HTMLElement>(".hero-cta");

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
    { scope: root },
  );

  return (
    <section ref={root} className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={bgImage ?? BG_IMAGE}
          alt="Catering spread"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      <div
        className="absolute inset-0"
        style={{ backgroundColor: `rgba(25, 25, 25, ${OVERLAY_OPACITY})` }}
      />

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

      <div className="hero-stack relative z-10 flex h-full flex-col items-center justify-center px-6 pt-65 text-center text-white">
        <h1
          style={{ ...serif, fontSize: SECTION_TITLE_FONT_SIZE }}
          className="hero-display font-medium leading-none"
        >
          <Letters text={SECTION_TITLE_TEXT} />
        </h1>

        <h2
          style={{
            ...serif,
            fontSize: TAGLINE_FONT_SIZE,
            maxWidth: TAGLINE_MAX_W,
            marginTop: TITLE_HEADER_TO_TAGLINE_GAP,
          }}
          className="hero-tagline font-medium leading-[1.15]"
        >
          <Letters text={TAGLINE_TEXT} />
        </h2>

        <div className="hero-cta mt-14">
          <CircleButton
            href="/menu-builder"
            circleColor="#6c7c7b"
            arrowColor="#ffffff"
            circleSize="7.5rem"
            magnet={0.4}
            className="rounded-full border border-white/80 px-10 py-4 text-white uppercase tracking-[0.15em] text-[clamp(0.9rem,1.05vw,0.9375rem)]"
          >
            Plan Your Event
          </CircleButton>
        </div>
      </div>
    </section>
  );
}
