export type MealType =
  "Breakfast" | "Lunch" | "High Tea" | "Brunch" | "Dinner" | "Cocktail";

export type DietaryPreference = (typeof DIETARY_PREFERENCES)[number];

export type BudgetTierId = "Standard" | "Premium" | "Delux" | "Luxury";

export type DishTag =
  "Veg" | "Jain" | "Satvik" | "Starter" | "Main" | "Dessert" | "Beverage";

export type CateringType = "venue-event" | "outdoor" | null;

export type MenuMode = "set" | "custom" | null;

export type VenueKind = "raj-aangan" | "raj-gharana" | "partner";

export type CatalogCategory =
  | "sweet-box"
  | "meal-box"
  | "snack-packet"
  | "bulk-mithai"
  | "live-counter-van"
  | "premium-addon";

export type Occasion = {
  id: string;
  label: string;
  image: string;
};

export type Venue = {
  id: string;
  name: string;
  image: string;

  type: "our-property" | "partner";

  venueKind?: VenueKind;
  category: "Indoor" | "Outdoor" | "Both";

  capacity: string;

  pricingNote: string;

  description?: string;

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

  subtitle?: string;

  section: string;

  cuisineCategoryId: string;
  price: number;
  tags: DishTag[];
};

export type PresetMenuSection = {
  sectionName: string;

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

  range: string;

  perHead: number;
};

export type SetMenuDishOption = {
  id: string;
  name: string;
  subtitle?: string;
};

export type SetMenuSection = {
  id: string;
  label: string;
  chooseCount: number;
  dishOptions: SetMenuDishOption[];
};

export type SetMenu = {
  id: string;
  name: string;
  slug: string;
  perPersonPrice: number;
  coverImage: string;
  description?: string;

  priceNote?: string;
  mealTypeFit: MealType[];

  addOnPricePerItem?: number | null;
  sections: SetMenuSection[];
};

export type CustomMenuItem = {
  id: string;
  name: string;
  traditionalName?: string;
  description?: string;

  price: number | null;
};

export type CustomMenuSubsection = {
  label: string;
  items: CustomMenuItem[];
};

export type CustomMenuSection = {
  id: string;
  label: string;
  subsections: CustomMenuSubsection[];
};

export type CuisineCard = {
  id: string;
  name: string;
  image: string;
  sectionIds: string[];
  itemCount: number;
  sectionCount: number;
};

export type CatalogVariant = {
  id: string;
  name: string;
  contents: string[];

  price?: number | null;
};

export type CatalogItem = {
  id: string;
  name: string;
  description: string;

  price: number | null;
  unit: string;
  image: string;
  category: CatalogCategory;

  variants: CatalogVariant[];

  variantLabel?: string;
  contentsLabel?: string;
};

export type PackagingStyle = {
  id: string;
  label: string;
  description?: string;

  pricePerUnit?: number | null;
};

export type DiscountCode = {
  code: string;
  percentOff: number;

  minGuests: number;

  expiresOn?: string;
  isActive: boolean;
};

export type PricingSettings = {
  gstPercent: number;

  addOnPricePerItem: number;

  minimumGuests: number;

  showDiscountField: boolean;
  discountCodes: DiscountCode[];
  invalidCodeMessage: string;

  quoteHeading: string;
  quoteSubheading: string;

  quoteValidityDays: number;

  depositPercent: number;
  quoteTerms: string[];
  contactPhone?: string;
  contactEmail?: string;
};

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

export type BookingState = {
  cateringType: CateringType;

  occasions: string[];
  clientName: string;
  contactPhone: string;
  mealTypes: MealType[];
  eventDate: string;
  eventDays: number;
  guests: number;
  dietaryPreferences: DietaryPreference[];

  venueId: string | null;
  customVenueAddress: string;

  menuMode: MenuMode;

  budgetTier: BudgetTierId | null;
  activeMealForCuisine: MealType | null;
  selectedCuisineCategories: string[];

  selectedDishes: { dishId: string; mealType: MealType }[];

  selectedSetMenuId: string | null;

  setMenuSelections: Record<string, string[]>;

  presentationChoices: {
    liveCounters: string[];
    counterConfigs: Record<string, CounterConfig>;
  };

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

export type WizardStep = { label: string; slug: string };

export const STEPS_VENUE_EVENT: WizardStep[] = [
  { label: "Client", slug: "client" },
  { label: "Venue", slug: "venue" },
  { label: "Menu", slug: "menu" },
  { label: "Presentation", slug: "presentation" },
  { label: "Quote", slug: "quote" },
];

export const STEPS_VENUE_EVENT_CUSTOM: WizardStep[] = [
  { label: "Client", slug: "client" },
  { label: "Venue", slug: "venue" },
  { label: "Cuisine", slug: "cuisine" },
  { label: "Menu", slug: "custom-menu" },
  { label: "Presentation", slug: "presentation" },
  { label: "Quote", slug: "quote" },
];

export const STEPS_OUTDOOR: WizardStep[] = [
  { label: "Client", slug: "client" },
  { label: "Catalog", slug: "catalog" },
  { label: "Packaging", slug: "packaging" },
  { label: "Quote", slug: "quote" },
];

export const MB_COLORS = {
  bg: "#0f2f3b",
  card: "#ffffff",
  cardCream: "#fdfbf5",
  ink: "#191919",
  inkMuted: "#666666",
  inkLight: "#8a8a8a",
  gold: "#d4a574",
  goldHover: "#c9975e",
  border: "#e5e5e5",
  borderLight: "#f0f0f0",
  greenCheck: "#22c55e",
} as const;

export const MEAL_TYPES: MealType[] = [
  "Breakfast",
  "Lunch",
  "High Tea",
  "Brunch",
  "Dinner",
  "Cocktail",
];

export const DIETARY_PREFERENCES = [
  "Pure Veg",
  "Jain",
  "Satvik",
  "Alcohol",
  "Non Alcohol",
] as const;

export const DISH_FILTER_TAGS: DishTag[] = [
  "Veg",
  "Jain",
  "Satvik",
  "Starter",
  "Main",
  "Dessert",
  "Beverage",
];

export type CateringTypeOption = {
  id: Exclude<CateringType, null>;
  label: string;
  description: string;

  image: string;

  nextHref: string;
};

export const CATERING_TYPES: CateringTypeOption[] = [
  {
    id: "venue-event",
    label: "Venue Event Catering",
    description:
      "Weddings, receptions & parties hosted at a venue, with full menu & presentation builder.",
    image: "/images/events-service-venue.jpg",
    nextHref: "/menu-builder/venue",
  },
  {
    id: "outdoor",
    label: "Outdoor Catering / Bulk Orders",
    description:
      "Packed meals, sweet boxes, corporate gifting & live counter vans delivered off-site.",
    image: "/images/catering-hero.jpg",
    nextHref: "/menu-builder/catalog",
  },
];
