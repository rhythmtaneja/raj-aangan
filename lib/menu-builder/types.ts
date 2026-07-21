// ══════════════════════════════════════════════════════════════════
// PATH IN REPO: lib/menu-builder/types.ts
// ══════════════════════════════════════════════════════════════════
// Domain types, BookingState, step-sets and shared design tokens for the
// three-sub-flow Menu Builder wizard:
//   A) Venue Event + Raj Aangan property → set-menu flow
//   B) Venue Event + partner venue       → cuisine flow (the original)
//   C) Outdoor Catering / Bulk Orders    → catalog flow
// ═══════════════════════════════════════════════════════════════════════════

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

/** Which sub-flow the wizard is in — chosen on Step 1. */
export type CateringType = "venue-event" | "outdoor" | null;

/**
 * How a venue routes the wizard:
 *   raj-aangan  → Raj Aangan property = set-menu flow (Sub-flow A)
 *   raj-gharana → our other property  = cuisine flow  (Sub-flow B)
 *   partner     → external venue       = cuisine flow  (Sub-flow B)
 */
export type VenueKind = "raj-aangan" | "raj-gharana" | "partner";

/** Outdoor catalog item categories. */
export type CatalogCategory =
  | "sweet-box"
  | "meal-box"
  | "snack-packet"
  | "bulk-mithai"
  | "live-counter-van";

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
  /**
   * Routing kind. Optional because queries.ts (Sanity) does not yet project it;
   * derive it with `venueKindOf()` in flow.ts, which infers from id when absent.
   */
  venueKind?: VenueKind;
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

// ─── Sub-flow A — Set-menu (Raj Aangan) shapes ─────────────────────────────

export type SetMenuDishOption = {
  id: string;
  name: string;                 // "French Fries"
  subtitle?: string;            // optional second line
};

export type SetMenuSection = {
  id: string;
  label: string;                // "Snacks"
  chooseCount: number;          // 4
  dishOptions: SetMenuDishOption[];
};

export type SetMenu = {
  id: string;
  name: string;                 // "Maharani Dinner Menu"
  slug: string;
  perPersonPrice: number;       // 1250
  coverImage: string;
  description?: string;         // "RO water and 200ml bottles are included..."
  mealTypeFit: MealType[];      // which meal types this menu shows for
  sections: SetMenuSection[];
};

// ─── Sub-flow C — Outdoor catalog shapes ───────────────────────────────────

export type CatalogItem = {
  id: string;
  name: string;                 // "Wedding Favour Sweet Box"
  description: string;          // "Assorted mithai, festive packaging"
  price: number;                // 220
  unit: string;                 // "per box" | "per kg" | "per packet" | "per day"
  image: string;
  category: CatalogCategory;
};

export type PackagingStyle = {
  id: string;
  label: string;                // "Eco Kraft Box"
};

// ─── BookingState — what the user has selected across the wizard ───────────

export type BookingState = {
  // Step 1 — Catering type (chosen first, picks the sub-flow)
  cateringType: CateringType;

  // Step 1 — Client / Event
  occasions: string[];           // ids from OCCASIONS
  clientName: string;
  contactPhone: string;
  mealTypes: MealType[];
  eventDate: string;             // ISO date string (also used as delivery date for outdoor)
  eventDays: number;
  guests: number;                // min 100, step 50
  dietaryPreferences: DietaryPreference[];

  // Step 2 — Venue (Sub-flows A/B)
  venueId: string | null;        // id from VENUES, or null if using custom
  customVenueAddress: string;

  // Step 3 — Cuisine (Sub-flow B)
  budgetTier: BudgetTierId | null;
  activeMealForCuisine: MealType | null;
  selectedCuisineCategories: string[]; // ids from CUISINE_CATEGORIES

  // Step 4 — Menu items (Sub-flow B)
  selectedDishes: { dishId: string; mealType: MealType }[];

  // Sub-flow A — Set-menu selection
  selectedSetMenuId: string | null;
  /** sectionId → chosen dishOptionIds. */
  setMenuSelections: Record<string, string[]>;

  // Sub-flow B — Presentation / Live Counters step
  presentationChoices: {
    liveCounters: string[];
    cutlery: string | null;
    presentationStyle: string | null;
    stallTheme: string | null;
    liveCounterDesigns: string[];
  };

  // Sub-flow C — Outdoor catalog
  /** catalogItemId → quantity. */
  catalogSelections: Record<string, number>;
  packagingStyleId: string | null;
  deliveryAddress: string;
};

export const INITIAL_STATE: BookingState = {
  cateringType: null,

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

  selectedSetMenuId: null,
  setMenuSelections: {},

  presentationChoices: {
    liveCounters: [],
    cutlery: null,
    presentationStyle: null,
    stallTheme: null,
    liveCounterDesigns: [],
  },

  catalogSelections: {},
  packagingStyleId: null,
  deliveryAddress: "",
};

// ─── Step definitions — one set per sub-flow (used by ProgressBar) ─────────

export type WizardStep = { label: string; slug: string };

/**
 * Sub-flow A — Venue Event + Raj Aangan property (set-menu). Includes the
 * shared Presentation (counters/cutlery) step, same as the cuisine flow.
 */
export const STEPS_VENUE_EVENT_SET_MENU: WizardStep[] = [
  { label: "Client", slug: "client" },
  { label: "Venue", slug: "venue" },
  { label: "Set Menu", slug: "menu" },
  { label: "Presentation", slug: "presentation" },
  { label: "Quote", slug: "quote" },
];

/** Sub-flow B — Venue Event + partner venue (cuisine). */
export const STEPS_VENUE_EVENT_CUISINE: WizardStep[] = [
  { label: "Client", slug: "client" },
  { label: "Venue", slug: "venue" },
  { label: "Cuisine", slug: "cuisine" },
  { label: "Menu", slug: "menu" },
  { label: "Presentation", slug: "presentation" },
  { label: "Quote", slug: "quote" },
];

/** Sub-flow C — Outdoor Catering / Bulk Orders. */
export const STEPS_OUTDOOR: WizardStep[] = [
  { label: "Client", slug: "client" },
  { label: "Catalog", slug: "catalog" },
  { label: "Packaging", slug: "packaging" },
  { label: "Quote", slug: "quote" },
];

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

// "Non Veg" intentionally removed from the selectable list (per brief); the
// literal remains in the DietaryPreference union for stored/legacy data.
export const DIETARY_PREFERENCES: DietaryPreference[] = [
  "Pure Veg", "Jain", "Satvik", "Alcohol", "Non Alcohol",
];

export const DISH_FILTER_TAGS: DishTag[] = [
  "Veg", "Jain", "Satvik", "Starter", "Main", "Dessert", "Beverage",
];

// ─── Catering type cards (Step 1, first section) ───────────────────────────

export type CateringTypeOption = {
  id: Exclude<CateringType, null>;
  label: string;
  description: string;
  /** Which route the Next button leads to when this type is chosen. */
  nextHref: string;
};

export const CATERING_TYPES: CateringTypeOption[] = [
  {
    id: "venue-event",
    label: "Venue Event Catering",
    description: "Weddings, receptions & parties hosted at a venue, with full menu & presentation builder.",
    nextHref: "/menu-builder/venue",
  },
  {
    id: "outdoor",
    label: "Outdoor Catering / Bulk Orders",
    description: "Packed meals, sweet boxes, corporate gifting & live counter vans delivered off-site.",
    nextHref: "/menu-builder/catalog",
  },
];
