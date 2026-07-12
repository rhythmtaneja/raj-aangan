// ══════════════════════════════════════════════════════════════════
// PATH IN REPO: components/ui/SiteHeader.tsx
// ══════════════════════════════════════════════════════════════════

// FIX (Jul 2026):
//   • quickTo can't tween `autoAlpha` (it's a GSAP shorthand for
//     opacity+visibility, not a real CSS property). That's why the
//     indicator never appeared — quickTo silently failed and the
//     indicator stayed at visibility:hidden from the initial set.
//     Now using `opacity` (a real property), with `pointer-events-none`
//     on the indicator so it can't catch clicks when invisible.
// ══════════════════════════════════════════════════════════════════

"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { prefersReducedMotion } from "@/components/anim/anim.config";

gsap.registerPlugin(useGSAP);

// ═══════════════════════════════════════════════════════════════════════════
// Single source of truth for nav links.
// ═══════════════════════════════════════════════════════════════════════════
const NAV_LINKS = [
  { label: "ABOUT US", href: "/about" },
  { label: "CATERING", href: "/catering" },
  { label: "EVENTS", href: "/events" },
  { label: "VENUE", href: "/venue" },
  { label: "GALLERY", href: "/gallery" },
  { label: "CONTACT", href: "/contact" },
  { label: "BLOG", href: "/blog" },
];

const MENU_BUTTON_HREF = "/menu-builder";

// ═══════════════════════════════════════════════════════════════════════════
// ─── TUNE THESE KNOBS ──────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════

// Space between nav links.
const NAV_LINK_GAP = "gap-14";

// Base opacity of nav links when nothing is hovered.
const IDLE_LINK_OPACITY = "opacity-90";
// Dimmed opacity applied to non-hovered links when SOMETHING in the nav
// is hovered.
const DIMMED_LINK_OPACITY_CLASS = "group-hover:opacity-40";

// The cursor-tracking indicator on the lower divider ─────────────────────
// SMALL_WIDTH = length of the bright segment when following cursor.
const INDICATOR_SMALL_WIDTH = 36;
// How lazily the indicator follows the cursor.
const INDICATOR_FOLLOW_DURATION = 0.35;
// Fade in/out duration.
const INDICATOR_FADE_DURATION = 0.35;

// ═══════════════════════════════════════════════════════════════════════════

type SiteHeaderProps = {
  animateEntrance?: boolean;
  variant?: "full" | "minimal";
  colorScheme?: "light" | "dark";
};

