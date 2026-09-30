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

const BG_IMAGE = "/images/about-hero.jpg";
const OVERLAY_OPACITY = 0.5;

const HERO_BLEND_TO_COLOR = "#081b24";
const HERO_BLEND_HEIGHT = "30vh";

const SECTION_TITLE_TEXT = "About Us";
const SECTION_TITLE_FONT_SIZE = "clamp(3rem, 7vw, 6.3125rem)";
const TITLE_FIRST_LINE = "One of the most premium resort for";
const TITLE_SECOND_LINE = "weddings & events";
const TITLE_FONT_SIZE = "clamp(2rem, 4.5vw, 4.0625rem)";
const TITLE_MAX_W = "75rem";
const TITLE_HEADER_TO_TAGLINE_GAP = "2rem";

const LETTER_STAGGER = 0.03;
const LETTER_DURATION = 0.9;
const LETTER_INITIAL_Y = 28;
const LETTER_START_DELAY = 0.4;

const CTA_DELAY = 1.5;

const SCROLL_TARGET_ID = "story";
const SCROLL_DURATION = 2.5;

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

function handleDownClick(e: React.MouseEvent) {
  e.preventDefault();
  const target = document.getElementById(SCROLL_TARGET_ID);
  if (!target) return;

  const w = window as unknown as {
    lenis?: { scrollTo: (t: HTMLElement, o?: { duration?: number }) => void };
  };
  if (w.lenis && typeof w.lenis.scrollTo === "function") {
    w.lenis.scrollTo(target, { duration: SCROLL_DURATION });
  } else {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

export default function AboutHero({ bgImage }: { bgImage?: string }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      const letters =
        root.current?.querySelectorAll<HTMLElement>(".hero-letter");
      const cta = root.current?.querySelector<HTMLElement>(".about-hero-cta");

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
          alt="Raj Aangan venue"
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

      <SiteHeader />

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
            fontSize: TITLE_FONT_SIZE,
            maxWidth: TITLE_MAX_W,
            marginTop: TITLE_HEADER_TO_TAGLINE_GAP,
          }}
          className="hero-tagline font-medium leading-[1.1]"
        >
          <Letters text={TITLE_FIRST_LINE} />{" "}
          <br className="hidden md:inline" />
          <Letters text={TITLE_SECOND_LINE} />
        </h2>

        <div className="about-hero-cta mt-14">
          <CircleButton
            href={`#${SCROLL_TARGET_ID}`}
            onClick={handleDownClick}
            circleColor="#ffffff"
            arrowColor="#191919"
            circleSize="7.5rem"
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
