// ══════════════════════════════════════════════════════════════════
// PATH IN REPO: lib/menu-builder/queries.ts
// ══════════════════════════════════════════════════════════════════
// Typed, server-only catalog fetchers — the single door between Sanity and
// the Menu Builder.
//
//   • When Sanity is configured, fetch published content via GROQ, tagged
//     for ISR so Studio publishes appear on the site within ~30s
//     (revalidated by app/api/revalidate/route.ts on the Sanity webhook).
//   • When it isn't (or a fetch fails / returns empty), fall back to the
//     hardcoded data so the wizard always works:
//         set menus            → generated/set-menus.ts
//         à-la-carte sections  → generated/custom-menu.ts
//         cuisine cards        → cuisine-groups.ts
//         presentation options → config.ts
//         outdoor + packaging  → data.ts
//         pricing / quote      → config.ts/DEFAULT_PRICING_SETTINGS
//         venues / occasions   → fallback.ts
//
// Never import this into a "use client" file — it uses the server client.
// ═══════════════════════════════════════════════════════════════════════════

import "server-only";
import { client } from "@/sanity/client";
import { imageUrl } from "@/sanity/image";
import { isSanityConfigured } from "@/sanity/env";
import * as fallback from "./fallback";
import {
  CUTLERY_OPTIONS,
  DEFAULT_PRICING_SETTINGS,
  LIVE_COUNTERS,
  LIVE_COUNTER_TILES,
  PRESENTATION_STYLES,
  STALL_THEMES,
} from "./config";
import { CUISINE_CARDS } from "./cuisine-groups";
import { CATALOG_ITEMS, PACKAGING_STYLES } from "./data";
import { CUSTOM_MENU_SECTIONS } from "./generated/custom-menu";
import { SET_MENUS } from "./generated/set-menus";
import { withCuisineCounts } from "./menu-utils";
import type {
  Occasion, Venue, CuisineCategory, Dish, DishTag, PresetMenu,
  CatalogItem, CuisineCard, CustomMenuSection, DiscountCode, LiveCounter,
  MealType, PackagingStyle, PricingSettings, SetMenu,
} from "./types";

const REVALIDATE = 30; // seconds
const PLACEHOLDER = "/images/mb-placeholder.jpg";

async function sanityFetch<T>(query: string, tag: string): Promise<T> {
  return client.fetch<T>(query, {}, { next: { revalidate: REVALIDATE, tags: [tag] } });
}

// ─── Dish mapping helpers ──────────────────────────────────────────────────

type RawDish = {
  id: string;
  name: string;
  subtitle?: string;
  cuisineCategoryId?: string;
  price?: number | null;
  dietaryTags?: string[];
  categories?: { label: string; parentSection: string; sortOrder?: number }[];
};

// No "non-veg" entry — the tag is retired, so a legacy dish still carrying it
// simply gets no dietary tag rather than surfacing "Non Veg" in the UI.
const DIET_TO_TAG: Record<string, DishTag> = {
  veg: "Veg",
  jain: "Jain",
  satvik: "Satvik",
};

const SECTION_TO_TAG: Record<string, DishTag> = {
  starters: "Starter",
  mains: "Main",
  desserts: "Dessert",
  beverages: "Beverage",
};

function mapDish(raw: RawDish): Dish {
  const categories = [...(raw.categories ?? [])].sort(
    (a, b) => (a.sortOrder ?? 100) - (b.sortOrder ?? 100),
  );
  const tags: DishTag[] = [];
  for (const d of raw.dietaryTags ?? []) {
    const t = DIET_TO_TAG[d];
    if (t && !tags.includes(t)) tags.push(t);
  }
  for (const c of categories) {
    const t = SECTION_TO_TAG[c.parentSection];
    if (t && !tags.includes(t)) tags.push(t);
  }
  return {
    id: raw.id,
    name: raw.name,
    subtitle: raw.subtitle ?? undefined,
    section: categories[0]?.label ?? "Other",
    cuisineCategoryId: raw.cuisineCategoryId ?? "",
    price: raw.price ?? 0,
    tags,
  };
}

const DISH_PROJECTION = `{
  "id": slug.current,
  name,
  subtitle,
  "cuisineCategoryId": cuisine->slug.current,
  price,
  dietaryTags,
  "categories": categoryTags[]->{ label, parentSection, sortOrder }
}`;

