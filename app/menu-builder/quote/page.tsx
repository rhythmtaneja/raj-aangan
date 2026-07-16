// ══════════════════════════════════════════════════════════════════
// PATH IN REPO: app/menu-builder/quote/page.tsx
// ⚠️  RENAME THIS FILE TO page.tsx BEFORE PLACING IN THE FOLDER
// ══════════════════════════════════════════════════════════════════
// CHANGES vs previous version:
//   • New "Start Over" button below the action row. Confirms with a
//     native dialog, then dispatches RESET and navigates to Step 1.
// ══════════════════════════════════════════════════════════════════

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BuilderLayout from "@/components/menu-builder/BuilderLayout";
import { useBooking } from "@/lib/menu-builder/context";
import { useCatalog } from "@/lib/menu-builder/catalog";
import {
  CUTLERY_OPTIONS,
  LIVE_COUNTERS,
  PRESENTATION_STYLES,
  STALL_THEMES,
} from "@/lib/menu-builder/config";
import {
  formatINR,
  getDiscountAmount,
  getDiscountPercent,
  getEstimatedTotal,
  getGstPercent,
  getPerHeadRate,
  getVenueLogisticsPerHead,
} from "@/lib/menu-builder/pricing";
import { MB_COLORS } from "@/lib/menu-builder/types";

const serif = { fontFamily: "var(--font-cormorant-garamond)" } as const;

// ═══════════════════════════════════════════════════════════════════════════
// ─── TUNE THESE KNOBS ──────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════

const CARD_BG        = MB_COLORS.card;
const INK            = MB_COLORS.ink;
const INK_MUTED      = MB_COLORS.inkMuted;
const GOLD           = MB_COLORS.gold;
const CARD_PADDING   = "p-8 md:p-10";

const START_OVER_CONFIRM_MSG =
  "Start over? All your selections will be cleared.";

// ═══════════════════════════════════════════════════════════════════════════

