"use client";

import { useMemo } from "react";
import { useCatalog } from "./catalog";
import type { PricingData } from "./pricing";

export function usePricingData(): PricingData {
  const {
    pricing,
    getSetMenu,
    getCustomItem,
    getCatalogItem,
    getCatalogSelection,
    venues,
  } = useCatalog();
  return useMemo(
    () => ({
      settings: pricing,
      getSetMenu,
      getCustomItem,
      getCatalogItem,
      getCatalogSelection,
      venues,
    }),
    [
      pricing,
      getSetMenu,
      getCustomItem,
      getCatalogItem,
      getCatalogSelection,
      venues,
    ],
  );
}
