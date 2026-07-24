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
// The 7 packages (Breakfast, Lunch, Maharani, Maharaja, Signature, Royal Feast,
// Elite) live in the GENERATED file below — see scripts/gen_set_menus.py.
// Imported locally (used by getSetMenuById) and re-exported.
import { SET_MENUS } from "./generated/set-menus";
export { SET_MENUS };

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
