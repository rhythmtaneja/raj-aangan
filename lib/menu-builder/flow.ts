import {
  STEPS_OUTDOOR,
  STEPS_VENUE_EVENT,
  STEPS_VENUE_EVENT_CUSTOM,
  type BookingState,
  type Venue,
  type VenueKind,
  type WizardStep,
} from "./types";

export function venueKindOf(venue: Venue | null | undefined): VenueKind {
  if (!venue) return "partner";
  if (venue.venueKind) return venue.venueKind;
  if (venue.id === "raj-aangan") return "raj-aangan";
  if (venue.id === "raj-gharana") return "raj-gharana";
  return "partner";
}

export function getSteps(state: BookingState): WizardStep[] {
  if (state.cateringType === "outdoor") return STEPS_OUTDOOR;
  return state.menuMode === "custom"
    ? STEPS_VENUE_EVENT_CUSTOM
    : STEPS_VENUE_EVENT;
}

export function stepIndexOf(steps: WizardStep[], slug: string): number {
  const i = steps.findIndex((s) => s.slug === slug);
  return i === -1 ? 1 : i + 1;
}

export function menuStepIndex(
  state: BookingState,
  steps: WizardStep[],
): number {
  return stepIndexOf(
    steps,
    state.menuMode === "custom" ? "custom-menu" : "menu",
  );
}