export default function SiteHeader({
  animateEntrance = false,
  variant = "full",
  colorScheme = "light",
}: SiteHeaderProps) {
  const root = useRef<HTMLElement>(null);
  const navContainerRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const indicatorRef = useRef<HTMLSpanElement>(null);

  const hoveredLinkIdx = useRef<number>(-1);

  // quickTo handles for smooth indicator motion.
  const xTo = useRef<((v: number) => void) | null>(null);
  const widthTo = useRef<((v: number) => void) | null>(null);
  const opacityTo = useRef<((v: number) => void) | null>(null);

  // ─── Entrance animation (unchanged) ──────────────────────────────────
  useGSAP(
    () => {
      if (!animateEntrance) return;
      if (prefersReducedMotion()) return;

      const items = root.current?.querySelectorAll<HTMLElement>(".site-header-item");
      if (!items || items.length === 0) return;

      gsap.set(items, { opacity: 0, y: -20 });
      gsap.to(items, {
        opacity: 1,
        y: 0,
        duration: 1.0,
        stagger: 0.1,
        ease: "power3.out",
        delay: 0.3,
      });
    },
    { scope: root }
  );

  // ─── Indicator setup ─────────────────────────────────────────────────
  useGSAP(
    () => {
      if (variant !== "full") return;
      const indicator = indicatorRef.current;
      if (!indicator) return;

      // Start hidden. Using `opacity` (not autoAlpha) because quickTo below
      // can only tween real CSS properties, not GSAP shorthands.
      gsap.set(indicator, {
        opacity: 0,
        width: INDICATOR_SMALL_WIDTH,
        x: 0,
      });

      if (prefersReducedMotion()) return;

      xTo.current = gsap.quickTo(indicator, "x", {
        duration: INDICATOR_FOLLOW_DURATION,
        ease: "power3",
      });
      widthTo.current = gsap.quickTo(indicator, "width", {
        duration: INDICATOR_FOLLOW_DURATION,
        ease: "power3",
      });
      opacityTo.current = gsap.quickTo(indicator, "opacity", {
        duration: INDICATOR_FADE_DURATION,
        ease: "power2",
      });
    },
    { scope: root, dependencies: [variant] }
  );

  // ─── Indicator handlers ──────────────────────────────────────────────
  const handleNavContainerMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (hoveredLinkIdx.current !== -1) return;

    const nav = navContainerRef.current;
    if (!nav) return;
    const rect = nav.getBoundingClientRect();

    xTo.current?.(e.clientX - rect.left - INDICATOR_SMALL_WIDTH / 2);
    widthTo.current?.(INDICATOR_SMALL_WIDTH);
    opacityTo.current?.(1);
  };

  const handleLinkEnter = (i: number) => {
    hoveredLinkIdx.current = i;
    const link = linkRefs.current[i];
    const nav = navContainerRef.current;
    if (!link || !nav) return;

    const linkRect = link.getBoundingClientRect();
    const navRect = nav.getBoundingClientRect();

    xTo.current?.(linkRect.left - navRect.left);
    widthTo.current?.(linkRect.width);
    opacityTo.current?.(1);
  };

  const handleLinkLeave = () => {
    hoveredLinkIdx.current = -1;
  };

  const handleNavContainerLeave = () => {
    hoveredLinkIdx.current = -1;
    opacityTo.current?.(0);
  };

  const isDark = colorScheme === "dark";
  const pillBg = isDark ? "bg-[#191919] text-white" : "bg-[#2d2d2d] text-white";
  const textColor = isDark ? "text-[#191919]" : "text-white";
  const dividerColor = isDark ? "bg-black/25" : "bg-white/30";
  const indicatorColor = isDark ? "bg-[#191919]" : "bg-white";

  return (
    <header ref={root} className={`absolute inset-x-0 top-0 z-30 ${textColor}`}>
      <div className="relative flex items-center justify-between px-6 pt-9 pb-4 md:px-12">
        {/* MENU */}
        <Link
          href={MENU_BUTTON_HREF}
          className={`site-header-item flex items-center gap-3 rounded-full ${pillBg} px-6 py-3 transition-opacity hover:opacity-90 md:px-7 md:py-3.5`}
        >
          <DehazeIcon className="h-5 w-5 md:h-6 md:w-6" />
          <span className="font-semibold text-[clamp(0.9rem,1.15vw,22px)]">Menu</span>
        </Link>

        {variant === "full" && (
          <Link
            href="/"
            className="site-header-item absolute left-1/2 top-2 -translate-x-1/2"
          >
            <Image
              src="/images/logo-round.png"
              alt="Raj Aangan Events and Caterers"
              width={110}
              height={110}
              priority
            />
          </Link>
        )}

        {/* BOOKING */}
        <button className={`site-header-item flex items-center gap-3 rounded-full ${pillBg} px-6 py-3 transition-opacity hover:opacity-90 md:px-7 md:py-3.5`}>
          <TripIcon className="h-5 w-5 md:h-6 md:w-6" />
          <span className="font-semibold text-[clamp(0.9rem,1.15vw,22px)]">Booking</span>
        </button>
      </div>

      {variant === "full" && (
        <>
          {/* Upper divider */}
          <div className={`site-header-item h-px w-full ${dividerColor}`} />

          {/*
            NAV CONTAINER — mousemove-tracked area.
          */}
          <div
            ref={navContainerRef}
            className="site-header-item relative"
            onMouseMove={handleNavContainerMove}
            onMouseLeave={handleNavContainerLeave}
          >
            <nav
              className={`group flex items-center justify-center ${NAV_LINK_GAP} py-4 font-medium uppercase tracking-widest text-[clamp(0.7rem,0.9vw,15px)]`}
            >
              {NAV_LINKS.map((link, i) => (
                <Link
                  key={link.label}
                  ref={(el) => { linkRefs.current[i] = el; }}
                  href={link.href}
                  onMouseEnter={() => handleLinkEnter(i)}
                  onMouseLeave={handleLinkLeave}
                  className={`transition-opacity duration-300 ${IDLE_LINK_OPACITY} ${DIMMED_LINK_OPACITY_CLASS} hover:!opacity-100`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* LOWER DIVIDER + tracking indicator */}
            <div className="relative h-px w-full">
              <div className={`absolute inset-0 ${dividerColor}`} />
              <span
                ref={indicatorRef}
                aria-hidden
                className={`pointer-events-none absolute inset-y-0 left-0 ${indicatorColor}`}
                style={{ width: INDICATOR_SMALL_WIDTH, willChange: "transform, width, opacity" }}
              />
            </div>
          </div>
        </>
      )}
    </header>
  );
}

function DehazeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
      <line x1="3" y1="7" x2="21" y2="7" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="17" x2="21" y2="17" />
    </svg>
  );
}

function TripIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="8" width="16" height="12" rx="2" />
      <path d="M9 8V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
    </svg>
  );
}
