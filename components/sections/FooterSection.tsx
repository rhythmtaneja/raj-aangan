// ══════════════════════════════════════════════════════════════════
// PATH IN REPO: components/sections/FooterSection.tsx
// ══════════════════════════════════════════════════════════════════

/**
 * FIX (Jul 2026):
 *   • Removed `overflow-hidden` from the <footer>. WaveTop positions
 *     itself at `bottom: 100%` of the footer — i.e. it sits OUTSIDE the
 *     footer's box, above its top edge. `overflow-hidden` was clipping
 *     that entire area, making the wave invisible. Overflow must stay
 *     visible for the wave to protrude upward into the section above.
 *
 * ---------------------------------------------------------------------------
 * FooterSection
 *   • Full-width dark-navy (#0f2f3b)
 *   • Top row: Menu pill / small logo / Booking pill
 *   • 3-col grid: numeral list / "More about" + arrow / brand + contact
 *   • Social icons row bottom-right
 *   • Copyright / credits bar at bottom
 *   • WaveTop mounted at the top — animates continuously, fades in on
 *     scroll approach
 *
 * WaveTop lives in `components/ui/WaveTop.tsx`.
 * ---------------------------------------------------------------------------
 */

"use client";

import Image from "next/image";
import Link from "next/link";
import WaveTop from "@/components/ui/WaveTop";

const serif = { fontFamily: "var(--font-cormorant-garamond)" } as const;

// ═══════════════════════════════════════════════════════════════════════════
// ─── TUNE THESE KNOBS (content + colours) ──────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════

// Footer background. If you change this, ALSO change WAVE_COLOR in
// WaveTop.tsx so the wave matches.
const FOOTER_BG = "#0f2f3b";

// Top-of-footer pill styling (matches SiteHeader pill).
const PILL_BG = "bg-[#191919]";

const MENU_HREF = "/menu-builder";
const BOOKING_HREF = "#";

const EXPLORE = [
  { num: "I",   label: "Weddings",   href: "/events" },
  { num: "II",  label: "Birthdays",  href: "/events" },
  { num: "III", label: "Restaurant", href: "/catering" },
  { num: "IV",  label: "Hotel",      href: "/venue" },
  { num: "V",   label: "Catering",   href: "/catering" },
  { num: "VI",  label: "Info",       href: "/about" },
];

const MORE_ABOUT_TITLE = "More about events";
const MORE_ABOUT_HREF = "/events";
const MORE_LINKS = [
  { label: "Weddings",                  href: "/events" },
  { label: "Corporate events",          href: "/events" },
  { label: "Birthdays & anniversaries", href: "/events" },
  { label: "Pre-wedding functions",     href: "/events" },
];

const BRAND_LINE_1 = "Raj Aangan Events";
const BRAND_LINE_2 = "and Caterers";
const ADDRESS_LINES = [
  "Maharaja Kishan Singh Nahar,",
  "Patrakar Colony, Mansarovar,",
  "Jaipur, Rajasthan 302020",
];
const PHONE = "+91 98290 12815";
const EMAIL = "info@rajaanganevents.com";
const CONTACTS_HREF = "/contact";

const COPYRIGHT = "© Raj Aangan Events and Caterers";
const CREDIT = "MADE BY RT";

// ═══════════════════════════════════════════════════════════════════════════

