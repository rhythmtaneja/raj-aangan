"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { EASE, DUR, MOVE } from "@/components/anim/anim.config";
import CircleButton from "@/components/anim/CircleButton";
import SiteHeader from "@/components/ui/SiteHeader";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function Hero() {
  const container = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.set(".hero-bg", { scale: 1, x: MOVE.heroDrift, transformOrigin: "center center" });
      gsap.set([".hero-logo", ".hero-cta", ".hero-sub"], { opacity: 0, y: 30 });
      gsap.set(".hero-title", { yPercent: 100 });

      // BG ken-burns + drift — plays ONCE.
      const tlIn = gsap.timeline({ defaults: { ease: "power3.out" } });
      tlIn
        .to(".hero-bg", { scale: 1.3, duration: DUR.heroZoom, ease: EASE.inOutCirc }, 0)
        .to(".hero-bg", { x: -MOVE.heroDrift, duration: DUR.heroDrift, ease: EASE.inOutCubic }, 0);

      // Logo + headline + CTA + subline — REPLAYS on scroll-back.
      const tlText = gsap.timeline({ defaults: { ease: "power2.out" } });
      tlText
        .to(".hero-logo", { opacity: 1, y: 0, duration: 1.2 }, 0.2)
        .to(".hero-title", { yPercent: 0, duration: 1.8, ease: "expo.out" }, 0.45)
        .to(".hero-cta", { opacity: 1, y: 0, duration: 1.1 }, 1.3)
        .to(".hero-sub", { opacity: 1, y: 0, duration: 1.1 }, 1.45);

      ScrollTrigger.create({
        trigger: container.current,
        start: "top 60%",
        onEnterBack: () => tlText.restart(),
      });
    },
    { scope: container }
  );

  return (
    <section ref={container} className="relative min-h-[70vh] sm:h-screen w-full overflow-hidden mx-auto max-w-7xl">
      {/* Background photo */}
      <div className="hero-bg absolute inset-0">
        <Image
          src="/images/hero-pool.jpg"
          alt="Luxury resort pool at Raj Aangan"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      <div className="absolute inset-0 bg-[rgba(25,25,25,0.5)]" />

      {/* Navbar — animates in on first homepage load */}
      <SiteHeader animateEntrance />

      {/* RAEC logo block (decorative, page content) */}
      <div className="hero-logo absolute inset-x-0 top-[clamp(10.5rem,21vh,15rem)] z-10 flex flex-col items-center">
        <Image src="/images/logo-round.png" alt="" width={58} height={58} priority />
        <div className="-mt-4 h-18 w-[min(50vw,220px)] overflow-hidden">
          <Image
            src="/images/logo.png"
            alt="Raj Aangan Events and Caterers"
            width={220}
            height={220}
            priority
            className="h-[220px] w-[220px] max-w-none -translate-y-[69px]"
          />
        </div>
      </div>

      {/* Center content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 pt-65 text-center">
        <div className="overflow-hidden">
          <h1 className="hero-title max-w-275 font-medium leading-[1.03] text-white text-[clamp(2.75rem,6.25vw,120px)]">
            The Crown of Heritage Hospitality
          </h1>
        </div>

        <p className="hero-sub mt-10 max-w-4xl text-center font-medium leading-relaxed text-white text-[clamp(1.125rem,1.56vw,30px)]">
          Where ancient architecture
          <br />
          meets modern comfort to create unforgettable royal experience
        </p>

        <CircleButton
          href="#"
          circleColor="#6c7c7b"
          arrowColor="#ffffff"
          circleSize={150}
          magnet={0.6}
          className="hero-cta mt-12 rounded-full border border-white px-8 py-3.75 text-[12px] font-medium uppercase tracking-[0.18em] text-white"
        >
          Plan Your Event
        </CircleButton>
      </div>
    </section>
  );
}
