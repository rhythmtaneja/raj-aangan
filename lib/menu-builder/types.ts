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

// Derived from DIETARY_PREFERENCES below so the union and the pill list can
// never drift apart — "Non Veg" is not offered and is not a valid value.
export type DietaryPreference = (typeof DIETARY_PREFERENCES)[number];

export type BudgetTierId = "Standard" | "Premium" | "Delux" | "Luxury";

export type DishTag = "Veg" | "Jain" | "Satvik" | "Starter" | "Main" | "Dessert" | "Beverage";

/** Which sub-flow the wizard is in — chosen on Step 1. */
export type CateringType = "venue-event" | "outdoor" | null;

/**
 * Within the venue-event flow, whether the guest took a fixed set menu or the
 * from-scratch custom builder. Drives quote/summary display + pricing basis.
 */
export type MenuMode = "set" | "custom" | null;

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
  | "live-counter-van"
  | "premium-addon";

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
  /** Optional line under the price, e.g. "min 300 guests" (Sanity-managed). */
  priceNote?: string;
  mealTypeFit: MealType[];      // which meal types this menu shows for
  /**
   * Per-head surcharge for each dish chosen beyond a course's chooseCount.
   * null/undefined → use the global value from PricingSettings.
   */
  addOnPricePerItem?: number | null;
  sections: SetMenuSection[];
};

// ─── Custom builder — master à-la-carte menu (from RAEC_master_menu.csv) ────

export type CustomMenuItem = {
  id: string;
  name: string;                 // display name
  traditionalName?: string;     // original name (may be absent)
  description?: string;         // may be absent
  /** ₹ per plate. null until the client fills real prices. */
  price: number | null;
};

/** A group of items inside a section. `label: ""` = a flat section. */
export type CustomMenuSubsection = {
  label: string;
  items: CustomMenuItem[];
};

export type CustomMenuSection = {
  id: string;
  label: string;                // e.g. "The Great Indian Chaat Experience"
  subsections: CustomMenuSubsection[];
};

// ─── Custom builder — the cuisine cards that gate the à-la-carte menu ───────

/**
 * A cuisine card on /menu-builder/cuisine. `sectionIds` are the à-la-carte
 * sections it unlocks; the counts are derived from those sections, never
 * stored by hand. Sanity type: `cuisineGroup`.
 */
export type CuisineCard = {
  id: string;
  name: string;
  image: string;
  sectionIds: string[];
  itemCount: number;
  sectionCount: number;
};

// ─── Sub-flow C — Outdoor catalog shapes ───────────────────────────────────

/**
 * One box / packet / collection / van inside a catalog section — a row of the
 * client's outdoor-catering workbook. `contents` is what's inside the box, shown
 * under the name so the guest knows what they're ordering.
 */
export type CatalogVariant = {
  id: string;
  name: string;                 // "Classic Wedding Box"
  contents: string[];           // ["Kaju Katli", "Motichoor Ladoo", …]
  /**
   * Per-variant price override in ₹. null = inherit the section's price, which
   * is the case for everything today (the client prices per section for now).
   */
  price?: number | null;
};

/**
 * A section of the outdoor catalog (one worksheet of the client's workbook) —
 * e.g. "Festive Snack Packets". Rendered as an accordion heading; opening it
 * lists its `variants`.
 */
export type CatalogItem = {
  id: string;
  name: string;                 // "Festive Snack Packets"
  description: string;          // "Sealed namkeen, kachori and mithai packets"
  /** ₹ per unit, applied to every variant. null = quoted on request. */
  price: number | null;         // 220
  unit: string;                 // "per box" | "per kg" | "per packet" | "per day"
  image: string;
  category: CatalogCategory;
  /** The variants inside this section. Empty = a plain, directly-orderable item. */
  variants: CatalogVariant[];
  /** The workbook's own column headings, e.g. "Box Category" / "Contents". */
  variantLabel?: string;
  contentsLabel?: string;
};

export type PackagingStyle = {
  id: string;
  label: string;                // "Eco Kraft Box"
  description?: string;
  /** Optional per-unit packaging surcharge (not yet added to the quote). */
  pricePerUnit?: number | null;
};

// ─── Pricing & quote settings (Sanity singleton `pricingSettings`) ─────────

export type DiscountCode = {
  code: string;
  percentOff: number;
  /** 0 = applies to any booking size. */
  minGuests: number;
  /** ISO date (YYYY-MM-DD). Absent = never expires. */
  expiresOn?: string;
  isActive: boolean;
};

/**
 * Every number and piece of quote wording that isn't attached to one menu.
 * Editable in Studio under Menu Builder → Pricing & Quote Settings; the
 * defaults live in config.ts/DEFAULT_PRICING_SETTINGS.
 */
