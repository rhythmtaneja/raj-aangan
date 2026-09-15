// ══════════════════════════════════════════════════════════════════
// PATH IN REPO: components/sections/booking/BookingHero.tsx
// ══════════════════════════════════════════════════════════════════
/**
 * Hero for /booking — built on the GalleryHero / AboutHero pattern so the page
 * opens exactly the way every other page on this site opens: full-bleed
 * photograph, dark scrim, centred Cormorant title revealed letter by letter, a
 * serif line under it, one CircleButton, and a gradient that dissolves the
 * photo into the section below.
 *
 * ⚠️ HERO_BLEND_TO_COLOR must match PAGE_BG in app/booking/page.tsx, which is
 * the menu builder's own navy. Same coupling AboutHero documents against
 * AboutStorySection — if they diverge you get a colour seam at the join.
 *
 * THE CTA CHANGES WITH THE GUEST'S HISTORY
 *   has history → "View Booking History", scrolls down to #history.
 *   no history  → "Start Your Booking", straight into the wizard.
 * The history lives in localStorage, which cannot be read during SSR, so the
 * button is rendered only once `hydrated` is true. Its WRAPPER is always in
 * the DOM: the entrance tween below targets the wrapper, and a tween cannot
 * attach to an element that does not exist yet at mount.
 */

"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import SiteHeader from "@/components/ui/SiteHeader";
import CircleButton from "@/components/anim/CircleButton";
import { prefersReducedMotion } from "@/components/anim/anim.config";
import { MB_COLORS } from "@/lib/menu-builder/types";

gsap.registerPlugin(useGSAP);

const serif = { fontFamily: "var(--font-cormorant-garamond)" } as const;

// ═══════════════════════════════════════════════════════════════════════════
// ─── TUNE THESE KNOBS ──────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════

const BG_IMAGE = "/images/events-banner.jpg";
const OVERLAY_OPACITY = 0.55;

/* MUST match PAGE_BG in app/booking/page.tsx. */
const HERO_BLEND_TO_COLOR = MB_COLORS.bg;
const HERO_BLEND_HEIGHT = "25vh";

// ─ Copy ──
const TITLE_TEXT = "Your Bookings";
const TAGLINE_TEXT = "Every quotation you build with us, kept in one place.";

const TITLE_FONT_SIZE = "clamp(2.5rem, 6vw, 5.375rem)";
const TAGLINE_FONT_SIZE = "clamp(1.0625rem, 1.6vw, 1.5rem)";

// ─ Letter-by-letter reveal — GalleryHero's timings, unchanged ──
const LETTER_STAGGER = 0.05;
const LETTER_DURATION = 0.9;
const LETTER_INITIAL_Y = 28;
const LETTER_START_DELAY = 0.4;

const FADE_DELAY = 0.9;
const CTA_DELAY = 1.15;

// The glass pill chrome shared by VenueHero / GalleryHero's down CTAs. Quoted
// rather than re-invented so this button is the same object the rest of the
// site uses.
const GLASS_BUTTON_CLASS =
  "min-h-[clamp(2.75rem,12vw,4rem)] px-6 py-2.5 text-[0.8125rem] font-medium text-white md:px-8 md:py-3 md:text-sm";
const GLASS_PILL_CLASS =
  "rounded-full border-[0.5px] border-white/55 bg-[rgba(255,255,255,0.10)] shadow-[inset_0_1px_0_rgba(255,255,255,0.26),inset_0_-1px_0_rgba(255,255,255,0.06),0_18px_42px_rgba(0,0,0,0.18)] backdrop-blur-md";

// Where "View Booking History" scrolls to, and how slowly.
const SCROLL_TARGET_ID = "history";
const SCROLL_DURATION = 1.8;

// ═══════════════════════════════════════════════════════════════════════════

function Letters({ text }: { text: string }) {
  return (
    <>
      {text.split(" ").map((word, wi, words) => (
        <span key={wi} className="inline-block whitespace-nowrap">
          {word.split("").map((ch, ci) => (
            <span key={ci} className="hero-letter inline-block will-change-transform">
              {ch}
            </span>
          ))}
          {wi < words.length - 1 && <span className="hero-letter inline-block">&nbsp;</span>}
        </span>
      ))}
    </>
  );
}

/**
 * Smooth-scroll to the history section through Lenis when it is available
 * (the site's own scroll feel), else the native behaviour. Same helper shape
 * as AboutHero/VenueHero.
 */
