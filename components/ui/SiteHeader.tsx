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

// ─── Pill fill reveal (opt in with `revealPillsOnReturn`) ────────────────
// First impression: "Menu Builder" / "Booking" are white text with NO pill
// behind them. The dark fill appears the first time the visitor scrolls back
// up to the top, and stays for the rest of the session.
//
// This is exactly how the reference site does it — it keeps a separate
// `.menu-fill` layer inside each button and tweens its opacity. Verified
// live: 0 on load, still 0 at scrollY 2000, then caught mid-tween at 0.488
// on the way back to the top. Note the trigger is the RETURN, not the
// scroll-down.
//
// ARM_VH: how far down (in viewports) counts as "went down". TOP_PX: how
// close to the top counts as "came back".
const PILL_REVEAL_ARM_VH = 0.6;
const PILL_REVEAL_TOP_PX = 4;
const PILL_REVEAL_DURATION = 0.6;
const PILL_REVEAL_EASE = "power2.out";

// ═══════════════════════════════════════════════════════════════════════════

type SiteHeaderProps = {
  animateEntrance?: boolean;
  variant?: "full" | "minimal";
  colorScheme?: "light" | "dark";
  /**
   * Start the pills as bare text and fade their fill in once the visitor
   * scrolls down and returns to the top. Landing page only by default —
   * `colorScheme="dark"` pages must NOT enable it, since their pill text is
   * white and would be invisible without the fill behind it.
   */
  revealPillsOnReturn?: boolean;
};

export default function SiteHeader({
  animateEntrance = false,
  variant = "full",
  colorScheme = "light",
  revealPillsOnReturn = false,
}: SiteHeaderProps) {
  const root = useRef<HTMLElement>(null);
  const navContainerRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const pillFillRefs = useRef<(HTMLSpanElement | null)[]>([]);

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

  // ─── Pill fill reveal ────────────────────────────────────────────────
  useGSAP(
    () => {
      if (!revealPillsOnReturn) return;
      const fills = pillFillRefs.current.filter(Boolean) as HTMLSpanElement[];
      if (fills.length === 0) return;

      let armed = false;

      const stop = () => {
        gsap.ticker.remove(check);
        window.removeEventListener("scroll", check);
      };

      const reveal = () => {
        stop();
        if (prefersReducedMotion()) {
          gsap.set(fills, { opacity: 1 });
          return;
        }
        gsap.to(fills, {
          opacity: 1,
          duration: PILL_REVEAL_DURATION,
          ease: PILL_REVEAL_EASE,
        });
      };

      // Wired to BOTH the `scroll` event and gsap.ticker, deliberately.
      // Neither alone is dependable here: the site runs Lenis (see
      // SmoothScroll.tsx) which drives scrolling from a rAF loop, so a
      // programmatic `lenis.scrollTo(0, {immediate:true})` can land without a
      // useful scroll event — while the ticker itself stalls whenever the tab
      // is backgrounded and rAF is throttled. Together they cover both.
      // `scrollY` is a cheap read and this unsubscribes from both the instant
      // it fires, so it costs nothing after the reveal.
      const check = () => {
        const y = window.scrollY;
        if (y > window.innerHeight * PILL_REVEAL_ARM_VH) armed = true;
        else if (armed && y <= PILL_REVEAL_TOP_PX) reveal();
      };

      // Deep links and refreshes can restore a mid-page scroll position; that
      // still counts as "went down", so arm immediately rather than requiring
      // a further scroll down first.
      check();

      gsap.ticker.add(check);
      window.addEventListener("scroll", check, { passive: true });
      return stop;
    },
    { scope: root, dependencies: [revealPillsOnReturn] }
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
  // The fill is now its OWN layer rather than a background on the pill, so it
  // can be faded independently of the label (see `revealPillsOnReturn`).
  const pillFillColor = isDark ? "bg-[#191919]" : "bg-[#2d2d2d]";
  const pillBg = "text-white";
  const textColor = isDark ? "text-[#191919]" : "text-white";

  /**
   * Transparent-until-revealed fill behind a header pill. A plain render
   * helper, NOT a component — a component declared in render is a fresh type
   * every pass, so React would unmount/remount the span and drop the ref that
   * the reveal tween holds.
   */
  const pillFill = (index: number) => (
    <span
      aria-hidden
      ref={(el) => { pillFillRefs.current[index] = el; }}
      className={`absolute inset-0 z-0 rounded-full ${pillFillColor}`}
      // Inline (not a class) so the very first server-rendered paint is
      // already transparent — a class would flash the filled pill first.
      style={{ opacity: revealPillsOnReturn ? 0 : 1 }}
    />
  );
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
          className={`site-header-item relative isolate flex items-center gap-2 rounded-full ${pillBg} px-3.5 py-2 transition-opacity hover:opacity-90 md:gap-3 md:px-7 md:py-3.5`}
        >
          {pillFill(0)}
          <DehazeIcon className="relative z-10 h-4 w-4 md:h-6 md:w-6" />
          <span className="relative z-10 font-semibold text-[0.8125rem] md:text-[clamp(0.9rem,1.15vw,1.0625rem)]">
            <span className="md:hidden">Menu</span>
            <span className="hidden md:inline">Menu Builder</span>
          </span>
        </Link>

        {variant === "full" && (
          <Link
            href="/"
            className="site-header-item absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:top-[1.7rem] md:translate-y-0"
          >
            <Image
              src="/images/logo-round.png"
              alt="Raj Aangan Events and Caterers"
              width={110}
              height={110}
              priority
              /* The white replacement has virtually no transparent padding,
                 unlike the approved gold mark. Scale its image box to retain
                 the same visible-logo footprint at every breakpoint. Keeping
                 both values in rem preserves the established responsive
                 relationship with the header. */
              className="h-[2.05rem] w-[2.05rem] md:h-[5.625rem] md:w-[5.625rem]"
            />
          </Link>
        )}

        {/* BOOKING */}
        <button className={`site-header-item relative isolate flex items-center gap-2 rounded-full ${pillBg} px-3.5 py-2 transition-opacity hover:opacity-90 md:gap-3 md:px-7 md:py-3.5`}>
          {pillFill(1)}
          <TripIcon className="relative z-10 h-4 w-4 md:h-6 md:w-6" />
          <span className="relative z-10 font-semibold text-[0.8125rem] md:text-[clamp(0.9rem,1.15vw,1.0625rem)]">Booking</span>
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
