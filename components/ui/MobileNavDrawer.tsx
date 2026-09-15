// ══════════════════════════════════════════════════════════════════
// PATH IN REPO: components/ui/MobileNavDrawer.tsx
// ══════════════════════════════════════════════════════════════════

/**
 * MobileNavDrawer — the phone-only navigation panel (Sep 2026).
 * ---------------------------------------------------------------------------
 * WHY THIS EXISTS
 *   The seven nav links used to render as an inline row under the header
 *   pills. Seven uppercase words cannot fit one row on a 390px screen, so they
 *   wrapped onto two lines, ran past both edges and ate ~120px of the hero.
 *   They now live in here, opened by the header's "Menu" pill.
 *
 * PHONE ONLY — by construction, not by convention.
 *   The root carries `md:hidden`, so nothing in this file can reach the
 *   signed-off desktop header. The desktop inline nav row is untouched.
 *
 * NO GSAP HERE, DELIBERATELY.
 *   SiteHeader's `useGSAP` scopes tweens to the <header> element and reverts
 *   them on cleanup; this panel is portalled out of that subtree to <body> so
 *   it can sit above every stacking context on the page (several heroes create
 *   their own). A plain CSS transition sidesteps both problems and there is no
 *   sequencing here worth a timeline.
 *
 * SCROLL LOCK.
 *   `overflow: hidden` on <body> alone is not enough: the site runs Lenis,
 *   which drives scrolling from its own rAF loop and would happily keep
 *   scrolling the page under the open panel. Lenis is exposed on
 *   `window.lenis` by SmoothScroll.tsx, so it is stopped and restarted here.
 * ---------------------------------------------------------------------------
 */

"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { MB_COLORS } from "@/lib/menu-builder/types";

const serif = { fontFamily: "var(--font-cormorant-garamond)" } as const;

// ═══════════════════════════════════════════════════════════════════════════
// ─── TUNE THESE KNOBS ──────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════

// Panel surface. Matches the site's ink, not the footer navy, so the drawer
// reads as an overlay on any page regardless of that page's palette.
const PANEL_BG = "#191919";
const PANEL_TRANSITION_MS = 420;

// Roman numerals down the left of the list — the same treatment the footer
// uses for its "explore" column, so the drawer looks like part of the site
// rather than a bolted-on mobile menu.
const NUMERALS = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];

// The gold CTA at the bottom. The drawer covers the header's Booking pill
// while it is open, so it mirrors that pill — which now opens the Booking page
// (hero + the guest's saved quotations), not the wizard. The wizard has its own
// entry in the link list above ("Menu Builder", directly under Events).
const BOOKING_HREF = "/booking";
const BOOKING_LABEL = "Start Your Booking";

// ═══════════════════════════════════════════════════════════════════════════

type NavLink = { label: string; href: string };

type Props = {
  open: boolean;
  onClose: () => void;
  links: NavLink[];
};

export default function MobileNavDrawer({ open, onClose, links }: Props) {
  // Portals need a DOM that exists — render nothing until mounted on the client.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Escape closes, and the page underneath is frozen while open.
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);

    const lenis = (window as { lenis?: { stop?: () => void; start?: () => void } }).lenis;
    lenis?.stop?.();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      lenis?.start?.();
    };
  }, [open, onClose]);

  if (!mounted) return null;

  return createPortal(
    <div
      id="mobile-nav"
      // `inert` while closed keeps the links out of the tab order and away
      // from screen readers without unmounting them, which is what lets the
      // panel animate out instead of vanishing.
      inert={!open}
      aria-hidden={!open}
      className="fixed inset-0 z-[60] md:hidden"
      style={{
        pointerEvents: open ? "auto" : "none",
        transition: `opacity ${PANEL_TRANSITION_MS}ms ease, visibility ${PANEL_TRANSITION_MS}ms ease`,
        opacity: open ? 1 : 0,
        visibility: open ? "visible" : "hidden",
      }}
    >
      {/* Scrim — tapping outside the panel closes it. */}
      <button
        aria-label="Close menu"
        tabIndex={-1}
        onClick={onClose}
        className="absolute inset-0 h-full w-full bg-black/50"
      />

      {/* The panel itself — slides down from the top edge. */}
      <div
        className="absolute inset-x-0 top-0 flex max-h-dvh flex-col overflow-y-auto"
        style={{
          backgroundColor: PANEL_BG,
          transform: open ? "translateY(0)" : "translateY(-100%)",
          transition: `transform ${PANEL_TRANSITION_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`,
        }}
      >
        {/* Panel header: logo + close. Mirrors the height of the site header
            it opens from, so the logo does not appear to jump. */}
        <div className="flex items-center justify-between px-4 pt-5 pb-4">
          <Link href="/" onClick={onClose} aria-label="Home">
            <Image
              src="/images/logo-round.png"
              alt="Raj Aangan Events and Caterers"
              width={110}
              height={110}
              /* KEEP IN SYNC with SiteHeader's phone logo size, or the mark
                 visibly jumps as the panel slides over the header. */
              className="h-[2.75rem] w-[2.75rem]"
            />
          </Link>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/30 text-white transition-colors hover:border-white/70"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="h-px w-full bg-white/15" />

        {/* Links */}
        <nav className="flex flex-col px-4 pt-3 pb-5">
          {links.map((link, i) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={onClose}
              className="flex items-baseline gap-5 border-b border-white/10 py-3.5 text-white transition-opacity active:opacity-60"
            >
              <span
                style={serif}
                className="w-5 shrink-0 text-[0.75rem] text-white/40"
              >
                {NUMERALS[i] ?? ""}
              </span>
              <span style={serif} className="text-[1.5rem] leading-none">
                {toTitleCase(link.label)}
              </span>
            </Link>
          ))}
        </nav>

        {/* Booking CTA — the header's own Booking pill is behind the scrim. */}
        <div className="px-4 pb-7">
          <Link
            href={BOOKING_HREF}
            onClick={onClose}
            className="flex w-full items-center justify-center gap-2.5 rounded-full py-3.5 text-[0.8125rem] font-semibold uppercase tracking-[0.14em] text-[#191919]"
            style={{ backgroundColor: MB_COLORS.gold }}
          >
            <TripIcon />
            {BOOKING_LABEL}
          </Link>
        </div>
      </div>
    </div>,
    document.body
  );
}

/** "ABOUT US" → "About Us". The links are authored uppercase for the desktop
 *  row's letter-spaced treatment; the drawer wants the serif display casing. */
function toTitleCase(label: string): string {
  return label
    .toLowerCase()
    .replace(/(^|\s)\S/g, (ch) => ch.toUpperCase());
}

function CloseIcon() {
  return (
    <svg
      className="h-[0.875rem] w-[0.875rem]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
    >
      <line x1="5" y1="5" x2="19" y2="19" />
      <line x1="19" y1="5" x2="5" y2="19" />
    </svg>
  );
}

function TripIcon() {
  return (
    <svg
      className="h-4 w-4"
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
