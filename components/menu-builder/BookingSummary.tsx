"use client";

import { useBooking } from "@/lib/menu-builder/context";
import { useCatalog } from "@/lib/menu-builder/catalog";
import {
  formatINR,
  getDiscountPercent,
  getEstimatedTotal,
  getPerHeadRate,
  getVenueLogisticsPerHead,
} from "@/lib/menu-builder/pricing";
import { MB_COLORS, type StepNumber } from "@/lib/menu-builder/types";

const serif = { fontFamily: "var(--font-cormorant-garamond)" } as const;

// ═══════════════════════════════════════════════════════════════════════════
// ─── TUNE THESE KNOBS ──────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════

const STICKY_TOP = "top-8";              // sticky offset from viewport top
const CARD_BG = MB_COLORS.card;
const CARD_PADDING = "p-8";
const TITLE_COLOR = MB_COLORS.ink;
const LABEL_COLOR = MB_COLORS.inkMuted;
const VALUE_COLOR = MB_COLORS.ink;
const DIVIDER_COLOR = MB_COLORS.borderLight;
const GOLD = MB_COLORS.gold;

// ═══════════════════════════════════════════════════════════════════════════

type Props = {
  currentStep: StepNumber;
};

export default function BookingSummary({ currentStep }: Props) {
  const { state, hydrated } = useBooking();
  const { venues, occasions, dishes } = useCatalog();

  // Extended summary appears from Step 3 onward.
  const showItemsAndTotal = currentStep >= 3;

  const venue = state.venueId ? venues.find((v) => v.id === state.venueId) : null;
  const occasion =
    state.occasions.length > 0
      ? occasions.find((o) => o.id === state.occasions[0])?.label
      : null;

  const perHead = getPerHeadRate(state) + getVenueLogisticsPerHead(state, venues);
  const total = getEstimatedTotal(state, venues);

  return (
    <aside className={`sticky ${STICKY_TOP} h-fit`}>
      <div
        className={`${CARD_PADDING} rounded-sm`}
        style={{ backgroundColor: CARD_BG }}
      >
        {/* Title */}
        <h3
          style={{ ...serif, color: TITLE_COLOR }}
          className="text-[clamp(1.15rem,1.35vw,26px)] font-semibold uppercase tracking-wide"
        >
          Booking Summary
        </h3>
        <p style={{ color: LABEL_COLOR }} className="mt-1 text-xs uppercase tracking-widest">
          Live Preview
        </p>

        {/* Basic info */}
        <div className="mt-6 space-y-3">
          <Row label="Client" value={hydrated ? (state.clientName || "—") : "—"} />
          <Row label="Occasion" value={hydrated ? (occasion || "—") : "—"} />
          <Row label="Date" value={hydrated ? (state.eventDate || "—") : "—"} />
          <Row label="Guests" value={hydrated ? String(state.guests) : "—"} />
        </div>

        <Divider />

        <div className="space-y-3">
          <Row label="Venue" value={hydrated ? (venue?.name || state.customVenueAddress || "—") : "—"} />
          <Row label="Meal" value={hydrated ? (state.mealTypes.join(", ") || "—") : "—"} />
          <Row label="Diet" value={hydrated ? (state.dietaryPreferences.join(", ") || "—") : "—"} />
        </div>

        {/* Selected items (from Step 3+) */}
        {showItemsAndTotal && state.selectedDishes.length > 0 && (
          <>
            <Divider />
            <h4
              style={{ ...serif, color: TITLE_COLOR }}
              className="mb-3 text-sm font-semibold uppercase tracking-wide"
            >
              Selected Item <span style={{ color: LABEL_COLOR }} className="font-normal normal-case">{state.selectedDishes.length} Items</span>
            </h4>
            <ul className="space-y-2">
              {state.selectedDishes.map(({ dishId }) => {
                const dish = dishes.find((d) => d.id === dishId);
                if (!dish) return null;
                return (
                  <li
                    key={dishId}
                    className="flex items-center justify-between text-[clamp(0.8rem,0.85vw,14px)]"
                    style={{ color: VALUE_COLOR }}
                  >
                    <span className="truncate pr-2">
                      {dish.name}
                      {currentStep >= 4 && (
                        <span style={{ color: GOLD }} className="ml-2">/ ₹{dish.price}</span>
                      )}
                    </span>
                    <RemoveButton dishId={dishId} />
                  </li>
                );
              })}
            </ul>
          </>
        )}

        {/* Estimated Total */}
        {showItemsAndTotal && (
          <>
            <Divider />
            <h4
              style={{ ...serif, color: TITLE_COLOR }}
              className="text-sm font-semibold uppercase tracking-wide"
            >
              Estimated Total
            </h4>
            <p
              style={{ ...serif, color: GOLD }}
              className="mt-2 text-[clamp(1.6rem,2vw,36px)] font-semibold leading-none"
            >
              {formatINR(total)}
            </p>
            <p style={{ color: LABEL_COLOR }} className="mt-2 text-xs">
              incl. GST · {formatINR(perHead)}/head
            </p>
            <p style={{ color: LABEL_COLOR }} className="text-xs">
              {state.guests} guests · {state.eventDays} day{state.eventDays > 1 ? "s" : ""}
              {venue?.type === "our-property" ? " · RAEC owned" : venue ? " · Partner venue" : ""}
            </p>
            <p style={{ color: GOLD }} className="mt-1 text-xs">
              Discount {getDiscountPercent()} %
            </p>
          </>
        )}
      </div>
    </aside>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 text-[clamp(0.85rem,0.95vw,16px)]">
      <span style={{ color: LABEL_COLOR }}>{label}</span>
      <span style={{ color: VALUE_COLOR }} className="text-right truncate">{value}</span>
    </div>
  );
}

function Divider() {
  return <div className="my-5 h-px w-full" style={{ backgroundColor: DIVIDER_COLOR }} />;
}

function RemoveButton({ dishId }: { dishId: string }) {
  const { dispatch } = useBooking();
  return (
    <button
      onClick={() => dispatch({ type: "REMOVE_DISH", dishId })}
      className="ml-2 shrink-0 text-lg leading-none hover:opacity-70"
      style={{ color: LABEL_COLOR }}
      aria-label="Remove item"
    >
      ×
    </button>
  );
}
