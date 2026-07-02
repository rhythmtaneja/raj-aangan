"use client";

import { useState } from "react";
import Link from "next/link";
import Reveal from "@/components/anim/Reveal";

const serif = { fontFamily: "var(--font-cormorant-garamond)" } as const;

// ═══════════════════════════════════════════════════════════════════════════
// ─── TUNE THESE KNOBS ──────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════

const SECTION_BG = "#f5efe6"; // same cream as AddressSection — no seam between them
const TEXT_COLOR = "#191919";

// ─ Row typography ──
const ROW_TITLE_SIZE = "clamp(1.4rem, 2.4vw, 46px)";
const ROW_DESC_SIZE  = "clamp(0.95rem, 1.1vw, 22px)";

// ─ Expand/collapse animation duration ──
const EXPAND_DURATION_MS = 500;

// ═══════════════════════════════════════════════════════════════════════════
// Data — each item can be expanded to reveal hours + one or more contact rows.
// Add / remove items freely; the accordion adapts.
// ═══════════════════════════════════════════════════════════════════════════

type IconKind = "phone" | "mobile" | "email" | "online" | "clock";

type ContactRow = {
  icon:        IconKind;
  label:       string;
  value:       string;
  actionLabel: string;
  href:        string;
};

type AccordionItem = {
  title:       string;
  description: string;
  hours?:      { day: string; range: string };
  rows:        ContactRow[];
};

