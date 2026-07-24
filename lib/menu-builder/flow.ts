// ══════════════════════════════════════════════════════════════════
// PATH IN REPO: lib/menu-builder/flow.ts
// ══════════════════════════════════════════════════════════════════
// Pure helpers that decide which sub-flow's step-set the ProgressBar renders.
// The venue-event flow is now the same for every venue (fixed set menus, with
// an optional custom builder that lives inside the Menu step), so routing no
// longer branches on venue kind. `venueKindOf` is kept for pricing/labels.
// ═══════════════════════════════════════════════════════════════════════════

import {
  STEPS_OUTDOOR,
  STEPS_VENUE_EVENT,
  type BookingState,
  type Venue,
  type VenueKind,
  type WizardStep,
} from "./types";

/**
 * The routing kind for a venue. Prefers the Sanity-managed `venueKind` field;
 * falls back to inferring from the slug/id (used only for pricing labels now).
 */
export function venueKindOf(venue: Venue | null | undefined): VenueKind {
  if (!venue) return "partner";
  if (venue.venueKind) return venue.venueKind;
  if (venue.id === "raj-aangan") return "raj-aangan";
  if (venue.id === "raj-gharana") return "raj-gharana";
  return "partner";
}

/**
 * The step-set for the current state.
 *   • outdoor      → STEPS_OUTDOOR
 *   • venue-event  → STEPS_VENUE_EVENT (same for all venues)
 */
export function getSteps(state: BookingState): WizardStep[] {
  return state.cateringType === "outdoor" ? STEPS_OUTDOOR : STEPS_VENUE_EVENT;
}

/** 1-based index of a slug within a step-set (1 if not found). */
export function stepIndexOf(steps: WizardStep[], slug: string): number {
  const i = steps.findIndex((s) => s.slug === slug);
  return i === -1 ? 1 : i + 1;
}
