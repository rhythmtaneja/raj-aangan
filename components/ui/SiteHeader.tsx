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
// Small wrapping gap on phones (7 links won't fit one row); wide single row md+.
const NAV_LINK_GAP = "gap-x-3.5 gap-y-1 md:gap-14";

// Base opacity of nav links when nothing is hovered.
const IDLE_LINK_OPACITY = "opacity-90";
// Dimmed opacity applied to non-hovered links when SOMETHING in the nav
// is hovered.
const DIMMED_LINK_OPACITY_CLASS = "group-hover:opacity-40";

// The cursor-tracking indicator on the lower divider ─────────────────────
// SMALL_WIDTH = length of the bright segment when following cursor.
// Expressed in REM, not px: the header scales off the root font-size, so a
// fixed-px segment would grow from 2.5% to 4.7% of the bar across the
// browser-zoom range. GSAP tweens `width` numerically (px), so resolve the
// rem against the live root size at call time.
const INDICATOR_SMALL_WIDTH_REM = 2.25; // 36px at the 1440px reference
const indicatorWidth = () =>
  INDICATOR_SMALL_WIDTH_REM *
  parseFloat(getComputedStyle(document.documentElement).fontSize);
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
        width: indicatorWidth(),
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

    const w = indicatorWidth();
    xTo.current?.(e.clientX - rect.left - w / 2);
    widthTo.current?.(w);
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
      {/*
        Phone sizing: the pills and the centre logo used to be laid out at
        desktop scale on a 390px screen, where "Menu Builder" + a 110px logo +
        "Booking" cannot fit a single row — the logo ended up sitting under the
        pills and colliding with the divider. Phones get compact pills, a short
        "Menu" label and a 3.25rem logo, which leaves clear space between all
        three. Desktop (md+) is unchanged.
      */}
      <div className="relative flex items-center justify-between px-4 pt-5 pb-4 md:px-12 md:pt-9 md:pb-8">
        {/* MENU */}
        <Link
          href={MENU_BUTTON_HREF}
          className={`site-header-item flex items-center gap-2 rounded-full ${pillBg} px-3.5 py-2 transition-opacity hover:opacity-90 md:gap-3 md:px-7 md:py-3.5`}
        >
          <DehazeIcon className="h-4 w-4 md:h-6 md:w-6" />
          <span className="font-semibold text-[0.8125rem] md:text-[clamp(0.9rem,1.15vw,1.0625rem)]">
            <span className="md:hidden">Menu</span>
            <span className="hidden md:inline">Menu Builder</span>
          </span>
        </Link>

        {variant === "full" && (
          <Link
            href="/"
            className="site-header-item absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:top-1 md:translate-y-0"
          >
            <Image
              src="/images/logo-round.png"
              alt="Raj Aangan Events and Caterers"
              width={110}
              height={110}
              priority
              /* MUST be a rem class, not the intrinsic 110px: the header's
                 padding is rem-based, so a fixed-px logo grows relative to
                 the bar as the root shrinks and collides with the divider. */
              className="h-[2.5rem] w-[2.5rem] md:h-[6.875rem] md:w-[6.875rem]"
            />
          </Link>
        )}

        {/* BOOKING */}
        <button className={`site-header-item flex items-center gap-2 rounded-full ${pillBg} px-3.5 py-2 transition-opacity hover:opacity-90 md:gap-3 md:px-7 md:py-3.5`}>
          <TripIcon className="h-4 w-4 md:h-6 md:w-6" />
          <span className="font-semibold text-[0.8125rem] md:text-[clamp(0.9rem,1.15vw,1.0625rem)]">Booking</span>
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
              className={`group flex flex-wrap items-center justify-center px-3 py-3 md:flex-nowrap md:px-4 md:py-6 ${NAV_LINK_GAP} font-medium uppercase tracking-[0.12em] text-[0.625rem] md:tracking-widest md:text-[clamp(0.7rem,0.9vw,0.8125rem)]`}
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
                style={{ width: `${INDICATOR_SMALL_WIDTH_REM}rem`, willChange: "transform, width, opacity" }}
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
