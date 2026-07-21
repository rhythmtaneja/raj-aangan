// ══════════════════════════════════════════════════════════════════
// PATH IN REPO: lib/menu-builder/data.ts
// ══════════════════════════════════════════════════════════════════
// PLACEHOLDER content for the reworked sub-flows that don't exist in Sanity
// yet (set menus, outdoor catalog, packaging). Imported directly by the new
// client pages so the whole flow works before Phase 8 wires Sanity. When the
// CMS pass lands, these arrays move behind queries.ts loaders and the pages
// swap their import — nothing else changes.
//
// All imagery uses /images/mb/placeholder-N.jpg (N = 1..12). The client will
// drop real assets later.
// ═══════════════════════════════════════════════════════════════════════════

import type { CatalogItem, PackagingStyle, SetMenu } from "./types";

const img = (n: number) => `/images/mb/placeholder-${n}.jpg`;

// ─── TUNE THESE KNOBS ──────────────────────────────────────────────────────
// Per-person prices, section chooseCounts and dish names below are all
// placeholders — replace via Sanity in Phase 8.
// ═══════════════════════════════════════════════════════════════════════════

// ─── Sub-flow A — Raj Aangan set menus ─────────────────────────────────────

export const SET_MENUS: SetMenu[] = [
  {
    id: "set-breakfast",
    name: "Breakfast Menu",
    slug: "breakfast-menu",
    perPersonPrice: 450,
    coverImage: img(1),
    description: "RO water and 200ml bottles are included in the package.",
    mealTypeFit: ["Breakfast", "Brunch"],
    sections: [
      {
        id: "bf-juices",
        label: "Juices",
        chooseCount: 2,
        dishOptions: [
          { id: "bf-j1", name: "Fresh Orange Juice" },
          { id: "bf-j2", name: "Watermelon Juice" },
          { id: "bf-j3", name: "Pineapple Juice" },
          { id: "bf-j4", name: "Mixed Fruit Juice" },
          { id: "bf-j5", name: "Sweet Lime Juice" },
          { id: "bf-j6", name: "Sugarcane Juice" },
        ],
      },
      {
        id: "bf-mains",
        label: "Breakfast Mains",
        chooseCount: 3,
        dishOptions: [
          { id: "bf-m1", name: "Aloo Paratha", subtitle: "with curd & pickle" },
          { id: "bf-m2", name: "Poha" },
          { id: "bf-m3", name: "Masala Dosa" },
          { id: "bf-m4", name: "Idli Sambhar" },
          { id: "bf-m5", name: "Chole Bhature" },
          { id: "bf-m6", name: "Stuffed Kulcha" },
          { id: "bf-m7", name: "Uttapam" },
          { id: "bf-m8", name: "Bread Pakora" },
        ],
      },
      {
        id: "bf-sides",
        label: "Sides & Bakery",
        chooseCount: 2,
        dishOptions: [
          { id: "bf-s1", name: "Assorted Toast" },
          { id: "bf-s2", name: "Croissant" },
          { id: "bf-s3", name: "Fruit Bowl" },
          { id: "bf-s4", name: "Cornflakes & Milk" },
          { id: "bf-s5", name: "Seasonal Fruit Platter" },
          { id: "bf-s6", name: "Assorted Cookies" },
        ],
      },
      {
        id: "bf-beverages",
        label: "Hot Beverages",
        chooseCount: 2,
        dishOptions: [
          { id: "bf-b1", name: "Masala Chai" },
          { id: "bf-b2", name: "Filter Coffee" },
          { id: "bf-b3", name: "Green Tea" },
          { id: "bf-b4", name: "Hot Chocolate" },
          { id: "bf-b5", name: "Cappuccino" },
        ],
      },
    ],
  },
  {
    id: "set-lunch",
    name: "Lunch Menu",
    slug: "lunch-menu",
    perPersonPrice: 750,
    coverImage: img(2),
    description: "RO water and 200ml bottles are included in the package.",
    mealTypeFit: ["Lunch", "Brunch"],
    sections: [
      {
        id: "ln-snacks",
        label: "Snacks",
        chooseCount: 4,
        dishOptions: [
          { id: "ln-sn1", name: "French Fries" },
          { id: "ln-sn2", name: "Paneer Tikka" },
          { id: "ln-sn3", name: "Veg Spring Roll" },
          { id: "ln-sn4", name: "Hara Bhara Kebab" },
          { id: "ln-sn5", name: "Corn Cheese Balls" },
          { id: "ln-sn6", name: "Dahi Ke Kebab" },
          { id: "ln-sn7", name: "Mushroom Duplex" },
          { id: "ln-sn8", name: "Chilli Paneer" },
        ],
      },
      {
        id: "ln-mains",
        label: "Main Course",
        chooseCount: 4,
        dishOptions: [
          { id: "ln-m1", name: "Shahi Paneer" },
          { id: "ln-m2", name: "Dal Makhani" },
          { id: "ln-m3", name: "Veg Jaipuri" },
          { id: "ln-m4", name: "Kadhai Paneer" },
          { id: "ln-m5", name: "Aloo Gobi" },
          { id: "ln-m6", name: "Malai Kofta" },
          { id: "ln-m7", name: "Jeera Aloo" },
          { id: "ln-m8", name: "Mix Veg" },
          { id: "ln-m9", name: "Rajma Masala" },
        ],
      },
      {
        id: "ln-breads",
        label: "Breads & Rice",
        chooseCount: 3,
        dishOptions: [
          { id: "ln-br1", name: "Butter Naan" },
          { id: "ln-br2", name: "Tandoori Roti" },
          { id: "ln-br3", name: "Lachha Paratha" },
          { id: "ln-br4", name: "Jeera Rice" },
          { id: "ln-br5", name: "Veg Pulao" },
          { id: "ln-br6", name: "Steamed Rice" },
        ],
      },
      {
        id: "ln-dessert",
        label: "Dessert",
        chooseCount: 2,
        dishOptions: [
          { id: "ln-d1", name: "Gulab Jamun" },
          { id: "ln-d2", name: "Moong Dal Halwa" },
          { id: "ln-d3", name: "Rasmalai" },
          { id: "ln-d4", name: "Gajar Ka Halwa" },
          { id: "ln-d5", name: "Ice Cream" },
          { id: "ln-d6", name: "Fruit Cream" },
        ],
      },
    ],
  },
  {
    id: "set-maharani",
    name: "Maharani Dinner Menu",
    slug: "maharani-dinner-menu",
    perPersonPrice: 1250,
    coverImage: img(3),
    description: "RO water and 200ml bottles are included in the package.",
    mealTypeFit: ["Dinner", "Cocktail"],
    sections: [
      {
        id: "mr-mocktails",
        label: "Mocktails",
        chooseCount: 2,
        dishOptions: [
          { id: "mr-mc1", name: "Virgin Mojito" },
          { id: "mr-mc2", name: "Blue Lagoon" },
          { id: "mr-mc3", name: "Fruit Punch" },
          { id: "mr-mc4", name: "Green Apple Cooler" },
          { id: "mr-mc5", name: "Watermelon Splash" },
          { id: "mr-mc6", name: "Rose Sharbat" },
        ],
      },
      {
        id: "mr-snacks",
        label: "Snacks",
        chooseCount: 4,
        dishOptions: [
          { id: "mr-sn1", name: "French Fries" },
          { id: "mr-sn2", name: "Paneer Malai Tikka" },
          { id: "mr-sn3", name: "Tandoori Broccoli" },
          { id: "mr-sn4", name: "Cheese Corn Rolls" },
          { id: "mr-sn5", name: "Beetroot Tikki" },
          { id: "mr-sn6", name: "Stuffed Mushroom" },
          { id: "mr-sn7", name: "Achari Paneer Tikka" },
          { id: "mr-sn8", name: "Veg Seekh Kebab" },
          { id: "mr-sn9", name: "Crispy Corn" },
          { id: "mr-sn10", name: "Soya Chaap" },
        ],
      },
      {
        id: "mr-soups",
        label: "Soups",
        chooseCount: 1,
        dishOptions: [
          { id: "mr-sp1", name: "Cream of Tomato" },
          { id: "mr-sp2", name: "Hot & Sour" },
          { id: "mr-sp3", name: "Sweet Corn" },
          { id: "mr-sp4", name: "Manchow" },
          { id: "mr-sp5", name: "Lemon Coriander" },
        ],
      },
      {
        id: "mr-mains",
        label: "Main Course",
        chooseCount: 5,
        dishOptions: [
          { id: "mr-m1", name: "Paneer Lababdar" },
          { id: "mr-m2", name: "Dal Makhani" },
          { id: "mr-m3", name: "Subz Diwani Handi" },
          { id: "mr-m4", name: "Kaju Curry" },
          { id: "mr-m5", name: "Veg Kolhapuri" },
          { id: "mr-m6", name: "Palak Paneer" },
          { id: "mr-m7", name: "Dum Aloo Banarasi" },
          { id: "mr-m8", name: "Navratan Korma" },
          { id: "mr-m9", name: "Methi Malai Matar" },
          { id: "mr-m10", name: "Chana Masala" },
        ],
      },
      {
        id: "mr-dessert",
        label: "Dessert",
        chooseCount: 3,
        dishOptions: [
          { id: "mr-d1", name: "Angoori Rasmalai" },
          { id: "mr-d2", name: "Moong Dal Halwa" },
          { id: "mr-d3", name: "Kesar Phirni" },
          { id: "mr-d4", name: "Assorted Pastries" },
          { id: "mr-d5", name: "Jalebi with Rabri" },
          { id: "mr-d6", name: "Kulfi Falooda" },
          { id: "mr-d7", name: "Chocolate Fountain" },
        ],
      },
    ],
  },
  {
    id: "set-maharaja",
    name: "Maharaja Vyanjan",
    slug: "maharaja-vyanjan",
    perPersonPrice: 1750,
    coverImage: img(4),
    description: "Our grandest spread. RO water and 200ml bottles are included in the package.",
    mealTypeFit: ["Dinner", "Cocktail"],
    sections: [
      {
        id: "mj-welcome",
        label: "Welcome Drinks",
        chooseCount: 2,
        dishOptions: [
          { id: "mj-w1", name: "Kesar Thandai" },
          { id: "mj-w2", name: "Aam Panna" },
          { id: "mj-w3", name: "Jaljeera Shots" },
          { id: "mj-w4", name: "Paan Mojito" },
          { id: "mj-w5", name: "Guava Chilli Cooler" },
          { id: "mj-w6", name: "Litchi Lemonade" },
        ],
      },
      {
        id: "mj-snacks",
        label: "Signature Snacks",
        chooseCount: 6,
        dishOptions: [
          { id: "mj-sn1", name: "Truffle Paneer Tikka" },
          { id: "mj-sn2", name: "Dahi Kebab Platter" },
          { id: "mj-sn3", name: "Peri Peri Fries" },
          { id: "mj-sn4", name: "Water Chestnut Tikki" },
          { id: "mj-sn5", name: "Cheese Jalapeno Poppers" },
          { id: "mj-sn6", name: "Zaffrani Malai Broccoli" },
          { id: "mj-sn7", name: "Mushroom Galouti" },
          { id: "mj-sn8", name: "Lotus Stem Honey Chilli" },
          { id: "mj-sn9", name: "Corn Palak Shammi" },
          { id: "mj-sn10", name: "Tandoori Aloo" },
          { id: "mj-sn11", name: "Paneer Shashlik" },
          { id: "mj-sn12", name: "Veg Galouti Kebab" },
        ],
      },
      {
        id: "mj-soups",
        label: "Soups",
        chooseCount: 1,
        dishOptions: [
          { id: "mj-sp1", name: "Wild Mushroom Cappuccino" },
          { id: "mj-sp2", name: "Thai Coconut Broth" },
          { id: "mj-sp3", name: "Roasted Tomato Basil" },
          { id: "mj-sp4", name: "Burnt Garlic Broth" },
        ],
      },
      {
        id: "mj-mains",
        label: "Royal Main Course",
        chooseCount: 6,
        dishOptions: [
          { id: "mj-m1", name: "Paneer Zaffrani" },
          { id: "mj-m2", name: "Dal Raj Aangan" },
          { id: "mj-m3", name: "Subz Nizami Handi" },
          { id: "mj-m4", name: "Kofta Shahi Korma" },
          { id: "mj-m5", name: "Kadhai Mushroom Masala" },
          { id: "mj-m6", name: "Gatte Ki Sabzi" },
          { id: "mj-m7", name: "Ker Sangri" },
          { id: "mj-m8", name: "Paneer Pasanda" },
          { id: "mj-m9", name: "Bharwan Baingan" },
          { id: "mj-m10", name: "Aloo Rajwadi" },
          { id: "mj-m11", name: "Vegetable Biryani" },
          { id: "mj-m12", name: "Lasooni Palak" },
        ],
      },
      {
        id: "mj-dessert",
        label: "Grand Desserts",
        chooseCount: 4,
        dishOptions: [
          { id: "mj-d1", name: "Shahi Tukda" },
          { id: "mj-d2", name: "Rabri Ghewar" },
          { id: "mj-d3", name: "Anjeer Halwa" },
          { id: "mj-d4", name: "Kulfi Trio" },
          { id: "mj-d5", name: "Live Jalebi Counter" },
          { id: "mj-d6", name: "Assorted Bengali Sweets" },
          { id: "mj-d7", name: "Chocolate Walnut Brownie" },
          { id: "mj-d8", name: "Paan Ice Cream" },
        ],
      },
    ],
  },
];