// ─── Public queries ────────────────────────────────────────────────────────

export async function getOccasions(): Promise<Occasion[]> {
  if (!isSanityConfigured) return fallback.OCCASIONS;
  try {
    const rows = await sanityFetch<
      { id: string; label: string; image?: unknown }[]
    >(
      `*[_type=="occasion" && defined(slug.current)]|order(sortOrder asc, label asc){
        "id": slug.current, label, image
      }`,
      "occasion",
    );
    if (!rows.length) return fallback.OCCASIONS;
    return rows.map((r) => ({
      id: r.id,
      label: r.label,
      image: imageUrl(r.image, PLACEHOLDER, 600),
    }));
  } catch {
    return fallback.OCCASIONS;
  }
}

export async function getVenues(): Promise<Venue[]> {
  if (!isSanityConfigured) return fallback.VENUES;
  try {
    const rows = await sanityFetch<
      {
        id: string; name: string; image?: unknown;
        type: Venue["type"]; category?: Venue["category"];
        capacity?: string; pricingNote?: string; description?: string;
        logisticsPerHead?: number;
      }[]
    >(
      `*[_type=="venue" && defined(slug.current)]|order(sortOrder asc, name asc){
        "id": slug.current, name, image, type, category, capacity,
        pricingNote, description, logisticsPerHead
      }`,
      "venue",
    );
    if (!rows.length) return fallback.VENUES;
    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      image: imageUrl(r.image, PLACEHOLDER, 800),
      type: r.type,
      category: r.category ?? "Both",
      capacity: r.capacity ?? "",
      pricingNote: r.pricingNote ?? "",
      description: r.description || undefined,
      logisticsPerHead: r.logisticsPerHead ?? 0,
    }));
  } catch {
    return fallback.VENUES;
  }
}

export async function getCuisines(): Promise<CuisineCategory[]> {
  if (!isSanityConfigured) return fallback.CUISINE_CATEGORIES;
  try {
    const rows = await sanityFetch<
      { id: string; name: string; image?: unknown; itemCount: number }[]
    >(
      `*[_type=="cuisine" && defined(slug.current)]|order(sortOrder asc, label asc){
        "id": slug.current, "name": label, "image": coverImage,
        "itemCount": count(*[_type=="dish" && references(^._id) && isActive != false])
      }`,
      "cuisine",
    );
    if (!rows.length) return fallback.CUISINE_CATEGORIES;
    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      image: imageUrl(r.image, PLACEHOLDER, 600),
      itemCount: r.itemCount ?? 0,
    }));
  } catch {
    return fallback.CUISINE_CATEGORIES;
  }
}

export async function getAllDishes(): Promise<Dish[]> {
  if (!isSanityConfigured) return fallback.DISHES;
  try {
    const rows = await sanityFetch<RawDish[]>(
      `*[_type=="dish" && isActive != false && defined(slug.current)]|order(name asc)${DISH_PROJECTION}`,
      "dish",
    );
    if (!rows.length) return fallback.DISHES;
    return rows.map(mapDish);
  } catch {
    return fallback.DISHES;
  }
}

