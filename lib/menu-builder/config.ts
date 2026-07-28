// ══════════════════════════════════════════════════════════════════
// PATH IN REPO: lib/menu-builder/config.ts
// ══════════════════════════════════════════════════════════════════
// The FALLBACK wizard config — what the builder uses until Sanity has the
// matching documents, and whenever Sanity is unreachable:
//   • Cutlery / Presentation / Stall / Live-counter tiles → Sanity type
//     `presentationOption` (Studio: Menu Builder → Presentation Options).
//   • DEFAULT_PRICING_SETTINGS → Sanity singleton `pricingSettings`
//     (Studio: Menu Builder → Pricing & Quote Settings).
//   • Budget tiers — no longer rendered anywhere (the budget block was cut
//     from the cuisine step); kept only so old state stays type-valid.
// Keep these in step with the schemas; the seed script pushes them into
// Sanity on first run (scripts/seed-menu-builder.ts).
// ═══════════════════════════════════════════════════════════════════════════

import type {
  BudgetTier, CutleryOption, PresentationStyle, StallTheme, LiveCounter,
  PricingSettings,
} from "./types";

// ─── Step 3 — Budget tiers ─────────────────────────────────────────────────
// perHead is placeholder — confirm real numbers with client, then update.
export const BUDGET_TIERS: BudgetTier[] = [
  { id: "Standard", label: "Standard", range: "₹700  -  ₹1,000",   perHead: 850  },
  { id: "Premium",  label: "Premium",  range: "₹1000  -  ₹1,500",  perHead: 1250 },
  { id: "Delux",    label: "Delux",    range: "₹1,500  -  ₹2,500", perHead: 2000 },
  { id: "Luxury",   label: "Luxury",   range: "₹2,500",             perHead: 3000 },
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

// Photo tiles for the "Choose Your Live Counters" grid on the Presentation
// step (distinct from LIVE_COUNTERS below, which is the pill-list of design
// names). Placeholder imagery until the client provides real shots.
export const LIVE_COUNTER_TILES: StallTheme[] = [
  { id: "chaat-counter",   name: "Chaat Counter",   image: "/images/mb/placeholder-1.jpg" },
  { id: "pasta-counter",   name: "Pasta Counter",   image: "/images/mb/placeholder-2.jpg" },
  { id: "tandoor-counter", name: "Live Tandoor",    image: "/images/mb/placeholder-3.jpg" },
  { id: "dessert-counter", name: "Dessert Counter", image: "/images/mb/placeholder-4.jpg" },
  { id: "chinese-wok",     name: "Chinese Wok",     image: "/images/mb/placeholder-5.jpg" },
  { id: "mocktail-counter", name: "Mocktail Bar",   image: "/images/mb/placeholder-6.jpg" },
];

// ─── Pricing & quote defaults ──────────────────────────────────────────────
// Mirrors the `pricingSettings` singleton. Every number here is the value the
// quote used before the CMS existed; the client can change them in Studio.

export const DEFAULT_PRICING_SETTINGS: PricingSettings = {
  gstPercent: 5,
  // Placeholder surcharge per extra set-menu dish — confirm with client.
  addOnPricePerItem: 100,
  minimumGuests: 0,

  showDiscountField: true,
  discountCodes: [],
  invalidCodeMessage: "No valid discount codes yet.",

  quoteHeading: "Review & Quote",
  quoteSubheading:
    "Everything you have chosen review before generating the final quote.",
  quoteValidityDays: 0,
  depositPercent: 0,
  quoteTerms: [],
};

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
