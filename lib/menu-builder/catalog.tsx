// ══════════════════════════════════════════════════════════════════
// PATH IN REPO: lib/menu-builder/catalog.tsx
// ══════════════════════════════════════════════════════════════════
// Client context carrying the Sanity-fetched catalog (fetched once, server
// side, in app/menu-builder/layout.tsx) down to the wizard's client
// components — plus the lookups derived from it.
//
// Everything the wizard renders or prices comes from here, so a component
// never imports the hardcoded data directly; whether the numbers came from
// Sanity or the code fallback is decided in queries.ts alone.
// ═══════════════════════════════════════════════════════════════════════════

"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import {
  catalogSelectionMap,
  customItemMap,
  sectionsForCuisines as filterSections,
  itemIdsForCuisine as itemIdsIn,
  type CatalogSelection,
} from "./menu-utils";
import type { Catalog } from "./queries";
import type {
  CatalogItem,
  CuisineCard,
  CustomMenuItem,
  CustomMenuSection,
  PackagingStyle,
  SetMenu,
} from "./types";

/** The catalog plus the lookups every step needs. */
export type CatalogValue = Catalog & {
  getSetMenu: (id: string | null) => SetMenu | undefined;
  getCustomItem: (id: string) => CustomMenuItem | undefined;
  getCatalogItem: (id: string) => CatalogItem | undefined;
  /**
   * Resolve an outdoor-cart key (a variant id, or a bare section id from an
   * older stored cart) to its section, variant, label and unit price.
   */
  getCatalogSelection: (id: string) => CatalogSelection | undefined;
  getPackaging: (id: string | null) => PackagingStyle | undefined;
  getCuisineCard: (id: string) => CuisineCard | undefined;
  /** À-la-carte sections unlocked by the given cuisine cards (all if empty). */
  sectionsForCuisines: (cuisineIds: string[]) => CustomMenuSection[];
  /** Every dish id inside a cuisine card — used to prune de-selections. */
  itemIdsForCuisine: (cuisineId: string) => string[];
};

const CatalogContext = createContext<CatalogValue | null>(null);

export function CatalogProvider({
  catalog,
  children,
}: {
  catalog: Catalog;
  children: ReactNode;
}) {
  const value = useMemo<CatalogValue>(() => {
    const itemById = customItemMap(catalog.customMenuSections);
    const selectionById = catalogSelectionMap(catalog.catalogItems);
    return {
      ...catalog,
      getSetMenu: (id) => (id ? catalog.setMenus.find((m) => m.id === id) : undefined),
      getCustomItem: (id) => itemById.get(id),
      getCatalogItem: (id) => catalog.catalogItems.find((c) => c.id === id),
      getCatalogSelection: (id) => selectionById.get(id),
      getPackaging: (id) =>
        id ? catalog.packagingStyles.find((p) => p.id === id) : undefined,
      getCuisineCard: (id) => catalog.cuisineCards.find((c) => c.id === id),
      sectionsForCuisines: (ids) =>
        filterSections(catalog.cuisineCards, catalog.customMenuSections, ids),
      itemIdsForCuisine: (id) =>
        itemIdsIn(catalog.cuisineCards, catalog.customMenuSections, id),
    };
  }, [catalog]);

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog(): CatalogValue {
  const ctx = useContext(CatalogContext);
  if (!ctx) {
    throw new Error("useCatalog() must be called inside <CatalogProvider>");
  }
  return ctx;
}