export async function getPresetMenus(): Promise<PresetMenu[]> {
  if (!isSanityConfigured) return fallback.PRESET_MENUS;
  try {
    const rows = await sanityFetch<
      {
        id: string; name: string; basePrice?: number | null;
        priceNote?: string; coverImage?: unknown; description?: string;
        sections?: {
          sectionName: string; chooseCount?: number; dishes?: RawDish[];
        }[];
      }[]
    >(
      `*[_type=="presetMenu" && defined(slug.current)]|order(sortOrder asc, name asc){
        "id": slug.current, name, basePrice, priceNote, coverImage, description,
        sections[]{
          sectionName, chooseCount,
          "dishes": dishes[]->${DISH_PROJECTION}
        }
      }`,
      "presetMenu",
    );
    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      basePrice: r.basePrice ?? null,
      priceNote: r.priceNote || undefined,
      image: imageUrl(r.coverImage, PLACEHOLDER, 1200),
      description: r.description || undefined,
      sections: (r.sections ?? []).map((s) => ({
        sectionName: s.sectionName,
        chooseCount: s.chooseCount ?? 0,
        dishes: (s.dishes ?? []).map(mapDish),
      })),
    }));
  } catch {
    return fallback.PRESET_MENUS;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// ─── Menu Builder (Phase 8) — the types the live wizard reads ──────────────
// ═══════════════════════════════════════════════════════════════════════════

// ─── Set menus ─────────────────────────────────────────────────────────────

type RawSetMenu = {
  id: string;
  name: string;
  perPersonPrice?: number | null;
  priceNote?: string;
  coverImage?: unknown;
  description?: string;
  mealTypeFit?: string[];
  addOnPricePerItem?: number | null;
  sections?: {
    id: string;
    label: string;
    chooseCount?: number | null;
    dishOptions?: { id: string; name: string; subtitle?: string }[];
  }[];
};

export async function getSetMenus(): Promise<SetMenu[]> {
  if (!isSanityConfigured) return SET_MENUS;
  try {
    const rows = await sanityFetch<RawSetMenu[]>(
      `*[_type=="setMenu" && isActive != false && defined(slug.current)]
        |order(sortOrder asc, name asc){
        "id": slug.current, name, perPersonPrice, priceNote, coverImage,
        description, mealTypeFit, addOnPricePerItem,
        sections[]{
          "id": _key, label, chooseCount,
          dishOptions[]{ "id": _key, name, subtitle }
        }
      }`,
      "setMenu",
    );
    if (!rows.length) return SET_MENUS;
    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      slug: r.id,
      perPersonPrice: r.perPersonPrice ?? 0,
      coverImage: imageUrl(r.coverImage, PLACEHOLDER, 800),
      description: r.description || undefined,
      priceNote: r.priceNote || undefined,
      mealTypeFit: (r.mealTypeFit ?? []) as MealType[],
      addOnPricePerItem: r.addOnPricePerItem ?? null,
      sections: (r.sections ?? []).map((s) => ({
        id: s.id,
        label: s.label,
        chooseCount: s.chooseCount ?? 0,
        dishOptions: (s.dishOptions ?? []).map((d) => ({
          id: d.id,
          name: d.name,
          subtitle: d.subtitle || undefined,
        })),
      })),
    }));
  } catch {
    return SET_MENUS;
  }
}

// ─── À-la-carte master menu ────────────────────────────────────────────────

type RawCustomSection = {
  id: string;
  label: string;
  subsections?: {
    label?: string;
    items?: {
      id: string;
      name: string;
      traditionalName?: string;
      description?: string;
      price?: number | null;
    }[];
  }[];
};

export async function getCustomMenuSections(): Promise<CustomMenuSection[]> {
  if (!isSanityConfigured) return CUSTOM_MENU_SECTIONS;
  try {
    const rows = await sanityFetch<RawCustomSection[]>(
      `*[_type=="customMenuSection" && isActive != false && defined(slug.current)]
        |order(sortOrder asc, label asc){
        "id": slug.current, label,
        subsections[]{
          label,
          "items": items[isActive != false]{
            "id": _key, name, traditionalName, description, price
          }
        }
      }`,
      "customMenuSection",
    );
    if (!rows.length) return CUSTOM_MENU_SECTIONS;
    return rows.map((r) => ({
      id: r.id,
      label: r.label,
      subsections: (r.subsections ?? []).map((sub) => ({
        label: sub.label ?? "",
        items: (sub.items ?? []).map((it) => ({
          id: it.id,
          name: it.name,
          traditionalName: it.traditionalName || undefined,
          description: it.description || undefined,
          price: it.price ?? null,
        })),
      })),
    }));
  } catch {
    return CUSTOM_MENU_SECTIONS;
  }
}

// ─── Cuisine cards ─────────────────────────────────────────────────────────

/**
 * Cards come from Sanity but their counts are derived from `sections` (the
 * à-la-carte menu we just fetched), so the two can never drift.
 */
export async function getCuisineCards(
  sections: CustomMenuSection[],
): Promise<CuisineCard[]> {
  const fallbackCards = withCuisineCounts(CUISINE_CARDS, sections);
  if (!isSanityConfigured) return fallbackCards;
  try {
    const rows = await sanityFetch<
      { id: string; name: string; image?: unknown; sectionIds?: (string | null)[] }[]
    >(
      `*[_type=="cuisineGroup" && isActive != false && defined(slug.current)]
        |order(sortOrder asc, name asc){
        "id": slug.current, name, image,
        "sectionIds": sections[]->slug.current
      }`,
      "cuisineGroup",
    );
    if (!rows.length) return fallbackCards;
    return withCuisineCounts(
      rows.map((r) => ({
        id: r.id,
        name: r.name,
        image: imageUrl(r.image, PLACEHOLDER, 600),
        sectionIds: (r.sectionIds ?? []).filter((s): s is string => Boolean(s)),
      })),
      sections,
    );
  } catch {
    return fallbackCards;
  }
}