export default function Step5QuotePage() {
  const { state, dispatch, hydrated } = useBooking();
  const { venues, occasions, dishes } = useCatalog();
  const router = useRouter();
  const [toast, setToast] = useState<string | null>(null);

  const venue = state.venueId ? venues.find((v) => v.id === state.venueId) : null;
  const occasion =
    state.occasions.length > 0
      ? state.occasions.map((id) => occasions.find((o) => o.id === id)?.label).join(", ")
      : "—";

  const subtotal = getEstimatedTotal(state, venues);
  const gstAmt   = subtotal * (getGstPercent() / 100);
  const discAmt  = getDiscountAmount(state, venues);
  const total    = subtotal + gstAmt - discAmt;

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const handleStartOver = () => {
    // Confirm before wiping everything.
    if (typeof window !== "undefined" && !window.confirm(START_OVER_CONFIRM_MSG)) {
      return;
    }
    dispatch({ type: "RESET" });
    router.push("/menu-builder/client");
  };

  return (
    <BuilderLayout
      currentStep={5}
      backHref="/menu-builder/menu"
    >
      <div className={CARD_PADDING} style={{ backgroundColor: CARD_BG }}>
        <h2
          style={{ ...serif, color: INK }}
          className="text-[clamp(1.6rem,2.3vw,42px)] font-semibold"
        >
          Review & Quote
        </h2>
        <p style={{ color: INK_MUTED }} className="mt-1 text-sm">
          Everything you&apos;ve chosen — review before generating the final quote.
        </p>

        <SectionTitle>Client & Event</SectionTitle>
        <KV label="Client"     value={hydrated ? (state.clientName    || "—") : "—"} />
        <KV label="Contact"    value={hydrated ? (state.contactPhone  || "—") : "—"} />
        <KV label="Occasion"   value={hydrated ? occasion              : "—"} />
        <KV label="Date"       value={hydrated ? (state.eventDate     || "—") : "—"} />
        <KV label="Duration"   value={`${state.eventDays} day${state.eventDays > 1 ? "s" : ""}`} />
        <KV label="Guests"     value={hydrated ? String(state.guests) : "—"} />
        <KV label="Meal Types" value={hydrated ? (state.mealTypes.join(", ")          || "—") : "—"} />
        <KV label="Dietary"    value={hydrated ? (state.dietaryPreferences.join(", ") || "—") : "—"} />

        <SectionTitle>Venue</SectionTitle>
        <KV
          label="Selected"
          value={hydrated ? (venue?.name || state.customVenueAddress || "—") : "—"}
        />
        {venue?.description && <KV label="Description" value={venue.description} />}
        {venue && <KV label="Pricing" value={venue.pricingNote} />}

        <SectionTitle>Selected Dishes ({state.selectedDishes.length})</SectionTitle>
        {state.selectedDishes.length === 0 ? (
          <p style={{ color: INK_MUTED }} className="text-sm">
            No dishes selected yet. Go back to <strong>Menu</strong> to pick some.
          </p>
        ) : (
          <ul className="divide-y" style={{ borderColor: MB_COLORS.borderLight }}>
            {state.selectedDishes.map(({ dishId, mealType }) => {
              const dish = dishes.find((d) => d.id === dishId);
              if (!dish) return null;
              return (
                <li key={dishId} className="flex items-center justify-between py-2 text-sm">
                  <div>
                    <p style={{ color: INK }} className="font-medium">{dish.name}</p>
                    <p style={{ color: INK_MUTED }} className="text-xs">
                      {mealType} · {dish.subtitle}
                    </p>
                  </div>
                  <span style={{ color: GOLD }} className="font-medium">₹{dish.price}</span>
                </li>
              );
            })}
          </ul>
        )}

        <SectionTitle>Presentation & Add-ons</SectionTitle>
        <AddonList
          label="Cutlery"
          ids={hydrated ? state.cutleryIds : []}
          catalog={CUTLERY_OPTIONS}
        />
        <AddonList
          label="Presentation Style"
          ids={hydrated ? state.presentationStyleIds : []}
          catalog={PRESENTATION_STYLES}
        />
        <AddonList
          label="Stall Themes"
          ids={hydrated ? state.stallThemeIds : []}
          catalog={STALL_THEMES}
        />
        <AddonList
          label="Live Counters"
          ids={hydrated ? state.liveCounterIds : []}
          catalog={LIVE_COUNTERS}
        />

        <SectionTitle>Estimated Total</SectionTitle>
        <div className="space-y-1.5 text-sm">
          <KVRow
            label={`Per-head base (${state.budgetTier || "—"})`}
            value={formatINR(getPerHeadRate(state))}
          />
          <KVRow
            label={`Venue logistics /head`}
            value={formatINR(getVenueLogisticsPerHead(state, venues))}
          />
          <KVRow
            label={`× ${state.guests} guests × ${state.eventDays} day${state.eventDays > 1 ? "s" : ""}`}
            value={formatINR(subtotal)}
          />
          <KVRow label={`GST (${getGstPercent()}%)`} value={formatINR(gstAmt)} />
          <KVRow
            label={`Discount (${getDiscountPercent()}%)`}
            value={"− " + formatINR(discAmt)}
            valueColor={GOLD}
          />
          <div className="mt-3 border-t pt-3" style={{ borderColor: MB_COLORS.border }}>
            <KVRow
              label="Estimated total"
              value={formatINR(total)}
              bold
              valueColor={GOLD}
            />
          </div>
        </div>

        {/* Primary action buttons — placeholder stubs */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <ActionButton
            label="Generate PDF"
            onClick={() => showToast("PDF generation coming soon.")}
          />
          <ActionButton
            label="Share Link"
            onClick={() => {
              if (typeof navigator !== "undefined" && navigator.clipboard) {
                navigator.clipboard.writeText(window.location.href);
                showToast("Link copied to clipboard.");
              }
            }}
          />
          <ActionButton
            label="WhatsApp"
            onClick={() => showToast("WhatsApp share coming soon.")}
          />
          <ActionButton
            label="Save Booking"
            onClick={() => showToast("Booking saved locally.")}
            primary
          />
        </div>

        {/* Start Over — distinct row, with warning styling */}
        <div
          className="mt-6 flex justify-center border-t pt-6"
          style={{ borderColor: MB_COLORS.borderLight }}
        >
          <button
            onClick={handleStartOver}
            className="inline-flex items-center gap-2 rounded-full border px-6 py-2.5 text-sm transition-colors hover:bg-gray-50"
            style={{ borderColor: MB_COLORS.border, color: INK_MUTED }}
          >
            <ResetIcon />
            Start Over
          </button>
        </div>

        {toast && (
          <div
            className="mt-4 rounded border px-4 py-2 text-sm"
            style={{ backgroundColor: `${GOLD}20`, borderColor: GOLD, color: INK }}
          >
            {toast}
          </div>
        )}
      </div>
    </BuilderLayout>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-8 mb-3 flex items-center gap-4">
      <h3
        style={{ ...serif, color: INK }}
        className="text-[clamp(1.1rem,1.35vw,24px)] font-semibold"
      >
        {children}
      </h3>
      <div className="h-px flex-1" style={{ backgroundColor: GOLD }} />
    </div>
  );
}

function KV({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between py-1 text-sm">
      <span style={{ color: INK_MUTED }}>{label}</span>
      <span style={{ color: INK }} className="text-right">{value}</span>
    </div>
  );
}

function KVRow({
  label,
  value,
  bold,
  valueColor = INK,
}: {
  label: string;
  value: string;
  bold?: boolean;
  valueColor?: string;
}) {
  return (
    <div className="flex items-baseline justify-between">
      <span style={{ color: INK_MUTED }} className={bold ? "font-semibold text-base" : ""}>
        {label}
      </span>
      <span
        style={{ color: valueColor }}
        className={bold ? "font-semibold text-lg" : "font-medium"}
      >
        {value}
      </span>
    </div>
  );
}

function AddonList({
  label,
  ids,
  catalog,
}: {
  label: string;
  ids: string[];
  catalog: { id: string; name: string }[];
}) {
  const names = ids
    .map((id) => catalog.find((c) => c.id === id)?.name)
    .filter(Boolean) as string[];
  return <KV label={label} value={names.length > 0 ? names.join(", ") : "—"} />;
}

function ActionButton({
  label,
  onClick,
  primary,
}: {
  label: string;
  onClick: () => void;
  primary?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-full border px-4 py-3 text-sm font-medium transition-colors"
      style={{
        backgroundColor: primary ? GOLD : "transparent",
        color: primary ? "#ffffff" : INK,
        borderColor: primary ? GOLD : MB_COLORS.border,
      }}
    >
      {label}
    </button>
  );
}

function ResetIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
      <path d="M3 21v-5h5" />
    </svg>
  );
}
