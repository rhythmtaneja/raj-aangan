"use client";

/**
 * useHideOnScrollDown.ts
 * ---------------------------------------------------------------------------
 * Sticky-nav behaviour from the reference site (PAGE_SCROLL_DOWN hides the
 * header, PAGE_SCROLL_UP shows it). Returns a ref to attach to your fixed
 * Navbar; the hook slides it out of view when scrolling down and back in when
 * scrolling up.
 *
 * Use this when you extract the shared sticky Navbar
 * (components/layout/Navbar.tsx). Works with Lenis since it reads
 * window.scrollY which Lenis keeps in sync.
 *
 *   const navRef = useHideOnScrollDown<HTMLElement>();
 *   return <header ref={navRef} className="fixed top-0 ...">...</header>;
 * ---------------------------------------------------------------------------
 */

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { DUR, EASE, prefersReducedMotion } from "./anim.config";

export function useHideOnScrollDown<T extends HTMLElement>(opts?: {
  /** Don't start hiding until scrolled past this many px (default 120). */
  threshold?: number;
}) {
  const ref = useRef<T>(null);
  const threshold = opts?.threshold ?? 120;

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    let lastY = window.scrollY;
    let hidden = false;
    let ticking = false;

    const update = () => {
      const y = window.scrollY;
      const goingDown = y > lastY;

      if (goingDown && y > threshold && !hidden) {
        hidden = true;
        gsap.to(el, { yPercent: -100, duration: DUR.navSlide, ease: EASE.out });
      } else if ((!goingDown || y <= threshold) && hidden) {
        hidden = false;
        gsap.to(el, { yPercent: 0, duration: DUR.navSlide, ease: EASE.out });
      }

      lastY = y;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return ref;
}