// ─── Presentation options ──────────────────────────────────────────────────

export type PresentationCatalog = {
  cutlery: { id: string; name: string; image: string }[];
  presentationStyles: { id: string; name: string; image: string }[];
  stallThemes: { id: string; name: string; image: string }[];
  liveCounterTiles: { id: string; name: string; image: string }[];
  liveCounters: LiveCounter[];
};

const PRESENTATION_FALLBACK: PresentationCatalog = {
  cutlery: CUTLERY_OPTIONS,
  presentationStyles: PRESENTATION_STYLES,
  stallThemes: STALL_THEMES,
  liveCounterTiles: LIVE_COUNTER_TILES,
  liveCounters: LIVE_COUNTERS,
};

export async function getPresentationCatalog(): Promise<PresentationCatalog> {
  if (!isSanityConfigured) return PRESENTATION_FALLBACK;
  try {
    const rows = await sanityFetch<
      { id: string; kind: string; name: string; image?: unknown }[]
    >(
      `*[_type=="presentationOption" && isActive != false && defined(slug.current)]
        |order(sortOrder asc, name asc){ "id": slug.current, kind, name, image }`,
      "presentationOption",
    );
    if (!rows.length) return PRESENTATION_FALLBACK;
    const tiles = (kind: string) =>
      rows
        .filter((r) => r.kind === kind)
        .map((r) => ({ id: r.id, name: r.name, image: imageUrl(r.image, PLACEHOLDER, 600) }));
    const result: PresentationCatalog = {
      cutlery: tiles("cutlery"),
      presentationStyles: tiles("presentationStyle"),
      stallThemes: tiles("stallTheme"),
      liveCounterTiles: tiles("liveCounterTile"),
      liveCounters: rows
        .filter((r) => r.kind === "liveCounter")
        .map((r) => ({ id: r.id, name: r.name })),
    };
    // A kind the client hasn't filled in yet keeps its hardcoded list.
    return {
      cutlery: result.cutlery.length ? result.cutlery : PRESENTATION_FALLBACK.cutlery,
      presentationStyles: result.presentationStyles.length
        ? result.presentationStyles
        : PRESENTATION_FALLBACK.presentationStyles,
      stallThemes: result.stallThemes.length
        ? result.stallThemes
        : PRESENTATION_FALLBACK.stallThemes,
      liveCounterTiles: result.liveCounterTiles.length
        ? result.liveCounterTiles
        : PRESENTATION_FALLBACK.liveCounterTiles,
      liveCounters: result.liveCounters.length
        ? result.liveCounters
        : PRESENTATION_FALLBACK.liveCounters,
    };
  } catch {
    return PRESENTATION_FALLBACK;
  }
}

// ─── Outdoor catalog + packaging ───────────────────────────────────────────

export async function getOutdoorCatalogItems(): Promise<CatalogItem[]> {
  if (!isSanityConfigured) return CATALOG_ITEMS;
  try {
    const rows = await sanityFetch<
      {
        id: string; name: string; description?: string; price?: number | null;
        unit?: string; image?: unknown; category: CatalogItem["category"];
      }[]
    >(
      `*[_type=="outdoorCatalogItem" && isActive != false && defined(slug.current)]
        |order(sortOrder asc, name asc){
        "id": slug.current, name, description, price, unit, image, category
      }`,
      "outdoorCatalogItem",
    );
    if (!rows.length) return CATALOG_ITEMS;
    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      description: r.description ?? "",
      price: r.price ?? 0,
      unit: r.unit ?? "",
      image: imageUrl(r.image, PLACEHOLDER, 600),
      category: r.category,
    }));
  } catch {
    return CATALOG_ITEMS;
  }
}

