// ══════════════════════════════════════════════════════════════════
// PATH IN REPO: lib/menu-builder/data.ts
// ══════════════════════════════════════════════════════════════════
//
// All catalog data lives here as plain TypeScript arrays.
//
// TO ADD A NEW DISH/VENUE/CUISINE etc:
//   Just add a new entry to the appropriate array below. Fields are all
//   type-checked so TypeScript will scream if something's missing.
//
// TO MIGRATE TO CMS LATER:
//   Replace each array with an async fetch. All the components import from
//   this file, so they update automatically.
//
// ═══════════════════════════════════════════════════════════════════════════

import type {
  Occasion, Venue, CuisineCategory, Dish, CutleryOption,
  PresentationStyle, StallTheme, LiveCounter, BudgetTier,
} from "./types";

// ─── Step 1 — Occasion cards ───────────────────────────────────────────────
export const OCCASIONS: Occasion[] = [
  { id: "wedding",    label: "Wedding",    image: "/images/mb-occasion-wedding.jpg" },
  { id: "engagement", label: "Engagement", image: "/images/mb-occasion-engagement.jpg" },
  { id: "reception",  label: "Reception",  image: "/images/mb-occasion-reception.jpg" },
  { id: "party",      label: "Party",      image: "/images/mb-occasion-party.jpg" },
  { id: "sangeet",    label: "Sangeet",    image: "/images/mb-occasion-sangeet.jpg" },
  { id: "haldi",      label: "Haldi",      image: "/images/mb-occasion-haldi.jpg" },
];

// ─── Step 2 — Venues (our properties + partners) ───────────────────────────
export const VENUES: Venue[] = [
  {
    id: "raj-gharana",
    name: "Raj Gharana Resort",
    image: "/images/mb-venue-raj-gharana.jpg",
    type: "our-property",
    category: "Outdoor",
    capacity: "200-2000",
    pricingNote: "Included in base rate",
  },
  {
    id: "raj-aangan",
    name: "Raj Aangan Resort",
    image: "/images/mb-venue-raj-aangan.jpg",
    type: "our-property",
    category: "Indoor",
    capacity: "100-800",
    pricingNote: "Included in base rate. Indoor",
  },
  {
    id: "samode-palace",
    name: "Samode palace",
    image: "/images/mb-venue-samode.jpg",
    type: "partner",
    category: "Outdoor",
    capacity: "",
    pricingNote: "+ 25/ Head Logistic",
    description: "Heritage Outdoor Lawn",
  },
  {
    id: "jaipur-marriott",
    name: "Jaipur Marriott",
    image: "/images/mb-venue-marriott.jpg",
    type: "partner",
    category: "Indoor",
    capacity: "",
    pricingNote: "+ 40/ Head Logistic",
    description: "5 star banquet · AC",
  },
  {
    id: "leela-palace",
    name: "Leela palace Jaipur",
    image: "/images/mb-venue-leela.jpg",
    type: "partner",
    category: "Both",
    capacity: "",
    pricingNote: "+ 25/ Head Logistic",
    description: "Heritage Garden + Hall",
  },
  {
    id: "rajmahal-palace",
    name: "Rajmahal palace",
    image: "/images/mb-venue-rajmahal.jpg",
    type: "partner",
    category: "Outdoor",
    capacity: "",
    pricingNote: "+ 25/ Head Logistic",
    description: "Heritage Outdoor Lawn",
  },
];

