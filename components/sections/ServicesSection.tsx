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

const BG_START_COLOR = "#dac8b0";
const BG_END_COLOR = "#d4dad3";
const COLOR_TRANSITION_START = "top bottom";
const COLOR_TRANSITION_END = "top top";

const HOVER_BG_DURATION = 0.75;
const HOVER_BG_EASE = "power2.out";

const WORD_FONT_SIZE = "clamp(1.75rem, 6vw, 5.375rem)";
const WORD_GAP = "clamp(1rem, 3vw, 2.6875rem)";
const WORD_LINE_HEIGHT = 1;

const IDLE_COLOR = "#8a8a8a";
const ACTIVE_COLOR = "#ffffff";

const IDLE_LETTER_SPACING = "0em";
const ACTIVE_LETTER_SPACING = "0.1em";
const WORD_ACTIVE_SCALE = 1.06;

const WORD_COLOR_DURATION = 0.5;
const WORD_COLOR_EASE = "power2.out";

const ACTIVE_SPACING_COMPENSATION = `-${parseFloat(ACTIVE_LETTER_SPACING)}em`;

const IMAGE_WIDTH = "50vw";
const IMAGE_HEIGHT = "70vh";

const IMAGE_FADE_IN_DUR = 0.5;
const IMAGE_FADE_IN_EASE = "power2.out";

const IMAGE_FADE_OUT_DUR = 0.55;
const IMAGE_FADE_OUT_EASE = "power2.inOut";

const FOLLOW_X = 0.75;
const FOLLOW_Y = 0.35;

const COUNTER_RATIO = 0.22;
const PARALLAX_FOLLOW_DURATION = 0.7;
const PARALLAX_EASE = "power3";

const TRACK_OVERSCAN = 20;

const SERVICES = [
  {
    label: "Weddings",
    image: "/images/service-weddings.jpg",
    href: "#",
    accent: "#cdbfa6",
  },
  {
    label: "Events",
    image: "/images/service-events.jpg",
    href: "#",
    accent: "#d8c3bd",
  },
  {
    label: "Catering",
    image: "/images/service-catering.jpg",
    href: "#",
    accent: "#bfccbb",
  },
];

type QuickTo = ReturnType<typeof gsap.quickTo>;

const activeWordVars = () => ({
  color: ACTIVE_COLOR,
  letterSpacing: ACTIVE_LETTER_SPACING,
  marginRight: ACTIVE_SPACING_COMPENSATION,
  scale: WORD_ACTIVE_SCALE,
  duration: WORD_COLOR_DURATION,
  ease: WORD_COLOR_EASE,
});

