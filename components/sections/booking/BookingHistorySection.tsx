// ══════════════════════════════════════════════════════════════════
// PATH IN REPO: components/sections/booking/BookingHistorySection.tsx
// ══════════════════════════════════════════════════════════════════
/**
 * The guest's saved quotations, listed under the hero on /booking.
 *
 * WHAT IT SHOWS
 *   One card per SavedBooking (lib/menu-builder/booking-history.ts), newest
 *   first: when it was saved, the venue / order, the client + event details,
 *   the estimated total, and — expanded — the FULL quotation, re-rendered
 *   from the stored QuoteDoc. Rendering from the stored doc rather than from
 *   today's prices is the point: a saved booking shows the guest exactly the
 *   quote they were given.
 *
 * "IF THERE IS NO BOOKING HISTORY THEN SHOW NOTHING" — literally. With an
 * empty list this component returns null, so the page is just the hero and
 * the footer, and the hero's CTA points into the wizard instead of down here
 * (see BookingHero). That also covers the pre-hydration render: localStorage
 * is unreadable during SSR, so the server always emits nothing here, and the
 * first client render must match it.
 *
 * DESIGN
 *   Deliberately the Quote screen's own language — white cards on the menu
 *   builder navy, gold hairline section rules, Cormorant Garamond headings,
 *   `p-5 md:p-10` card padding — because this IS the quote, seen later. The
 *   surrounding chrome (eyebrow over a gold rule, centred heading, Reveal on
 *   scroll) is the marketing site's, so the page belongs to both.
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import Reveal from "@/components/anim/Reveal";
import {
  formatEventDate,
  formatSavedAt,
  type SavedBooking,
} from "@/lib/menu-builder/booking-history";
import { whatsAppText, whatsAppUrl, type QuoteSection } from "@/lib/menu-builder/quote-doc";
import { MB_COLORS } from "@/lib/menu-builder/types";
import { SITE_PHONE } from "@/lib/site-info";

const serif = { fontFamily: "var(--font-cormorant-garamond)" } as const;

// ═══════════════════════════════════════════════════════════════════════════
// ─── TUNE THESE KNOBS ──────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════

const INK = MB_COLORS.ink;
const INK_MUTED = MB_COLORS.inkMuted;
const GOLD = MB_COLORS.gold;
const CARD_BG = MB_COLORS.card;

// Same padding ladder as every menu-builder step card.
const CARD_PADDING = "p-5 md:p-10";
const SECTION_PAD = "px-4 pb-20 pt-6 md:px-10 md:pb-32 md:pt-10";

const HEADING_EYEBROW = "Booking History";
const HEADING_TITLE = "Quotations you have saved";
/* Names the two things a guest actually does from here — send the quote over,
   or begin the next one — and nothing else. The previous line led with "the
   estimate exactly as it was built", which is a reassurance about our own data
   handling; it reads as defensive on a page a guest opens to plan a wedding. */
const HEADING_INTRO =
  "Share it with us on WhatsApp whenever you\u2019re ready or start planning your next celebration.";

const REMOVE_CONFIRM = "Remove this booking from your history? This can't be undone.";

// ═══════════════════════════════════════════════════════════════════════════

type Props = {
  history: SavedBooking[];
  onRemove: (id: string) => void;
};

