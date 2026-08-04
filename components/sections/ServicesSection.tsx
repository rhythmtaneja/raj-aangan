// ══════════════════════════════════════════════════════════════════
// PATH IN REPO: components/sections/ServicesSection.tsx
// ══════════════════════════════════════════════════════════════════

// REWORK (Aug 2026) — SEAMLESS HOVER SWAP
//   Modelled on resortkaskady.com's "Rooms / Suites / Villas" section,
//   whose live DOM was measured directly. Three things make it read as
//   ONE big photo being masked rather than three photos animating:
//
//   1. ONE SHARED STAGE. Every photo occupies the *identical* rect,
//      stacked on top of each other. Previously each photo was
//      `left:50%` of its OWN zone, so Weddings → Events physically
//      threw the picture a third of the screen sideways.
//   2. NO ENTRANCE OFFSET. Switching changes `opacity` and nothing
//      else. The old ±50px directional slide (IMAGE_ENTER_OFFSET) is
//      gone — that was the "incoming transition" that had to be waited
//      out before the new photo settled.
//   3. THE PARALLAX IS NEVER RESET. It's one continuous mouse-follow
//      shared by every layer, driven by `gsap.quickTo`. The old code
//      did `gsap.set(parallax, {x:0, y:0})` on every mouseenter, which
//      snapped the picture back to centre mid-swap.
//
//   Crossfades never dip through the background: the incoming layer is
//   raised above the stack and fades IN over the outgoing one, which is
//   left fully opaque underneath and only zeroed once it is provably
//   covered (see `hideBelow`).
//
// FIX (Jul 2026):
//   • Same autoAlpha issue as SiteHeader — useGSAP's revert mechanism
//     can't cleanly reset `autoAlpha` (it's opacity+visibility as one
//     shorthand). Swapped for plain `opacity` throughout. The image
//     wraps already have `pointer-events-none`, so no functional loss
//     from dropping the visibility side of autoAlpha.
// ══════════════════════════════════════════════════════════════════

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

// ═══════════════════════════════════════════════════════════════════════════
// ─── TUNE THESE KNOBS ──────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════

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

// ─── HOW MUCH THE HOVERED WORD EXPANDS ─────────────────────────────────────
// Two independent knobs — turn either off on its own.
//
//   ACTIVE_LETTER_SPACING — the letters spread APART (the reference site's
//     only expand effect). In `em`, so it scales with the font. Raise for a
//     wider, airier word; set to IDLE_LETTER_SPACING to disable.
//   WORD_ACTIVE_SCALE — the word also grows overall. 1 = off (reference
//     behaviour). 1.05 ≈ 5% bigger. Keep it small: the words sit in fixed
//     flex columns, so a large value can crowd its neighbours.
const IDLE_LETTER_SPACING = "0em";
const ACTIVE_LETTER_SPACING = "0.1em";
const WORD_ACTIVE_SCALE = 1.06;

const WORD_COLOR_DURATION = 0.5;
const WORD_COLOR_EASE = "power2.out";

// Letter-spacing appends a trailing gap AFTER the last character, which drags
// a centred word visibly off-centre as the spacing grows. Cancelling it with
// an equal negative right margin keeps the word optically pinned. Derived
// from the knob above so there is only ever one number to edit.
const ACTIVE_SPACING_COMPENSATION = `-${parseFloat(ACTIVE_LETTER_SPACING)}em`;

const IMAGE_WIDTH = "50vw";
const IMAGE_HEIGHT = "70vh";

// Swap timings. Because the incoming layer fades in ON TOP of a still-opaque
// outgoing one, FADE_IN is the *entire* perceived transition — there is no
// second half to wait for. Keep it short; this is the number to tune if the
// swap still feels laggy.
const IMAGE_FADE_IN_DUR = 0.5;
const IMAGE_FADE_IN_EASE = "power2.out";
// Only used when the pointer leaves the row entirely (nothing underneath).
const IMAGE_FADE_OUT_DUR = 0.55;
const IMAGE_FADE_OUT_EASE = "power2.inOut";

