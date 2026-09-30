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

export type PricingData = {
  settings: PricingSettings;
  getSetMenu: (id: string | null) => SetMenu | undefined;
  getCustomItem: (id: string) => CustomMenuItem | undefined;
  getCatalogItem: (id: string) => CatalogItem | undefined;
  getCatalogSelection: (id: string) => CatalogSelection | undefined;
  venues: Venue[];
};

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

export function getAddOnPricePerItem(
  state: BookingState,
  data: PricingData,
): number {
  const menu = data.getSetMenu(state.selectedSetMenuId);
  const override = menu?.addOnPricePerItem;
  return typeof override === "number"
    ? override
    : data.settings.addOnPricePerItem;
}

export function getSetMenuAddOnCount(
  state: BookingState,
  data: PricingData,
): number {
  const menu = data.getSetMenu(state.selectedSetMenuId);
  if (!menu) return 0;
  return menu.sections.reduce((sum, s) => {
    const chosen = state.setMenuSelections[s.id]?.length ?? 0;
    return sum + Math.max(0, chosen - s.chooseCount);
  }, 0);
}

export function getSetMenuAddOnPerHead(
  state: BookingState,
  data: PricingData,
): number {
  return getSetMenuAddOnCount(state, data) * getAddOnPricePerItem(state, data);
}

export function getSetMenuPerHead(
  state: BookingState,
  data: PricingData,
): number {
  const menu = data.getSetMenu(state.selectedSetMenuId);
  if (!menu) return 0;
  return menu.perPersonPrice + getSetMenuAddOnPerHead(state, data);
}

export function getCustomMenuPerHead(
  state: BookingState,
  data: PricingData,
): number {
  return state.selectedDishes.reduce(
    (sum, { dishId }) => sum + (data.getCustomItem(dishId)?.price ?? 0),
    0,
  );
}

export function getVenueEventPerHead(
  state: BookingState,
  data: PricingData,
): number {
  return state.menuMode === "custom"
    ? getCustomMenuPerHead(state, data)
    : getSetMenuPerHead(state, data);
}

export function getVenueEventSubtotal(
  state: BookingState,
  data: PricingData,
): number {
  const perHead =
    getVenueEventPerHead(state, data) +
    getVenueLogisticsPerHead(state, data.venues);
  return perHead * state.guests * state.eventDays;
}

export function getVenueEventEstimatedTotal(
  state: BookingState,
  data: PricingData,
): number {
  return withGst(getVenueEventSubtotal(state, data), data.settings);
}

export type OutdoorLine = CatalogSelection & { qty: number; lineTotal: number };

export function getOutdoorLines(
  state: BookingState,
  data: PricingData,
): OutdoorLine[] {
  return Object.entries(state.catalogSelections)
    .filter(([, qty]) => qty > 0)
    .map(([id, qty]) => {
      const selection = data.getCatalogSelection(id);
      if (!selection) return null;
      return { ...selection, qty, lineTotal: (selection.unitPrice ?? 0) * qty };
    })
    .filter((line): line is OutdoorLine => line !== null);
}

export function getOutdoorSubtotal(
  state: BookingState,
  data: PricingData,
): number {
  return getOutdoorLines(state, data).reduce(
    (sum, line) => sum + line.lineTotal,
    0,
  );
}

export function getOutdoorEstimatedTotal(
  state: BookingState,
  data: PricingData,
): number {
  return withGst(getOutdoorSubtotal(state, data), data.settings);
}

export const getGstAmount = (
  subtotal: number,
  settings: PricingSettings,
): number => (subtotal * settings.gstPercent) / 100;

export const withGst = (subtotal: number, settings: PricingSettings): number =>
  subtotal + getGstAmount(subtotal, settings);

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

export const getDiscountAmount = (
  subtotal: number,
  percentOff: number,
): number => (subtotal * percentOff) / 100;

export function formatINR(n: number): string {
  return "₹" + Math.round(n).toLocaleString("en-IN");
}