// ─── Sub-flow C — Outdoor catalog (image 9) ────────────────────────────────

export const CATALOG_ITEMS: CatalogItem[] = [
  {
    id: "cat-sweet-box",
    name: "Wedding Favour Sweet Box",
    description: "Assorted mithai, festive packaging",
    price: 220,
    unit: "per box",
    image: img(5),
    category: "sweet-box",
  },
  {
    id: "cat-bulk-mithai",
    name: "Bulk Ladoo / Mithai Order",
    description: "Besan / boondi / motichoor, bulk pricing",
    price: 380,
    unit: "per kg",
    image: img(6),
    category: "bulk-mithai",
  },
  {
    id: "cat-meal-box",
    name: "Corporate Meal Box",
    description: "3-course boxed meal for office events",
    price: 260,
    unit: "per box",
    image: img(7),
    category: "meal-box",
  },
  {
    id: "cat-snack-packet",
    name: "Festive Snack Packets",
    description: "Namkeen, kachori, sweet — sealed packet",
    price: 120,
    unit: "per packet",
    image: img(8),
    category: "snack-packet",
  },
  {
    id: "cat-breakfast-box",
    name: "Packed Breakfast Box",
    description: "Poha/paratha + beverage, sealed box",
    price: 180,
    unit: "per box",
    image: img(9),
    category: "meal-box",
  },
  {
    id: "cat-live-counter-van",
    name: "Live Counter Van (on-site)",
    description: "Chaat / Chinese counter on wheels",
    price: 15000,
    unit: "per day",
    image: img(10),
    category: "live-counter-van",
  },
];

// ─── Sub-flow C — Packaging styles ─────────────────────────────────────────

export const PACKAGING_STYLES: PackagingStyle[] = [
  { id: "eco-kraft", label: "Eco Kraft Box" },
  { id: "traditional-thali", label: "Traditional Thali Box" },
  { id: "premium-gift", label: "Premium Gift Box" },
  { id: "standard-foil", label: "Standard Foil Pack" },
];

// ─── Lookup helpers ────────────────────────────────────────────────────────

export const getSetMenuById = (id: string | null): SetMenu | undefined =>
  id ? SET_MENUS.find((m) => m.id === id) : undefined;

export const getCatalogItemById = (id: string): CatalogItem | undefined =>
  CATALOG_ITEMS.find((c) => c.id === id);

export const getPackagingById = (id: string | null): PackagingStyle | undefined =>
  id ? PACKAGING_STYLES.find((p) => p.id === id) : undefined;