export type PricingSettings = {
  gstPercent: number;
  /** Default surcharge per extra set-menu dish (a menu may override it). */
  addOnPricePerItem: number;
  /** 0 = no minimum. */
  minimumGuests: number;

  showDiscountField: boolean;
  discountCodes: DiscountCode[];
  invalidCodeMessage: string;

  quoteHeading: string;
  quoteSubheading: string;
  /** 0 hides the line. */
  quoteValidityDays: number;
  /** 0 hides the line. */
  depositPercent: number;
  quoteTerms: string[];
  contactPhone?: string;
  contactEmail?: string;
};

// ─── Per-live-counter presentation config ──────────────────────────────────
// One of these per SELECTED live counter (keyed by the counter tile's id), so
// "Chaat Counter" and "Pasta Counter" each carry their own cutlery, style,
// stall theme and counter-design picks.

export type CounterConfig = {
  cutlery: string | null;
  presentationStyle: string | null;
  stallTheme: string | null;
  designs: string[];
};

export const EMPTY_COUNTER_CONFIG: CounterConfig = {
  cutlery: null,
  presentationStyle: null,
  stallTheme: null,
  designs: [],
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

  // Venue-event Menu step — set package vs custom builder
  menuMode: MenuMode;

  // Custom builder — Cuisine categories (budget tier removed from the UI)
  budgetTier: BudgetTierId | null;
  activeMealForCuisine: MealType | null;
  selectedCuisineCategories: string[]; // ids from CUISINE_CATEGORIES

  // Custom builder — Menu items
  selectedDishes: { dishId: string; mealType: MealType }[];

  // Set-menu selection
  selectedSetMenuId: string | null;
  /** sectionId → chosen dishOptionIds. */
  setMenuSelections: Record<string, string[]>;

  // Sub-flow B — Presentation / Live Counters step
  // Every chosen live counter gets its OWN cutlery / presentation / stall /
  // design picks, keyed by the counter's id in `counterConfigs`.
  presentationChoices: {
    liveCounters: string[];
    counterConfigs: Record<string, CounterConfig>;
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

  menuMode: null,

  budgetTier: "Premium",
  activeMealForCuisine: "Breakfast",
  selectedCuisineCategories: [],

  selectedDishes: [],

  selectedSetMenuId: null,
  setMenuSelections: {},

  presentationChoices: {
    liveCounters: [],
    counterConfigs: {},
  },

  catalogSelections: {},
  packagingStyleId: null,
  deliveryAddress: "",
};

// ─── Step definitions — one set per sub-flow (used by ProgressBar) ─────────

export type WizardStep = { label: string; slug: string };

/**
 * Venue Event flow — identical for every venue. The Menu step shows the fixed
 * set menus; a "Build a Custom Menu" button branches into the from-scratch
 * builder, which adds its own Cuisine step (see STEPS_VENUE_EVENT_CUSTOM).
 */
export const STEPS_VENUE_EVENT: WizardStep[] = [
  { label: "Client", slug: "client" },
  { label: "Venue", slug: "venue" },
  { label: "Menu", slug: "menu" },
  { label: "Presentation", slug: "presentation" },
  { label: "Quote", slug: "quote" },
];

/**
 * Venue Event flow once the guest opts into the custom builder (menuMode ===
 * "custom"): a Cuisine step appears before Menu. Cuisine picks the categories,
 * Menu (= /menu-builder/custom-menu) then lists only those categories' dishes.
 */
export const STEPS_VENUE_EVENT_CUSTOM: WizardStep[] = [
  { label: "Client", slug: "client" },
  { label: "Venue", slug: "venue" },
  { label: "Cuisine", slug: "cuisine" },
  { label: "Menu", slug: "custom-menu" },
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

// SINGLE SOURCE OF TRUTH for dietary preference. "Non Veg" is removed entirely
// (per brief) — the DietaryPreference type is derived from this array, so it is
// not a valid value anywhere, and context.tsx strips it out of any older
// localStorage blob that still carries it.
export const DIETARY_PREFERENCES = [
  "Pure Veg", "Jain", "Satvik", "Alcohol", "Non Alcohol",
] as const;

export const DISH_FILTER_TAGS: DishTag[] = [
  "Veg", "Jain", "Satvik", "Starter", "Main", "Dessert", "Beverage",
];

// ─── Catering type cards (Step 1, first section) ───────────────────────────

export type CateringTypeOption = {
  id: Exclude<CateringType, null>;
  label: string;
  description: string;
  /** Card image (photo shown on the Step 1 catering-type card). */
  image: string;
  /** Which route the Next button leads to when this type is chosen. */
  nextHref: string;
};

export const CATERING_TYPES: CateringTypeOption[] = [
  {
    id: "venue-event",
    label: "Venue Event Catering",
    description: "Weddings, receptions & parties hosted at a venue, with full menu & presentation builder.",
    image: "/images/events-service-venue.jpg",
    nextHref: "/menu-builder/venue",
  },
  {
    id: "outdoor",
    label: "Outdoor Catering / Bulk Orders",
    description: "Packed meals, sweet boxes, corporate gifting & live counter vans delivered off-site.",
    image: "/images/catering-hero.jpg",
    nextHref: "/menu-builder/catalog",
  },
];