const ITEMS: AccordionItem[] = [
  {
    title:       "Accommodation Booking And Information",
    description: "Contact for booking Banquet or garden",
    hours:       { day: "Monday - Friday", range: "8:00 — 16:30" },
    rows: [
      { icon: "phone",  label: "Phone",          value: "+91 98290 12815",       actionLabel: "Call",   href: "tel:+919829012815" },
      { icon: "mobile", label: "Mobile",         value: "+91 98290 12815",       actionLabel: "Call",   href: "tel:+919829012815" },
      { icon: "email",  label: "Email",          value: "info@rajaangan.com",    actionLabel: "Write",  href: "mailto:info@rajaangan.com" },
      { icon: "online", label: "Online booking", value: "",                       actionLabel: "Online", href: "#" },
    ],
  },
  {
    title:       "Raj Aangan Events & Caterers",
    description: "Contact for booking Event & Caterers",
    hours:       { day: "Monday - Sunday", range: "9:00 — 20:00" },
    rows: [
      { icon: "phone", label: "Phone", value: "+91 98290 12815",       actionLabel: "Call",  href: "tel:+919829012815" },
      { icon: "email", label: "Email", value: "events@rajaangan.com",  actionLabel: "Write", href: "mailto:events@rajaangan.com" },
    ],
  },
  {
    title:       "Planning & Event Services",
    description: "Contact for Services",
    rows: [
      { icon: "phone", label: "Phone", value: "+91 98290 12815",         actionLabel: "Call",  href: "tel:+919829012815" },
      { icon: "email", label: "Email", value: "planning@rajaangan.com",  actionLabel: "Write", href: "mailto:planning@rajaangan.com" },
    ],
  },
  {
    title:       "Event & Wedding Gallery",
    description: "See our Gallery",
    rows: [
      { icon: "online", label: "Gallery", value: "View all our work", actionLabel: "View", href: "/gallery" },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════════

export default function ContactAccordion() {
  // Single-open behaviour: only one row expanded at a time.
  // For multi-open, swap this for a Set<number>.
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section
      className="w-full px-6 py-8 md:px-16 md:pb-32"
      style={{ backgroundColor: SECTION_BG, color: TEXT_COLOR }}
    >
      <div className="mx-auto w-full max-w-6xl">
        <Reveal>
          <div className="divide-y divide-[#191919]/15">
            {ITEMS.map((item, i) => (
              <AccordionRow
                key={i}
                item={item}
                isOpen={openIdx === i}
                onToggle={() => setOpenIdx(openIdx === i ? null : i)}
              />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─── Single row (closed → header only; open → header + panel) ─────────── */

function AccordionRow({
  item,
  isOpen,
  onToggle,
}: {
  item:     AccordionItem;
  isOpen:   boolean;
  onToggle: () => void;
}) {
  return (
    <div>
      {/* HEADER — click anywhere to toggle */}
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className="grid w-full grid-cols-[1fr_auto_auto] items-center gap-6 py-8 text-left md:grid-cols-[1.4fr_1fr_auto] md:gap-12 md:py-10"
      >
        <h3
          style={{ ...serif, fontSize: ROW_TITLE_SIZE }}
          className="font-medium leading-[1.15]"
        >
          {item.title}
        </h3>

        <p
          style={{ fontSize: ROW_DESC_SIZE }}
          className="hidden text-[#3a3a3a] md:block"
        >
          {item.description}
        </p>

        <span
          className="flex h-11 w-11 items-center justify-center rounded-full border border-[#191919]/40 transition-transform duration-500"
          style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          <ChevronDown />
        </span>
      </button>

      {/*
        PANEL — auto-height animation using the grid-template-rows trick.
        grid-template-rows: 0fr (collapsed) ↔ 1fr (open). The inner div uses
        overflow-hidden so content clips smoothly. No JS height measurement.
      */}
      <div
        className="grid overflow-hidden transition-[grid-template-rows] ease-out"
        style={{
          gridTemplateRows:   isOpen ? "1fr" : "0fr",
          transitionDuration: `${EXPAND_DURATION_MS}ms`,
        }}
      >
        <div className="overflow-hidden">
          <div className="pb-10 pt-2">
            {item.hours && (
              <HoursRow day={item.hours.day} range={item.hours.range} />
            )}
            {item.rows.map((row, ri) => (
              <ContactRowLine key={ri} row={row} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Sub-rows inside the expanded panel ─────────────────────────────── */

function HoursRow({ day, range }: { day: string; range: string }) {
  return (
    <div className="flex items-center gap-6 border-b border-[#191919]/12 py-5 md:py-6">
      <span className="flex w-8 justify-center text-[#191919]">
        <ClockIcon />
      </span>
      <span
        style={{ ...serif, fontSize: "clamp(1.05rem, 1.35vw, 26px)" }}
        className="flex-1 font-medium"
      >
        {day}
      </span>
      <span className="text-[clamp(0.95rem,1.1vw,22px)] text-[#3a3a3a]">
        {range}
      </span>
    </div>
  );
}

function ContactRowLine({ row }: { row: ContactRow }) {
  return (
    <div className="flex items-center gap-6 border-b border-[#191919]/12 py-5 md:py-6 last:border-b-0">
      <span className="flex w-8 justify-center text-[#191919]">
        <RowIcon kind={row.icon} />
      </span>

      <span
        style={{ ...serif, fontSize: "clamp(1.05rem, 1.35vw, 26px)" }}
        className="w-24 md:w-40"
      >
        {row.label}
      </span>

      <span className="flex-1 text-[clamp(0.95rem,1.1vw,22px)] text-[#3a3a3a]">
        {row.value}
      </span>

      <Link
        href={row.href}
        className="rounded-full border border-[#191919] px-6 py-2.5 text-[clamp(0.85rem,1vw,20px)] font-medium text-[#191919] transition-colors hover:bg-[#191919] hover:text-white md:px-8 md:py-3"
      >
        {row.actionLabel}
      </Link>
    </div>
  );
}

/* ─── Icons ──────────────────────────────────────────────────────────── */

function RowIcon({ kind }: { kind: IconKind }) {
  switch (kind) {
    case "phone":
    case "mobile":  return <PhoneIcon />;
    case "email":   return <EmailIcon />;
    case "online":  return <MenuIcon />;
    case "clock":   return <ClockIcon />;
  }
}

function ChevronDown() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.72 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.36 1.85.59 2.81.72A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
      <line x1="4" y1="7"  x2="20" y2="7"  />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="17" x2="20" y2="17" />
    </svg>
  );
}
