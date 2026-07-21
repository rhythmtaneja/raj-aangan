// ══════════════════════════════════════════════════════════════════
// PATH IN REPO: lib/menu-builder/fallback.ts
// ══════════════════════════════════════════════════════════════════
// Hardcoded catalog used as a FALLBACK when Sanity isn't configured yet
// (NEXT_PUBLIC_SANITY_PROJECT_ID unset), so the wizard keeps working
// through the whole migration. Once Sanity has data, queries.ts fetches
// from there and these arrays are ignored.
// ═══════════════════════════════════════════════════════════════════════════

import type {
  Occasion, Venue, CuisineCategory, Dish, PresetMenu,
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
  { id: "raj-gharana", name: "Raj Gharana Resort", image: "/images/mb-venue-raj-gharana.jpg", type: "our-property", venueKind: "raj-gharana", category: "Outdoor", capacity: "200-2000", pricingNote: "Included in base rate", logisticsPerHead: 0 },
  { id: "raj-aangan", name: "Raj Aangan Resort", image: "/images/mb-venue-raj-aangan.jpg", type: "our-property", venueKind: "raj-aangan", category: "Indoor", capacity: "100-800", pricingNote: "Included in base rate. Indoor", logisticsPerHead: 0 },
  { id: "samode-palace", name: "Samode palace", image: "/images/mb-venue-samode.jpg", type: "partner", venueKind: "partner", category: "Outdoor", capacity: "", pricingNote: "+ 25/ Head Logistic", description: "Heritage Outdoor Lawn", logisticsPerHead: 25 },
  { id: "jaipur-marriott", name: "Jaipur Marriott", image: "/images/mb-venue-marriott.jpg", type: "partner", venueKind: "partner", category: "Indoor", capacity: "", pricingNote: "+ 40/ Head Logistic", description: "5 star banquet · AC", logisticsPerHead: 40 },
  { id: "leela-palace", name: "Leela palace Jaipur", image: "/images/mb-venue-leela.jpg", type: "partner", venueKind: "partner", category: "Both", capacity: "", pricingNote: "+ 25/ Head Logistic", description: "Heritage Garden + Hall", logisticsPerHead: 25 },
  { id: "rajmahal-palace", name: "Rajmahal palace", image: "/images/mb-venue-rajmahal.jpg", type: "partner", venueKind: "partner", category: "Outdoor", capacity: "", pricingNote: "+ 25/ Head Logistic", description: "Heritage Outdoor Lawn", logisticsPerHead: 25 },
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

// ─── Step 4 — Dishes ───────────────────────────────────────────────────────
export const DISHES: Dish[] = [
  { id: "d1",  name: "Royal Aloo Bukhara Elixir", subtitle: "Aloo Bukhara / Plum Juice", section: "Signature Welcome Elixirs", cuisineCategoryId: "drinks",       price: 499, tags: ["Veg", "Beverage"] },
  { id: "d2",  name: "Kesar Pista Lassi Supreme", subtitle: "Kesar / Pista Lassi",       section: "Signature Welcome Elixirs", cuisineCategoryId: "drinks",       price: 399, tags: ["Veg", "Beverage"] },
  { id: "d3",  name: "Malai Paneer Tikka Royale", subtitle: "Paneer Starter",            section: "Signature Welcome Elixirs", cuisineCategoryId: "tandoor",      price: 499, tags: ["Veg", "Starter"] },
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

// No preset menus in the fallback — presets are Sanity-only content.
export const PRESET_MENUS: PresetMenu[] = [];
