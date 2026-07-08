// ══════════════════════════════════════════════════════════════════
// PATH IN REPO: lib/menu-builder/context.tsx
// ══════════════════════════════════════════════════════════════════

"use client";

import { createContext, useContext, useEffect, useReducer, useState, type ReactNode } from "react";
import { INITIAL_STATE, type BookingState, type MealType } from "./types";

// ─── Actions ───────────────────────────────────────────────────────────────

export type Action =
  | { type: "SET_FIELD"; field: keyof BookingState; value: BookingState[keyof BookingState] }
  | { type: "TOGGLE_ARRAY"; field: "occasions" | "mealTypes" | "dietaryPreferences" | "selectedCuisineCategories" | "cutleryIds" | "presentationStyleIds" | "stallThemeIds" | "liveCounterIds"; value: string }
  | { type: "ADD_DISH"; dishId: string; mealType: MealType }
  | { type: "REMOVE_DISH"; dishId: string }
  | { type: "REPLACE_STATE"; state: BookingState }
  | { type: "RESET" };

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

    case "REPLACE_STATE":
      // Merge with INITIAL_STATE to guard against missing fields in older stored state.
      return { ...INITIAL_STATE, ...action.state };

    case "RESET":
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
