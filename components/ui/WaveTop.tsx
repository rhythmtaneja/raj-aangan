// ══════════════════════════════════════════════════════════════════
// PATH IN REPO: components/ui/WaveTop.tsx
// ══════════════════════════════════════════════════════════════════

/**
 * WaveTop — final version
 * ---------------------------------------------------------------------------
 * A layered animated wave that:
 *   • Is INVISIBLE on non-footer pages by construction (lives inside the
 *     footer as `position: sticky`, not `position: fixed`).
 *   • Slides UP from the bottom of the viewport when the user has scrolled
 *     the footer to cover the screen and continues scrolling.
 *   • Stays pinned at the top of the viewport while the user scrolls
 *     through the footer.
 *   • Releases naturally when the footer bottom reaches the viewport top
 *     (scrolls off with the footer).
 *
 * Why sticky over fixed:
 *   Previous attempts used `position: fixed`, which puts the wave in the
 *   viewport on EVERY page — a single unit-mismatch bug (yPercent vs y)
 *   made it visible everywhere. Sticky is bound to the footer's own
 *   scrolling context, so bugs can only cause it to misbehave inside the
 *   footer, never on other pages.
 *
 * Structure:
 *   <sticky wrapper, height:0, top:0>
 *     <wave inner, absolute, top:0, translateY animates>
 *       <svg with three layered paths />
 *
 * Sticky wrapper has `height: 0` so it takes no space in the footer's
 * layout — the Menu row and everything else sit in their original spots.
 * The wave inner overflows the wrapper (positioned absolute), animated
 * via `translateY` in pixels (not yPercent — that was the previous bug).
 *
 * Requires: <footer> has `position: relative` (or nothing overflow-clipping
 * between here and the html root). FooterSection already provides that.
 * ---------------------------------------------------------------------------
 */

"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { prefersReducedMotion } from "@/components/anim/anim.config";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// ═══════════════════════════════════════════════════════════════════════════
// ─── TUNE THESE KNOBS ──────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════

// Wave SVG height in px. Reference feels ~90–130px.
const WAVE_HEIGHT = 100;

// SVG viewBox width — arbitrary; SVG stretches to 100vw via
// preserveAspectRatio="none".
const WAVE_WIDTH = 1440;

// Segments per curve. Higher = smoother, slightly more CPU.
const WAVE_SEGMENTS = 70;

// px of scroll AFTER footer covers the screen during which the wave slides
// up from the bottom of the viewport. Larger = more cinematic; smaller = snappy.
const REVEAL_SCROLL_DISTANCE = 400;

// ─ Layer definitions ────────────────────────────────────────────────────
// Three stacked <path>s with different colours so the wave silhouette is
// VISIBLE against the footer's own dark navy — a same-colour wave would
// blend into the bg and be invisible on top of the footer.
type WaveLayer = {
  amplitude: number;
  frequency: number;
  speed: number;
  initialPhase: number;
  fill: string;
  opacity: number;
  yOffset: number;
};

const LAYERS: WaveLayer[] = [
  {
    // Back — darker peaks catch the tallest crests
    amplitude: 14,
    frequency: 2,
    speed: 2,
    initialPhase: 0,
    fill: "#0a2530",
    opacity: 0.7,
    yOffset: 32,
  },
  {
    // Middle — slightly lighter than footer bg, provides visible tonal shift
    amplitude: 22,
    frequency: 1.3,
    speed: 0.6,
    initialPhase: Math.PI / 3,
    fill: "#14394a",
    opacity: 0.85,
    yOffset: 55,
  },
  {
    // Front — matches footer bg exactly so the wave's bottom edge blends
    // seamlessly into the footer once settled at top of viewport
    amplitude: 28,
    frequency: 1,
    speed: 0.5,
    initialPhase: Math.PI / 2,
    fill: "#0f2f3b",
    opacity: 1.0,
    yOffset: 78,
  },
];

// ═══════════════════════════════════════════════════════════════════════════

