"use client";
import { ReactNode, useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  // Sanity Studio (/studio) manages its own scrolling — Lenis would hijack it.
  const disabled = pathname?.startsWith("/studio") ?? false;

  useEffect(() => {
    if (disabled) return;
    const lenis = new Lenis({ duration: 1.2, smoothWheel: true });
    // 1. Expose globally
    (window as { lenis?: unknown }).lenis = lenis;

    // 2. Global anchor smooth-scroll — catches every <a href="#..."> site-wide
    const onAnchorClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest?.("a");
      if (!link) return;
      const href = link.getAttribute("href");
      if (!href || !href.startsWith("#") || href === "#") return;
      const id = href.slice(1);
      const el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el, { duration: 1.5 });
    };
    document.addEventListener("click", onAnchorClick);
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    return () => { document.removeEventListener("click", onAnchorClick); gsap.ticker.remove(raf); lenis.destroy(); };
  }, [disabled]);
  return <>{children}</>;
}