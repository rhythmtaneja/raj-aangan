"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import CircleButton from "@/components/anim/CircleButton";
import ImageOverlay from "@/components/ui/ImageOverlay";
import { prefersReducedMotion } from "@/components/anim/anim.config";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const serif = { fontFamily: "var(--font-cormorant-garamond)" } as const;

const EYEBROW = "We Have Joined Hands With";
const BRAND_LEFT = "RAEC";
const BRAND_JOINER = "x";
const BRAND_RIGHT = "AURETTE";
const CITY = "JAIPUR";
const BLURB =
  "This collaboration brings together RAEC's expertise in wedding planning, catering & event execution with Aurette's luxury hospitality and iconic destination experience.";
const CAPTION = "Where Rajasthani's wedding aurette meet destination wedding";
const BUTTON_TEXT = "Discover";

const DISCOVER_HREF = "/venue/partners";

const COLLAB_IMAGE = "/images/venue-aurette.png";

const PANEL_GRADIENT =
  "linear-gradient(180deg, #fffcfc 0%, #efdfdb 50%, #dfc1ba 100%)";

const TEXT_COLOR = "#442a0f";
const BLURB_COLOR = "#54310f";

const COLUMNS = "md:grid-cols-[53fr_47fr]";

const ORNAMENT_TOP_WIDTH = "16.3rem";
const ORNAMENT_BOTTOM_WIDTH = "21rem";

const FRAME_INSET = "1.125rem";
const FRAME_COLOR = "rgba(255,255,255,0.75)";
const CARD_OVERLAY = "rgba(15,10,10,0.26)";
const CARD_OVERLAY_OPACITY = 0.34;

const GLASS_BUTTON_CLASS =
  "min-h-[3.4375rem] min-w-[10.125rem] px-6 py-2.5 text-white text-[clamp(0.9rem,1.11vw,1rem)]";
const GLASS_PILL_CLASS =
  "rounded-full border-[0.5px] border-white/55 bg-[rgba(255,255,255,0.10)] shadow-[inset_0_1px_0_rgba(255,255,255,0.26),inset_0_-1px_0_rgba(255,255,255,0.06),0_14px_32px_rgba(0,0,0,0.16)] backdrop-blur-md";

const TILT_DEG = -35;
const INITIAL_SCALE = 0.78;
const TILT_DURATION = 6;
const TILT_EASE = "power3.out";

const WORD_STAGGER = 0.15;
const WORD_FADE_DURATION = 2;
const WORD_REVEAL_DELAY = 0.4;

const ENBLOC_FADE_DURATION = 1.2;

const RISE_Y = 22;
const RISE_DURATION = 0.8;

const IMAGE_ZOOM_FROM = 1.12;
const IMAGE_ZOOM_DURATION = 2.4;

const TRIGGER_START = "top 70%";

function Words({ text }: { text: string }) {
  const parts = text.split(" ");
  return (
    <>
      {parts.map((word, i) => (
        <span key={i} className="word inline-block will-change-transform">
          {word}
          {i < parts.length - 1 ? " " : ""}
        </span>
      ))}
    </>
  );
}

function Ornament({ width }: { width: string }) {
  const line = {
    height: "1px",
    background: `linear-gradient(to right, transparent, ${TEXT_COLOR} 45%, ${TEXT_COLOR} 55%, transparent)`,
  } as const;

  return (
    <div
      aria-hidden
      className="flex items-center justify-center gap-[0.5rem]"
      style={{ width, maxWidth: "100%", color: TEXT_COLOR }}
    >
      <span className="flex-1" style={line} />
      <svg
        viewBox="0 0 14 10"
        className="h-[0.625rem] w-[0.875rem] shrink-0"
        fill="currentColor"
      >
        <path d="M7 0.2 8.4 2 7 3.8 5.6 2Z" />
        <path d="M7 6.2 8.4 8 7 9.8 5.6 8Z" />
        <path d="M1.6 3.2 3 5 1.6 6.8 0.2 5Z" />
        <path d="M12.4 3.2 13.8 5 12.4 6.8 11 5Z" />
      </svg>
      <span className="flex-1" style={line} />
    </div>
  );
}

function DiscoverLabel() {
  return (
    <span className="inline-flex items-center gap-[0.45rem]">
      {BUTTON_TEXT}
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        className="h-[0.9375rem] w-[0.9375rem] shrink-0"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9 6l6 6-6 6" />
      </svg>
    </span>
  );
}