export async function getPackagingStyles(): Promise<PackagingStyle[]> {
  if (!isSanityConfigured) return PACKAGING_STYLES;
  try {
    const rows = await sanityFetch<
      { id: string; label: string; description?: string; pricePerUnit?: number | null }[]
    >(
      `*[_type=="packagingStyle" && isActive != false && defined(slug.current)]
        |order(sortOrder asc, label asc){
        "id": slug.current, label, description, pricePerUnit
      }`,
      "packagingStyle",
    );
    if (!rows.length) return PACKAGING_STYLES;
    return rows.map((r) => ({
      id: r.id,
      label: r.label,
      description: r.description || undefined,
      pricePerUnit: r.pricePerUnit ?? null,
    }));
  } catch {
    return PACKAGING_STYLES;
  }
}

// ─── Pricing & quote settings (singleton) ──────────────────────────────────

type RawPricingSettings = Partial<Omit<PricingSettings, "discountCodes">> & {
  discountCodes?: Partial<DiscountCode>[];
};

export async function getPricingSettings(): Promise<PricingSettings> {
  if (!isSanityConfigured) return DEFAULT_PRICING_SETTINGS;
  try {
    const row = await sanityFetch<RawPricingSettings | null>(
      `*[_type=="pricingSettings"]|order(_updatedAt desc)[0]{
        gstPercent, addOnPricePerItem, minimumGuests,
        showDiscountField, invalidCodeMessage,
        "discountCodes": discountCodes[]{ code, percentOff, minGuests, expiresOn, isActive },
        quoteHeading, quoteSubheading, quoteValidityDays, depositPercent,
        quoteTerms, contactPhone, contactEmail
      }`,
      "pricingSettings",
    );
    if (!row) return DEFAULT_PRICING_SETTINGS;
    const d = DEFAULT_PRICING_SETTINGS;
    return {
      gstPercent: row.gstPercent ?? d.gstPercent,
      addOnPricePerItem: row.addOnPricePerItem ?? d.addOnPricePerItem,
      minimumGuests: row.minimumGuests ?? d.minimumGuests,
      showDiscountField: row.showDiscountField ?? d.showDiscountField,
      discountCodes: (row.discountCodes ?? [])
        .filter((c) => c.code && typeof c.percentOff === "number")
        .map((c) => ({
          code: String(c.code),
          percentOff: Number(c.percentOff),
          minGuests: c.minGuests ?? 0,
          expiresOn: c.expiresOn || undefined,
          isActive: c.isActive !== false,
        })),
      invalidCodeMessage: row.invalidCodeMessage || d.invalidCodeMessage,
      quoteHeading: row.quoteHeading || d.quoteHeading,
      quoteSubheading: row.quoteSubheading || d.quoteSubheading,
      quoteValidityDays: row.quoteValidityDays ?? d.quoteValidityDays,
      depositPercent: row.depositPercent ?? d.depositPercent,
      quoteTerms: (row.quoteTerms ?? []).filter(Boolean),
      contactPhone: row.contactPhone || undefined,
      contactEmail: row.contactEmail || undefined,
    };
  } catch {
    return DEFAULT_PRICING_SETTINGS;
  }
}

// ─── Aggregate — one parallel fetch for the wizard layout ──────────────────

export type Catalog = {
  // Client + venue steps
  occasions: Occasion[];
  venues: Venue[];
  // Menu steps
  setMenus: SetMenu[];
  customMenuSections: CustomMenuSection[];
  cuisineCards: CuisineCard[];
  // Presentation step
  presentation: PresentationCatalog;
  // Outdoor sub-flow
  catalogItems: CatalogItem[];
  packagingStyles: PackagingStyle[];
  // Quote / pricing
  pricing: PricingSettings;
};

export async function getCatalog(): Promise<Catalog> {
  const [
    occasions,
    venues,
    setMenus,
    customMenuSections,
    presentation,
    catalogItems,
    packagingStyles,
    pricing,
  ] = await Promise.all([
    getOccasions(),
    getVenues(),
    getSetMenus(),
    getCustomMenuSections(),
    getPresentationCatalog(),
    getOutdoorCatalogItems(),
    getPackagingStyles(),
    getPricingSettings(),
  ]);
  // Cuisine cards need the sections to count their dishes.
  const cuisineCards = await getCuisineCards(customMenuSections);
  return {
    occasions,
    venues,
    setMenus,
    customMenuSections,
    cuisineCards,
    presentation,
    catalogItems,
    packagingStyles,
    pricing,
  };
}
