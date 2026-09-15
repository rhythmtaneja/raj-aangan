// ══════════════════════════════════════════════════════════════════
// PATH IN REPO: components/sections/FooterSection.tsx
// ══════════════════════════════════════════════════════════════════

/**
 * FooterSection — rebuilt against the reference footer (Sep 2026).
 *
 * ---------------------------------------------------------------------------
 * WHAT THE REFERENCE ACTUALLY DOES (measured live on resortkaskady.com)
 *
 *   ┌─ DARK PANEL ──────────────────────────┐  #194141 there
 *   │  Menu pill · logo · Booking pill       │
 *   │  numeral list │ more-about │ brand     │
 *   │  social icons                          │
 *   ├─ LIGHTER CLOSING PANEL ───────────────┤  #296161 there
 *   │  ↑ its top edge is cut into a WAVE and │  15vh tall, floated up
 *   │    floated 14vh up over the dark panel │  by -14vh
 *   │
 *   │  "Find your stay" + sub + Booking pill │
 *   │  © brand              MADE BY <studio> │
 *   └───────────────────────────────────────┘
 *
 * The two-panel split is the whole design. What the client described —
 * "the footer takes the whole screen, you keep scrolling, then the wave and
 * the text arrive" — is simply the seam between those two panels scrolling
 * into view. Nothing there is scroll-triggered; the dark panel IS pinned, but
 * only by a sticky offset computed below, never by a ScrollTrigger.
 *
 * Note there is no third element between the panels. The wave is not a band
 * with its own background sitting in the gap — that arrangement is exactly
 * what put a hard horizontal line across the footer. It is the closing
 * panel's own top edge, and the dark panel shows through around it.
 *
 * ---------------------------------------------------------------------------
 * WHY THE OLD PHONE FOOTER WAS BROKEN
 *
 * The previous wave (`WaveTop.tsx`) was `position: sticky; top: 0`, revealed
 * by a scrubbed ScrollTrigger. On desktop the footer is roughly one viewport
 * tall, so the wave pinned briefly and released — it read fine. On a phone the
 * same content stacks into a strip about three viewports tall, so the wave
 * pinned to the top of the SCREEN and stayed there, drifting across the middle
 * of the copy. That is the band sitting over "More about events" in
 * phone-changes/footer.jpeg. It is now `WaveDivider`, absolutely positioned
 * against the closing panel, which cannot do that by construction. See that
 * file's header.
 *
 * The second phone problem was layout, and it needed a second pass (below).
 *
 * ---------------------------------------------------------------------------
 * THE PHONE FOOTER IS A DIFFERENT LAYOUT, NOT A NARROW DESKTOP ONE
 *
 * Stacking the desktop footer into one centred column ran it to ~2.5 screens
 * of almost nothing but a vertical list, so the client asked for the space to
 * be used. What changed, and why each one is phone-only:
 *
 *   • MENU + BOOKING PILLS ARE HIDDEN. Both duplicate SiteHeader, which is
 *     a thumb-flick away on a phone. They cost a whole row and offered
 *     nothing the header didn't. (`hidden md:flex`)
 *   • THE LINK LIST IS TWO COLUMNS at 1.0625rem instead of one column at
 *     1.5rem. Seven links went from ~7 screens-worth of scrolling to four
 *     rows. Left-aligned inside the grid so the labels share a common edge —
 *     centred text in a 2-up grid reads as scattered.
 *   • THE "MORE ABOUT EVENTS" SUB-LIST IS HIDDEN, and its heading becomes a
 *     bordered full-width row. ⚠️ This loses no destination: every entry in
 *     MORE_LINKS points at /events, which the main list already links twice
 *     (Weddings, Events). If those ever get their own pages, un-hide it.
 *   • CONTACTS IS A PILL, not a bare text link, so the footer's two phone
 *     actions (Contacts, Booking) look like the same kind of thing.
 *   • TAP TARGETS: list links get `py-2.5`, socials get `p-2`, both reverted
 *     at `md:` so desktop spacing is untouched. Phone/email are full white
 *     and a step larger — they are the most-tapped things down here.
 *
 * Numerals stay desktop-only: they are a wide-layout ornament, and in a
 * 2-column grid they would eat a third of each cell.
 *
 * EVERY ONE of these is a base class with an `md:` restore, so the signed-off
 * desktop footer renders identically. If you change a base class here, add
 * the matching `md:` or you will move the desktop layout.
 * ---------------------------------------------------------------------------
 */

