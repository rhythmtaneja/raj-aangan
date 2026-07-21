// ══════════════════════════════════════════════════════════════════
// PATH IN REPO: lib/menu-builder/context.tsx
// ══════════════════════════════════════════════════════════════════
// Booking state + reducer for the three-sub-flow wizard. New actions cover
// the set-menu picker (Sub-flow A), the presentation step (Sub-flow B) and
// the outdoor catalog / packaging (Sub-flow C), plus a full RESET_WIZARD.
// ═══════════════════════════════════════════════════════════════════════════

"use client";

import { createContext, useContext, useEffect, useReducer, useState, type ReactNode } from "react";
import { INITIAL_STATE, type BookingState, type MealType } from "./types";

// ─── Actions ───────────────────────────────────────────────────────────────

type PresentationSingleField = "cutlery" | "presentationStyle" | "stallTheme";
type PresentationMultiField = "liveCounters" | "liveCounterDesigns";

export type Action =
  | { type: "SET_FIELD"; field: keyof BookingState; value: BookingState[keyof BookingState] }
  | { type: "TOGGLE_ARRAY"; field: "occasions" | "mealTypes" | "dietaryPreferences" | "selectedCuisineCategories"; value: string }
  | { type: "ADD_DISH"; dishId: string; mealType: MealType }
  | { type: "REMOVE_DISH"; dishId: string }
  // Sub-flow A — set menu
  | { type: "SET_SET_MENU"; setMenuId: string }
  | { type: "TOGGLE_SET_MENU_DISH"; sectionId: string; optionId: string; chooseCount: number }
  | { type: "CLEAR_SET_MENU_SELECTIONS" }
  // Sub-flow B — presentation / live counters
  | { type: "SET_PRESENTATION_SINGLE"; field: PresentationSingleField; value: string | null }
  | { type: "TOGGLE_PRESENTATION_MULTI"; field: PresentationMultiField; value: string }
  // Sub-flow C — outdoor catalog
  | { type: "SET_CATALOG_QUANTITY"; itemId: string; quantity: number }
  | { type: "SET_PACKAGING_STYLE"; styleId: string }
  | { type: "SET_DELIVERY_ADDRESS"; value: string }
  | { type: "REPLACE_STATE"; state: BookingState }
  | { type: "RESET" }
  | { type: "RESET_WIZARD" };

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
      if (state.selectedSetMenuId === action.setMenuId) return state;
      // Switching menus clears prior section picks (they belong to the old menu).
      return { ...state, selectedSetMenuId: action.setMenuId, setMenuSelections: {} };

    case "TOGGLE_SET_MENU_DISH": {
      const current = state.setMenuSelections[action.sectionId] ?? [];
      let next: string[];
      if (current.includes(action.optionId)) {
        next = current.filter((id) => id !== action.optionId);
      } else {
        // Enforce the section's chooseCount cap — ignore over-selection.
        if (current.length >= action.chooseCount) return state;
        next = [...current, action.optionId];
      }
      return {
        ...state,
        setMenuSelections: { ...state.setMenuSelections, [action.sectionId]: next },
      };
    }

    case "CLEAR_SET_MENU_SELECTIONS":
      return { ...state, setMenuSelections: {} };

    // ─── Sub-flow B — presentation ─────────────────────────────────────────
    case "SET_PRESENTATION_SINGLE":
      return {
        ...state,
        presentationChoices: {
          ...state.presentationChoices,
          // Toggle off when re-selecting the same value.
          [action.field]:
            state.presentationChoices[action.field] === action.value ? null : action.value,
        },
      };

    case "TOGGLE_PRESENTATION_MULTI": {
      const current = state.presentationChoices[action.field];
      const next = current.includes(action.value)
        ? current.filter((v) => v !== action.value)
        : [...current, action.value];
      return {
        ...state,
        presentationChoices: { ...state.presentationChoices, [action.field]: next },
      };
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
        },
        setMenuSelections: action.state.setMenuSelections ?? {},
        catalogSelections: action.state.catalogSelections ?? {},
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