// ─── CURSOR FOLLOW ─────────────────────────────────────────────────────────
// The photo does NOT sit near the middle. It chases the cursor across the
// whole row, so hovering "Weddings" puts it hard left (bleeding off screen)
// and "Catering" hard right. Measured off the reference's own screenshots:
// its box centre travels ~1200px across a 2000px viewport, and two captures
// of the SAME word 463px apart prove it tracks the cursor continuously
// rather than snapping to a per-word position.
//
// stage offset = FOLLOW × (cursor − row centre). FOLLOW_X ≈ 0.75 is the fit
// through those six samples. Everything is a fraction of a MEASURED distance,
// never a px constant, so it scales with the rem-based layout (CLAUDE.md).
const FOLLOW_X = 0.75;
const FOLLOW_Y = 0.35; // the reference moves vertically too, but less
// The oversized photo inside counter-drifts against its mask — that's what
// reads as "a window sliding over one big image" rather than a photo sliding
// around. The reference runs the inner image at ~0.22× the mask's travel.
const COUNTER_RATIO = 0.22;
const PARALLAX_FOLLOW_DURATION = 0.7;
const PARALLAX_EASE = "power3";

// How much bigger the inner photo track is than its mask, per side (%).
// MUST exceed the counter-drift or the mask shows its own empty edge:
// max counter = COUNTER_RATIO × FOLLOW_X × rowWidth/2 ≈ 0.083 × rowWidth,
// which at a 50vw-wide stage is ~16.5% of the stage. 20% leaves headroom.
// (The reference sizes its photo 800px inside a 572px mask — the same 1.4×.)
const TRACK_OVERSCAN = 20;

// ═══════════════════════════════════════════════════════════════════════════

const SERVICES = [
  { label: "Weddings", image: "/images/service-weddings.jpg", href: "#", accent: "#cdbfa6" },
  { label: "Events", image: "/images/service-events.jpg", href: "#", accent: "#d8c3bd" },
  { label: "Catering", image: "/images/service-catering.jpg", href: "#", accent: "#bfccbb" },
];

type QuickTo = ReturnType<typeof gsap.quickTo>;