// ─── Step 3 — Cuisine categories ───────────────────────────────────────────
export const CUISINE_CATEGORIES: CuisineCategory[] = [
  { id: "drinks",       name: "Drinks",       image: "/images/mb-cat-drinks.jpg",       itemCount: 300 },
  { id: "chaat",        name: "Chaat",        image: "/images/mb-cat-chaat.jpg",        itemCount: 100 },
  { id: "thai",         name: "Thai",         image: "/images/mb-cat-thai.jpg",         itemCount: 100 },
  { id: "italian",      name: "Italian",      image: "/images/mb-cat-italian.jpg",      itemCount: 95  },
  { id: "lebanese",     name: "Lebanease",    image: "/images/mb-cat-lebanese.jpg",     itemCount: 95  },
  { id: "soup",         name: "Soup",         image: "/images/mb-cat-soup.jpg",         itemCount: 100 },
  { id: "japanese",     name: "Japanese",     image: "/images/mb-cat-japanese.jpg",     itemCount: 95  },
  { id: "pan-asian",    name: "Pan Asian",    image: "/images/mb-cat-pan-asian.jpg",    itemCount: 95  },
  { id: "dessert",      name: "Deseart",      image: "/images/mb-cat-dessert.jpg",      itemCount: 100 },
  { id: "tandoor",      name: "Tandoor",      image: "/images/mb-cat-tandoor.jpg",      itemCount: 26  },
  { id: "indian-mains", name: "Indian mains", image: "/images/mb-cat-indian-mains.jpg", itemCount: 95  },
  { id: "oriental",     name: "Oriental",     image: "/images/mb-cat-oriental.jpg",     itemCount: 8   },
];

// ─── Step 3 — Budget tiers ─────────────────────────────────────────────────
// perHead is placeholder — confirm real numbers with client, then update.
export const BUDGET_TIERS: BudgetTier[] = [
  { id: "Standard", label: "Standard", range: "₹700  -  ₹1,000",   perHead: 850  },
  { id: "Premium",  label: "Premium",  range: "₹1000  -  ₹1,500",  perHead: 1250 },
  { id: "Delux",    label: "Delux",    range: "₹1,500  -  ₹2,500", perHead: 2000 },
  { id: "Luxury",   label: "Luxury",   range: "₹2,500",             perHead: 3000 },
];

// ─── Step 4 — Dishes ───────────────────────────────────────────────────────
// Starter set. Add more dishes here — each just needs the required fields.
// `section` groups dishes under a header on the dish-picking screen.
// `cuisineCategoryId` links to CUISINE_CATEGORIES so we can filter by category.
export const DISHES: Dish[] = [
  // Signature Welcome Elixirs
  { id: "d1",  name: "Royal Aloo Bukhara Elixir", subtitle: "Aloo Bukhara / Plum Juice", section: "Signature Welcome Elixirs", cuisineCategoryId: "drinks",       price: 499, tags: ["Veg", "Beverage"] },
  { id: "d2",  name: "Kesar Pista Lassi Supreme", subtitle: "Kesar / Pista Lassi",       section: "Signature Welcome Elixirs", cuisineCategoryId: "drinks",       price: 399, tags: ["Veg", "Beverage"] },
  { id: "d3",  name: "Malai Paneer Tikka Royale", subtitle: "Paneer Starter",            section: "Signature Welcome Elixirs", cuisineCategoryId: "tandoor",      price: 499, tags: ["Veg", "Starter"] },

  // Artisan Shake & Lassi Bar
  { id: "d4",  name: "Rajwadi Shahi Paneer Nazakat", subtitle: "Shahi Paneer",             section: "Artisan Shake & Lassi Bar", cuisineCategoryId: "indian-mains", price: 799, tags: ["Veg", "Main"] },
  { id: "d5",  name: "Jeweled Crisp Tokri Chat",     subtitle: "Chaat basket",              section: "Artisan Shake & Lassi Bar", cuisineCategoryId: "chaat",       price: 499, tags: ["Veg", "Starter"] },
  { id: "d6",  name: "Malpua Rabdi Rajsi Vilas",     subtitle: "Malpua with Rabdi",         section: "Artisan Shake & Lassi Bar", cuisineCategoryId: "dessert",     price: 599, tags: ["Veg", "Dessert"] },
  { id: "d7",  name: "Ghewar Rabdi Shahi Angan",     subtitle: "Ghewar with Rabdi",         section: "Artisan Shake & Lassi Bar", cuisineCategoryId: "dessert",     price: 999, tags: ["Veg", "Dessert"] },
  { id: "d8",  name: "Afgan Pista Royal",             subtitle: "Afghan Pista Shake",       section: "Artisan Shake & Lassi Bar", cuisineCategoryId: "drinks",      price: 499, tags: ["Veg", "Beverage"] },
  { id: "d9",  name: "Badam Bliss Shake",             subtitle: "Badam Shake",              section: "Artisan Shake & Lassi Bar", cuisineCategoryId: "drinks",      price: 599, tags: ["Veg", "Beverage"] },
  { id: "d10", name: "Belgian Chocolate Indulgence",  subtitle: "Belgian Chocolate Shake",  section: "Artisan Shake & Lassi Bar", cuisineCategoryId: "drinks",      price: 599, tags: ["Veg", "Beverage"] },
  { id: "d11", name: "Chiku Cream Delight",           subtitle: "Chiku Shake",              section: "Artisan Shake & Lassi Bar", cuisineCategoryId: "drinks",      price: 599, tags: ["Veg", "Beverage"] },
  { id: "d12", name: "Classic Cold Coffee Frappe",    subtitle: "Cold Coffee",              section: "Artisan Shake & Lassi Bar", cuisineCategoryId: "drinks",      price: 599, tags: ["Veg", "Beverage"] },
  { id: "d13", name: "Cold Coffee Ice Cream Supreme", subtitle: "Cold Coffee with Ice Cream", section: "Artisan Shake & Lassi Bar", cuisineCategoryId: "drinks",    price: 599, tags: ["Veg", "Beverage"] },
];