export default function BookingHistorySection({ history, onRemove }: Props) {
  // See the file header — nothing at all when there is nothing to show.
  if (history.length === 0) return null;

  return (
    <section
      id="history"
      className={`w-full ${SECTION_PAD}`}
      style={{ backgroundColor: MB_COLORS.bg }}
    >
      <div className="mx-auto w-full max-w-[64rem]">
        <Reveal>
          <div className="flex flex-col items-center text-center">
            <span
              style={{ ...serif, color: GOLD }}
              className="text-[0.75rem] uppercase tracking-[0.24em] md:text-[0.8125rem]"
            >
              {HEADING_EYEBROW}
            </span>
            <span aria-hidden className="mt-4 block h-px w-16" style={{ backgroundColor: GOLD }} />
            <h2
              style={{ ...serif, color: "#ffffff" }}
              className="mt-5 font-semibold text-[1.75rem] md:text-[clamp(2rem,3.4vw,3.0625rem)]"
            >
              {HEADING_TITLE}
            </h2>
            <p
              style={{ ...serif, color: "rgba(255,255,255,0.7)" }}
              className="mt-4 max-w-[min(34rem,86vw)] leading-relaxed text-[1rem] md:max-w-[36rem] md:text-[clamp(1.05rem,1.3vw,1.1875rem)]"
            >
              {HEADING_INTRO}
            </p>
          </div>
        </Reveal>

        <ul className="mt-10 flex flex-col gap-5 md:mt-16 md:gap-8">
          {history.map((booking) => (
            <li key={booking.id}>
              <Reveal>
                <BookingCard booking={booking} onRemove={onRemove} />
              </Reveal>
            </li>
          ))}
        </ul>

        <div className="mt-10 flex justify-center md:mt-16">
          <Link
            href="/menu-builder"
            className="rounded-full px-8 py-3.5 text-[0.8125rem] font-semibold uppercase tracking-[0.14em] transition-opacity hover:opacity-90 md:text-sm"
            style={{ backgroundColor: GOLD, color: INK }}
          >
            Start a New Booking
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── One saved quotation ───────────────────────────────────────────────────

function BookingCard({
  booking,
  onRemove,
}: {
  booking: SavedBooking;
  onRemove: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);

  const sendWhatsApp = () => {
    window.open(
      whatsAppUrl(SITE_PHONE, whatsAppText(booking.doc)),
      "_blank",
      "noopener,noreferrer",
    );
  };

  const remove = () => {
    if (typeof window !== "undefined" && !window.confirm(REMOVE_CONFIRM)) return;
    onRemove(booking.id);
  };

  return (
    <article className={`rounded-sm ${CARD_PADDING}`} style={{ backgroundColor: CARD_BG }}>
      {/* Saved-on + total. Wraps to two rows on a phone rather than squeezing
          the total onto the same line as the date. */}
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <span
          style={{ color: GOLD }}
          className="text-[0.6875rem] uppercase tracking-[0.2em] md:text-[0.75rem]"
        >
          Saved {formatSavedAt(booking.savedAt)}
        </span>
        <span
          style={{ ...serif, color: GOLD }}
          className="font-semibold text-[1.25rem] md:text-[clamp(1.2rem,1.6vw,1.4375rem)]"
        >
          {booking.total}
        </span>
      </div>

      <h3
        style={{ ...serif, color: INK }}
        className="mt-2 font-semibold text-[1.5rem] leading-tight md:text-[clamp(1.5rem,2vw,1.875rem)]"
      >
        {booking.headline}
      </h3>
      <p style={{ color: INK_MUTED }} className="mt-1 text-[0.875rem] md:text-sm">
        {booking.summary}
      </p>

      {/* Details. One column on a phone, two from md up — a 2-up grid of
          label/value pairs is unreadable at 390px. */}
      <dl className="mt-5 grid grid-cols-1 gap-x-10 md:mt-7 md:grid-cols-2">
        <Detail label="Client" value={booking.clientName || "—"} />
        <Detail label="Contact" value={booking.contactPhone || "—"} />
        <Detail
          label={booking.kind === "outdoor" ? "Delivery Date" : "Event Date"}
          value={formatEventDate(booking.eventDate)}
        />
        {booking.guests !== null && <Detail label="Guests" value={String(booking.guests)} />}
        {booking.eventDays !== null && (
          <Detail
            label="Duration"
            value={`${booking.eventDays} Day${booking.eventDays > 1 ? "s" : ""}`}
          />
        )}
      </dl>

      {/*
        EXPANDING BODY — the `grid-template-rows: 0fr → 1fr` technique, so the
        panel animates to its NATURAL height with no JS measuring and no
        max-height guess that clips a long quotation. The inner div must keep
        `overflow-hidden` or the collapsed content spills out of the 0fr row.
        `visibility` follows `open` so collapsed content stays out of the tab
        order and away from screen readers.
      */}
      <div
        className="grid transition-[grid-template-rows] duration-500 ease-out motion-reduce:transition-none"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden" style={{ visibility: open ? "visible" : "hidden" }}>
          <div className="pt-2">
            {booking.doc.sections.map((section) => (
              <QuoteSectionBlock key={section.title} section={section} />
            ))}

            <div
              className="mt-6 flex items-baseline justify-between border-t pt-4"
              style={{ borderColor: MB_COLORS.border }}
            >
              <span
                style={{ ...serif, color: INK }}
                className="font-semibold text-[1.125rem] md:text-[clamp(1.2rem,1.6vw,1.4375rem)]"
              >
                {booking.doc.totalLabel}
              </span>
              <span
                style={{ ...serif, color: GOLD }}
                className="font-semibold text-[1.125rem] md:text-[clamp(1.2rem,1.6vw,1.4375rem)]"
              >
                {booking.doc.totalValue}
              </span>
            </div>

            {booking.doc.contact && (
              <p style={{ color: INK_MUTED }} className="mt-3 text-[0.875rem] md:text-sm">
                {booking.doc.contact}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Actions. `flex-wrap` is what keeps three buttons usable at 390px —
          they fall onto a second row instead of shrinking below a tap target. */}
      <div className="mt-6 flex flex-wrap gap-2.5 md:gap-3">
        {/* Full width on a phone: at 390px the three buttons wrap 1 + 2 anyway,
            and a half-width button with a whole empty row beside it reads as a
            layout bug. `md:w-auto` puts all three back on one row on desktop. */}
        <CardButton
          label={open ? "Hide quotation" : "View full quotation"}
          onClick={() => setOpen((v) => !v)}
          expanded={open}
          className="w-full md:w-auto"
        />
        <CardButton label="Send on WhatsApp" onClick={sendWhatsApp} />
        <CardButton label="Remove" onClick={remove} muted />
      </div>
    </article>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="flex items-baseline justify-between gap-4 border-b py-2.5"
      style={{ borderColor: MB_COLORS.borderLight }}
    >
      <dt style={{ color: INK_MUTED }} className="text-[0.875rem] md:text-sm">
        {label}
      </dt>
      <dd style={{ color: INK }} className="text-right text-[0.875rem] md:text-sm">
        {value}
      </dd>
    </div>
  );
}

/** One section of the stored QuoteDoc — the Quote screen's own treatment. */
function QuoteSectionBlock({ section }: { section: QuoteSection }) {
  const hasContent = (section.lines?.length ?? 0) + (section.notes?.length ?? 0) > 0;
  if (!hasContent) return null;

  return (
    <div>
      <div className="mt-7 mb-3 flex items-center gap-4">
        <h4
          style={{ ...serif, color: INK }}
          className="font-semibold text-[1.0625rem] md:text-[clamp(1.1rem,1.35vw,1.1875rem)]"
        >
          {section.title}
        </h4>
        <div className="h-px flex-1" style={{ backgroundColor: GOLD }} />
      </div>

      {section.lines?.map((line) => (
        <div
          key={line.label}
          className="flex items-baseline justify-between gap-4 border-b py-2 text-[0.875rem] md:text-sm"
          style={{ borderColor: MB_COLORS.borderLight }}
        >
          <span style={{ color: INK_MUTED }}>{line.label}</span>
          <span style={{ color: INK }} className="text-right">
            {line.value}
          </span>
        </div>
      ))}

      {section.notes && section.notes.length > 0 && (
        <ul className="mt-1 space-y-1.5">
          {section.notes.map((note, i) => (
            <li
              key={i}
              style={{ color: INK_MUTED }}
              className="flex gap-2 text-[0.875rem] md:text-sm"
            >
              <span style={{ color: GOLD }} aria-hidden>
                •
              </span>
              {/* `whitespace-pre-wrap` preserves the indentation the quote doc
                  uses for nested live-counter lines. */}
              <span className="whitespace-pre-wrap">{note}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function CardButton({
  label,
  onClick,
  muted = false,
  expanded,
  className = "",
}: {
  label: string;
  onClick: () => void;
  muted?: boolean;
  expanded?: boolean;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-expanded={expanded}
      className={`rounded border px-5 py-2.5 text-[0.8125rem] font-medium transition-colors hover:bg-gray-50 md:px-6 md:py-3 md:text-sm ${className}`}
      style={{ borderColor: MB_COLORS.border, color: muted ? INK_MUTED : INK }}
    >
      {label}
    </button>
  );
}