const idleWordVars = () => ({
  color: IDLE_COLOR,
  letterSpacing: IDLE_LETTER_SPACING,
  marginRight: "0em",
  scale: 1,
  duration: WORD_COLOR_DURATION,
  ease: WORD_COLOR_EASE,
});

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const zoneRefs = useRef<(HTMLDivElement | null)[]>([]);
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const scrollProxy = useRef({ c: BG_START_COLOR });
  const displayProxy = useRef({ c: BG_START_COLOR });
  const activeIdx = useRef<number | null>(null);

  const layerZ = useRef(0);
  const zOf = useRef<number[]>(SERVICES.map(() => 0));

  const stageX = useRef<QuickTo | null>(null);
  const stageY = useRef<QuickTo | null>(null);
  const trackX = useRef<QuickTo | null>(null);
  const trackY = useRef<QuickTo | null>(null);

  useGSAP(
    () => {
      gsap.to(scrollProxy.current, {
        c: BG_END_COLOR,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: COLOR_TRANSITION_START,
          end: COLOR_TRANSITION_END,
          scrub: true,
        },
        onUpdate: () => {
          if (activeIdx.current === null) {
            displayProxy.current.c = scrollProxy.current.c;
            document.documentElement.style.setProperty(
              "--page-bg",
              scrollProxy.current.c,
            );
          }
        },
      });

      layerRefs.current.forEach((l) => {
        if (l) gsap.set(l, { opacity: 0 });
      });

      gsap.set(stageRef.current, { xPercent: -50, yPercent: -50, x: 0, y: 0 });
      gsap.set(trackRef.current, { x: 0, y: 0 });

      stageRef.current?.querySelectorAll("img").forEach((img) => {
        img.decode?.().catch(() => {});
      });

      if (prefersReducedMotion()) return;

      const opts = {
        duration: PARALLAX_FOLLOW_DURATION,
        ease: PARALLAX_EASE,
        force3D: true,
      };
      stageX.current = gsap.quickTo(stageRef.current, "x", opts);
      stageY.current = gsap.quickTo(stageRef.current, "y", opts);
      trackX.current = gsap.quickTo(trackRef.current, "x", opts);
      trackY.current = gsap.quickTo(trackRef.current, "y", opts);
    },
    { scope: sectionRef },
  );

  const isDesktopPointer = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(min-width: 1024px)").matches;

  const hideBelow = (z: number) => {
    layerRefs.current.forEach((l, j) => {
      if (l && zOf.current[j] < z) gsap.set(l, { opacity: 0 });
    });
  };

  const handleWordEnter = (e: React.MouseEvent<HTMLDivElement>, i: number) => {
    if (!isDesktopPointer()) return;
    const prevIdx = activeIdx.current;
    if (prevIdx === i) return;

    if (prevIdx === null) applyFollow(e.clientX, e.clientY, true);

    activeIdx.current = i;

    zoneRefs.current.forEach((z, idx) => {
      if (z) z.style.zIndex = idx === i ? "20" : "1";
    });

    const layer = layerRefs.current[i];
    if (layer) {
      const z = ++layerZ.current;
      zOf.current[i] = z;
      layer.style.zIndex = String(z);

      gsap.to(layer, {
        opacity: 1,
        duration: IMAGE_FADE_IN_DUR,
        ease: IMAGE_FADE_IN_EASE,
        overwrite: "auto",
        onComplete: () => hideBelow(z),
      });
    }

    if (prevIdx !== null && prevIdx !== i) {
      const prevWord = wordRefs.current[prevIdx];
      if (prevWord) {
        gsap.to(prevWord, { ...idleWordVars(), overwrite: "auto" });
      }
    }

    const word = wordRefs.current[i];
    if (word) {
      gsap.to(word, { ...activeWordVars(), overwrite: "auto" });
    }

    gsap.to(displayProxy.current, {
      c: SERVICES[i].accent,
      duration: HOVER_BG_DURATION,
      ease: HOVER_BG_EASE,
      overwrite: "auto",
      onUpdate: () => {
        document.documentElement.style.setProperty(
          "--page-bg",
          displayProxy.current.c,
        );
      },
    });
  };

  const handleRowLeave = () => {
    if (!isDesktopPointer()) return;
    const idx = activeIdx.current;
    if (idx === null) return;

    layerRefs.current.forEach((l) => {
      if (!l) return;
      gsap.to(l, {
        opacity: 0,
        duration: IMAGE_FADE_OUT_DUR,
        ease: IMAGE_FADE_OUT_EASE,
        overwrite: "auto",
      });
    });

    const word = wordRefs.current[idx];
    if (word) {
      gsap.to(word, { ...idleWordVars(), overwrite: "auto" });
    }

    activeIdx.current = null;

    gsap.to(displayProxy.current, {
      c: scrollProxy.current.c,
      duration: HOVER_BG_DURATION,
      ease: HOVER_BG_EASE,
      overwrite: "auto",
      onUpdate: () => {
        document.documentElement.style.setProperty(
          "--page-bg",
          displayProxy.current.c,
        );
      },
      onComplete: () => {
        if (activeIdx.current !== null) return;
        displayProxy.current.c = scrollProxy.current.c;
        document.documentElement.style.setProperty(
          "--page-bg",
          scrollProxy.current.c,
        );
        zoneRefs.current.forEach((z) => {
          if (z) z.style.zIndex = "1";
        });
      },
    });
  };

  const applyFollow = (clientX: number, clientY: number, immediate = false) => {
    const stage = stageRef.current;
    const track = trackRef.current;
    const row = rowRef.current;
    if (!stage || !track || !row || !stageX.current) return;

    const rect = row.getBoundingClientRect();
    const dx = clientX - (rect.left + rect.width / 2);
    const dy = clientY - (rect.top + rect.height / 2);

    const sx = dx * FOLLOW_X;
    const sy = dy * FOLLOW_Y;

    if (immediate) {
      gsap.set(stage, { x: sx, y: sy });
      gsap.set(track, { x: -sx * COUNTER_RATIO, y: -sy * COUNTER_RATIO });
      return;
    }
    stageX.current(sx);
    stageY.current?.(sy);
    trackX.current?.(-sx * COUNTER_RATIO);
    trackY.current?.(-sy * COUNTER_RATIO);
  };

  const handleRowMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDesktopPointer()) return;
    applyFollow(e.clientX, e.clientY);
  };

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen w-full flex-col items-center justify-center px-6 py-32 text-center overflow-hidden"
      style={{ backgroundColor: `var(--page-bg, ${BG_START_COLOR})` }}
    >
      <div className="mb-16" style={{ position: "relative", zIndex: 30 }}>
        <NumeralMarker numeral="II" />
      </div>

      <div
        ref={rowRef}
        className="services-row relative flex w-full items-center justify-between"
        style={{ gap: WORD_GAP }}
        onMouseLeave={handleRowLeave}
        onMouseMove={handleRowMove}
      >
        <div
          ref={stageRef}
          className="services-img absolute pointer-events-none overflow-hidden"
          style={{
            width: IMAGE_WIDTH,
            height: IMAGE_HEIGHT,
            left: "50%",
            top: "50%",
            zIndex: 5,
            willChange: "transform",
          }}
        >
          <div
            ref={trackRef}
            className="absolute"
            style={{
              inset: `-${TRACK_OVERSCAN}%`,
              willChange: "transform",
            }}
          >
            {SERVICES.map((s, i) => (
              <div
                key={s.label}
                ref={(el) => {
                  layerRefs.current[i] = el;
                }}
                className="absolute inset-0"
                style={{ opacity: 0, willChange: "opacity" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={s.image}
                  alt={s.label}
                  draggable={false}
                  decoding="async"
                  className="w-full h-full object-cover select-none"
                />
              </div>
            ))}
          </div>
        </div>

        {SERVICES.map((s, i) => (
          <div
            key={s.label}
            ref={(el) => {
              zoneRefs.current[i] = el;
            }}
            className="services-zone relative flex-1 flex items-center justify-center cursor-pointer"
            style={{ minHeight: IMAGE_HEIGHT, zIndex: 1 }}
            onMouseEnter={(e) => handleWordEnter(e, i)}
          >
            <a href={s.href} className="relative block" style={{ zIndex: 10 }}>
              <span
                ref={(el) => {
                  wordRefs.current[i] = el;
                }}
                className="services-word font-semibold inline-block"
                style={{
                  ...serif,
                  fontSize: WORD_FONT_SIZE,
                  color: IDLE_COLOR,
                  letterSpacing: IDLE_LETTER_SPACING,

                  marginRight: "0em",
                  lineHeight: WORD_LINE_HEIGHT,
                  whiteSpace: "nowrap",
                }}
              >
                {s.label}
              </span>
            </a>
          </div>
        ))}
      </div>

      <div className="mt-16" style={{ position: "relative", zIndex: 30 }}>
        <CircleButton
          href="#"
          circleColor="#191919"
          arrowColor="#ffffff"
          circleSize="9.375rem"
          magnet={0.4}
          className="rounded-full border border-[#191919] px-10 py-4 font-medium text-[#191919] text-[clamp(1rem,1.25vw,1.125rem)]"
        >
          Explore
        </CircleButton>
      </div>
    </section>
  );
}