// ─── Step 4 — Cutlery / Presentation / Stalls / Live Counters ──────────────

export const CUTLERY_OPTIONS: CutleryOption[] = [
  { id: "royal-silver",    name: "Royal Silver",    image: "/images/mb-cutlery-silver.jpg" },
  { id: "copper-brass",    name: "Copper & Brass",  image: "/images/mb-cutlery-copper.jpg" },
  { id: "white-porcelain", name: "White Porcelain", image: "/images/mb-cutlery-porcelain.jpg" },
  { id: "stoneware",       name: "Stoneware",       image: "/images/mb-cutlery-stoneware.jpg" },
  { id: "luxury-black",    name: "Luxury Black",    image: "/images/mb-cutlery-black.jpg" },
  { id: "eco-disposable",  name: "Eco Disposable",  image: "/images/mb-cutlery-eco.jpg" },
];

export const PRESENTATION_STYLES: PresentationStyle[] = [
  { id: "classic-elegant", name: "Classic Elegant",    image: "/images/mb-presentation-classic.jpg" },
  { id: "royal-heritage",  name: "Royal Heritage",     image: "/images/mb-presentation-heritage.jpg" },
  { id: "luxury-dining",   name: "Luxury Fine Dining", image: "/images/mb-presentation-luxury.jpg" },
  { id: "contemporary",    name: "Contemporary",       image: "/images/mb-presentation-contemporary.jpg" },
  { id: "minimalist",      name: "Minimalist Chic",    image: "/images/mb-presentation-minimalist.jpg" },
  { id: "vintage",         name: "Vintage Romance",    image: "/images/mb-presentation-vintage.jpg" },
];

export const STALL_THEMES: StallTheme[] = [
  { id: "traditional-rajasthan", name: "Traditional Rajasthan", image: "/images/mb-stall-traditional.jpg" },
  { id: "royal-palace",          name: "Royal Palace",          image: "/images/mb-stall-royal.jpg" },
  { id: "modern-luxury",         name: "Modern Luxury",         image: "/images/mb-stall-modern.jpg" },
  { id: "floral-garden",         name: "Floral Garden",         image: "/images/mb-stall-floral.jpg" },
  { id: "mughal-grandeur",       name: "Mughal Grandeur",       image: "/images/mb-stall-mughal.jpg" },
  { id: "destination-wedding",   name: "Destination Wedding",   image: "/images/mb-stall-destination.jpg" },
];

export const LIVE_COUNTERS: LiveCounter[] = [
  { id: "chaat-station",  name: "Chaat Station"  },
  { id: "jalebi-counter", name: "Jalebi Counter" },
  { id: "pasta-bar",      name: "Pasta Bar"      },
  { id: "tea-counter",    name: "Tea Counter"    },
  { id: "coffee-bar",     name: "Coffee Bar"     },
  { id: "paan-counter",   name: "Paan Counter"   },
  { id: "dessert-wall",   name: "Dessert Walll"  },
  { id: "mocktail-bar",   name: "Mocktail Bar"   },
];
