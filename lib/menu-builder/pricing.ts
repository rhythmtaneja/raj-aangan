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
import { getCatalogItemById, getCustomMenuItemById, getSetMenuById } from "./data";
import type { BookingState, Dish, Venue } from "./types";

// ─── PLACEHOLDER CONSTANTS — replace when client confirms ─────────────────
const GST_PERCENT = 5;
const DEFAULT_DISCOUNT_PERCENT = 30;
// Per-head surcharge for each set-menu dish chosen BEYOND its section's
// chooseCount (an "add-on"). Placeholder — confirm the real add-on price with
// the client (flat per item, or per-dish prices).
const ADDON_PRICE_PER_ITEM = 100;
// ═══════════════════════════════════════════════════════════════════════════

export const getAddOnPricePerItem = (): number => ADDON_PRICE_PER_ITEM;

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

/**
 * Number of add-on dishes across the selected set menu — i.e. picks beyond
 * each section's chooseCount (the first chooseCount, in order, are included).
 */
export function getSetMenuAddOnCount(state: BookingState): number {
  const menu = getSetMenuById(state.selectedSetMenuId);
  if (!menu) return 0;
  return menu.sections.reduce((sum, s) => {
    const chosen = state.setMenuSelections[s.id]?.length ?? 0;
    return sum + Math.max(0, chosen - s.chooseCount);
  }, 0);
}

/** Add-on surcharge per head = #add-on dishes × per-item surcharge. */
export function getSetMenuAddOnPerHead(state: BookingState): number {
  return getSetMenuAddOnCount(state) * ADDON_PRICE_PER_ITEM;
}

/** Per-head for the selected set menu = package base + add-on surcharge. */
export function getSetMenuPerHead(state: BookingState): number {
  const menu = getSetMenuById(state.selectedSetMenuId);
  if (!menu) return 0;
  return menu.perPersonPrice + getSetMenuAddOnPerHead(state);
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

// ─── Venue-event pricing (set package OR custom sum-of-dishes) ──────────────

/**
 * Custom-menu per-head = sum of the selected master-menu items' prices.
 * Prices are null until the client fills them, so this is 0 for now (any
 * priced item contributes once real numbers land — no code change needed).
 */
export function getCustomMenuPerHead(state: BookingState): number {
  return state.selectedDishes.reduce(
    (sum, { dishId }) => sum + (getCustomMenuItemById(dishId)?.price ?? 0),
    0,
  );
}

/**
 * Per-head base for the venue-event flow:
 *   • custom menu → sum of selected master-menu item prices.
 *   • set menu    → package per-person price + add-on surcharge.
 */
export function getVenueEventPerHead(state: BookingState): number {
  return state.menuMode === "custom"
    ? getCustomMenuPerHead(state)
    : getSetMenuPerHead(state);
}

/** (perHead + venue logistics) × guests × eventDays — pre-GST. */
export function getVenueEventSubtotal(state: BookingState, venues: Venue[]): number {
  const perHead = getVenueEventPerHead(state) + getVenueLogisticsPerHead(state, venues);
  return perHead * state.guests * state.eventDays;
}

/** GST-inclusive venue-event total (used by the sidebar). */
export function getVenueEventEstimatedTotal(state: BookingState, venues: Venue[]): number {
  const subtotal = getVenueEventSubtotal(state, venues);
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
