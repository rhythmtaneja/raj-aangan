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

import type { CatalogItem, CustomMenuItem, PackagingStyle, SetMenu } from "./types";

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

// ─── Custom builder — full à-la-carte master menu (generated from CSV) ──────
import { CUSTOM_MENU_SECTIONS } from "./generated/custom-menu";
export { CUSTOM_MENU_SECTIONS };

// Flat id → item lookup, built once (1128 items).
const CUSTOM_ITEM_BY_ID: Map<string, CustomMenuItem> = new Map(
  CUSTOM_MENU_SECTIONS.flatMap((s) =>
    s.subsections.flatMap((ss) => ss.items.map((it) => [it.id, it] as const)),
  ),
);

export const getCustomMenuItemById = (id: string): CustomMenuItem | undefined =>
  CUSTOM_ITEM_BY_ID.get(id);

// ─── Sub-flow C — Outdoor catalog (image 9) ────────────────────────────────
// The 8 sections and their 77 boxes/packets/vans live in the GENERATED file
// below — see scripts/gen_outdoor_catalog.py, which reads the client's
// "RAEC Outdoor Catering.xlsx" (one worksheet per section). Prices there are
// still the placeholders that used to be hardcoded here: one per section,
// inherited by every variant in it.
import { OUTDOOR_CATALOG_ITEMS } from "./generated/outdoor-catalog";
export { OUTDOOR_CATALOG_ITEMS };

export const CATALOG_ITEMS: CatalogItem[] = OUTDOOR_CATALOG_ITEMS;

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
