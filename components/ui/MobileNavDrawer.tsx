"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { MB_COLORS } from "@/lib/menu-builder/types";

const serif = { fontFamily: "var(--font-cormorant-garamond)" } as const;

const PANEL_BG = "#191919";
const PANEL_TRANSITION_MS = 420;

const NUMERALS = [
  "I",
  "II",
  "III",
  "IV",
  "V",
  "VI",
  "VII",
  "VIII",
  "IX",
  "X",
  "XI",
  "XII",
];

const BOOKING_HREF = "/booking";
const BOOKING_LABEL = "Start Your Booking";

type NavLink = { label: string; href: string };

type Props = {
  open: boolean;
  onClose: () => void;
  links: NavLink[];
};

export default function MobileNavDrawer({ open, onClose, links }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);

    const lenis = (
      window as { lenis?: { stop?: () => void; start?: () => void } }
    ).lenis;
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
      <button
        aria-label="Close menu"
        tabIndex={-1}
        onClick={onClose}
        className="absolute inset-0 h-full w-full bg-black/50"
      />

      <div
        className="absolute inset-x-0 top-0 flex max-h-dvh flex-col overflow-y-auto"
        style={{
          backgroundColor: PANEL_BG,
          transform: open ? "translateY(0)" : "translateY(-100%)",
          transition: `transform ${PANEL_TRANSITION_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`,
        }}
      >
        <div className="flex items-center justify-between px-4 pt-5 pb-4">
          <Link href="/" onClick={onClose} aria-label="Home">
            <Image
              src="/images/logo-round.png"
              alt="Raj Aangan Events and Caterers"
              width={110}
              height={110}

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
    document.body,
  );
}

function toTitleCase(label: string): string {
  return label.toLowerCase().replace(/(^|\s)\S/g, (ch) => ch.toUpperCase());
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
