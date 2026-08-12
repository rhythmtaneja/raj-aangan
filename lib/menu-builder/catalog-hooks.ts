// ══════════════════════════════════════════════════════════════════
// PATH IN REPO: lib/menu-builder/catalog-hooks.ts
// ══════════════════════════════════════════════════════════════════
// Small client hooks over the catalog context. Kept out of catalog.tsx so
// that file stays just the provider.
// ═══════════════════════════════════════════════════════════════════════════

"use client";

import { useMemo } from "react";
import { useCatalog } from "./catalog";
import type { PricingData } from "./pricing";

/**
 * The bundle every pricing function takes. Memoised on the catalog's identity,
 * which is stable for the whole wizard session.
 */
export function usePricingData(): PricingData {
  const { pricing, getSetMenu, getCustomItem, getCatalogItem, getCatalogSelection, venues } =
    useCatalog();
  return useMemo(
    () => ({
      settings: pricing,
      getSetMenu,
      getCustomItem,
      getCatalogItem,
      getCatalogSelection,
      venues,
    }),
    [pricing, getSetMenu, getCustomItem, getCatalogItem, getCatalogSelection, venues],
  );
}
