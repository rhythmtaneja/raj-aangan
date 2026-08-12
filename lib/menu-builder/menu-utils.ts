// ══════════════════════════════════════════════════════════════════
// PATH IN REPO: lib/menu-builder/menu-utils.ts
// ══════════════════════════════════════════════════════════════════
// Pure helpers over the menu data. Deliberately source-agnostic: the same
// functions serve the hardcoded fallback (cuisine-groups.ts) and the
// Sanity-fetched catalog (catalog.tsx), so both behave identically.
// ═══════════════════════════════════════════════════════════════════════════

import type {
  CatalogItem,
  CatalogVariant,
  CuisineCard,
  CustomMenuItem,
  CustomMenuSection,
} from "./types";

/** Total number of dishes in a section. */
export const itemsInSection = (section: CustomMenuSection): number =>
  section.subsections.reduce((n, sub) => n + sub.items.length, 0);

/** id → section, for the lookups below. */
export const sectionMap = (
  sections: CustomMenuSection[],
): Map<string, CustomMenuSection> => new Map(sections.map((s) => [s.id, s]));

/** id → dish, across every section (1128 items in the current master menu). */
export const customItemMap = (
  sections: CustomMenuSection[],
): Map<string, CustomMenuItem> =>
  new Map(
    sections.flatMap((s) =>
      s.subsections.flatMap((sub) => sub.items.map((it) => [it.id, it] as const)),
    ),
  );

// ─── Outdoor catalog ───────────────────────────────────────────────────────

/**
 * One line of an outdoor order: the section plus, when the guest picked a box
 * from inside it, that variant. `unitPrice` is the variant's own price when it
 * has one, else the section's — null means "quoted on request" (Premium
 * Add-ons), which contributes nothing to the total.
 */
export type CatalogSelection = {
  item: CatalogItem;
  variant?: CatalogVariant;
  /** What the line is called on the quote, e.g. "Festive Snack Packets — Holi Snack Packet". */
  label: string;
  unitPrice: number | null;
};

/**
 * Resolve a `catalogSelections` key. Keys are variant ids today; a plain
 * section id still resolves (older stored carts, and sections with no variants),
 * so a returning visitor's saved order never silently vanishes.
 */
export const catalogSelectionMap = (
  items: CatalogItem[],
): Map<string, CatalogSelection> => {
  const map = new Map<string, CatalogSelection>();
  for (const item of items) {
    map.set(item.id, { item, label: item.name, unitPrice: item.price });
    for (const variant of item.variants ?? []) {
      map.set(variant.id, {
        item,
        variant,
        label: `${item.name} — ${variant.name}`,
        unitPrice: variant.price ?? item.price,
      });
    }
  }
  return map;
};

/**
 * Fill in a cuisine card's derived counts from the sections it points at, and
 * drop cards whose sections are all missing/empty. Order is preserved.
 */
export function withCuisineCounts(
  cards: Omit<CuisineCard, "itemCount" | "sectionCount">[],
  sections: CustomMenuSection[],
): CuisineCard[] {
  const byId = sectionMap(sections);
  return cards
    .map((card) => {
      const found = card.sectionIds
        .map((id) => byId.get(id))
        .filter((s): s is CustomMenuSection => Boolean(s));
      return {
        ...card,
        sectionCount: found.length,
        itemCount: found.reduce((n, s) => n + itemsInSection(s), 0),
      };
    })
    .filter((c) => c.itemCount > 0);
}

/**
 * Sections not claimed by any cuisine card. Bundled into a trailing card by
 * the callers so a newly added section can never silently disappear.
 */
export function unmappedSectionIds(
  cards: { sectionIds: string[] }[],
  sections: CustomMenuSection[],
): string[] {
  const claimed = new Set(cards.flatMap((c) => c.sectionIds));
  return sections.filter((s) => !claimed.has(s.id)).map((s) => s.id);
}

/**
 * The sections unlocked by the given cuisine card ids, in menu order.
 * No ids → every section, so a deep link never lands on an empty screen.
 */
export function sectionsForCuisines(
  cards: CuisineCard[],
  sections: CustomMenuSection[],
  cuisineIds: string[],
): CustomMenuSection[] {
  if (cuisineIds.length === 0) return sections;
  const allowed = new Set(
    cuisineIds.flatMap((id) => cards.find((c) => c.id === id)?.sectionIds ?? []),
  );
  return sections.filter((s) => allowed.has(s.id));
}

/** Every dish id inside a cuisine card — used to prune de-selections. */
export function itemIdsForCuisine(
  cards: CuisineCard[],
  sections: CustomMenuSection[],
  cuisineId: string,
): string[] {
  const card = cards.find((c) => c.id === cuisineId);
  if (!card) return [];
  const byId = sectionMap(sections);
  return card.sectionIds.flatMap((sid) => {
    const section = byId.get(sid);
    if (!section) return [];
    return section.subsections.flatMap((sub) => sub.items.map((it) => it.id));
  });
}