"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import WaveDivider from "@/components/ui/WaveDivider";
import {
  SITE_ADDRESS_LINES,
  SITE_CREDIT,
  SITE_EMAIL,
  SITE_LEGAL,
  SITE_PHONE,
  SITE_PHONE_HREF,
  SITE_SOCIALS,
} from "@/lib/site-info";

const serif = { fontFamily: "var(--font-cormorant-garamond)" } as const;

// ═══════════════════════════════════════════════════════════════════════════
// ─── TUNE THESE KNOBS (colour + content) ───────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════

// ─ The two panel colours ───────────────────────────────────────────────────
// Both are LIGHTER than the old single `#0f2f3b`, per the client's note that
// the footer colour was close to the reference but wanted lifting. They keep
// our own hue (~196°, the navy-teal used across the site) rather than adopting
// the reference's greener teal, so the footer still belongs to this brand.
//
// The relationship matters more than the absolute values: the closing panel
// must read as a clear step lighter, or the wave has nothing to divide. If you
// retune these, keep roughly this much separation.
const FOOTER_BG = "#12414E";       // dark panel   (was #0f2f3b)
const FOOTER_OUTRO_BG = "#1C5D6B"; // closing panel, one step lighter

// Pills at the top of the dark panel (matches SiteHeader's).
const PILL_BG = "bg-[#0d323d]";

const MENU_HREF = "/menu-builder";
/* Mirrors SiteHeader's Booking pill, which opens the Booking page (hero + the
   guest's saved quotations) rather than dropping straight into the wizard. */
const BOOKING_HREF = "/booking";

// ─ Column 1: the main link list ────────────────────────────────────────────
// Numerals are rendered on desktop only — see the phone note in the header.
// "Investor Relations" now has its own page (app/investors/page.tsx), built
// from pending-work/Investor/. It used to point at /contact as a stopgap.
const EXPLORE = [
  { num: "I", label: "Weddings", href: "/events" },
  { num: "II", label: "Events", href: "/events" },
  { num: "III", label: "Catering", href: "/catering" },
  { num: "IV", label: "Venue", href: "/venue" },
  { num: "V", label: "Gallery", href: "/gallery" },
  { num: "VI", label: "About Us", href: "/about" },
  { num: "VII", label: "Investor Relations", href: "/investors" },
];

// ─ Column 2 ────────────────────────────────────────────────────────────────
const MORE_ABOUT_TITLE = "More about events";
const MORE_ABOUT_HREF = "/events";
const MORE_LINKS = [
  { label: "Weddings", href: "/events" },
  { label: "Corporate events", href: "/events" },
  { label: "Birthdays & anniversaries", href: "/events" },
  { label: "Pre-wedding functions", href: "/events" },
];

// ─ Column 3 ────────────────────────────────────────────────────────────────
const BRAND_LINE_1 = "Raj Aangan Events";
const BRAND_LINE_2 = "and Caterers";
// Address / phone / email come from lib/site-info.ts — the single source of
// truth shared with the contact page. Do NOT hardcode them here again.
const CONTACTS_HREF = "/contact";

// ─ Closing panel ───────────────────────────────────────────────────────────
const OUTRO_TITLE = "Plan your celebration";
const OUTRO_SUB = "Tell us the occasion and we will build the menu around it.";
const OUTRO_CTA_LABEL = "Booking";
const OUTRO_CTA_HREF = "/menu-builder";

const COPYRIGHT = "© Raj Aangan Events & Caterers";

// ═══════════════════════════════════════════════════════════════════════════

