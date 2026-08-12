// ══════════════════════════════════════════════════════════════════
// PATH IN REPO: lib/menu-builder/pricing.ts
// ══════════════════════════════════════════════════════════════════
// All quote math. Nothing is hardcoded any more — every function takes a
// `PricingData` bundle built from the catalog (Sanity, or the code fallback
// when Sanity is empty):
//
//   settings          → Studio: Menu Builder → Pricing & Quote Settings
//                       (GST %, add-on surcharge, discount codes, wording)
//   getSetMenu        → Studio: Set Menus (per-person price, choose-N)
//   getCustomItem     → Studio: À-la-carte Menu (price per dish)
//   getCatalogItem    → Studio: Outdoor Catering → Catalog Items
//   venues            → Studio: Venues (logisticsPerHead)
//
// Client components get this bundle from useCatalog() — see usePricingData()
// in catalog-hooks.ts.
// ═══════════════════════════════════════════════════════════════════════════

import type { CatalogSelection } from "./menu-utils";
import type {
  BookingState,
  CatalogItem,
  CustomMenuItem,
  DiscountCode,
  PricingSettings,
  SetMenu,
  Venue,
} from "./types";

/** Everything the math needs, resolved from the catalog. */
export type PricingData = {
  settings: PricingSettings;
  getSetMenu: (id: string | null) => SetMenu | undefined;
  getCustomItem: (id: string) => CustomMenuItem | undefined;
  getCatalogItem: (id: string) => CatalogItem | undefined;
  getCatalogSelection: (id: string) => CatalogSelection | undefined;
  venues: Venue[];
};

// ─── Venue ─────────────────────────────────────────────────────────────────

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

// ─── Set menus ─────────────────────────────────────────────────────────────

/** The add-on surcharge for the selected menu (menu override → global default). */
export function getAddOnPricePerItem(state: BookingState, data: PricingData): number {
  const menu = data.getSetMenu(state.selectedSetMenuId);
  const override = menu?.addOnPricePerItem;
  return typeof override === "number" ? override : data.settings.addOnPricePerItem;
}

/**
 * Number of add-on dishes across the selected set menu — i.e. picks beyond
 * each course's chooseCount (the first chooseCount, in order, are included).
 */
export function getSetMenuAddOnCount(state: BookingState, data: PricingData): number {
  const menu = data.getSetMenu(state.selectedSetMenuId);
  if (!menu) return 0;
  return menu.sections.reduce((sum, s) => {
    const chosen = state.setMenuSelections[s.id]?.length ?? 0;
    return sum + Math.max(0, chosen - s.chooseCount);
  }, 0);
}

/** Add-on surcharge per head = #add-on dishes × per-item surcharge. */
export function getSetMenuAddOnPerHead(state: BookingState, data: PricingData): number {
  return getSetMenuAddOnCount(state, data) * getAddOnPricePerItem(state, data);
}

/** Per-head for the selected set menu = package base + add-on surcharge. */
export function getSetMenuPerHead(state: BookingState, data: PricingData): number {
  const menu = data.getSetMenu(state.selectedSetMenuId);
  if (!menu) return 0;
  return menu.perPersonPrice + getSetMenuAddOnPerHead(state, data);
}

// ─── Venue-event pricing (set package OR custom sum-of-dishes) ──────────────

/**
 * Custom-menu per-head = sum of the selected à-la-carte dishes' prices.
 * Dishes with no price yet contribute 0, so the quote stays honest until the
 * client fills prices in Studio.
 */
export function getCustomMenuPerHead(state: BookingState, data: PricingData): number {
  return state.selectedDishes.reduce(
    (sum, { dishId }) => sum + (data.getCustomItem(dishId)?.price ?? 0),
    0,
  );
}

/**
 * Per-head base for the venue-event flow:
 *   • custom menu → sum of selected à-la-carte dish prices.
 *   • set menu    → package per-person price + add-on surcharge.
 */
export function getVenueEventPerHead(state: BookingState, data: PricingData): number {
  return state.menuMode === "custom"
    ? getCustomMenuPerHead(state, data)
    : getSetMenuPerHead(state, data);
}

/** (perHead + venue logistics) × guests × eventDays — pre-GST, pre-discount. */
export function getVenueEventSubtotal(state: BookingState, data: PricingData): number {
  const perHead =
    getVenueEventPerHead(state, data) + getVenueLogisticsPerHead(state, data.venues);
  return perHead * state.guests * state.eventDays;
}

/** GST-inclusive venue-event total (used by the sidebar). */
export function getVenueEventEstimatedTotal(
  state: BookingState,
  data: PricingData,
): number {
  return withGst(getVenueEventSubtotal(state, data), data.settings);
}

// ─── Sub-flow C — outdoor catalog pricing ──────────────────────────────────

/**
 * The order as priced lines. Cart keys are box/packet ids (a bare section id
 * still resolves — see catalogSelectionMap). An "on request" line has a null
 * unit price and a lineTotal of 0: it stays on the quote, it just carries no
 * rupee value until the client prices it.
 */
export type OutdoorLine = CatalogSelection & { qty: number; lineTotal: number };

export function getOutdoorLines(state: BookingState, data: PricingData): OutdoorLine[] {
  return Object.entries(state.catalogSelections)
    .filter(([, qty]) => qty > 0)
    .map(([id, qty]) => {
      const selection = data.getCatalogSelection(id);
      if (!selection) return null;
      return { ...selection, qty, lineTotal: (selection.unitPrice ?? 0) * qty };
    })
    .filter((line): line is OutdoorLine => line !== null);
}

/** Sum of quantity × unit price across all selected boxes (pre-GST). */
export function getOutdoorSubtotal(state: BookingState, data: PricingData): number {
  return getOutdoorLines(state, data).reduce((sum, line) => sum + line.lineTotal, 0);
}

/** GST-inclusive estimated total for the outdoor flow (used by the sidebar). */
export function getOutdoorEstimatedTotal(
  state: BookingState,
  data: PricingData,
): number {
  return withGst(getOutdoorSubtotal(state, data), data.settings);
}

// ─── Tax + discounts ───────────────────────────────────────────────────────

export const getGstAmount = (subtotal: number, settings: PricingSettings): number =>
  (subtotal * settings.gstPercent) / 100;

export const withGst = (subtotal: number, settings: PricingSettings): number =>
  subtotal + getGstAmount(subtotal, settings);

/**
 * Look up a guest-entered discount code. Returns the matching code only when
 * it is active, in date, and the booking meets its minimum guest count.
 */
export function findDiscountCode(
  code: string,
  state: BookingState,
  settings: PricingSettings,
  today = new Date(),
): DiscountCode | null {
  const wanted = code.trim().toLowerCase();
  if (!wanted) return null;
  const match = settings.discountCodes.find(
    (c) => c.code.trim().toLowerCase() === wanted,
  );
  if (!match || !match.isActive) return null;
  if (match.minGuests > 0 && state.guests < match.minGuests) return null;
  if (match.expiresOn) {
    const expiry = new Date(`${match.expiresOn}T23:59:59`);
    if (!Number.isNaN(expiry.getTime()) && expiry < today) return null;
  }
  return match;
}

/** Discount value in ₹ off a pre-GST subtotal. */
export const getDiscountAmount = (subtotal: number, percentOff: number): number =>
  (subtotal * percentOff) / 100;

// ─── Formatting ────────────────────────────────────────────────────────────

/** Format a number as Indian Rupees, e.g. 442500 → "₹4,42,500". */
export function formatINR(n: number): string {
  return "₹" + Math.round(n).toLocaleString("en-IN");
}
