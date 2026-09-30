export const EASE = {
  out: "power1.out",
  inOutCubic: "power2.inOut",
  inOutCirc: "circ.inOut",
  ease: "power1.inOut",
} as const;

export const DUR = {
  heroZoom: 3.0,
  heroDrift: 2.0,
  reveal: 0.62,

  hover: 0.3,
  navSlide: 0.45,
} as const;

export const MOVE = {
  reveal: 40,
  parallax: 60,
  heroDrift: 20,
  cursor: 14,
} as const;

export const TRIGGER = {
  revealStart: "top 85%",

  parallaxStart: "top bottom",
  parallaxEnd: "bottom top",
} as const;

export const prefersReducedMotion = (): boolean =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const PHONE_MAX_WIDTH = 1023;

export const isPhoneViewport = (): boolean =>
  typeof window !== "undefined" &&
  window.matchMedia(`(max-width: ${PHONE_MAX_WIDTH}px)`).matches;