export default function FooterSection() {
  return (
    // ⚠️ Do NOT add `overflow-hidden` here — it would clip WaveTop, which is
    // positioned above the footer's top edge and needs to protrude upward.
    <footer
      className="relative w-full text-white"
      style={{ backgroundColor: FOOTER_BG }}
    >
      {/* WaveTop mounts here; absolute positioning at bottom:100% */}
      <WaveTop />

      <div className="relative z-10">
        {/* ─── TOP ROW: Menu / Logo / Booking ─────────────────────────── */}
        <div className="flex items-center justify-between px-8 pt-10 pb-6 md:px-16">
          <Link
            href={MENU_HREF}
            className={`flex items-center gap-3 rounded-full ${PILL_BG} px-6 py-3 transition-opacity hover:opacity-90 md:px-7 md:py-3.5`}
          >
            <DehazeIcon className="h-5 w-5 md:h-6 md:w-6" />
            <span className="font-semibold text-[clamp(0.9rem,1.15vw,22px)]">Menu</span>
          </Link>

          <Link href="/" className="hidden shrink-0 md:block" aria-label="Home">
            <Image
              src="/images/logo-round.png"
              alt="Raj Aangan Events and Caterers"
              width={80}
              height={80}
              priority
            />
          </Link>

          <Link
            href={BOOKING_HREF}
            className={`flex items-center gap-3 rounded-full ${PILL_BG} px-6 py-3 transition-opacity hover:opacity-90 md:px-7 md:py-3.5`}
          >
            <TripIcon className="h-5 w-5 md:h-6 md:w-6" />
            <span className="font-semibold text-[clamp(0.9rem,1.15vw,22px)]">Booking</span>
          </Link>
        </div>

        {/* ─── MAIN 3-COLUMN GRID ──────────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-14 px-8 pt-8 pb-16 md:grid-cols-3 md:gap-16 md:px-16 md:pt-12 md:pb-24 lg:gap-20">
          {/* LEFT — Roman numeral list */}
          <ul className="space-y-6 md:space-y-8">
            {EXPLORE.map(({ num, label, href }) => (
              <li key={label} className="flex items-baseline gap-6 md:gap-10">
                <span
                  style={serif}
                  className="w-8 shrink-0 text-white/45 text-[clamp(0.8rem,0.9vw,18px)]"
                >
                  {num}
                </span>
                <Link
                  href={href}
                  style={serif}
                  className="transition-opacity duration-300 hover:opacity-70 text-[clamp(1.8rem,3vw,58px)]"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {/* MIDDLE — More about ___ */}
          <div className="pt-2">
            <div className="flex items-center gap-6">
              <h3
                style={serif}
                className="text-[clamp(1.3rem,1.9vw,36px)]"
              >
                {MORE_ABOUT_TITLE}
              </h3>
              <Link
                href={MORE_ABOUT_HREF}
                aria-label={MORE_ABOUT_TITLE}
                className="group flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/50 transition-all duration-300 hover:border-white hover:bg-white"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  className="text-white transition-colors duration-300 group-hover:text-[#0f2f3b]"
                >
                  <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>

            <ul className="mt-10 space-y-3">
              {MORE_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    style={serif}
                    className="text-white/70 transition-colors duration-300 hover:text-white text-[clamp(1rem,1.15vw,22px)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* RIGHT — brand + contact */}
          <div>
            <h2
              style={serif}
              className="leading-tight text-[clamp(1.7rem,2.4vw,44px)]"
            >
              {BRAND_LINE_1}
              <br />
              {BRAND_LINE_2}
            </h2>

            <div
              style={serif}
              className="mt-8 space-y-1 text-white/80 text-[clamp(1rem,1.15vw,22px)]"
            >
              {ADDRESS_LINES.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>

            <div className="mt-8 space-y-1 text-white/80 text-[clamp(1rem,1.15vw,22px)]">
              <p>{PHONE}</p>
              <p>{EMAIL}</p>
            </div>

            <Link
              href={CONTACTS_HREF}
              className="mt-8 inline-flex items-center gap-3 text-[clamp(1rem,1.15vw,22px)] transition-opacity duration-300 hover:opacity-70"
            >
              <span>Contacts</span>
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>

        {/* ─── SOCIAL ICONS ────────────────────────────────────────────── */}
        <div className="flex items-center justify-end gap-6 px-8 pb-8 md:px-16 md:pb-12">
          <a href="#" aria-label="Facebook"  className="text-white/70 transition-colors duration-300 hover:text-white"><FacebookIcon /></a>
          <a href="#" aria-label="Instagram" className="text-white/70 transition-colors duration-300 hover:text-white"><InstagramIcon /></a>
          <a href="#" aria-label="YouTube"   className="text-white/70 transition-colors duration-300 hover:text-white"><YoutubeIcon /></a>
        </div>

        {/* ─── COPYRIGHT BAR ───────────────────────────────────────────── */}
        <div className="border-t border-white/10 px-8 py-6 md:px-16">
          <div className="flex flex-col items-center justify-between gap-2 md:flex-row">
            <p style={serif} className="text-white/50 text-[clamp(0.85rem,0.9vw,16px)]">
              {COPYRIGHT}
            </p>
            <p className="uppercase tracking-widest text-white/50 text-[clamp(0.75rem,0.8vw,14px)]">
              {CREDIT}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Icons
// ─────────────────────────────────────────────────────────────────────────

function DehazeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
      <line x1="3" y1="7"  x2="21" y2="7" />
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
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.55-1.5h1.65V3.6c-.8-.1-1.6-.15-2.4-.15-2.4 0-4.05 1.45-4.05 4.15v2.3H7.5V13h2.75v8h3.25z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M22 8.2a2.6 2.6 0 0 0-1.8-1.85C18.6 6 12 6 12 6s-6.6 0-8.2.35A2.6 2.6 0 0 0 2 8.2 27 27 0 0 0 1.75 12 27 27 0 0 0 2 15.8a2.6 2.6 0 0 0 1.8 1.85C5.4 18 12 18 12 18s6.6 0 8.2-.35A2.6 2.6 0 0 0 22 15.8 27 27 0 0 0 22.25 12 27 27 0 0 0 22 8.2zM10 14.6V9.4l4.4 2.6-4.4 2.6z" />
    </svg>
  );
}