export default function WaveTop() {
  const stickyRef = useRef<HTMLDivElement>(null);
  const waveRef = useRef<HTMLDivElement>(null);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);

  useGSAP(
    () => {
      const sticky = stickyRef.current;
      const wave = waveRef.current;
      if (!sticky || !wave) return;
      const footerEl = sticky.parentElement;
      if (!footerEl) return;

      // Enough vertical translation to guarantee the wave is BELOW the
      // viewport at rest. Recomputed on every ScrollTrigger update so it
      // stays correct across window resizes.
      const hiddenOffset = () => window.innerHeight + WAVE_HEIGHT;

      // Initial: wave far below viewport (invisible).
      // Uses PIXEL value (not yPercent) so the offset is truly viewport-
      // sized, not element-sized.
      gsap.set(wave, { y: hiddenOffset() });

      // Draw initial paths so the wave has a shape immediately.
      LAYERS.forEach((layer, i) => {
        const path = pathRefs.current[i];
        if (!path) return;
        path.setAttribute(
          "d",
          buildWavePath(
            WAVE_WIDTH,
            WAVE_HEIGHT,
            layer.amplitude,
            layer.frequency,
            layer.initialPhase,
            layer.yOffset,
            WAVE_SEGMENTS
          )
        );
      });

      if (prefersReducedMotion()) return;

      // ─ Continuous flow via gsap.ticker ─
      const startTime = performance.now();
      let tickerActive = false;

      const tickerFn = () => {
        const elapsed = (performance.now() - startTime) / 1000;
        LAYERS.forEach((layer, i) => {
          const path = pathRefs.current[i];
          if (!path) return;
          const phase = layer.initialPhase + elapsed * layer.speed;
          path.setAttribute(
            "d",
            buildWavePath(
              WAVE_WIDTH,
              WAVE_HEIGHT,
              layer.amplitude,
              layer.frequency,
              phase,
              layer.yOffset,
              WAVE_SEGMENTS
            )
          );
        });
      };

      const startTicker = () => {
        if (tickerActive) return;
        tickerActive = true;
        gsap.ticker.add(tickerFn);
      };
      const stopTicker = () => {
        if (!tickerActive) return;
        tickerActive = false;
        gsap.ticker.remove(tickerFn);
      };

      // ─ Ticker on/off gated on footer being in viewport ─
      const activityST = ScrollTrigger.create({
        trigger: footerEl,
        start: "top bottom",
        end: "bottom top",
        onEnter: startTicker,
        onEnterBack: startTicker,
        onLeave: stopTicker,
        onLeaveBack: stopTicker,
      });

      // ─ Reveal slide-up ─
      // Starts the moment the footer's top hits viewport top (footer
      // covers the screen). Scrubs the wave's y from hiddenOffset (below
      // viewport) → 0 (top of sticky wrapper = top of viewport). Reverses
      // cleanly when scrolling back up.
      const revealST = ScrollTrigger.create({
        trigger: footerEl,
        start: "top top",
        end: `top top-=${REVEAL_SCROLL_DISTANCE}`,
        scrub: 0.5,
        onUpdate: (self) => {
          gsap.set(wave, {
            y: (1 - self.progress) * hiddenOffset(),
          });
        },
      });

      return () => {
        stopTicker();
        activityST.kill();
        revealST.kill();
      };
    },
    { scope: stickyRef }
  );

  return (
    // Sticky wrapper — height 0 so it takes no space in the footer's
    // layout, but its natural position at the top of the footer is what
    // sticky uses. `top: 0` means: pin to viewport top once footer's top
    // has scrolled above it.
    <div
      ref={stickyRef}
      aria-hidden
      className="pointer-events-none sticky top-0 z-[5]"
      style={{ height: 0 }}
    >
      {/*
        Wave inner — absolute inside the sticky wrapper. CSS transform is
        the initial-render safety net so the wave never flashes visible
        before useGSAP takes over.
      */}
      <div
        ref={waveRef}
        className="absolute inset-x-0 top-0"
        style={{
          height: WAVE_HEIGHT,
          transform: "translateY(200vh)",
        }}
      >
        <svg
          viewBox={`0 0 ${WAVE_WIDTH} ${WAVE_HEIGHT}`}
          preserveAspectRatio="none"
          className="block h-full w-full"
        >
          {LAYERS.map((layer, i) => (
            <path
              key={i}
              ref={(el) => { pathRefs.current[i] = el; }}
              fill={layer.fill}
              fillOpacity={layer.opacity}
            />
          ))}
        </svg>
      </div>
    </div>
  );
}

/**
 * Build an SVG path tracing a sine wave from left → right, then closing
 * back down to (width, height) → (0, height) so the area under the curve
 * fills solid.
 */
function buildWavePath(
  width: number,
  height: number,
  amplitude: number,
  frequency: number,
  phase: number,
  yOffset: number,
  segments: number
): string {
  const step = width / segments;
  let d = `M0,${height}`;
  for (let i = 0; i <= segments; i++) {
    const x = i * step;
    const y = yOffset + amplitude * Math.sin((x / width) * Math.PI * 2 * frequency + phase);
    d += ` L${x.toFixed(2)},${y.toFixed(2)}`;
  }
  d += ` L${width},${height} Z`;
  return d;
}