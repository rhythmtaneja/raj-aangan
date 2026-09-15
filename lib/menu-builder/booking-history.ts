// ══════════════════════════════════════════════════════════════════
// PATH IN REPO: lib/menu-builder/booking-history.ts
// ══════════════════════════════════════════════════════════════════
/**
 * BOOKING HISTORY — the guest's own saved quotations.
 *
 * WHAT IT IS
 *   Every time a guest reaches the Quote step with an actual menu on it, the
 *   finished quotation is written here, and /booking lists them back. One
 *   entry per WIZARD RUN, not per visit to the Quote screen: the run's id is
 *   held in `ACTIVE_KEY` and only cleared by "Start Over" / RESET_WIZARD, so
 *   tweaking guest count on the Quote screen UPDATES the guest's booking
 *   instead of piling up near-duplicates.
 *
 * ⚠️ THIS IS STILL LOCALSTORAGE, NOT A SERVER RECORD.
 *   It is the same storage the wizard itself uses (context.tsx), and it has
 *   the same limits: this browser only, no RAEC-side copy, gone if the guest
 *   clears site data. It gives the guest their own history — it does NOT
 *   close the "bookings are saved nowhere" gap in CLAUDE.md §D.14, and it
 *   must not be presented to the client as if it does. Workstream 4 (the CRM
 *   integration) is still the thing that captures the lead; when it lands,
 *   `upsertBooking` is the single place to also POST the entry.
 *
 * SHAPE
 *   A SavedBooking stores the whole `QuoteDoc` — the render-agnostic quote
 *   description that the Quote screen already builds for its WhatsApp / PDF /
 *   Share actions. That is deliberate: /booking re-renders the sections
 *   straight out of it, so a saved booking can never disagree with the quote
 *   the guest actually saw, and a later change to the wizard's pricing cannot
 *   silently rewrite history.
 */

"use client";

import { useCallback, useEffect, useState } from "react";
import type { QuoteDoc } from "./quote-doc";

// ─── Storage keys ──────────────────────────────────────────────────────────

const HISTORY_KEY = "raec-booking-history";
/** The id of the wizard run in progress, so re-saves update one entry. */
const ACTIVE_KEY = "raec-active-booking-id";

/** Fired on every write so open pages in THIS tab re-read (the `storage`
 *  event only fires in OTHER tabs). */
const CHANGE_EVENT = "raec-booking-history-change";

/** Oldest entries past this are dropped — localStorage has a hard quota and a
 *  QuoteDoc is not small. */
const MAX_ENTRIES = 30;

// ─── Types ─────────────────────────────────────────────────────────────────

export type SavedBooking = {
  /** Stable per wizard run — see ACTIVE_KEY above. */
  id: string;
  /** ISO timestamp of the last save. */
  savedAt: string;
  kind: "venue-event" | "outdoor";
  /** Card heading, e.g. the venue name or "Outdoor Catering & Bulk Order". */
  headline: string;
  clientName: string;
  contactPhone: string;
  /** Event date for a venue event, delivery date for an outdoor order. */
  eventDate: string;
  /** null for outdoor orders, which are priced per box rather than per head. */
  guests: number | null;
  eventDays: number | null;
  /** One-line description of what was ordered (menu name / item count). */
  summary: string;
  /** Pre-formatted, e.g. "₹4,42,500" — never re-derived from today's prices. */
  total: string;
  doc: QuoteDoc;
};

// ─── Low-level storage (every access guarded) ──────────────────────────────
// Storage throws in private windows, in embedded webviews and when the quota
// is full. None of that may take the page down, so every path below returns a
// sane empty value instead.

function readRaw(): SavedBooking[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = window.localStorage.getItem(HISTORY_KEY);
    if (!stored) return [];
    const parsed: unknown = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];
    // Anything without an id or a doc predates this shape / is corrupt.
    return parsed.filter(
      (entry): entry is SavedBooking =>
        !!entry && typeof entry === "object" && "id" in entry && "doc" in entry,
    );
  } catch {
    return [];
  }
}

function writeRaw(entries: SavedBooking[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(entries.slice(0, MAX_ENTRIES)));
  } catch {
    // Quota exceeded / storage blocked — the guest keeps what is already
    // stored, and the wizard itself is unaffected.
    return;
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

// ─── Public API ────────────────────────────────────────────────────────────

/** Newest first. Safe to call during SSR — returns []. */
export function readBookingHistory(): SavedBooking[] {
  return [...readRaw()].sort((a, b) => b.savedAt.localeCompare(a.savedAt));
}

/**
 * Insert or update one booking, keyed by `id`. An update keeps the entry's
 * position by re-stamping `savedAt`, so the list stays "most recently worked
 * on first".
 */
export function upsertBooking(entry: SavedBooking): void {
  const rest = readRaw().filter((e) => e.id !== entry.id);
  writeRaw([entry, ...rest]);
}

export function removeBooking(id: string): void {
  writeRaw(readRaw().filter((e) => e.id !== id));
}

export function clearBookingHistory(): void {
  writeRaw([]);
}

/**
 * The id for the wizard run in progress, created on first call. Kept out of
 * BookingState on purpose: that object is serialised into the wizard's own
 * storage blob and merged with INITIAL_STATE on load, so a new field there
 * would need a migration and would be reset by every RESET_WIZARD — which is
 * the one moment we need to control explicitly.
 */
export function activeBookingId(): string {
  if (typeof window === "undefined") return "";
  try {
    const existing = window.localStorage.getItem(ACTIVE_KEY);
    if (existing) return existing;
    const id = newId();
    window.localStorage.setItem(ACTIVE_KEY, id);
    return id;
  } catch {
    // No storage → a throwaway id. The entry simply cannot be written either,
    // so nothing downstream breaks.
    return newId();
  }
}

/** Call when a wizard run ENDS (Start Over), so the next run is its own entry. */
export function clearActiveBookingId(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(ACTIVE_KEY);
  } catch {
    /* nothing to clear */
  }
}

function newId(): string {
  // `crypto.randomUUID` needs a secure context; the fallback is only ever used
  // on plain-http origins, where a collision is harmless (one guest, one tab).
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `b-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

// ─── React binding ─────────────────────────────────────────────────────────

/**
 * Subscribe to the stored history.
 *
 * `hydrated` matters: localStorage cannot be read during SSR, so the first
 * client render MUST match the server's "nothing yet" output or React drops
 * the tree with a hydration mismatch. Consumers render their empty/loading
 * shape until this flips — see BookingHistorySection.
 */
export function useBookingHistory() {
  const [history, setHistory] = useState<SavedBooking[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const sync = () => setHistory(readBookingHistory());
    sync();
    // Intentional one-shot post-mount flag, same pattern as BookingProvider.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHydrated(true);

    // Same tab (our own writes) + other tabs (the native storage event).
    window.addEventListener(CHANGE_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(CHANGE_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const remove = useCallback((id: string) => removeBooking(id), []);
  const clear = useCallback(() => clearBookingHistory(), []);

  return { history, hydrated, remove, clear };
}

// ─── Display helpers (shared by the Quote screen and /booking) ─────────────

/** "2026-09-15T10:04:00.000Z" → "15 Sep 2026". */
export function formatSavedAt(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/** An ISO date field from the wizard ("2026-11-04") → "04 Nov 2026". */
export function formatEventDate(value: string): string {
  if (!value) return "—";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
