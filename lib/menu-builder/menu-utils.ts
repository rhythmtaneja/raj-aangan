import type {
  CatalogItem,
  CatalogVariant,
  CuisineCard,
  CustomMenuItem,
  CustomMenuSection,
} from "./types";

export const itemsInSection = (section: CustomMenuSection): number =>
  section.subsections.reduce((n, sub) => n + sub.items.length, 0);

export const sectionMap = (
  sections: CustomMenuSection[],
): Map<string, CustomMenuSection> => new Map(sections.map((s) => [s.id, s]));

export const customItemMap = (
  sections: CustomMenuSection[],
): Map<string, CustomMenuItem> =>
  new Map(
    sections.flatMap((s) =>
      s.subsections.flatMap((sub) =>
        sub.items.map((it) => [it.id, it] as const),
      ),
    ),
  );

export type CatalogSelection = {
  item: CatalogItem;
  variant?: CatalogVariant;

  label: string;
  unitPrice: number | null;
};

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

export function unmappedSectionIds(
  cards: { sectionIds: string[] }[],
  sections: CustomMenuSection[],
): string[] {
  const claimed = new Set(cards.flatMap((c) => c.sectionIds));
  return sections.filter((s) => !claimed.has(s.id)).map((s) => s.id);
}

export function sectionsForCuisines(
  cards: CuisineCard[],
  sections: CustomMenuSection[],
  cuisineIds: string[],
): CustomMenuSection[] {
  if (cuisineIds.length === 0) return sections;
  const allowed = new Set(
    cuisineIds.flatMap(
      (id) => cards.find((c) => c.id === id)?.sectionIds ?? [],
    ),
  );
  return sections.filter((s) => allowed.has(s.id));
}

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
