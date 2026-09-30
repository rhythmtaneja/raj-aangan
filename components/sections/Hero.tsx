"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
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

      gsap.set(".hero-bg", {
        scale: 1,
        x: MOVE.heroDrift,
        transformOrigin: "center center",
      });
      gsap.set([".hero-logo", ".hero-cta", ".hero-sub"], { opacity: 0, y: 30 });
      gsap.set(".hero-title", { yPercent: 100 });

      const tlIn = gsap.timeline({ defaults: { ease: "power3.out" } });
      tlIn
        .to(
          ".hero-bg",
          { scale: 1.3, duration: DUR.heroZoom, ease: EASE.inOutCirc },
          0,
        )
        .to(
          ".hero-bg",
          {
            x: -MOVE.heroDrift,
            duration: DUR.heroDrift,
            ease: EASE.inOutCubic,
          },
          0,
        );

      const tlText = gsap.timeline({ defaults: { ease: "power2.out" } });
      tlText
        .to(".hero-logo", { opacity: 1, y: 0, duration: 1.2 }, 0.2)
        .to(
          ".hero-title",
          { yPercent: 0, duration: 1.8, ease: "expo.out" },
          0.45,
        )
        .to(".hero-cta", { opacity: 1, y: 0, duration: 1.1 }, 1.3)
        .to(".hero-sub", { opacity: 1, y: 0, duration: 1.1 }, 1.45);

      ScrollTrigger.create({
        trigger: container.current,
        start: "top 60%",
        onEnterBack: () => tlText.restart(),
      });
    },
    { scope: container },
  );

  return (
    <section
      ref={container}
      className="relative h-dvh w-full overflow-hidden md:h-screen"
    >
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

      <SiteHeader animateEntrance revealPillsOnReturn hideCenterLogoOnPhone />

      <div className="hero-logo absolute inset-x-0 top-[calc(24vh-4.25rem)] z-10 flex flex-col items-center md:top-[clamp(15rem,27vh,20rem)]">
        <Link href="/" aria-label="Home" className="mb-3 md:hidden">
          <Image
            src="/images/logo-round.png"
            alt="Raj Aangan Events and Caterers"
            width={110}
            height={110}
            priority
            className="h-[3.25rem] w-[3.25rem]"
          />
        </Link>

        <Image
          src="/images/logo.png"
          alt="Raj Aangan Events and Caterers"
          width={1716}
          height={916}
          priority
          sizes="183px"
          className="h-auto w-[11.4375rem]"
        />
      </div>

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 pt-40 text-center md:pt-[calc(16.25rem+1rem)]">
        <div className="overflow-hidden">
          <h1 className="hero-title mx-auto max-w-[min(32rem,78vw)] font-medium leading-[1.12] text-white text-[1.9rem] md:max-w-275 md:leading-[1.03] md:text-[clamp(2.75rem,6.25vw,5.625rem)]">
            The Crown of Heritage Hospitality
          </h1>
        </div>

        <p className="hero-sub mx-auto mt-5 max-w-[min(34rem,82vw)] text-center font-medium leading-relaxed text-white text-[0.9375rem] md:mt-10 md:max-w-4xl md:text-[clamp(1.125rem,1.56vw,1.375rem)]">
          Where ancient architecture
          <br className="hidden md:inline" /> meets modern comfort to create
          unforgettable royal experience
        </p>

        <CircleButton
          href="#"
          circleColor="#6c7c7b"
          arrowColor="#ffffff"
          circleSize="9.375rem"

          magnet={0.4}
          className="hero-cta mt-7 rounded-full border border-white px-6 py-3 text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-white md:mt-12 md:px-8 md:py-3.75 md:text-[0.75rem]"
        >
          Plan Your Event
        </CircleButton>
      </div>
    </section>
  );
}
