/**
 * anim.config.ts
 * ---------------------------------------------------------------------------
 * Single source of truth for animation timing + easing.
 *
 * Every value here was reverse-engineered from the reference site
 * (resortkaskady.com), which is a Webflow site driven by Webflow Interactions
 * (IX2). Webflow's named easings are mapped to their GSAP equivalents below.
 *
 * Webflow -> GSAP easing map (GSAP Power eases: power1=Quad, power2=Cubic,
 * power3=Quart, power4=Quint):
 *   Webflow "easeOut"    (Quad.out)   -> "power1.out"
 *   Webflow "inOutCubic" (Cubic.io)   -> "power2.inOut"
 *   Webflow "inOutCirc"  (Circ.io)    -> "circ.inOut"
 *   Webflow "ease"       (generic)    -> "power1.inOut"
 * ---------------------------------------------------------------------------
 */

export const EASE = {
  out: "power1.out", // Webflow easeOut (Quad)
  inOutCubic: "power2.inOut", // Webflow inOutCubic
  inOutCirc: "circ.inOut", // Webflow inOutCirc (hero zoom)
  ease: "power1.inOut", // Webflow generic ease (hover fades)
} as const;

/** Durations in SECONDS (Webflow stores ms; converted here). */
export const DUR = {
  heroZoom: 3.0, // bg scale 1 -> 1.3   (Webflow 3000ms inOutCirc)
  heroDrift: 2.0, // bg x 20 -> -20     (Webflow 2000ms inOutCubic)
  reveal: 0.62, // section fade + move-up on scroll-in (was 0.9 — client asked
  //              for snappier arrivals across the whole template, Sep 2026)
  hover: 0.3, // hover image fade     (Webflow 300ms ease)
  navSlide: 0.45, // sticky nav hide/show
} as const;

/** Transform distances (px) matched to the reference. */
export const MOVE = {
  reveal: 40, // how far elements rise on scroll-in reveal
  parallax: 60, // scroll-tied parallax travel for images
  heroDrift: 20, // hero ken-burns horizontal drift (each side)
  cursor: 14, // max cursor-parallax drift
} as const;

/** ScrollTrigger start matching Webflow's 50% scrollOffset. */
export const TRIGGER = {
  /** Element begins revealing when its top hits 85% down the viewport
   *  (Webflow's "scrollOffset 50%" fires a touch earlier than dead-centre;
   *  85% reads as a natural "as it comes in" reveal). Tune per taste. */
  revealStart: "top 85%",
  /** Parallax is scrubbed across the element's full pass through viewport. */
  parallaxStart: "top bottom",
  parallaxEnd: "bottom top",
} as const;

/** Honour the user's OS "reduce motion" setting. */
export const prefersReducedMotion = (): boolean =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * The ONE phone/desktop boundary used by JS.
 *
 * It must stay identical to Tailwind's `md:` (768px) and to the
 * `@media (max-width: 767px)` block in globals.css — the layout rule in
 * CLAUDE.md is that this site has exactly one breakpoint, and a second one
 * introduced here would reflow the page mid-browser-zoom.
 *
 * Deliberately a WIDTH query rather than `(hover: none)`: it has to be true
 * in devtools' phone emulation too, since that is how the phone design is
 * reviewed, and ServicesSection already gates its hover imagery the same way.
 */
export const PHONE_MAX_WIDTH = 767;

export const isPhoneViewport = (): boolean =>
  typeof window !== "undefined" &&
  window.matchMedia(`(max-width: ${PHONE_MAX_WIDTH}px)`).matches;
