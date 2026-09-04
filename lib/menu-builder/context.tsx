// ══════════════════════════════════════════════════════════════════
// PATH IN REPO: lib/menu-builder/context.tsx
// ══════════════════════════════════════════════════════════════════
// Booking state + reducer for the three-sub-flow wizard. New actions cover
// the set-menu picker (Sub-flow A), the presentation step (Sub-flow B) and
// the outdoor catalog / packaging (Sub-flow C), plus a full RESET_WIZARD.
// ═══════════════════════════════════════════════════════════════════════════

"use client";

import { createContext, useContext, useEffect, useReducer, useState, type ReactNode } from "react";
import {
  DIETARY_PREFERENCES,
  EMPTY_COUNTER_CONFIG,
  INITIAL_STATE,
  type BookingState,
  type CounterConfig,
  type DietaryPreference,
  type MealType,
} from "./types";

// Stored state can predate an option being retired — most notably "Non Veg",
// which used to be a Dietary Preference pill. A visitor who picked it before it
// was removed keeps it in localStorage forever, so it re-appears in the Booking
// Summary / Quote "Diet" row even though the pill is long gone. Drop anything
// no longer in DIETARY_PREFERENCES, and fall back to the default if that empties
// the list.
function sanitizeDietaryPreferences(stored: unknown): DietaryPreference[] {
  if (!Array.isArray(stored)) return INITIAL_STATE.dietaryPreferences;
  const valid = stored.filter((d): d is DietaryPreference =>
    (DIETARY_PREFERENCES as readonly string[]).includes(d as string),
  );
  return valid.length > 0 ? valid : INITIAL_STATE.dietaryPreferences;
}

// ─── Actions ───────────────────────────────────────────────────────────────

type CounterSingleField = "cutlery" | "presentationStyle" | "stallTheme";

export type Action =
  | { type: "SET_FIELD"; field: keyof BookingState; value: BookingState[keyof BookingState] }
  | { type: "TOGGLE_ARRAY"; field: "occasions" | "mealTypes" | "dietaryPreferences" | "selectedCuisineCategories"; value: string }
  | { type: "ADD_DISH"; dishId: string; mealType: MealType }
  | { type: "REMOVE_DISH"; dishId: string }
  // Sub-flow A — set menu
  | { type: "SET_SET_MENU"; setMenuId: string }
  | { type: "TOGGLE_SET_MENU_DISH"; sectionId: string; optionId: string; chooseCount: number }
  | { type: "CLEAR_SET_MENU_SELECTIONS" }
  // Sub-flow B — presentation / live counters (per-counter)
  | { type: "TOGGLE_LIVE_COUNTER"; counterId: string }
  | { type: "SET_COUNTER_SINGLE"; counterId: string; field: CounterSingleField; value: string }
  | { type: "TOGGLE_COUNTER_DESIGN"; counterId: string; value: string }
  // Sub-flow C — outdoor catalog
  | { type: "SET_CATALOG_QUANTITY"; itemId: string; quantity: number }
  | { type: "SET_PACKAGING_STYLE"; styleId: string }
  | { type: "SET_DELIVERY_ADDRESS"; value: string }
  | { type: "REPLACE_STATE"; state: BookingState }
  | { type: "RESET" }
  | { type: "RESET_WIZARD" };

/** The stored config for one live counter, or a blank one if it has none yet. */
function counterConfigOf(state: BookingState, counterId: string): CounterConfig {
  return state.presentationChoices.counterConfigs[counterId] ?? { ...EMPTY_COUNTER_CONFIG };
}

function withCounterConfig(
  state: BookingState,
  counterId: string,
  config: CounterConfig,
): BookingState {
  return {
    ...state,
    presentationChoices: {
      ...state.presentationChoices,
      counterConfigs: { ...state.presentationChoices.counterConfigs, [counterId]: config },
    },
  };
}

