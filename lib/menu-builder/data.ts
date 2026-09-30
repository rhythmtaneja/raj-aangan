import type {
  CatalogItem,
  CustomMenuItem,
  PackagingStyle,
  SetMenu,
} from "./types";

import { SET_MENUS } from "./generated/set-menus";
export { SET_MENUS };

import { CUSTOM_MENU_SECTIONS } from "./generated/custom-menu";
export { CUSTOM_MENU_SECTIONS };

const CUSTOM_ITEM_BY_ID: Map<string, CustomMenuItem> = new Map(
  CUSTOM_MENU_SECTIONS.flatMap((s) =>
    s.subsections.flatMap((ss) => ss.items.map((it) => [it.id, it] as const)),
  ),
);

export const getCustomMenuItemById = (id: string): CustomMenuItem | undefined =>
  CUSTOM_ITEM_BY_ID.get(id);

import { OUTDOOR_CATALOG_ITEMS } from "./generated/outdoor-catalog";
export { OUTDOOR_CATALOG_ITEMS };

export const CATALOG_ITEMS: CatalogItem[] = OUTDOOR_CATALOG_ITEMS;

export const PACKAGING_STYLES: PackagingStyle[] = [
  { id: "eco-kraft", label: "Eco Kraft Box" },
  { id: "traditional-thali", label: "Traditional Thali Box" },
  { id: "premium-gift", label: "Premium Gift Box" },
  { id: "standard-foil", label: "Standard Foil Pack" },
];

export const getSetMenuById = (id: string | null): SetMenu | undefined =>
  id ? SET_MENUS.find((m) => m.id === id) : undefined;

export const getCatalogItemById = (id: string): CatalogItem | undefined =>
  CATALOG_ITEMS.find((c) => c.id === id);

export const getPackagingById = (
  id: string | null,
): PackagingStyle | undefined =>
  id ? PACKAGING_STYLES.find((p) => p.id === id) : undefined;
