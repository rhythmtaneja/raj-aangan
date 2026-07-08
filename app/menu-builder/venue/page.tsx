"use client";

import Image from "next/image";
import BuilderLayout from "@/components/menu-builder/BuilderLayout";
import { useBooking } from "@/lib/menu-builder/context";
import { VENUES } from "@/lib/menu-builder/data";
import { MB_COLORS, type Venue } from "@/lib/menu-builder/types";

const serif = { fontFamily: "var(--font-cormorant-garamond)" } as const;

// ═══════════════════════════════════════════════════════════════════════════
// ─── TUNE THESE KNOBS ──────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════

const CARD_BG = MB_COLORS.card;
const INK = MB_COLORS.ink;
const INK_MUTED = MB_COLORS.inkMuted;
const GOLD = MB_COLORS.gold;
const CARD_PADDING = "p-8 md:p-10";
const VENUE_IMG_H = 180;

// ═══════════════════════════════════════════════════════════════════════════

export default function Step2VenuePage() {
  const { state, dispatch, hydrated } = useBooking();

  const ourProperties = VENUES.filter((v) => v.type === "our-property");
  const partners = VENUES.filter((v) => v.type === "partner");

  const selectVenue = (id: string) =>
    dispatch({ type: "SET_FIELD", field: "venueId", value: state.venueId === id ? null : id });

  const setCustom = (addr: string) =>
    dispatch({ type: "SET_FIELD", field: "customVenueAddress", value: addr });

  return (
    <BuilderLayout
      currentStep={2}
      backHref="/menu-builder/client"
      nextHref="/menu-builder/cuisine"
      nextLabel="Next"
    >
      <div className={CARD_PADDING} style={{ backgroundColor: CARD_BG }}>
        <h2
          style={{ ...serif, color: INK }}
          className="text-[clamp(1.6rem,2.3vw,42px)] font-semibold"
        >
          Select Venue
        </h2>
        <p style={{ color: INK_MUTED }} className="mt-1 text-sm">
          Choose from our properties or a partner venue in Jaipur.
        </p>

        {/* OUR PROPERTIES */}
        <SectionLabel>Our Properties</SectionLabel>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {ourProperties.map((v) => (
            <VenueCard
              key={v.id}
              venue={v}
              selected={hydrated && state.venueId === v.id}
              onSelect={() => selectVenue(v.id)}
            />
          ))}
        </div>

        {/* VENUE PARTNERS */}
        <SectionLabel>Venue Partner in Jaipur</SectionLabel>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {partners.map((v) => (
            <VenueCard
              key={v.id}
              venue={v}
              selected={hydrated && state.venueId === v.id}
              onSelect={() => selectVenue(v.id)}
            />
          ))}
        </div>

        {/* CUSTOM VENUE ADDRESS */}
        <SectionLabel>Custom Venue Address</SectionLabel>
        <input
          type="text"
          value={hydrated ? state.customVenueAddress : ""}
          onChange={(e) => setCustom(e.target.value)}
          placeholder="Venue name, Locality, Jaipur.."
          className="w-full rounded border border-gray-300 px-4 py-3 text-sm focus:border-gray-600 focus:outline-none"
          style={{ color: INK }}
        />
        <p style={{ color: INK_MUTED }} className="mt-2 text-xs">
          Use this if your event is at a location not listed above.
        </p>
      </div>
    </BuilderLayout>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-8 mb-4 flex items-center gap-4">
      <p style={{ color: INK }} className="text-xs font-semibold uppercase tracking-widest">
        {children}
      </p>
      <div className="h-px flex-1" style={{ backgroundColor: GOLD }} />
    </div>
  );
}

function VenueCard({
  venue,
  selected,
  onSelect,
}: {
  venue: Venue;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className="group relative flex flex-col overflow-hidden text-left"
      style={{
        border: `1px solid ${selected ? GOLD : MB_COLORS.border}`,
        outline: selected ? `1px solid ${GOLD}` : "none",
        borderRadius: 6,
      }}
    >
      {/* Image + category badge */}
      <div className="relative w-full" style={{ height: VENUE_IMG_H }}>
        <Image
          src={venue.image}
          alt={venue.name}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        {venue.category !== "Both" && (
          <span
            className="absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-medium text-white"
            style={{ backgroundColor: "rgba(15,47,59,0.85)" }}
          >
            {venue.category}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3
              style={{ ...serif, color: INK }}
              className="truncate text-lg font-semibold"
            >
              {venue.name}
            </h3>
            {venue.description && (
              <p style={{ color: INK_MUTED }} className="mt-0.5 text-xs">
                {venue.description}
              </p>
            )}
            {venue.capacity && (
              <p style={{ color: INK_MUTED }} className="mt-1 text-xs">
                Capacity {venue.capacity}
              </p>
            )}
            <p style={{ color: GOLD }} className="mt-1 text-xs font-medium">
              {venue.pricingNote}
            </p>
          </div>

          {/* Selection indicator */}
          <div
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
            style={{
              backgroundColor: selected ? GOLD : "transparent",
              border: `1.5px solid ${selected ? GOLD : MB_COLORS.border}`,
            }}
          >
            {selected && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}
