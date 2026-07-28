// ══════════════════════════════════════════════════════════════════
// PATH IN REPO: lib/menu-builder/cuisine-groups.ts
// ══════════════════════════════════════════════════════════════════
// The FALLBACK cuisine cards for /menu-builder/cuisine (custom-menu step 1 of
// 2) — used until Sanity has `cuisineGroup` documents, and whenever Sanity is
// unreachable. Once the CMS is seeded, queries.ts serves these from Sanity and
// this file is only the safety net (it also seeds the CMS — see
// scripts/seed-menu-builder.ts).
//
// Each card groups one or more sections of the à-la-carte master menu
// (CUSTOM_MENU_SECTIONS, generated from RAEC_master_menu.csv). Whatever the
// guest picks here is exactly what /menu-builder/custom-menu then shows — pick
// Drinks + Chaat + Soup and only those three groups' sections appear.
//
// Item counts are DERIVED from the real data (not hardcoded), so regenerating
// the master menu keeps the cards honest. Any section that is not listed in a
// group below is collected into a trailing "Chef's Selection" card, so a new
// section added to the CSV can never silently disappear from the builder.
//
// TODO(assets): "Salads & Wellness Bowls" has no photo yet — it currently uses
// the generic mb-placeholder. Swap in a real shot when the client supplies one.
// ═══════════════════════════════════════════════════════════════════════════

import { CUSTOM_MENU_SECTIONS } from "./generated/custom-menu";
import { unmappedSectionIds, withCuisineCounts } from "./menu-utils";
import type { CuisineCard } from "./types";

const PLACEHOLDER_IMG = "/images/mb-placeholder.jpg";

/** A card before its counts are derived (what the mapping below declares). */
export type CuisineGroup = {
  id: string;
  name: string;
  image: string;
  /** ids of the CUSTOM_MENU_SECTIONS this card unlocks. */
  sectionIds: string[];
};

// ─── The mapping ───────────────────────────────────────────────────────────
// Card order = the order they appear on the cuisine screen (loosely the order
// of a meal: drinks → soups → starters → mains → sides → desserts).

export const CUISINE_GROUPS: CuisineGroup[] = [
  {
    id: "drinks",
    name: "Drinks",
    image: "/images/mb-cat-drinks.jpg",
    sectionIds: [
      "signature-welcome-elixirs",
      "artisan-shake-lassi-bar",
      "crafted-mocktail-infusions",
      "signature-warm-infusions",
      "refined-tea-rituals",
      "signature-welcome-experience",
      "royal-beverage-pairing-dessert-drinks",
    ],
  },
  {
    id: "soup",
    name: "Soup",
    image: "/images/mb-cat-soup.jpg",
    sectionIds: ["the-soup-atelier"],
  },
  {
    id: "chaat",
    name: "Chaat",
    image: "/images/mb-cat-chaat.jpg",
    sectionIds: ["the-great-indian-chaat-experience"],
  },
  {
    id: "tandoor",
    name: "Tandoor",
    image: "/images/mb-cat-tandoor.jpg",
    sectionIds: ["the-tandoor-creations"],
  },
  {
    id: "indian-starters",
    name: "Indian Starters",
    image: "/images/cuisine-punjabi.jpg",
    sectionIds: ["modern-indian-signatures", "indian-culinary-heirlooms"],
  },
  {
    id: "pan-asian",
    name: "Pan Asian",
    image: "/images/mb-cat-pan-asian.jpg",
    sectionIds: [
      "appetizers-pan-asian-curated-selection",
      "pan-asian-global-gourmet-mains",
      "the-burmese-khao-suey-atelier",
    ],
  },
  {
    id: "oriental",
    name: "Oriental",
    image: "/images/mb-cat-oriental.jpg",
    sectionIds: ["the-oriental-culinary-experience", "oriental-dim-sum-pavilion-live"],
  },
  {
    id: "thai",
    name: "Thai",
    image: "/images/mb-cat-thai.jpg",
    sectionIds: ["the-thai-culinary-experience"],
  },
  {
    id: "japanese",
    name: "Japanese",
    image: "/images/mb-cat-japanese.jpg",
    sectionIds: ["the-japanese-culinary-experience"],
  },
  {
    id: "lebanese",
    name: "Lebanese",
    image: "/images/mb-cat-lebanese.jpg",
    sectionIds: ["the-levantine-culinary-experience", "pita-khubus-artisanal-bread-bar"],
  },
  {
    id: "italian",
    name: "Italian",
    image: "/images/mb-cat-italian.jpg",
    sectionIds: ["the-italian-culinary-experience"],
  },
  {
    id: "continental",
    name: "Continental",
    image: "/images/cuisine-italian.png",
    sectionIds: [
      "taste-of-europe",
      "the-world-plate-collection",
      "the-chilled-edit",
      "european-baked-indulgence",
      "swiss-alpine-r-sti-counter",
      "the-grand-fromage-gallery",
    ],
  },
  {
    id: "salads",
    name: "Salads & Wellness Bowls",
    image: PLACEHOLDER_IMG,
    sectionIds: [
      "the-regal-greens-global-salad-symphony",
      "gourmet-designer-salads",
      "royal-indian-fusion-salads",
      "heritage-grains-wellness-bowls",
    ],
  },
  {
    id: "indian-mains",
    name: "Indian Mains",
    image: "/images/mb-cat-indian-mains.jpg",
    sectionIds: [
      "royal-paneer-vegetable-kitchen",
      "the-kofta-pavilion-of-royal-flavours",
      "the-royal-matar-sabzi-selection",
      "aloo-regional-specialties",
      "the-imperial-curry-khazana",
      "the-rajputana-sabz-bhandar",
      "the-rajputana-marwari-rasoi",
      "bhindi-seasonal-vegetables",
      "the-rajputana-bharwan-subz-darbar",
      "live-vegetable-station",
      "the-exotic-subz-indulgence",
      "the-rajputana-dal-kadhi-darbar",
      "indian-fusion-legacy-kitchen",
      "artisanal-kulcha-atelier",
    ],
  },
  {
    id: "dessert",
    name: "Dessert",
    image: "/images/mb-cat-dessert.jpg",
    sectionIds: [
      "the-dessert-edit",
      "dessert-studio-indian-indulgence-reimagined",
      "the-shahi-mithai-khazana",
      "the-shai-live-mithai-rasoi",
      "the-royal-sweet-connoisseur-s-collection",
      "international-patisserie-studio",
      "petit-desserts-mini-indulgences",
      "ice-cream-gelato-bar",
      "live-dessert-experience-counters",
    ],
  },
];

// ─── Derived: the fallback cards ───────────────────────────────────────────

/**
 * The mapping above plus a trailing "Chef's Selection" card for any section no
 * group claims, so nothing in the master menu is unreachable.
 */
export const CUISINE_GROUPS_WITH_REST: CuisineGroup[] = (() => {
  const rest = unmappedSectionIds(CUISINE_GROUPS, CUSTOM_MENU_SECTIONS);
  if (!rest.length) return CUISINE_GROUPS;
  return [
    ...CUISINE_GROUPS,
    {
      id: "chefs-selection",
      name: "Chef's Selection",
      image: PLACEHOLDER_IMG,
      sectionIds: rest,
    },
  ];
})();

/** Fallback cuisine cards, with real item counts. Empty cards are dropped. */
export const CUISINE_CARDS: CuisineCard[] = withCuisineCounts(
  CUISINE_GROUPS_WITH_REST,
  CUSTOM_MENU_SECTIONS,
);
