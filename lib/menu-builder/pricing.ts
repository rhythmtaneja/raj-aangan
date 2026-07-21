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
import { getCatalogItemById, getSetMenuById } from "./data";
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

// ─── Sub-flow A — set-menu pricing ─────────────────────────────────────────

/** Per-head base for the selected set menu (0 if none picked). */
export function getSetMenuPerHead(state: BookingState): number {
  return getSetMenuById(state.selectedSetMenuId)?.perPersonPrice ?? 0;
}

/**
 * Set-menu subtotal (pre-GST) = perPersonPrice × guests × eventDays.
 * Raj Aangan is RAEC-owned, so venue logistics are 0 and not added here.
 */
export function getSetMenuSubtotal(state: BookingState): number {
  return getSetMenuPerHead(state) * state.guests * state.eventDays;
}

/** GST-inclusive estimated total for the set-menu flow (used by the sidebar). */
export function getSetMenuEstimatedTotal(state: BookingState): number {
  const subtotal = getSetMenuSubtotal(state);
  return subtotal + (subtotal * GST_PERCENT) / 100;
}

// ─── Sub-flow C — outdoor catalog pricing ──────────────────────────────────

/** Sum of quantity × unit price across all selected catalog items (pre-GST). */
export function getOutdoorSubtotal(state: BookingState): number {
  return Object.entries(state.catalogSelections).reduce((sum, [itemId, qty]) => {
    const item = getCatalogItemById(itemId);
    return sum + (item ? item.price * qty : 0);
  }, 0);
}

/** GST-inclusive estimated total for the outdoor flow (used by the sidebar). */
export function getOutdoorEstimatedTotal(state: BookingState): number {
  const subtotal = getOutdoorSubtotal(state);
  return subtotal + (subtotal * GST_PERCENT) / 100;
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
