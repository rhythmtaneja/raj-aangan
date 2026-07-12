
/**
 * WaveTop
 * ---------------------------------------------------------------------------
 * Layered animated SVG wave sitting above the top edge of the footer. Three
 * <path>s share the same colour but different amplitudes / frequencies /
 * speeds and opacities — overlapping regions blend into a natural depth
 * gradient, and the varied speeds create a subtle parallax as they flow.
 *
 * Usage (already wired into FooterSection):
 *   <footer className="relative bg-[#0f2f3b]">
 *     <WaveTop />
 *     ...
 *   </footer>
 *
 * The component absolutely positions itself at `bottom: 100%` of its parent
 * (the footer), so it protrudes upward into whatever section sits above.
 *
 * Performance:
 *   • Continuous motion runs on gsap.ticker (single RAF loop).
 *   • A ScrollTrigger pauses the ticker when the footer is out of viewport,
 *     so this component costs nothing on pages where the user hasn't scrolled
 *     near the bottom.
 *   • A second ScrollTrigger scrubs opacity + a small Y rise as the footer
 *     approaches — the "wave rises up as we scroll down" behaviour you
 *     described.
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

// Vertical height of the wave in px. Bigger = wave protrudes further up
// into the section above. Reference feels ~90–120px.
const WAVE_HEIGHT = 110;

// SVG viewBox width — arbitrary internal unit; SVG scales to 100% width via
// preserveAspectRatio="none".
const WAVE_WIDTH = 1440;

// Number of line segments used to draw each curve. Higher = smoother curve,
// slightly more CPU. 60 is smooth on a 27" display; drop to 40 for cheap
// laptops if you notice frame drops.
const WAVE_SEGMENTS = 60;

// How far the wave slides up on scroll-in, in px. 0 = pure opacity fade.
const RISE_OFFSET = 30;

// ─ Layer definitions ────────────────────────────────────────────────────
// Rendered in array order — index 0 is drawn first (back), last index is
// on top. All use the same fill colour; opacity differences do the depth.
// If you want to match a different footer colour, change `fill` on all
// three (or accept it via a prop — currently hard-coded for simplicity).
//
// TUNING:
//  amplitude → how tall the wave crest is (px). Bigger = taller peaks.
//  frequency → how many full waves fit across WAVE_WIDTH. Higher = tighter.
//  speed     → radians / sec added to phase every frame. Higher = faster
//              horizontal motion. Keep front layer slowest for parallax.
//  yOffset   → vertical centre of the wave inside the SVG. Larger = wave
//              sits lower / closer to the footer edge.
//  opacity   → back layers subtler, front layer opaque for the base wash.
type WaveLayer = {
  amplitude: number;
  frequency: number;
  speed: number;
  initialPhase: number;
  fill: string;
  opacity: number;
  yOffset: number;
};

const WAVE_COLOR = "#0f2f3b"; // = FooterSection bg. Change both together.

const LAYERS: WaveLayer[] = [
  {
    // Back — small tight wave, subtle, fastest
    amplitude: 14,
    frequency: 1.6,
    speed: 0.18,
    initialPhase: 0,
    fill: WAVE_COLOR,
    opacity: 0.4,
    yOffset: 32,
  },
  {
    // Middle — medium wave, slower
    amplitude: 22,
    frequency: 1.0,
    speed: 0.11,
    initialPhase: Math.PI / 3,
    fill: WAVE_COLOR,
    opacity: 0.65,
    yOffset: 55,
  },
  {
    // Front — large sweeping wave, slowest, opaque. This is the base
    // that visually connects to the footer.
    amplitude: 28,
    frequency: 0.7,
    speed: 0.07,
    initialPhase: Math.PI / 2,
    fill: WAVE_COLOR,
    opacity: 1.0,
    yOffset: 78,
  },
];

// ═══════════════════════════════════════════════════════════════════════════

export default function WaveTop() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;
      const footerEl = container.parentElement; // the <footer> hosting this

      // ─ Initial hidden state ─
      gsap.set(container, { opacity: 0, y: RISE_OFFSET });

      // ─ Draw initial static paths so the wave has a shape before the
      //   ticker ever runs (matters for reduced-motion + SSR flash) ─
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

      if (prefersReducedMotion() || !footerEl) return;

      // ─ Continuous flow via gsap.ticker ─
      // Single RAF loop updates all three path `d` attributes each frame.
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

      // ─ ScrollTrigger 1: run the ticker only when the footer is anywhere
      //   in the viewport. Costs nothing on pages you never scroll to. ─
      const activityST = ScrollTrigger.create({
        trigger: footerEl,
        start: "top bottom",
        end: "bottom top",
        onEnter: startTicker,
        onEnterBack: startTicker,
        onLeave: stopTicker,
        onLeaveBack: stopTicker,
      });

      // ─ ScrollTrigger 2: scrub opacity + Y rise as the footer enters
      //   view. This is the "wave rises up as we scroll down" effect.
      //   Reverses smoothly when the user scrolls back up. ─
      const revealST = ScrollTrigger.create({
        trigger: footerEl,
        start: "top bottom",
        end: "top center",
        scrub: 0.5,
        onUpdate: (self) => {
          gsap.set(container, {
            opacity: self.progress,
            y: (1 - self.progress) * RISE_OFFSET,
          });
        },
      });

      return () => {
        stopTicker();
        activityST.kill();
        revealST.kill();
      };
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      aria-hidden
      className="pointer-events-none absolute inset-x-0 z-20"
      style={{
        bottom: "100%", // sit directly above the footer's top edge
        height: WAVE_HEIGHT,
        opacity: 0,
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
  );
}

/**
 * Build an SVG path string tracing a sine wave from left → right, then
 * closing back down to (width, height) → (0, height) so the area under the
 * curve fills solid.
 *
 *   y(x) = yOffset + amplitude * sin( (x/width) * 2π * frequency + phase )
 *
 * Segments are joined with straight lines. At 60 segments across the width,
 * the curve is smooth enough visually — no need for expensive cubic Béziers.
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