function reducer(state: BookingState, action: Action): BookingState {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };

    case "TOGGLE_ARRAY": {
      const current = state[action.field] as string[];
      const next = current.includes(action.value)
        ? current.filter((v) => v !== action.value)
        : [...current, action.value];
      return { ...state, [action.field]: next };
    }

    case "ADD_DISH":
      if (state.selectedDishes.some((d) => d.dishId === action.dishId)) return state;
      return {
        ...state,
        selectedDishes: [
          ...state.selectedDishes,
          { dishId: action.dishId, mealType: action.mealType },
        ],
      };

    case "REMOVE_DISH":
      return {
        ...state,
        selectedDishes: state.selectedDishes.filter((d) => d.dishId !== action.dishId),
      };

    // ─── Sub-flow A — set menu ─────────────────────────────────────────────
    case "SET_SET_MENU":
      if (state.selectedSetMenuId === action.setMenuId) {
        return { ...state, menuMode: "set" };
      }
      // Switching menus clears prior section picks (they belong to the old menu).
      return {
        ...state,
        selectedSetMenuId: action.setMenuId,
        setMenuSelections: {},
        menuMode: "set",
      };

    case "TOGGLE_SET_MENU_DISH": {
      // Soft cap: picks beyond chooseCount are ALLOWED — they become paid
      // add-ons (the first chooseCount, in selection order, are included in the
      // package; the rest surcharge). So no blocking here; order is preserved.
      const current = state.setMenuSelections[action.sectionId] ?? [];
      const next = current.includes(action.optionId)
        ? current.filter((id) => id !== action.optionId)
        : [...current, action.optionId];
      return {
        ...state,
        setMenuSelections: { ...state.setMenuSelections, [action.sectionId]: next },
      };
    }

    case "CLEAR_SET_MENU_SELECTIONS":
      return { ...state, setMenuSelections: {} };

    // ─── Sub-flow B — presentation (one config per live counter) ───────────
    case "TOGGLE_LIVE_COUNTER": {
      const { liveCounters, counterConfigs } = state.presentationChoices;
      const selected = liveCounters.includes(action.counterId);
      const nextCounters = selected
        ? liveCounters.filter((id) => id !== action.counterId)
        : [...liveCounters, action.counterId];
      // De-selecting a counter drops its picks — they belong to that counter.
      const nextConfigs = { ...counterConfigs };
      if (selected) delete nextConfigs[action.counterId];
      else nextConfigs[action.counterId] = { ...EMPTY_COUNTER_CONFIG };
      return {
        ...state,
        presentationChoices: { liveCounters: nextCounters, counterConfigs: nextConfigs },
      };
    }

    case "SET_COUNTER_SINGLE": {
      const current = counterConfigOf(state, action.counterId);
      return withCounterConfig(state, action.counterId, {
        ...current,
        // Toggle off when re-selecting the same value.
        [action.field]: current[action.field] === action.value ? null : action.value,
      });
    }

    case "TOGGLE_COUNTER_DESIGN": {
      const current = counterConfigOf(state, action.counterId);
      const designs = current.designs.includes(action.value)
        ? current.designs.filter((v) => v !== action.value)
        : [...current.designs, action.value];
      return withCounterConfig(state, action.counterId, { ...current, designs });
    }

    // ─── Sub-flow C — outdoor catalog ──────────────────────────────────────
    case "SET_CATALOG_QUANTITY": {
      const next = { ...state.catalogSelections };
      if (action.quantity <= 0) delete next[action.itemId];
      else next[action.itemId] = action.quantity;
      return { ...state, catalogSelections: next };
    }

    case "SET_PACKAGING_STYLE":
      return {
        ...state,
        packagingStyleId: state.packagingStyleId === action.styleId ? null : action.styleId,
      };

    case "SET_DELIVERY_ADDRESS":
      return { ...state, deliveryAddress: action.value };

    case "REPLACE_STATE":
      // Merge with INITIAL_STATE to guard against missing fields in older stored state.
      return {
        ...INITIAL_STATE,
        ...action.state,
        // Nested objects need explicit merges so older stored blobs don't drop keys.
        presentationChoices: {
          ...INITIAL_STATE.presentationChoices,
          ...(action.state.presentationChoices ?? {}),
          // Pre-per-counter blobs have no counterConfigs; start them empty.
          counterConfigs: action.state.presentationChoices?.counterConfigs ?? {},
        },
        setMenuSelections: action.state.setMenuSelections ?? {},
        catalogSelections: action.state.catalogSelections ?? {},
        // Strip retired options (e.g. "Non Veg") out of older stored blobs.
        dietaryPreferences: sanitizeDietaryPreferences(action.state.dietaryPreferences),
      };

    case "RESET":
    case "RESET_WIZARD":
      return INITIAL_STATE;

    default:
      return state;
  }
}

// ─── Context ───────────────────────────────────────────────────────────────

type BookingCtx = {
  state: BookingState;
  dispatch: React.Dispatch<Action>;
  hydrated: boolean;
};

const BookingContext = createContext<BookingCtx | null>(null);

const STORAGE_KEY = "raec-menu-builder-state";

export function BookingProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const [hydrated, setHydrated] = useState(false);

  // Load from localStorage AFTER mount to avoid SSR / client hydration mismatch.
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as BookingState;
        dispatch({ type: "REPLACE_STATE", state: parsed });
      }
    } catch {
      // corrupted / blocked storage — ignore, use initial state
    }
    // Intentional: flip the hydration flag once, post-mount, so persisted
    // state loads without an SSR/client mismatch. Not a cascading render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHydrated(true);
  }, []);

  // Persist on every change, but ONLY after hydration (avoids clobbering
  // stored state with the SSR INITIAL_STATE on first render).
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // storage full / blocked — silently ignore
    }
  }, [state, hydrated]);

  return (
    <BookingContext.Provider value={{ state, dispatch, hydrated }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) {
    throw new Error("useBooking() must be called inside <BookingProvider>");
  }
  return ctx;
}