function scrollToHistory(e: React.MouseEvent) {
  e.preventDefault();
  const target = document.getElementById(SCROLL_TARGET_ID);
  if (!target) return;

  const w = window as unknown as {
    lenis?: { scrollTo: (t: HTMLElement, o?: { duration?: number }) => void };
  };
  if (w.lenis && typeof w.lenis.scrollTo === "function") {
    w.lenis.scrollTo(target, { duration: SCROLL_DURATION });
  } else {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

type Props = {
  /** True once localStorage has been read AND it held at least one booking. */
  hasHistory: boolean;
  /** False until the first client effect — see the file header. */
  hydrated: boolean;
  bgImage?: string;
};

export default function BookingHero({ hasHistory, hydrated, bgImage }: Props) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const letters = root.current?.querySelectorAll<HTMLElement>(".hero-letter");
      const fades = root.current?.querySelectorAll<HTMLElement>(".booking-hero-fade");

      if (prefersReducedMotion()) {
        if (letters) gsap.set(letters, { autoAlpha: 1, y: 0 });
        if (fades) gsap.set(fades, { autoAlpha: 1, y: 0 });
        return;
      }

      if (letters && letters.length > 0) {
        gsap.set(letters, { autoAlpha: 0, y: LETTER_INITIAL_Y });
        gsap.to(letters, {
          autoAlpha: 1,
          y: 0,
          duration: LETTER_DURATION,
          stagger: LETTER_STAGGER,
          ease: "power2.out",
          delay: LETTER_START_DELAY,
        });
      }

      if (fades && fades.length > 0) {
        gsap.set(fades, { autoAlpha: 0, y: 20 });
        fades.forEach((el, i) => {
          gsap.to(el, {
            autoAlpha: 1,
            y: 0,
            duration: 1.0,
            ease: "power2.out",
            delay: i === 0 ? FADE_DELAY : CTA_DELAY,
          });
        });
      }
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative h-screen w-full overflow-hidden">
      {/* Background photo */}
      <div className="absolute inset-0">
        <Image
          src={bgImage ?? BG_IMAGE}
          alt=""
          aria-hidden
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      {/* Dark scrim */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ backgroundColor: `rgba(25, 25, 25, ${OVERLAY_OPACITY})` }}
      />

      {/* Bottom blend into the page ground — no hard seam at the join. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0"
        style={{
          height: HERO_BLEND_HEIGHT,
          zIndex: 5,
          background: `linear-gradient(to bottom, transparent, ${HERO_BLEND_TO_COLOR} 100%)`,
        }}
      />

      <SiteHeader />

      {/* `hero-display` / `hero-tagline` are the phone-only measure hooks from
          the PHONE-ONLY OVERRIDES block in globals.css — they cap the line
          length and balance the wrapping below 768px, and have no rules at all
          above it, so the desktop composition is untouched. */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-white">
        <h1
          style={{ ...serif, fontSize: TITLE_FONT_SIZE }}
          className="hero-display font-medium leading-[1.1]"
        >
          <Letters text={TITLE_TEXT} />
        </h1>

        <p
          style={{ ...serif, fontSize: TAGLINE_FONT_SIZE }}
          className="booking-hero-fade hero-tagline mt-5 max-w-[34rem] leading-relaxed text-white/80 md:mt-7"
        >
          {TAGLINE_TEXT}
        </p>

        {/* Always mounted (the tween needs a target); its contents wait for
            localStorage. `min-h` reserves the row so nothing below it jumps
            when the button arrives. */}
        <div className="booking-hero-fade mt-10 flex min-h-[3.5rem] items-center md:mt-14 md:min-h-[4rem]">
          {hydrated &&
            (hasHistory ? (
              <CircleButton
                href={`#${SCROLL_TARGET_ID}`}
                onClick={scrollToHistory}
                circleColor="#ffffff"
                arrowColor="#191919"
                circleSize="clamp(5.5rem,24vw,8.125rem)"
                magnet={0.25}
                arrowDirection="down"
                className={GLASS_BUTTON_CLASS}
                pillClassName={GLASS_PILL_CLASS}
              >
                View Booking History
              </CircleButton>
            ) : (
              <CircleButton
                href="/menu-builder"
                circleColor="#ffffff"
                arrowColor="#191919"
                circleSize="clamp(5.5rem,24vw,8.125rem)"
                magnet={0.25}
                className={GLASS_BUTTON_CLASS}
                pillClassName={GLASS_PILL_CLASS}
              >
                Start Your Booking
              </CircleButton>
            ))}
        </div>
      </div>
    </section>
  );
}
