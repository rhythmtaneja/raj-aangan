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

const HERO_BG_FALLBACK = "/images/hero-pool.jpg";

export default function Hero({ bgImage }: { bgImage?: string }) {
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
    <section ref={container} className="relative h-dvh w-full overflow-hidden md:h-screen">
      {/*
        Background photo.
        BLEED (-inset-x-[30px]): the ken-burns tween drifts this layer
        horizontally by MOVE.heroDrift (20px) each way while it starts at
        scale 1 — with a flush `inset-0` that drift exposed a bare strip down
        the left edge until the zoom caught up. 30px of fixed-px bleed on each
        side always covers the 20px drift. Fixed px is correct here: the drift
        it compensates for is itself a fixed px value, and this is a bleeding
        background, not layout.
      */}
      <div className="hero-bg absolute inset-y-0 -inset-x-[30px]">
        <Image
          src={bgImage ?? HERO_BG_FALLBACK}
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

      {/*
        RAEC wordmark.
        The inner box is a CROP WINDOW: it shows a 4.5rem-tall slice of a
        13.75rem logo image pushed up by 4.3125rem. The window width must stay
        the FULL 13.75rem — it used to be `min(50vw,13.75rem)`, which on any
        phone (50vw = 195px < 220px) sliced the right-hand edge off the
        wordmark. To make it smaller on phones, scale the whole crop instead,
        which keeps the slice geometry intact.
      */}
      <div className="hero-logo absolute inset-x-0 top-[24vh] z-10 flex flex-col items-center md:top-[clamp(15rem,27vh,20rem)]">
        {/* The phone down-scale lives in globals.css (@media max-width:767px)
            so DESKTOP emits no `transform` at all — a `md:scale-100` here
            still writes `transform: scale(1)`, which is visually identity but
            makes this div an offsetParent and changes measured geometry. */}
        <div className="hero-wordmark-crop h-18 w-[13.75rem] overflow-hidden">
          <Image
            src="/images/logo.png"
            alt="Raj Aangan Events and Caterers"
            width={220}
            height={220}
            priority
            className="h-[13.75rem] w-[13.75rem] max-w-none -translate-y-[4.3125rem]"
          />
        </div>
      </div>

      {/*
        Center content.
        Phone: the desktop `pt-[16.25rem]` existed only to clear the absolutely
        positioned wordmark above, and at a fixed 16px mobile root it pushed the
        whole block off a 844px-tall screen. Phones get a much smaller clearance
        and a capped content width so the layout still reads as "phone" at 767px
        (200% zoom) rather than sprawling.
      */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 pt-40 text-center md:pt-[calc(16.25rem+1rem)]">
        <div className="overflow-hidden">
          <h1 className="hero-title mx-auto max-w-[19rem] font-medium leading-[1.12] text-white text-[1.9rem] md:max-w-275 md:leading-[1.03] md:text-[clamp(2.75rem,6.25vw,5.625rem)]">
            The Crown of Heritage Hospitality
          </h1>
        </div>

        {/*
          The <br/> is a desktop line-break; on phones it would strand a single
          word, so it is hidden and the paragraph wraps naturally.
        */}
        <p className="hero-sub mx-auto mt-5 max-w-[20rem] text-center font-medium leading-relaxed text-white text-[0.9375rem] md:mt-10 md:max-w-4xl md:text-[clamp(1.125rem,1.56vw,1.375rem)]">
          Where ancient architecture
          <br className="hidden md:inline" />{" "}
          meets modern comfort to create unforgettable royal experience
        </p>

        <CircleButton
          href="#"
          circleColor="#6c7c7b"
          arrowColor="#ffffff"
          circleSize="9.375rem"
          magnet={0.6}
          className="hero-cta mt-7 rounded-full border border-white px-6 py-3 text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-white md:mt-12 md:px-8 md:py-3.75 md:text-[0.75rem]"
        >
          Plan Your Event
        </CircleButton>
      </div>
    </section>
  );
}
