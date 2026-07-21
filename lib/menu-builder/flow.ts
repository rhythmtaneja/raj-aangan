// ══════════════════════════════════════════════════════════════════
// PATH IN REPO: lib/menu-builder/flow.ts
// ══════════════════════════════════════════════════════════════════
// Pure helpers that decide which of the three sub-flows the wizard is in,
// and therefore which step-set the ProgressBar should render. No React here
// so both client pages and (later) server code can import it.
// ═══════════════════════════════════════════════════════════════════════════

import {
  STEPS_OUTDOOR,
  STEPS_VENUE_EVENT_CUISINE,
  STEPS_VENUE_EVENT_SET_MENU,
  type BookingState,
  type Venue,
  type VenueKind,
  type WizardStep,
} from "./types";

/**
 * The routing kind for a venue. Prefers the Sanity-managed `venueKind` field;
 * falls back to inferring from the slug/id so partner venues and our other
 * property still route correctly before Phase 8 wires the field.
 */
export function venueKindOf(venue: Venue | null | undefined): VenueKind {
  if (!venue) return "partner";
  if (venue.venueKind) return venue.venueKind;
  if (venue.id === "raj-aangan") return "raj-aangan";
  if (venue.id === "raj-gharana") return "raj-gharana";
  return "partner";
}

/** True when the current selection resolves to the Raj Aangan set-menu flow. */
export function isSetMenuFlow(state: BookingState, venues: Venue[]): boolean {
  if (state.cateringType !== "venue-event") return false;
  const venue = state.venueId ? venues.find((v) => v.id === state.venueId) : null;
  return venueKindOf(venue) === "raj-aangan";
}

/**
 * The step-set for the current state.
 *   • outdoor                         → STEPS_OUTDOOR
 *   • venue-event + Raj Aangan venue  → STEPS_VENUE_EVENT_SET_MENU
 *   • venue-event + anything else     → STEPS_VENUE_EVENT_CUISINE (default)
 *
 * Before a venue is chosen we default venue-event to the fuller cuisine set,
 * then collapse to the 4-step set-menu set once Raj Aangan is selected.
 */
export function getSteps(state: BookingState, venues: Venue[]): WizardStep[] {
  if (state.cateringType === "outdoor") return STEPS_OUTDOOR;
  if (isSetMenuFlow(state, venues)) return STEPS_VENUE_EVENT_SET_MENU;
  return STEPS_VENUE_EVENT_CUISINE;
}

/** 1-based index of a slug within a step-set (0 if not found → renders nothing lit). */
export function stepIndexOf(steps: WizardStep[], slug: string): number {
  const i = steps.findIndex((s) => s.slug === slug);
  return i === -1 ? 1 : i + 1;
}