// The hovered/idle word states, in one place so the three call sites
// (activate, deactivate-on-switch, deactivate-on-leave) can never drift apart.
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

  // Monotonic stacking counter. The most recently hovered layer always owns
  // the highest z-index, which is what lets `hideBelow` know exactly which
  // layers are provably hidden and safe to zero.
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
            document.documentElement.style.setProperty("--page-bg", scrollProxy.current.c);
          }
        },
      });

      // Every layer starts hidden and — crucially — with NO transform of its
      // own. All motion lives on the stage/track above them, so the layers
      // themselves are pure opacity. Nothing can drift out of register.
      layerRefs.current.forEach((l) => {
        if (l) gsap.set(l, { opacity: 0 });
      });

      // Centring lives on the transform (not `translate(-50%,-50%)` in CSS)
      // because the parallax writes `x`/`y` on the same element and would
      // otherwise clobber it. xPercent/yPercent compose with x/y, so the two
      // never fight. This must run even under reduced motion, or the stage
      // hangs off its own top-left corner.
      gsap.set(stageRef.current, { xPercent: -50, yPercent: -50, x: 0, y: 0 });
      gsap.set(trackRef.current, { x: 0, y: 0 });

      // Force the browser to DECODE all three photos up front. An
      // `opacity: 0` layer is never rasterised, so without this the first
      // hover on each word paints an empty frame while the JPEG decodes —
      // which is exactly the stutter this rework exists to remove.
      stageRef.current?.querySelectorAll("img").forEach((img) => {
        img.decode?.().catch(() => {});
      });

      // Reduced motion keeps the crossfade (it's not movement) but drops the
      // mouse-follow parallax entirely — `handleRowMove` no-ops while these
      // quickTo setters are null.
      if (prefersReducedMotion()) return;

      // quickTo reuses ONE tween per property instead of spawning a new tween
      // on every mousemove. This is the single biggest smoothness win over the
      // old `gsap.to(... overwrite:"auto")`-per-event approach.
      const opts = { duration: PARALLAX_FOLLOW_DURATION, ease: PARALLAX_EASE, force3D: true };
      stageX.current = gsap.quickTo(stageRef.current, "x", opts);
      stageY.current = gsap.quickTo(stageRef.current, "y", opts);
      trackX.current = gsap.quickTo(trackRef.current, "x", opts);
      trackY.current = gsap.quickTo(trackRef.current, "y", opts);
    },
    { scope: sectionRef }
  );

  // The hover-reveal (image + word tint + page-background shift) is a DESKTOP
  // affordance. On phones the section is a plain vertical link list, and a
  // stray touch firing these would tint the page background with no way to
  // clear it — there is no mouseleave on touch.
  const isDesktopPointer = () =>
    typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches;

  // Zero every layer that sits BELOW `z` in the stack. Safe by construction:
  // the layer at `z` has just reached opacity 1 and covers the exact same
  // rect, so anything under it is already invisible. Layers ABOVE `z` (a
  // newer hover that started mid-fade) are deliberately left alone.
  const hideBelow = (z: number) => {
    layerRefs.current.forEach((l, j) => {
      if (l && zOf.current[j] < z) gsap.set(l, { opacity: 0 });
    });
  };

  const handleWordEnter = (e: React.MouseEvent<HTMLDivElement>, i: number) => {
    if (!isDesktopPointer()) return;
    const prevIdx = activeIdx.current;
    if (prevIdx === i) return;

    // Coming from nothing, the stage is still parked wherever it was left.
    // Snap it under the cursor BEFORE the fade starts so the photo appears
    // already in place instead of gliding in from the middle of the row.
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
      // Opacity only. No x/y, no scale, no direction logic — the photo is
      // already exactly where the previous one was.
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
        document.documentElement.style.setProperty("--page-bg", displayProxy.current.c);
      },
    });
  };

  const handleRowLeave = () => {
    if (!isDesktopPointer()) return;
    const idx = activeIdx.current;
    if (idx === null) return;

    // Fade the WHOLE stack out together. Normally only the top layer is
    // non-zero (`hideBelow` cleared the rest), but if the pointer leaves
    // mid-swap a second layer may still be opaque underneath — fading it on
    // the same curve keeps the background from flashing through.
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

    // The parallax is deliberately NOT reset here. It eases home only because
    // the pointer stops feeding it; re-entering picks up from wherever it is,
    // so there is never a snap.
    activeIdx.current = null;

    gsap.to(displayProxy.current, {
      c: scrollProxy.current.c,
      duration: HOVER_BG_DURATION,
      ease: HOVER_BG_EASE,
      overwrite: "auto",
      onUpdate: () => {
        document.documentElement.style.setProperty("--page-bg", displayProxy.current.c);
      },
      onComplete: () => {
        if (activeIdx.current !== null) return; // re-entered mid-fade
        displayProxy.current.c = scrollProxy.current.c;
        document.documentElement.style.setProperty("--page-bg", scrollProxy.current.c);
        zoneRefs.current.forEach((z) => {
          if (z) z.style.zIndex = "1";
        });
      },
    });
  };

  // ONE handler on the row, not one per zone. Measuring against the row means
  // the follow value is continuous as the pointer crosses from Weddings to
  // Events — measuring against the zone made it jump from +1 to −1 at every
  // boundary, which read as the image lurching sideways on each swap.
  //
  // `immediate` skips the damping and teleports. It's used for the very first
  // reveal: without it the photo would fade in at the row's centre and then
  // visibly slide 400px to the word you're actually pointing at — the exact
  // "incoming transition" this whole rework exists to kill.
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
        {/* ── THE STAGE ──────────────────────────────────────────────────
            One mask for all three photos, centred on the ROW (not on any
            single word). This is the whole trick: every photo shares this
            exact rect, so a swap can never move anything.
            Keeps the `services-img` class so the phone-only rule in
            globals.css (`display:none !important`) still hides it. */}
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
          {/* Oversized inner track — counter-drifts against the mask so the
              crop pans, the way a window onto a larger picture would. */}
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
                  // Declared in `em` up front so GSAP tweens em → em rather
                  // than converting from a computed `0px`.
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
