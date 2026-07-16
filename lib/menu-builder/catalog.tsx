// ══════════════════════════════════════════════════════════════════
// PATH IN REPO: lib/menu-builder/catalog.tsx
// ══════════════════════════════════════════════════════════════════
// Client context that carries the Sanity-fetched catalog (occasions,
// venues, cuisines, dishes) down to the wizard's client components.
// Fetched once, server-side, in app/menu-builder/layout.tsx.
//
// Static, non-Sanity config (budget tiers, cutlery, etc.) is NOT here —
// import those directly from ./config.
// ═══════════════════════════════════════════════════════════════════════════

"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Catalog } from "./queries";

const CatalogContext = createContext<Catalog | null>(null);

export function CatalogProvider({
  catalog,
  children,
}: {
  catalog: Catalog;
  children: ReactNode;
}) {
  return <CatalogContext.Provider value={catalog}>{children}</CatalogContext.Provider>;
}

export function useCatalog(): Catalog {
  const ctx = useContext(CatalogContext);
  if (!ctx) {
    throw new Error("useCatalog() must be called inside <CatalogProvider>");
  }
  return ctx;
}
