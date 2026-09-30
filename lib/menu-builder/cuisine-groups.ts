import { CUSTOM_MENU_SECTIONS } from "./generated/custom-menu";
import { unmappedSectionIds, withCuisineCounts } from "./menu-utils";
import type { CuisineCard } from "./types";

const PLACEHOLDER_IMG = "/images/mb-placeholder.jpg";

export type CuisineGroup = {
  id: string;
  name: string;
  image: string;

  sectionIds: string[];
};

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
    sectionIds: [
      "the-oriental-culinary-experience",
      "oriental-dim-sum-pavilion-live",
    ],
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
    sectionIds: [
      "the-levantine-culinary-experience",
      "pita-khubus-artisanal-bread-bar",
    ],
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

export const CUISINE_CARDS: CuisineCard[] = withCuisineCounts(
  CUISINE_GROUPS_WITH_REST,
  CUSTOM_MENU_SECTIONS,
);
