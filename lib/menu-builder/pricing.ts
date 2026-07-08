// ══════════════════════════════════════════════════════════════════
// PATH IN REPO: lib/menu-builder/pricing.ts
// ══════════════════════════════════════════════════════════════════
//
// Placeholder pricing math. All numbers here are illustrative — swap
// in real values once client confirms:
//   • Real per-head rates per budget tier (currently in data.ts)
//   • Real venue logistics rates
//   • GST %
//   • Discount rules
// ═══════════════════════════════════════════════════════════════════════════

import { BUDGET_TIERS, DISHES, VENUES } from "./data";
import type { BookingState } from "./types";

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
 * Parse the venue's pricingNote for a "+ N/ Head" surcharge (e.g. "+ 25/ Head Logistic" → 25).
 * "Included in base rate" venues return 0.
 */
export function getVenueLogisticsPerHead(state: BookingState): number {
  if (!state.venueId) return 0;
  const venue = VENUES.find((v) => v.id === state.venueId);
  if (!venue) return 0;
  const match = venue.pricingNote.match(/\+\s*(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

/** Sum of prices for all selected dishes. Currently not used in the primary total, but useful for the summary. */
export function getSelectedDishesSubtotal(state: BookingState): number {
  return state.selectedDishes.reduce((sum, { dishId }) => {
    const dish = DISHES.find((d) => d.id === dishId);
    return sum + (dish?.price ?? 0);
  }, 0);
}

/**
 * Estimated total = (perHead + venueLogistics) × guests × eventDays.
 * This matches the design ballpark (e.g. 300 × 1 × ₹1,250 ≈ ₹4,42,500 with GST).
 */
export function getEstimatedTotal(state: BookingState): number {
  const perHead = getPerHeadRate(state) + getVenueLogisticsPerHead(state);
  return perHead * state.guests * state.eventDays;
}

/** Subtotal + GST. */
export function getTotalWithGst(state: BookingState): number {
  const subtotal = getEstimatedTotal(state);
  return subtotal + (subtotal * GST_PERCENT) / 100;
}

/** Applied discount amount. */
export function getDiscountAmount(state: BookingState): number {
  const subtotal = getEstimatedTotal(state);
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
