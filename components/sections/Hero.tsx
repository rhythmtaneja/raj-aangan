"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { EASE, DUR, MOVE } from "@/components/anim/anim.config";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const NAV_LINKS = ["ABOUT US", "CATERING", "EVENTS", "VENUE", "GALLERY", "CONTACT", "BLOG"];

export default function Hero() {
  const container = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.set(".hero-bg", { scale: 1, x: MOVE.heroDrift, transformOrigin: "center center" });
      gsap.set(".hero-top", { opacity: 0, y: -20 });
      gsap.set([".hero-logo", ".hero-cta", ".hero-sub"], { opacity: 0, y: 30 });
      gsap.set(".hero-title", { yPercent: 100 });

      // Background + navbar entrance — plays ONCE on load, then stays.
      const tlIn = gsap.timeline({ defaults: { ease: "power3.out" } });
      tlIn
        .to(".hero-bg", { scale: 1.3, duration: DUR.heroZoom, ease: EASE.inOutCirc }, 0)
        .to(".hero-bg", { x: -MOVE.heroDrift, duration: DUR.heroDrift, ease: EASE.inOutCubic }, 0)
        .to(".hero-top", { opacity: 1, y: 0, duration: 0.8, stagger: 0.08 }, 0.2);

      // Logo + headline + cta + subline — REPLAYS when you scroll back up to the hero.
      const tlText = gsap.timeline({ defaults: { ease: "power3.out" } });
      tlText
        .to(".hero-logo", { opacity: 1, y: 0, duration: 0.8 }, 0)
        .to(".hero-title", { yPercent: 0, duration: 1.2, ease: "power4.out" }, 0.2)
        .to(".hero-cta", { opacity: 1, y: 0, duration: 0.8 }, 0.75)
        .to(".hero-sub", { opacity: 1, y: 0, duration: 0.8 }, 0.85);

      ScrollTrigger.create({
        trigger: container.current,
        start: "top 60%",
        onEnterBack: () => tlText.restart(),
      });
    },
    { scope: container }
  );

  return (
    <section ref={container} className="relative h-screen w-full overflow-hidden">
      {/* Background photo */}
      <div className="hero-bg absolute inset-0">
        <Image src="/images/hero-pool.jpg" alt="Luxury resort pool at Raj Aangan" fill priority sizes="100vw" className="object-cover object-center" />
      </div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-[rgba(25,25,25,0.5)]" />

      {/* Header */}
      <header className="absolute inset-x-0 top-0 z-30 text-white">
        <div className="relative flex items-center justify-between px-12 pt-9 pb-4">
          <button className="hero-top flex items-center gap-3 rounded-full bg-[#2d2d2d] px-7 py-3.5 transition-opacity hover:opacity-90">
            <DehazeIcon className="h-6 w-6" />
            <span className="font-semibold text-[clamp(1rem,1.25vw,24px)]">Menu</span>
          </button>

          {/* Top-centre round logo (swap /images/logo-round.png with your file) */}
          <div className="hero-top absolute left-1/2 top-2 -translate-x-1/2">
            <Image src="/images/logo-round.png" alt="Raj Aangan Events and Caterers" width={110} height={110} priority />
          </div>

          <button className="hero-top flex items-center gap-3 rounded-full bg-[#2d2d2d] px-7 py-3.5 transition-opacity hover:opacity-90">
            <TripIcon className="h-6 w-6" />
            <span className="font-semibold text-[clamp(1rem,1.25vw,24px)]">Booking</span>
          </button>
        </div>

        <div className="hero-top h-px w-full bg-white/30" />

        <nav className="flex items-center justify-center gap-10 py-4 font-semibold uppercase tracking-[0.15em] text-[clamp(0.8rem,1.04vw,20px)]">
          {NAV_LINKS.map((link) => (
            <a key={link} href="#" className="hero-top transition-opacity duration-300 hover:opacity-60">
              {link}
            </a>
          ))}
        </nav>

        <div className="hero-top h-px w-full bg-white/30" />
      </header>

      {/* Center content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        {/* Logo lockup above the headline: round logo + wordmark.
            Add /images/logo-round.png (round) — /images/logo.png is your RAEC wordmark. */}
       <div className="hero-logo mt-12 mb-4 flex flex-col items-center -space-y-2">
  {/* <Image src="/images/logo-round.png" alt="" width={70} height={70} priority /> */}
  <Image src="/images/logo.png" alt="Raj Aangan Events and Caterers" width={220} height={70} priority />
</div>

        <div className="overflow-hidden">
          <h1 className="hero-title max-w-275 font-bold leading-[0.92] text-white text-[clamp(2.75rem,6.25vw,120px)]">
            The Crown of Heritage Hospitality
          </h1>
        </div>

        <a
          href="#"
          className="hero-cta mt-14 inline-flex items-center rounded-full border border-white px-12 py-5 text-sm font-semibold uppercase tracking-[0.2em] text-white transition-colors duration-300 hover:bg-white hover:text-[#191919]"
        >
          Plan Your Event
        </a>
        <p className="hero-sub mt-10 max-w-4xl text-center font-medium leading-relaxed text-white text-[clamp(1.125rem,1.56vw,30px)]">
          Where ancient architecture
          <br />
          meets modern comfort to create unforgettable royal experience
        </p>
      </div>
    </section>
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
