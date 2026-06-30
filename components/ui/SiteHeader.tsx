"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { prefersReducedMotion } from "@/components/anim/anim.config";

gsap.registerPlugin(useGSAP);

// ═══════════════════════════════════════════════════════════════════════════
// Single source of truth for nav links — edit here, propagates to every page.
// ═══════════════════════════════════════════════════════════════════════════
const NAV_LINKS = [
  { label: "ABOUT US",  href: "/about"   },
  { label: "CATERING",  href: "#"        },
  { label: "EVENTS",    href: "#"        },
  { label: "VENUE",     href: "#"        },
  { label: "GALLERY",   href: "#"        },
  { label: "CONTACT",   href: "#"        },
  { label: "BLOG",      href: "#"        },
];

type SiteHeaderProps = {
  /**
   * When true, header elements start invisible and fade in. Use this ONLY on
   * the homepage's first load. On any other page the navbar should "already
   * be there" because the user navigated here from somewhere.
   */
  animateEntrance?: boolean;
};

export default function SiteHeader({ animateEntrance = false }: SiteHeaderProps) {
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

  return (
    <header ref={root} className="absolute inset-x-0 top-0 z-30 text-white">
      <div className="relative flex items-center justify-between px-12 pt-9 pb-4">
        <button className="site-header-item flex items-center gap-3 rounded-full bg-[#2d2d2d] px-7 py-3.5 transition-opacity hover:opacity-90">
          <DehazeIcon className="h-6 w-6" />
          <span className="font-semibold text-[clamp(1rem,1.25vw,24px)]">Menu</span>
        </button>

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

        <button className="site-header-item flex items-center gap-3 rounded-full bg-[#2d2d2d] px-7 py-3.5 transition-opacity hover:opacity-90">
          <TripIcon className="h-6 w-6" />
          <span className="font-semibold text-[clamp(1rem,1.25vw,24px)]">Booking</span>
        </button>
      </div>

      <div className="site-header-item h-px w-full bg-white/30" />

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

      <div className="site-header-item h-px w-full bg-white/30" />
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