export default function FooterSection() {
  const darkRef = useRef<HTMLDivElement>(null);

  /**
   * Pin the dark panel once it covers the screen (laptop only).
   *
   * ─ WHY THIS NEEDS JS ──────────────────────────────────────────────────
   * The effect wanted is: the panel scrolls up until it fills the viewport,
   * then holds still while the wave + closing panel ride up over it.
   *
   * `position: sticky; bottom: 0` looks like the answer and is NOT — verified
   * on the live page with a probe element. Sticky-BOTTOM pulls an element UP
   * into view *early*, holding it against the viewport's bottom edge until its
   * natural position catches up; it does nothing once you have scrolled past
   * it. Sticky-TOP is the one that holds an element in place, and it holds the
   * element's TOP — which on a panel taller than the viewport would pin its top
   * and permanently hide its bottom third.
   *
   * The fix is a sticky-top offset by exactly how much taller than the viewport
   * the panel is:  top = -(panelHeight - viewportHeight).  With the measured
   * 974px panel in an 819px viewport that is `top: -155px`, so the panel pins
   * the instant its last row reaches the bottom of the screen — i.e. the moment
   * it covers the viewport exactly. Neither number is knowable in CSS, hence
   * the effect.
   *
   * Re-run on resize AND on the panel's own resize: the offset depends on both
   * dimensions, and the panel's height moves with the fluid root font-size.
   *
   * ─ WHY PHONE OPTS OUT ─────────────────────────────────────────────────
   * There the panel is ~3 viewports tall, so a pin would hold a single screenful
   * and park the rest off-screen. `md:sticky` keeps it static below 1024px, and
   * the inline `top` is inert on a static element. Same trap the old sticky
   * WaveTop fell into — see WaveDivider.tsx.
   */
  useEffect(() => {
    const el = darkRef.current;
    if (!el) return;

    const sync = () => {
      // Must match Tailwind's `md:` — the one breakpoint this site has (1024px
      // since 2026-09-16; the footer is ~3 viewports tall on a tablet too, so
      // pinning it there would park most of it off-screen exactly as on a phone).
      if (window.innerWidth < 1024) {
        el.style.top = "";
        return;
      }
      const overflow = el.offsetHeight - window.innerHeight;
      el.style.top = overflow > 0 ? `${-overflow}px` : "0px";
    };

    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    window.addEventListener("resize", sync);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", sync);
    };
  }, []);

  return (
    <footer className="relative w-full text-white">
      {/* ═══ DARK PANEL ═══════════════════════════════════════════════════
          The laptop motion the client asked to have back: this panel holds
          still once it covers the screen while the wave + closing panel ride
          up over it. `top` is computed in the effect above — read it for why
          CSS alone cannot do this.

          ⚠️ Sticky changes only WHEN this panel paints, never its size or its
          contents' positions, so the signed-off desktop layout is untouched. */}
      <div ref={darkRef} className="md:sticky md:z-0" style={{ backgroundColor: FOOTER_BG }}>
        {/* ─── TOP ROW: Menu / logo / Booking ─────────────────────────── */}
        <div className="relative flex items-center justify-center px-5 pt-10 pb-6 md:justify-between md:px-16 md:pt-10 md:pb-6">
          <Link
            href={MENU_HREF}
            className={`hidden items-center gap-2 rounded-full ${PILL_BG} px-4 py-2.5 transition-opacity hover:opacity-90 md:flex md:gap-3 md:px-7 md:py-3.5`}
          >
            <DehazeIcon className="h-4 w-4 md:h-6 md:w-6" />
            <span className="font-semibold text-[0.8125rem] md:text-[clamp(0.9rem,1.15vw,1.0625rem)]">
              Menu
            </span>
          </Link>

          {/*
            TRUE CENTRE, not flex-centre.
            `justify-between` equalises the GAPS, so with a narrow "Menu" pill
            on one side and a wider "Booking" pill on the other the middle item
            lands off-centre by half their width difference — and because the
            pill labels are `clamp(..., vw, ...)`, that offset changes as you
            zoom, which is the drift the client spotted. Absolute positioning
            pins the logo to the row's actual midpoint at every width and zoom
            level. Same technique SiteHeader already uses for its centre logo.
          */}
          <Link
            href="/"
            className="shrink-0 md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2"
            aria-label="Home"
          >
            <Image
              src="/images/logo-round.png"
              alt="Raj Aangan Events and Caterers"
              width={80}
              height={80}
              /* rem, not the intrinsic 80px — see SiteHeader. */
              className="h-[3.5rem] w-[3.5rem] md:h-[5rem] md:w-[5rem]"
            />
          </Link>

          <Link
            href={BOOKING_HREF}
            className={`hidden items-center gap-2 rounded-full ${PILL_BG} px-4 py-2.5 transition-opacity hover:opacity-90 md:flex md:gap-3 md:px-7 md:py-3.5`}
          >
            <TripIcon className="h-4 w-4 md:h-6 md:w-6" />
            <span className="font-semibold text-[0.8125rem] md:text-[clamp(0.9rem,1.15vw,1.0625rem)]">
              Booking
            </span>
          </Link>
        </div>

        {/* ─── MAIN COLUMNS ───────────────────────────────────────────────
            Phone: brand identity first (order-1), then the link list as a
            2-up grid (order-2), then the "more about" row (order-3).
            Desktop: the original three-column grid, unchanged. */}
        <div className="grid grid-cols-1 gap-9 px-5 pt-2 pb-10 text-center md:grid-cols-3 md:gap-20 md:px-16 md:pt-12 md:pb-24 md:text-left">
          {/* LINK LIST */}
          <ul className="order-2 grid grid-cols-2 gap-x-5 gap-y-1 text-left md:order-none md:block md:space-y-8">
            {EXPLORE.map(({ num, label, href }) => (
              <li
                key={label}
                className="flex items-baseline md:gap-10"
              >
                {/* Numerals are a wide-layout ornament: in the phone's 2-up
                    grid they would eat a third of each cell. */}
                <span
                  style={serif}
                  className="hidden w-8 shrink-0 text-white/45 text-[clamp(0.8rem,0.9vw,0.8125rem)] md:block"
                >
                  {num}
                </span>
                <Link
                  href={href}
                  style={serif}
                  className="block py-2.5 transition-opacity duration-300 hover:opacity-70 text-[1.0625rem] md:py-0 md:text-[clamp(1.8rem,3vw,2.6875rem)]"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {/* MORE ABOUT */}
          <div className="order-3 md:order-none md:pt-2">
            <div className="flex items-center justify-between gap-5 rounded-full border border-white/20 py-2.5 pl-6 pr-2.5 md:justify-start md:gap-6 md:rounded-none md:border-0 md:p-0">
              <h3 style={serif} className="text-[1.25rem] md:text-[clamp(1.3rem,1.9vw,1.6875rem)]">
                {MORE_ABOUT_TITLE}
              </h3>
              <Link
                href={MORE_ABOUT_HREF}
                aria-label={MORE_ABOUT_TITLE}
                className="group flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/50 transition-all duration-300 hover:border-white hover:bg-white md:h-12 md:w-12"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  className="h-[0.875rem] w-[0.875rem] text-white transition-colors duration-300 group-hover:text-[#12414E] md:h-[1rem] md:w-[1rem]"
                >
                  <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>

            <ul className="hidden md:mt-10 md:block md:space-y-3">
              {MORE_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    style={serif}
                    className="text-white/70 transition-colors duration-300 hover:text-white text-[1rem] md:text-[clamp(1rem,1.15vw,1.0625rem)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* BRAND + CONTACT */}
          <div className="order-1 md:order-none">
            <h2
              style={serif}
              className="leading-tight text-[1.75rem] md:text-[clamp(1.7rem,2.4vw,2.1875rem)]"
            >
              {BRAND_LINE_1}
              <br />
              {BRAND_LINE_2}
            </h2>

            <div
              style={serif}
              className="mt-4 space-y-1 text-white/65 text-[0.9375rem] md:mt-8 md:text-white/80 md:text-[clamp(1rem,1.15vw,1.0625rem)]"
            >
              {SITE_ADDRESS_LINES.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>

            <div className="mt-5 space-y-2 text-white text-[1.0625rem] md:mt-8 md:space-y-1 md:text-white/80 md:text-[clamp(1rem,1.15vw,1.0625rem)]">
              <p>
                <a href={SITE_PHONE_HREF} className="transition-colors hover:text-white">
                  {SITE_PHONE}
                </a>
              </p>
              <p>
                <a href={`mailto:${SITE_EMAIL}`} className="transition-colors hover:text-white">
                  {SITE_EMAIL}
                </a>
              </p>
            </div>

            <Link
              href={CONTACTS_HREF}
              className="mt-7 inline-flex items-center gap-3 rounded-full border border-white/40 px-9 py-3 text-[0.9375rem] transition-opacity duration-300 hover:opacity-70 md:mt-8 md:rounded-none md:border-0 md:px-0 md:py-0 md:text-[clamp(1rem,1.15vw,1.0625rem)]"
            >
              <span>Contacts</span>
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>

        {/* ─── SOCIAL ICONS ───────────────────────────────────────────────
            Centred on phones (matching the reference), right-aligned on
            desktop where they close the three-column block. The phone `p-2`
            on each icon is what makes them a thumb-sized target; the visual
            gap is cut to `gap-4` to compensate, and both revert at `md:`. */}
        {/* Bottom padding = the wave's upward overlap (14vh, see WaveDivider)
            plus breathing room. The band is `pointer-events-none` so it never
            eats a click, but it is still opaque — without this the icons sit
            under the swell. The reference has the same dead space here. */}
        <div className="flex items-center justify-center gap-4 px-5 pb-[calc(14vh+3rem)] md:justify-end md:gap-6 md:px-16 md:pb-[calc(14vh+3rem)]">
          {SITE_SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              aria-label={s.label}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-white/70 transition-colors duration-300 hover:text-white md:p-0"
            >
              <SocialIcon name={s.label} />
            </a>
          ))}
        </div>
      </div>

      {/* ═══ CLOSING PANEL (+ the wave that is its top edge) ═══════════════
          `relative z-10` so this block paints ABOVE the pinned dark panel and
          appears to ride up over it. Both need an explicit z for that to hold,
          rather than relying on source order.

          The wave is a CHILD of the closing panel, not a sibling between the
          two panels. That inversion is the fix for the flat seam we used to
          have: the wave is now the panel's own top edge, cut into a curve and
          floated up over the dark panel, which shows through around it. The
          inner `relative` is its containing block — load-bearing, don't drop
          it. See WaveDivider.tsx for the full note. */}
      <div className="relative z-10">
      <div className="relative" style={{ backgroundColor: FOOTER_OUTRO_BG }}>
        <WaveDivider bottomColor={FOOTER_OUTRO_BG} />
        {/* CTA — stacked and centred on phones, one row on desktop. */}
        <div className="flex flex-col items-center gap-6 px-5 pt-14 pb-12 text-center md:flex-row md:justify-center md:gap-14 md:px-16 md:pt-20 md:pb-16 md:text-left">
          <h2
            style={serif}
            className="text-[2rem] leading-tight md:text-[clamp(2rem,3.1vw,2.8125rem)]"
          >
            {OUTRO_TITLE}
          </h2>

          <p className="max-w-[18rem] leading-relaxed text-white/80 text-[0.9375rem] md:max-w-[18rem] md:text-[clamp(0.95rem,1.05vw,1rem)]">
            {OUTRO_SUB}
          </p>

          <Link
            href={OUTRO_CTA_HREF}
            className="w-full max-w-[17rem] rounded-full border border-white/70 px-10 py-3.5 text-center text-[0.9375rem] font-medium transition-colors duration-300 hover:border-white hover:bg-white hover:text-[#12414E] md:w-auto md:max-w-none md:px-12 md:py-4 md:text-[clamp(0.95rem,1.05vw,1rem)]"
          >
            {OUTRO_CTA_LABEL}
          </Link>
        </div>

        {/* ─── LEGAL / SOCIAL TEXT ROW + COPYRIGHT ────────────────────────
            Uppercase, letter-spaced, hairline rules above and below —
            the treatment in phone-changes/terms-social accounts.jpeg.
            Phone wraps it to two centred rows rather than squeezing five
            items onto one line. */}
        <div className="mx-5 border-t border-white/15 md:mx-16">
          <div className="flex flex-col items-center gap-4 py-6 text-[0.6875rem] uppercase tracking-[0.18em] text-white/60 md:flex-row md:justify-between md:gap-8 md:text-[0.75rem]">
            {/* The five items are ~333px of text — they cannot fit one phone line.
                 Left to wrap freely they break 4+1 and leave TERMS orphaned, so
                 the phone width is capped to force a balanced 3+2. */}
            <div className="flex max-w-[17rem] flex-wrap items-center justify-center gap-x-4 gap-y-2.5 md:max-w-none md:gap-x-6 md:gap-y-2">
              {SITE_SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors duration-300 hover:text-white"
                >
                  {s.label}
                </a>
              ))}
              {SITE_LEGAL.map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  className="transition-colors duration-300 hover:text-white"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mx-5 border-t border-white/15 md:mx-16">
          <div className="flex flex-col items-center justify-between gap-2 py-6 md:flex-row">
            <p style={serif} className="text-white/50 text-[0.875rem] md:text-[clamp(0.85rem,0.9vw,0.8125rem)]">
              {COPYRIGHT}
            </p>
            <p className="uppercase tracking-[0.18em] text-white/50 text-[0.6875rem] md:text-[0.75rem]">
              Made by{" "}
              <a
                href={SITE_CREDIT.href}
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-white/25 underline-offset-4 transition-colors duration-300 hover:text-white hover:decoration-white"
              >
                {SITE_CREDIT.label}
              </a>
            </p>
          </div>
        </div>
      </div>
      </div>
    </footer>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Icons
// ─────────────────────────────────────────────────────────────────────────

function SocialIcon({ name }: { name: string }) {
  if (name === "Facebook") return <FacebookIcon />;
  if (name === "WhatsApp") return <WhatsappIcon />;
  return <InstagramIcon />;
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

function FacebookIcon() {
  return (
    <svg className="h-[1.5rem] w-[1.5rem] md:h-[1.375rem] md:w-[1.375rem]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.55-1.5h1.65V3.6c-.8-.1-1.6-.15-2.4-.15-2.4 0-4.05 1.45-4.05 4.15v2.3H7.5V13h2.75v8h3.25z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg className="h-[1.5rem] w-[1.5rem] md:h-[1.375rem] md:w-[1.375rem]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function WhatsappIcon() {
  return (
    <svg className="h-[1.5rem] w-[1.5rem] md:h-[1.375rem] md:w-[1.375rem]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.04 2A9.9 9.9 0 0 0 2.1 11.9c0 1.75.46 3.46 1.33 4.97L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01A9.9 9.9 0 0 0 22 11.95 9.9 9.9 0 0 0 12.04 2zm0 18.13h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.37 8.23 8.23 0 0 1 8.25-8.21 8.23 8.23 0 0 1 8.2 8.22 8.23 8.23 0 0 1-8.2 8.22zm4.5-6.15c-.24-.13-1.46-.72-1.69-.8-.22-.08-.39-.13-.55.12s-.63.8-.77.96-.28.19-.52.06a6.7 6.7 0 0 1-1.98-1.22 7.5 7.5 0 0 1-1.37-1.7c-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.44.12-.15.16-.25.24-.42.08-.16.04-.31-.02-.44-.06-.12-.55-1.33-.76-1.82-.2-.48-.4-.41-.55-.42h-.47c-.16 0-.42.06-.64.31-.22.25-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.7 2.59 4.11 3.63.58.25 1.03.4 1.38.51.58.18 1.1.16 1.52.1.46-.07 1.46-.6 1.67-1.18.2-.58.2-1.07.14-1.18-.06-.1-.22-.16-.46-.29z" />
    </svg>
  );
}
