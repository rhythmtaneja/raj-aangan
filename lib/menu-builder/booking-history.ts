"use client";

import { useCallback, useEffect, useState } from "react";
import type { QuoteDoc } from "./quote-doc";

const HISTORY_KEY = "raec-booking-history";

const ACTIVE_KEY = "raec-active-booking-id";

const CHANGE_EVENT = "raec-booking-history-change";

const MAX_ENTRIES = 30;

export type SavedBooking = {
  id: string;

  savedAt: string;
  kind: "venue-event" | "outdoor";

  headline: string;
  clientName: string;
  contactPhone: string;

  eventDate: string;

  guests: number | null;
  eventDays: number | null;

  summary: string;

  total: string;
  doc: QuoteDoc;
};

function readRaw(): SavedBooking[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = window.localStorage.getItem(HISTORY_KEY);
    if (!stored) return [];
    const parsed: unknown = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];

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
    window.localStorage.setItem(
      HISTORY_KEY,
      JSON.stringify(entries.slice(0, MAX_ENTRIES)),
    );
  } catch {
    return;
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function readBookingHistory(): SavedBooking[] {
  return [...readRaw()].sort((a, b) => b.savedAt.localeCompare(a.savedAt));
}

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

export function activeBookingId(): string {
  if (typeof window === "undefined") return "";
  try {
    const existing = window.localStorage.getItem(ACTIVE_KEY);
    if (existing) return existing;
    const id = newId();
    window.localStorage.setItem(ACTIVE_KEY, id);
    return id;
  } catch {
    return newId();
  }
}

export function clearActiveBookingId(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(ACTIVE_KEY);
  } catch {}
}

function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto)
    return crypto.randomUUID();
  return `b-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function useBookingHistory() {
  const [history, setHistory] = useState<SavedBooking[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const sync = () => setHistory(readBookingHistory());
    sync();

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHydrated(true);

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

export function formatSavedAt(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

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
