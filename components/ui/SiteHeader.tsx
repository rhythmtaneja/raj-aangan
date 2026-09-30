"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { prefersReducedMotion } from "@/components/anim/anim.config";
import MobileNavDrawer from "./MobileNavDrawer";

gsap.registerPlugin(useGSAP);

const NAV_LINKS = [
  { label: "ABOUT US", href: "/about" },
  { label: "CATERING", href: "/catering" },
  { label: "EVENTS", href: "/events" },
  { label: "VENUE", href: "/venue" },
  { label: "GALLERY", href: "/gallery" },
  { label: "CONTACT", href: "/contact" },
  { label: "BLOG", href: "/blog" },

  { label: "INVESTORS", href: "/investors" },
];

const MENU_BUTTON_HREF = "/menu-builder";

const BOOKING_BUTTON_HREF = "/booking";

const MOBILE_NAV_LINKS = (() => {
  const menuBuilder = { label: "MENU BUILDER", href: MENU_BUTTON_HREF };
  const afterEvents = NAV_LINKS.findIndex((l) => l.label === "EVENTS") + 1;

  if (afterEvents === 0) return [...NAV_LINKS, menuBuilder];
  return [
    ...NAV_LINKS.slice(0, afterEvents),
    menuBuilder,
    ...NAV_LINKS.slice(afterEvents),
  ];
})();

const NAV_LINK_GAP = "gap-x-3.5 gap-y-1 md:gap-14";

const IDLE_LINK_OPACITY = "opacity-90";

const DIMMED_LINK_OPACITY_CLASS = "group-hover:opacity-40";

const INDICATOR_SMALL_WIDTH_REM = 2.25;
const indicatorWidth = () =>
  INDICATOR_SMALL_WIDTH_REM *
  parseFloat(getComputedStyle(document.documentElement).fontSize);

const INDICATOR_FOLLOW_DURATION = 0.35;

const INDICATOR_FADE_DURATION = 0.35;

const PILL_REVEAL_ARM_VH = 0.6;
const PILL_REVEAL_TOP_PX = 4;
const PILL_REVEAL_DURATION = 0.6;
const PILL_REVEAL_EASE = "power2.out";

type SiteHeaderProps = {
  animateEntrance?: boolean;
  variant?: "full" | "minimal";
  colorScheme?: "light" | "dark";

  revealPillsOnReturn?: boolean;

  hideCenterLogoOnPhone?: boolean;
};

