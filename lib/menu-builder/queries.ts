// ══════════════════════════════════════════════════════════════════
// PATH IN REPO: lib/menu-builder/queries.ts
// ══════════════════════════════════════════════════════════════════
// Typed, server-only catalog fetchers. Replaces the old data.ts arrays.
//
//   • When Sanity is configured, fetch published content via GROQ, tagged
//     for ISR so Studio publishes appear on the site within ~30s
//     (revalidated by app/api/revalidate/route.ts on the Sanity webhook).
//   • When it isn't (or a fetch fails / returns empty), fall back to the
//     hardcoded catalog in fallback.ts so the wizard always works.
//
// Never import this into a "use client" file — it uses the server client.
// ═══════════════════════════════════════════════════════════════════════════

import "server-only";
import { client } from "@/sanity/client";
import { imageUrl } from "@/sanity/image";
import { isSanityConfigured } from "@/sanity/env";
import * as fallback from "./fallback";
import type {
  Occasion, Venue, CuisineCategory, Dish, DishTag, PresetMenu,
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

const DIET_TO_TAG: Record<string, DishTag> = {
  veg: "Veg",
  "non-veg": "Non Veg",
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

// ─── Aggregate — one parallel fetch for the wizard layout ──────────────────

export type Catalog = {
  occasions: Occasion[];
  venues: Venue[];
  cuisines: CuisineCategory[];
  dishes: Dish[];
};

export async function getCatalog(): Promise<Catalog> {
  const [occasions, venues, cuisines, dishes] = await Promise.all([
    getOccasions(),
    getVenues(),
    getCuisines(),
    getAllDishes(),
  ]);
  return { occasions, venues, cuisines, dishes };
}