export default function CollaborationSection({ image }: { image?: string }) {
  const sectionRef = useRef<HTMLElement>(null);
  const textBlockRef = useRef<HTMLDivElement>(null);
  const blurbRef = useRef<HTMLParagraphElement>(null);
  const buttonWrapRef = useRef<HTMLDivElement>(null);
  const imageZoomRef = useRef<HTMLDivElement>(null);
  const captionWrapRef = useRef<HTMLDivElement>(null);

  const hasPlayedWordReveal = useRef(false);

  useGSAP(
    () => {
      const text = textBlockRef.current;
      if (!text) return;

      const words = text.querySelectorAll<HTMLElement>(".word");
      const risers = [
        blurbRef.current,
        buttonWrapRef.current,
        captionWrapRef.current,
      ].filter(Boolean) as HTMLElement[];
      const zoom = imageZoomRef.current;

      if (prefersReducedMotion()) {
        gsap.set(text, { autoAlpha: 1, rotateY: 0, scale: 1 });
        gsap.set(words, { autoAlpha: 1, y: 0 });
        gsap.set(risers, { autoAlpha: 1, y: 0 });
        if (zoom) gsap.set(zoom, { scale: 1 });
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
        gsap.set(risers, { autoAlpha: 0, y: RISE_Y });
        if (zoom)
          gsap.set(zoom, {
            scale: IMAGE_ZOOM_FROM,
            transformOrigin: "center center",
          });
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

          if (zoom) {
            tl.to(
              zoom,
              { scale: 1, duration: IMAGE_ZOOM_DURATION, ease: "power2.out" },
              0,
            );
          }
          if (captionWrapRef.current) {
            tl.to(
              captionWrapRef.current,
              {
                autoAlpha: 1,
                y: 0,
                duration: RISE_DURATION,
                ease: "power2.out",
              },
              0.5,
            );
          }
          if (blurbRef.current) {
            tl.to(
              blurbRef.current,
              {
                autoAlpha: 1,
                y: 0,
                duration: RISE_DURATION,
                ease: "power2.out",
              },
              0.9,
            );
          }
          if (buttonWrapRef.current) {
            tl.to(
              buttonWrapRef.current,
              {
                autoAlpha: 1,
                y: 0,
                duration: RISE_DURATION,
                ease: "power2.out",
              },
              1.25,
            );
          }
        },
        onLeaveBack: () => setHidden(),
      });
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className="relative w-full">
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ background: PANEL_GRADIENT }}
      />

      <div
        className={`relative grid w-full grid-cols-1 px-6 py-12 md:px-12 md:py-16 ${COLUMNS}`}
      >
        <div
          className="relative flex flex-col items-center justify-center px-7 py-20 text-center md:px-12 md:pt-[5.7rem] md:pb-[8rem]"
          style={{ color: TEXT_COLOR }}
        >
          <div
            ref={textBlockRef}
            className="flex w-full flex-col items-center"
            style={{ willChange: "transform, opacity" }}
          >
            <Ornament width={ORNAMENT_TOP_WIDTH} />

            <p
              style={serif}
              className="mt-[3.9rem] font-semibold tracking-[0.02em] text-[clamp(1.05rem,1.59vw,1.43rem)]"
            >
              <Words text={EYEBROW} />
            </p>

            <h2
              style={serif}
              className="mt-[3.63rem] font-medium leading-[1.05] tracking-[0.03em] text-[clamp(1.9rem,4.06vw,3.65rem)]"
            >
              <span className="word inline-block will-change-transform">
                {BRAND_LEFT}
              </span>
              <span className="word inline-block px-[0.75em] text-[0.7em] will-change-transform">
                {BRAND_JOINER}
              </span>
              <span className="word inline-block will-change-transform">
                {BRAND_RIGHT}
              </span>
            </h2>

            <div className="mt-[1.56rem]">
              <Ornament width={ORNAMENT_BOTTOM_WIDTH} />
            </div>

            <p
              style={serif}
              className="mt-[2.35rem] font-medium tracking-[0.12em] text-[clamp(1rem,1.4vw,1.26rem)]"
            >
              <Words text={CITY} />
            </p>

            <p
              ref={blurbRef}
              style={{
                ...serif,
                color: BLURB_COLOR,
                willChange: "transform, opacity",
              }}
              className="mt-[3.31rem] max-w-[26.75rem] italic leading-[1.4] text-[clamp(0.95rem,1.36vw,1.224rem)]"
            >
              {BLURB}
            </p>

            <div
              ref={buttonWrapRef}
              className="mt-[3.25rem]"
              style={{ willChange: "transform, opacity" }}
            >
              <CircleButton
                href={DISCOVER_HREF}
                circleColor={TEXT_COLOR}
                arrowColor="#ffffff"
                circleSize="6.25rem"
                magnet={0.35}
                className="min-h-[3.4375rem] rounded-full border border-[#442a0f] px-[2.3rem] py-3.5 text-[#442a0f] text-[clamp(0.95rem,1.11vw,1rem)]"
              >
                <DiscoverLabel />
              </CircleButton>
            </div>
          </div>
        </div>

        <div className="group relative aspect-[4/5] w-full overflow-hidden md:aspect-auto">
          <div
            ref={imageZoomRef}
            className="absolute inset-0"
            style={{ willChange: "transform" }}
          >
            <Image
              src={image ?? COLLAB_IMAGE}
              alt={`${BRAND_LEFT} x ${BRAND_RIGHT}`}
              fill
              sizes="(max-width: 768px) 100vw, 47vw"
              className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
            />
          </div>

          <ImageOverlay opacity={CARD_OVERLAY_OPACITY} />
          <div
            className="absolute inset-0"
            style={{ backgroundColor: CARD_OVERLAY }}
          />

          <div
            aria-hidden
            className="pointer-events-none absolute z-10"
            style={{ inset: FRAME_INSET, border: `1px solid ${FRAME_COLOR}` }}
          />

          <div
            ref={captionWrapRef}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center px-10 pt-[1.75rem] text-center text-white"
            style={{ willChange: "transform, opacity" }}
          >
            <p className="max-w-[24rem] font-medium italic leading-[1.2] text-[clamp(1rem,1.5vw,1.35rem)] [text-shadow:0_2px_12px_rgba(0,0,0,0.55)]">
              {CAPTION}
            </p>

            <div className="mt-[5rem]">
              <CircleButton
                href={DISCOVER_HREF}
                circleColor="#ffffff"
                arrowColor="#191919"
                circleSize="6.25rem"
                magnet={0.22}
                className={GLASS_BUTTON_CLASS}
                pillClassName={GLASS_PILL_CLASS}
              >
                <DiscoverLabel />
              </CircleButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
