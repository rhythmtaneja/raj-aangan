// ══════════════════════════════════════════════════════════════════
// PATH IN REPO: lib/menu-builder/pricing.ts
// ══════════════════════════════════════════════════════════════════
// Placeholder pricing math. Structure is unchanged; the numbers now come
// from Sanity-managed data passed in by the caller:
//   • Venue logistics per-head  → venue.logisticsPerHead (Sanity)
//   • Budget tier per-head      → BUDGET_TIERS (still static config —
//                                 no Sanity schema for tiers this phase)
//   • GST % / discount %        → still placeholder constants below
// Swap the remaining placeholders once the client confirms real values.
// ═══════════════════════════════════════════════════════════════════════════

import { BUDGET_TIERS } from "./config";
import type { BookingState, Dish, Venue } from "./types";

// ─── PLACEHOLDER CONSTANTS — replace when client confirms ─────────────────
const GST_PERCENT = 5;
const DEFAULT_DISCOUNT_PERCENT = 30;
// ═══════════════════════════════════════════════════════════════════════════

/** Look up the per-head rate for the selected budget tier. */
export function getPerHeadRate(state: BookingState): number {
  if (!state.budgetTier) return 0;
  const tier = BUDGET_TIERS.find((t) => t.id === state.budgetTier);
  return tier?.perHead ?? 0;
}

/**
 * Per-head venue logistics surcharge. Uses the Sanity `logisticsPerHead`
 * field when present, otherwise falls back to parsing the pricingNote
 * (e.g. "+ 25/ Head Logistic" → 25).
 */
export function getVenueLogisticsPerHead(
  state: BookingState,
  venues: Venue[],
): number {
  if (!state.venueId) return 0;
  const venue = venues.find((v) => v.id === state.venueId);
  if (!venue) return 0;
  if (typeof venue.logisticsPerHead === "number") return venue.logisticsPerHead;
  const match = venue.pricingNote.match(/\+\s*(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

/** Sum of prices for all selected dishes. Useful for the summary. */
export function getSelectedDishesSubtotal(
  state: BookingState,
  dishes: Dish[],
): number {
  return state.selectedDishes.reduce((sum, { dishId }) => {
    const dish = dishes.find((d) => d.id === dishId);
    return sum + (dish?.price ?? 0);
  }, 0);
}

/**
 * Estimated total = (perHead + venueLogistics) × guests × eventDays.
 * Matches the design ballpark (e.g. 300 × 1 × ₹1,250 ≈ ₹4,42,500 with GST).
 */
export function getEstimatedTotal(state: BookingState, venues: Venue[]): number {
  const perHead = getPerHeadRate(state) + getVenueLogisticsPerHead(state, venues);
  return perHead * state.guests * state.eventDays;
}

/** Subtotal + GST. */
export function getTotalWithGst(state: BookingState, venues: Venue[]): number {
  const subtotal = getEstimatedTotal(state, venues);
  return subtotal + (subtotal * GST_PERCENT) / 100;
}

/** Applied discount amount. */
export function getDiscountAmount(state: BookingState, venues: Venue[]): number {
  const subtotal = getEstimatedTotal(state, venues);
  return (subtotal * DEFAULT_DISCOUNT_PERCENT) / 100;
}

export function getDiscountPercent(): number {
  return DEFAULT_DISCOUNT_PERCENT;
}

export function getGstPercent(): number {
  return GST_PERCENT;
}

// ─── Formatting ────────────────────────────────────────────────────────────

/** Format a number as Indian Rupees, e.g. 442500 → "₹4,42,500". */
export function formatINR(n: number): string {
  return "₹" + Math.round(n).toLocaleString("en-IN");
}