export default function SiteHeader({
  animateEntrance = false,
  variant = "full",
  colorScheme = "light",
  revealPillsOnReturn = false,
  hideCenterLogoOnPhone = false,
}: SiteHeaderProps) {
  const root = useRef<HTMLElement>(null);
  const navContainerRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const pillFillRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const [navOpen, setNavOpen] = useState(false);
  const closeNav = useCallback(() => setNavOpen(false), []);

  const hoveredLinkIdx = useRef<number>(-1);

  const xTo = useRef<((v: number) => void) | null>(null);
  const widthTo = useRef<((v: number) => void) | null>(null);
  const opacityTo = useRef<((v: number) => void) | null>(null);

  useGSAP(
    () => {
      if (!animateEntrance) return;
      if (prefersReducedMotion()) return;

      const items =
        root.current?.querySelectorAll<HTMLElement>(".site-header-item");
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
    { scope: root },
  );

  useGSAP(
    () => {
      if (variant !== "full") return;
      const indicator = indicatorRef.current;
      if (!indicator) return;

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
    { scope: root, dependencies: [variant] },
  );

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

      const check = () => {
        const y = window.scrollY;
        if (y > window.innerHeight * PILL_REVEAL_ARM_VH) armed = true;
        else if (armed && y <= PILL_REVEAL_TOP_PX) reveal();
      };

      check();

      gsap.ticker.add(check);
      window.addEventListener("scroll", check, { passive: true });
      return stop;
    },
    { scope: root, dependencies: [revealPillsOnReturn] },
  );

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

  const pillFillColor = isDark ? "bg-[#191919]" : "bg-[#2d2d2d]";
  const pillBg = "text-white";
  const textColor = isDark ? "text-[#191919]" : "text-white";

  const pillFill = (index: number) => (
    <span
      aria-hidden
      ref={(el) => {
        pillFillRefs.current[index] = el;
      }}
      className={`absolute inset-0 z-0 rounded-full ${pillFillColor}`}

      style={{ opacity: revealPillsOnReturn ? 0 : 1 }}
    />
  );
  const dividerColor = isDark ? "bg-black/25" : "bg-white/30";
  const indicatorColor = isDark ? "bg-[#191919]" : "bg-white";

  const PILL_BASE = `site-header-item relative isolate items-center gap-2 rounded-full ${pillBg} px-3.5 py-2 transition-opacity hover:opacity-90 md:gap-3 md:px-7 md:py-3.5`;
  const PILL_LABEL =
    "relative z-10 font-semibold text-[0.8125rem] md:text-[clamp(0.9rem,1.15vw,1.0625rem)]";
  const PILL_ICON = "relative z-10 h-4 w-4 md:h-6 md:w-6";

  return (
    <header ref={root} className={`absolute inset-x-0 top-0 z-30 ${textColor}`}>
      <div className="relative flex items-center justify-between px-4 pt-5 pb-4 md:px-12 md:pt-9 md:pb-8">
        <button
          type="button"
          onClick={() => setNavOpen(true)}
          aria-expanded={navOpen}
          aria-controls="mobile-nav"
          aria-label="Open menu"
          className={`${PILL_BASE} flex md:hidden`}
        >
          {pillFill(0)}
          <DehazeIcon className={PILL_ICON} />
          <span className={PILL_LABEL}>Menu</span>
        </button>

        <Link href={MENU_BUTTON_HREF} className={`${PILL_BASE} hidden md:flex`}>
          {pillFill(1)}
          <DehazeIcon className={PILL_ICON} />
          <span className={PILL_LABEL}>Menu Builder</span>
        </Link>

        {variant === "full" && (
          <Link
            href="/"
            className={`site-header-item shrink-0 md:absolute md:left-1/2 md:top-[1.5rem] md:-translate-x-1/2 ${
              hideCenterLogoOnPhone ? "hidden md:block" : "block"
            }`}
          >
            <Image
              src="/images/logo-round.png"
              alt="Raj Aangan Events and Caterers"
              width={110}
              height={110}
              priority

              className="h-[2.75rem] w-[2.75rem] md:h-[5.625rem] md:w-[5.625rem]"
            />
          </Link>
        )}

        <Link
          href={BOOKING_BUTTON_HREF}
          className={`${PILL_BASE} flex md:hidden`}
        >
          {pillFill(2)}
          <TripIcon className={PILL_ICON} />
          <span className={PILL_LABEL}>Booking</span>
        </Link>

        <Link
          href={BOOKING_BUTTON_HREF}
          className={`${PILL_BASE} hidden md:flex`}
        >
          {pillFill(3)}
          <TripIcon className={PILL_ICON} />
          <span className={PILL_LABEL}>Booking</span>
        </Link>
      </div>

      <MobileNavDrawer
        open={navOpen}
        onClose={closeNav}
        links={MOBILE_NAV_LINKS}
      />

      {variant === "full" && (
        <>
          <div
            className={`site-header-item hidden h-px w-full md:block ${dividerColor}`}
          />

          <div
            ref={navContainerRef}
            className="site-header-item relative hidden md:block"
            onMouseMove={handleNavContainerMove}
            onMouseLeave={handleNavContainerLeave}
          >
            <nav
              className={`group flex flex-wrap items-center justify-center px-3 py-3 md:flex-nowrap md:px-4 md:py-6 ${NAV_LINK_GAP} font-medium uppercase tracking-[0.12em] text-[0.625rem] md:tracking-widest md:text-[clamp(0.7rem,0.9vw,0.8125rem)]`}
            >
              {NAV_LINKS.map((link, i) => (
                <Link
                  key={link.label}
                  ref={(el) => {
                    linkRefs.current[i] = el;
                  }}
                  href={link.href}
                  onMouseEnter={() => handleLinkEnter(i)}
                  onMouseLeave={handleLinkLeave}
                  className={`transition-opacity duration-300 ${IDLE_LINK_OPACITY} ${DIMMED_LINK_OPACITY_CLASS} hover:!opacity-100`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="relative h-px w-full">
              <div className={`absolute inset-0 ${dividerColor}`} />
              <span
                ref={indicatorRef}
                aria-hidden
                className={`pointer-events-none absolute inset-y-0 left-0 ${indicatorColor}`}
                style={{
                  width: `${INDICATOR_SMALL_WIDTH_REM}rem`,
                  willChange: "transform, width, opacity",
                }}
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
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
    >
      <line x1="3" y1="7" x2="21" y2="7" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="17" x2="21" y2="17" />
    </svg>
  );
}

function TripIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="4" y="8" width="16" height="12" rx="2" />
      <path d="M9 8V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
    </svg>
  );
}
