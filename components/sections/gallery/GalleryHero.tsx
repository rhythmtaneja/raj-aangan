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

const BG_IMAGE = "/images/gallery-hero.jpg";
const OVERLAY_OPACITY = 0.5;

const HERO_BLEND_TO_COLOR = "#0a1e26";

const HERO_BLEND_HEIGHT = "25vh";

const HERO_BLEND_START = "0%";

const TITLE_TEXT = "Resort Gallery";
const TITLE_FONT_SIZE = "clamp(2.5rem, 6vw, 5.375rem)";

const LETTER_STAGGER = 0.05;
const LETTER_DURATION = 0.9;
const LETTER_INITIAL_Y = 28;
const LETTER_START_DELAY = 0.4;

const CTA_DELAY = 1;

const GLASS_DOWN_BUTTON_CLASS =
  "min-h-[clamp(2.75rem,12vw,4rem)] w-[clamp(6.5rem,29vw,9.375rem)] px-5 py-2 text-white md:px-7 md:py-2.5";
const GLASS_DOWN_PILL_CLASS =
  "rounded-full border-[0.5px] border-white/55 bg-[rgba(255,255,255,0.10)] shadow-[inset_0_1px_0_rgba(255,255,255,0.26),inset_0_-1px_0_rgba(255,255,255,0.06),0_18px_42px_rgba(0,0,0,0.18)] backdrop-blur-md";

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

export default function GalleryHero({ bgImage }: { bgImage?: string }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      const letters =
        root.current?.querySelectorAll<HTMLElement>(".hero-letter");
      const cta = root.current?.querySelector<HTMLElement>(".gallery-hero-cta");

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
          alt="Resort gallery"
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
          background: `linear-gradient(to bottom, transparent ${HERO_BLEND_START}, ${HERO_BLEND_TO_COLOR} 100%)`,
        }}
      />

      <SiteHeader />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-white">
        <h1
          style={{ ...serif, fontSize: TITLE_FONT_SIZE }}
          className="hero-display font-medium leading-[1.1]"
        >
          <Letters text={TITLE_TEXT} />
        </h1>

        <div className="gallery-hero-cta mt-14">
          <CircleButton
            href="#gallery"
            circleColor="#ffffff"
            arrowColor="#191919"
            circleSize="clamp(5.5rem,24vw,8.125rem)"
            magnet={0.25}
            arrowDirection="down"
            className={GLASS_DOWN_BUTTON_CLASS}
            pillClassName={GLASS_DOWN_PILL_CLASS}
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
    <svg
      className="w-[1.25rem] h-[1.25rem]"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}
