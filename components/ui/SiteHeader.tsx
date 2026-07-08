// ══════════════════════════════════════════════════════════════════
// PATH IN REPO: components/ui/SiteHeader.tsx
// ══════════════════════════════════════════════════════════════════
// CHANGES vs previous version:
//   • Menu button (top-left pill) is now a <Link> to /menu-builder,
//     matching the "Plan Your Event" CTA behaviour. Applies site-wide
//     since SiteHeader is used on every top-level page.
//   • Booking button unchanged — still a plain button (wire it up later
//     when the booking flow is ready).
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
  { label: "ABOUT US",  href: "/about"    },
  { label: "CATERING",  href: "/catering" },
  { label: "EVENTS",    href: "/events"   },
  { label: "VENUE",     href: "/venue"    },
  { label: "GALLERY",   href: "/gallery"  },
  { label: "CONTACT",   href: "/contact"  },
  { label: "BLOG",      href: "/blog"     },
];

// Menu button destination — the catering menu builder wizard.
const MENU_BUTTON_HREF = "/menu-builder";

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

  const isDark = colorScheme === "dark";
  const pillBg = isDark ? "bg-[#191919] text-white" : "bg-[#2d2d2d] text-white";
  const textColor = isDark ? "text-[#191919]" : "text-white";
  const dividerColor = isDark ? "bg-black/20" : "bg-white/30";

  return (
    <header
      ref={root}
      className={`absolute inset-x-0 top-0 z-30 ${textColor}`}
    >
      <div className="relative flex items-center justify-between px-6 pt-9 pb-4 md:px-12">
        {/* MENU — now a Link to the menu builder wizard */}
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

        {/* BOOKING — still a plain button (no route yet) */}
        <button className={`site-header-item flex items-center gap-3 rounded-full ${pillBg} px-6 py-3 transition-opacity hover:opacity-90 md:px-7 md:py-3.5`}>
          <TripIcon className="h-5 w-5 md:h-6 md:w-6" />
          <span className="font-semibold text-[clamp(0.9rem,1.15vw,22px)]">Booking</span>
        </button>
      </div>

      {variant === "full" && (
        <>
          <div className={`site-header-item h-px w-full ${dividerColor}`} />

          <nav className="flex items-center justify-center gap-10 py-4 font-medium uppercase tracking-widest text-[clamp(0.7rem,0.9vw,15px)]">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="site-header-item transition-opacity duration-300 hover:opacity-60"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className={`site-header-item h-px w-full ${dividerColor}`} />
        </>
      )}
    </header>
  );
}

function DehazeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
      <line x1="3" y1="7"  x2="21" y2="7"  />
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
