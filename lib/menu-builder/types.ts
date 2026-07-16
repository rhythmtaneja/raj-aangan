// ─── Domain enums / literal unions ─────────────────────────────────────────

export type MealType = "Breakfast" | "Lunch" | "High Tea" | "Brunch" | "Dinner" | "Cocktail";

export type DietaryPreference =
  | "Pure Veg"
  | "Non Veg"
  | "Jain"
  | "Satvik"
  | "Alcohol"
  | "Non Alcohol";

export type BudgetTierId = "Standard" | "Premium" | "Delux" | "Luxury";

export type DishTag = "Veg" | "Non Veg" | "Jain" | "Satvik" | "Starter" | "Main" | "Dessert" | "Beverage";

// ─── Catalog types (what the site OFFERS) ──────────────────────────────────

export type Occasion = {
  id: string;
  label: string;
  image: string;
};

export type Venue = {
  id: string;
  name: string;
  image: string;
  /** "our-property" = RAEC-owned; "partner" = external partner property. */
  type: "our-property" | "partner";
  category: "Indoor" | "Outdoor" | "Both";
  /** e.g. "200-2000". Empty string means not specified. */
  capacity: string;
  /** e.g. "Included in base rate" or "+ 25/ Head Logistic". */
  pricingNote: string;
  /** Optional short descriptor rendered under the name, e.g. "Heritage Outdoor Lawn". */
  description?: string;
  /**
   * Per-head logistics surcharge in ₹ (Sanity-managed). When present the
   * pricing math uses this directly instead of parsing `pricingNote`.
   */
  logisticsPerHead?: number;
};

export type CuisineCategory = {
  id: string;
  name: string;
  image: string;
  itemCount: number;
};

export type Dish = {
  id: string;
  name: string;
  /** e.g. "Aloo Bukhara / Plum Juice" — shown as small line under the name. */
  subtitle?: string;
  /** Section grouping inside a cuisine (e.g. "Signature Welcome Elixirs"). */
  section: string;
  /** Which CuisineCategory this dish belongs to (id). */
  cuisineCategoryId: string;
  price: number;
  tags: DishTag[];
};

/** A preset menu (e.g. "Maharaja Vyanjan") with "choose any N" sections. */
export type PresetMenuSection = {
  sectionName: string;
  /** How many dishes the guest may pick from this section. 0 = all included. */
  chooseCount: number;
  dishes: Dish[];
};

export type PresetMenu = {
  id: string;
  name: string;
  basePrice: number | null;
  priceNote?: string;
  image: string;
  description?: string;
  sections: PresetMenuSection[];
};

export type CutleryOption = { id: string; name: string; image: string };
export type PresentationStyle = { id: string; name: string; image: string };
export type StallTheme = { id: string; name: string; image: string };
export type LiveCounter = { id: string; name: string };

export type BudgetTier = {
  id: BudgetTierId;
  label: string;
  /** Display string, e.g. "₹700 - ₹1,000". */
  range: string;
  /** Numeric per-head price used for math (placeholder — confirm real values with client). */
  perHead: number;
};

// ─── BookingState — what the user has selected across the wizard ───────────

export type BookingState = {
  // Step 1 — Client / Event
  occasions: string[];           // ids from OCCASIONS
  clientName: string;
  contactPhone: string;
  mealTypes: MealType[];
  eventDate: string;             // ISO date string
  eventDays: number;
  guests: number;                // min 100, step 50
  dietaryPreferences: DietaryPreference[];

  // Step 2 — Venue
  venueId: string | null;        // id from VENUES, or null if using custom
  customVenueAddress: string;

  // Step 3 — Cuisine
  budgetTier: BudgetTierId | null;
  activeMealForCuisine: MealType | null;
  selectedCuisineCategories: string[]; // ids from CUISINE_CATEGORIES

  // Step 4 — Menu items + Cutlery/Presentation/Stalls
  selectedDishes: { dishId: string; mealType: MealType }[];
  cutleryIds: string[];
  presentationStyleIds: string[];
  stallThemeIds: string[];
  liveCounterIds: string[];
};

export const INITIAL_STATE: BookingState = {
  occasions: [],
  clientName: "",
  contactPhone: "",
  mealTypes: ["Dinner"],
  eventDate: "",
  eventDays: 1,
  guests: 300,
  dietaryPreferences: ["Pure Veg"],

  venueId: null,
  customVenueAddress: "",

  budgetTier: "Premium",
  activeMealForCuisine: "Breakfast",
  selectedCuisineCategories: [],

  selectedDishes: [],
  cutleryIds: [],
  presentationStyleIds: [],
  stallThemeIds: [],
  liveCounterIds: [],
};

// ─── Step definitions (used by ProgressBar and NavFooter) ──────────────────

export const STEPS = [
  { number: 1, label: "Client", slug: "client" },
  { number: 2, label: "Venue", slug: "venue" },
  { number: 3, label: "Cuisine", slug: "cuisine" },
  { number: 4, label: "Menu", slug: "menu" },
  { number: 5, label: "Quote", slug: "quote" },
] as const;

export type StepNumber = 1 | 2 | 3 | 4 | 5;

// ─── Design tokens shared across all menu-builder files ────────────────────

export const MB_COLORS = {
  bg: "#0f2f3b",   // dark navy — main background
  card: "#ffffff",   // white cards / panels
  cardCream: "#fdfbf5",   // warm off-white for accents
  ink: "#191919",   // primary text
  inkMuted: "#666666",   // secondary text
  inkLight: "#8a8a8a",   // tertiary / captions
  gold: "#d4a574",   // accent gold / tan (selected pill bg, buttons)
  goldHover: "#c9975e",
  border: "#e5e5e5",   // light card borders
  borderLight: "#f0f0f0",
  greenCheck: "#22c55e",   // checkmark on selected occasion cards
} as const;

// ─── Meal type + dietary + filter option arrays (used by pill groups) ──────

export const MEAL_TYPES: MealType[] = ["Breakfast", "Lunch", "High Tea", "Brunch", "Dinner", "Cocktail"];

export const DIETARY_PREFERENCES: DietaryPreference[] = [
  "Pure Veg", "Non Veg", "Jain", "Satvik", "Alcohol", "Non Alcohol",
];

export const DISH_FILTER_TAGS: DishTag[] = [
  "Veg", "Jain", "Satvik", "Starter", "Main", "Dessert", "Beverage",
];
