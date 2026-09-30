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

const TILT_DEG = -35;
const INITIAL_SCALE = 0.78;
const TILT_DURATION = 2.2;
const TILT_EASE = "power3.out";

const WORD_STAGGER = 0.05;
const WORD_FADE_DURATION = 0.85;
const WORD_REVEAL_DELAY = 0.15;

const ENBLOC_FADE_DURATION = 0.6;

const BUTTON_DURATION = 0.6;
const BUTTON_LEAD = 0.9;

const TRIGGER_START = "top 70%";

const ITALIC_TAIL_COLOR = "#737272";

const LABEL_COLOR = "#444444";

const BG_FALLBACK = "#ffffff";

function Words({ text, italicTail }: { text: string; italicTail?: string }) {
  const parts = text.split(" ");
  const italicParts = italicTail ? italicTail.split(" ") : [];

  return (
    <>
      {parts.map((word, i) => (
        <span
          key={`w-${i}`}
          className="word inline-block will-change-transform"
        >
          {word}
          {i < parts.length - 1 || italicParts.length > 0 ? "\u00A0" : ""}
        </span>
      ))}
      {italicParts.map((word, i) => (
        <span
          key={`it-${i}`}
          className="word italic inline-block will-change-transform"
          style={{ color: ITALIC_TAIL_COLOR }}
        >
          {word}
          {i < italicParts.length - 1 ? "\u00A0" : ""}
        </span>
      ))}
    </>
  );
}

type IntroSectionProps = {
  numeral: string;

  label?: string;

  title: string;

  italicTail?: string;

  secondaryLines?: string[];

  buttonText: string;
  buttonHref?: string;
  buttonCircleSize?: number | string;
  buttonClassName?: string;
};

export default function IntroSection({
  numeral,
  label,
  title,
  italicTail,
  secondaryLines,
  buttonText,
  buttonHref = "#",
  buttonCircleSize = "9.375rem",
  buttonClassName = "rounded-full border border-[#737272] px-10 py-4 text-[#191919] text-[clamp(1rem,1.25vw,1.125rem)]",
}: IntroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const textBlockRef = useRef<HTMLDivElement>(null);
  const buttonWrapRef = useRef<HTMLDivElement>(null);

  const hasPlayedWordReveal = useRef(false);

  useGSAP(
    () => {
      const text = textBlockRef.current;
      const btn = buttonWrapRef.current;
      if (!text) return;

      const words = text.querySelectorAll<HTMLElement>(".word");

      if (prefersReducedMotion()) {
        gsap.set(text, { autoAlpha: 1, rotateY: 0, scale: 1 });
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
            {
              autoAlpha: 1,
              rotateY: 0,
              scale: 1,
              duration: TILT_DURATION,
              ease: TILT_EASE,
            },
            0,
          );
          if (!hasPlayedWordReveal.current) {
            tl.to(
              words,
              {
                autoAlpha: 1,
                y: 0,
                duration: WORD_FADE_DURATION,
                stagger: WORD_STAGGER,
                ease: "power2.out",
              },
              WORD_REVEAL_DELAY,
            );
            hasPlayedWordReveal.current = true;
          } else {
            tl.to(
              words,
              {
                autoAlpha: 1,
                y: 0,
                duration: ENBLOC_FADE_DURATION,
                ease: "power2.out",
              },
              0,
            );
          }
          if (btn) {
            tl.to(
              btn,
              {
                autoAlpha: 1,
                y: 0,
                duration: BUTTON_DURATION,
                ease: "power2.out",
              },
              `-=${BUTTON_LEAD}`,
            );
          }
        },
        onLeaveBack: () => setHidden(),
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      style={{ backgroundColor: `var(--page-bg, ${BG_FALLBACK})` }}
      className="relative flex min-h-screen w-full flex-col items-center justify-center px-6 py-20 text-center md:px-6 md:py-32"
    >
      <div className="mb-8 flex items-center gap-4 md:mb-20 md:gap-5">
        <NumeralMarker numeral={numeral} />
        {label && (
          <span
            style={{ ...serif, color: LABEL_COLOR }}
            className="uppercase tracking-[0.2em] text-[clamp(1rem,1.25vw,1.125rem)]"
          >
            {label}
          </span>
        )}
      </div>

      <div
        ref={textBlockRef}
        className="flex w-full max-w-[21rem] flex-col items-center md:w-auto md:max-w-none"
        style={{ willChange: "transform, opacity" }}
      >
        <h2
          style={serif}

          className="max-w-none text-balance font-semibold leading-[1.3] text-[#191919] text-[1.75rem] md:max-w-[100rem] md:[text-wrap:auto] md:leading-[1.05] md:text-[clamp(2rem,3.9vw,3.5rem)]"
        >
          <Words text={title} italicTail={italicTail} />
        </h2>

        {secondaryLines && secondaryLines.length > 0 && (
          <div
            style={serif}
            className="mt-5 font-semibold leading-[1.3] text-[#999999] md:mt-6 md:leading-[1.15]"
          >
            {secondaryLines.map((line, i) => (
              <p
                key={i}

                className={
                  i === 0
                    ? "text-balance text-[#5e5e5e] text-[1.25rem] md:[text-wrap:auto] md:text-[clamp(1.5rem,3.39vw,3.0625rem)]"
                    : "mt-3 text-balance text-[1.0625rem] md:mt-6 md:[text-wrap:auto] md:text-[clamp(1.25rem,2.86vw,2.5625rem)]"
                }
              >
                <Words text={line} />
              </p>
            ))}
          </div>
        )}

        <div
          ref={buttonWrapRef}
          className="mt-12 md:mt-20"
          style={{ willChange: "transform, opacity" }}
        >
          <CircleButton
            href={buttonHref}
            circleColor="#191919"
            arrowColor="#ffffff"
            circleSize={buttonCircleSize}
            magnet={0.4}
            className={buttonClassName}
          >
            {buttonText}
          </CircleButton>
        </div>
      </div>
    </section>
  );
}
