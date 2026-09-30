"use client";

import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
  type ReactNode,
} from "react";
import {
  DIETARY_PREFERENCES,
  EMPTY_COUNTER_CONFIG,
  INITIAL_STATE,
  type BookingState,
  type CounterConfig,
  type DietaryPreference,
  type MealType,
} from "./types";

function sanitizeDietaryPreferences(stored: unknown): DietaryPreference[] {
  if (!Array.isArray(stored)) return INITIAL_STATE.dietaryPreferences;
  const valid = stored.filter((d): d is DietaryPreference =>
    (DIETARY_PREFERENCES as readonly string[]).includes(d as string),
  );
  return valid.length > 0 ? valid : INITIAL_STATE.dietaryPreferences;
}

type CounterSingleField = "cutlery" | "presentationStyle" | "stallTheme";

export type Action =
  | {
      type: "SET_FIELD";
      field: keyof BookingState;
      value: BookingState[keyof BookingState];
    }
  | {
      type: "TOGGLE_ARRAY";
      field:
        | "occasions"
        | "mealTypes"
        | "dietaryPreferences"
        | "selectedCuisineCategories";
      value: string;
    }
  | { type: "ADD_DISH"; dishId: string; mealType: MealType }
  | { type: "REMOVE_DISH"; dishId: string }
  | { type: "SET_SET_MENU"; setMenuId: string }
  | {
      type: "TOGGLE_SET_MENU_DISH";
      sectionId: string;
      optionId: string;
      chooseCount: number;
    }
  | { type: "CLEAR_SET_MENU_SELECTIONS" }
  | { type: "TOGGLE_LIVE_COUNTER"; counterId: string }
  | {
      type: "SET_COUNTER_SINGLE";
      counterId: string;
      field: CounterSingleField;
      value: string;
    }
  | { type: "TOGGLE_COUNTER_DESIGN"; counterId: string; value: string }
  | { type: "SET_CATALOG_QUANTITY"; itemId: string; quantity: number }
  | { type: "SET_PACKAGING_STYLE"; styleId: string }
  | { type: "SET_DELIVERY_ADDRESS"; value: string }
  | { type: "REPLACE_STATE"; state: BookingState }
  | { type: "RESET" }
  | { type: "RESET_WIZARD" };

function counterConfigOf(
  state: BookingState,
  counterId: string,
): CounterConfig {
  return (
    state.presentationChoices.counterConfigs[counterId] ?? {
      ...EMPTY_COUNTER_CONFIG,
    }
  );
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
      counterConfigs: {
        ...state.presentationChoices.counterConfigs,
        [counterId]: config,
      },
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
      if (state.selectedDishes.some((d) => d.dishId === action.dishId))
        return state;
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
        selectedDishes: state.selectedDishes.filter(
          (d) => d.dishId !== action.dishId,
        ),
      };

    case "SET_SET_MENU":
      if (state.selectedSetMenuId === action.setMenuId) {
        return { ...state, menuMode: "set" };
      }

      return {
        ...state,
        selectedSetMenuId: action.setMenuId,
        setMenuSelections: {},
        menuMode: "set",
      };

    case "TOGGLE_SET_MENU_DISH": {
      const current = state.setMenuSelections[action.sectionId] ?? [];
      const next = current.includes(action.optionId)
        ? current.filter((id) => id !== action.optionId)
        : [...current, action.optionId];
      return {
        ...state,
        setMenuSelections: {
          ...state.setMenuSelections,
          [action.sectionId]: next,
        },
      };
    }

    case "CLEAR_SET_MENU_SELECTIONS":
      return { ...state, setMenuSelections: {} };

    case "TOGGLE_LIVE_COUNTER": {
      const { liveCounters, counterConfigs } = state.presentationChoices;
      const selected = liveCounters.includes(action.counterId);
      const nextCounters = selected
        ? liveCounters.filter((id) => id !== action.counterId)
        : [...liveCounters, action.counterId];

      const nextConfigs = { ...counterConfigs };
      if (selected) delete nextConfigs[action.counterId];
      else nextConfigs[action.counterId] = { ...EMPTY_COUNTER_CONFIG };
      return {
        ...state,
        presentationChoices: {
          liveCounters: nextCounters,
          counterConfigs: nextConfigs,
        },
      };
    }

    case "SET_COUNTER_SINGLE": {
      const current = counterConfigOf(state, action.counterId);
      return withCounterConfig(state, action.counterId, {
        ...current,

        [action.field]:
          current[action.field] === action.value ? null : action.value,
      });
    }

    case "TOGGLE_COUNTER_DESIGN": {
      const current = counterConfigOf(state, action.counterId);
      const designs = current.designs.includes(action.value)
        ? current.designs.filter((v) => v !== action.value)
        : [...current.designs, action.value];
      return withCounterConfig(state, action.counterId, {
        ...current,
        designs,
      });
    }

    case "SET_CATALOG_QUANTITY": {
      const next = { ...state.catalogSelections };
      if (action.quantity <= 0) delete next[action.itemId];
      else next[action.itemId] = action.quantity;
      return { ...state, catalogSelections: next };
    }

    case "SET_PACKAGING_STYLE":
      return {
        ...state,
        packagingStyleId:
          state.packagingStyleId === action.styleId ? null : action.styleId,
      };

    case "SET_DELIVERY_ADDRESS":
      return { ...state, deliveryAddress: action.value };

    case "REPLACE_STATE":
      return {
        ...INITIAL_STATE,
        ...action.state,

        presentationChoices: {
          ...INITIAL_STATE.presentationChoices,
          ...(action.state.presentationChoices ?? {}),

          counterConfigs:
            action.state.presentationChoices?.counterConfigs ?? {},
        },
        setMenuSelections: action.state.setMenuSelections ?? {},
        catalogSelections: action.state.catalogSelections ?? {},

        dietaryPreferences: sanitizeDietaryPreferences(
          action.state.dietaryPreferences,
        ),
      };

    case "RESET":
    case "RESET_WIZARD":
      return INITIAL_STATE;

    default:
      return state;
  }
}

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

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as BookingState;
        dispatch({ type: "REPLACE_STATE", state: parsed });
      }
    } catch {}

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
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
