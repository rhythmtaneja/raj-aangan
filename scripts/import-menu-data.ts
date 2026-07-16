// ══════════════════════════════════════════════════════════════════
// PATH IN REPO: scripts/import-menu-data.ts
// ══════════════════════════════════════════════════════════════════
// One-shot importer: transforms a structured JSON menu file into Sanity
// NDJSON and imports it with `sanity dataset import --replace`.
//
// IDEMPOTENT: every document gets a deterministic _id derived from its
// slug (e.g. dish-<slug>), so re-running REPLACES documents instead of
// creating duplicates. Safe to run as many times as you like.
//
// USAGE:
//   node scripts/import-menu-data.ts [path/to/menu-data.json] [--dry-run]
//   npm run import-menu -- ./data/menu-data.json
//
// Requires NEXT_PUBLIC_SANITY_PROJECT_ID + NEXT_PUBLIC_SANITY_DATASET in
// the environment (load .env.local first, e.g. `set -a; . ./.env.local`).
//
// Input JSON shape (all top-level keys optional):
//   {
//     "cuisines":   [{ label, slug, description?, sortOrder? }],
//     "categories": [{ label, slug, parentSection, sortOrder? }],
//     "occasions":  [{ label, slug, sortOrder? }],
//     "venues":     [{ name, slug, type, category?, capacity?, pricingNote?,
//                      logisticsPerHead?, description?, sortOrder? }],
//     "dishes":     [{ name, slug, subtitle?, description?, price?, cuisine,
//                      categories?: string[], dietaryTags?: string[],
//                      isActive? }],
//     "presetMenus":[{ name, slug, basePrice?, priceNote?, description?,
//                      sortOrder?, sections: [{ sectionName, chooseCount?,
//                      dishes: string[] }] }]
//   }
// `cuisine`, `categories[]`, and section `dishes[]` reference other items
// BY SLUG. Images are added later in Studio (not part of this import).
// ═══════════════════════════════════════════════════════════════════════════

import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

type Json = Record<string, unknown>;

type InputData = {
  cuisines?: Json[];
  categories?: Json[];
  occasions?: Json[];
  venues?: Json[];
  dishes?: Json[];
  presetMenus?: Json[];
};

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const inputPath = args.find((a) => !a.startsWith("--")) ?? "data/menu-data.json";

const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

function ref(id: string) {
  return { _type: "reference", _ref: id };
}

function slugField(current: string) {
  return { _type: "slug", current };
}

function requireStr(obj: Json, key: string, ctx: string): string {
  const v = obj[key];
  if (typeof v !== "string" || !v.trim()) {
    throw new Error(`Missing required "${key}" on ${ctx}: ${JSON.stringify(obj)}`);
  }
  return v;
}

function build(input: InputData): Json[] {
  const docs: Json[] = [];

  for (const c of input.cuisines ?? []) {
    const slug = requireStr(c, "slug", "cuisine");
    docs.push({
      _id: `cuisine-${slug}`,
      _type: "cuisine",
      label: requireStr(c, "label", "cuisine"),
      slug: slugField(slug),
      description: c.description ?? undefined,
      sortOrder: c.sortOrder ?? 100,
    });
  }

  for (const c of input.categories ?? []) {
    const slug = requireStr(c, "slug", "category");
    docs.push({
      _id: `category-${slug}`,
      _type: "category",
      label: requireStr(c, "label", "category"),
      slug: slugField(slug),
      parentSection: requireStr(c, "parentSection", "category"),
      sortOrder: c.sortOrder ?? 100,
    });
  }

  for (const o of input.occasions ?? []) {
    const slug = requireStr(o, "slug", "occasion");
    docs.push({
      _id: `occasion-${slug}`,
      _type: "occasion",
      label: requireStr(o, "label", "occasion"),
      slug: slugField(slug),
      sortOrder: o.sortOrder ?? 100,
    });
  }

  for (const v of input.venues ?? []) {
    const slug = requireStr(v, "slug", "venue");
    docs.push({
      _id: `venue-${slug}`,
      _type: "venue",
      name: requireStr(v, "name", "venue"),
      slug: slugField(slug),
      type: requireStr(v, "type", "venue"),
      category: v.category ?? "Both",
      capacity: v.capacity ?? undefined,
      pricingNote: v.pricingNote ?? undefined,
      description: v.description ?? undefined,
      logisticsPerHead: v.logisticsPerHead ?? 0,
      sortOrder: v.sortOrder ?? 100,
    });
  }

  for (const d of input.dishes ?? []) {
    const slug = requireStr(d, "slug", "dish");
    const cuisineSlug = requireStr(d, "cuisine", `dish ${slug}`);
    const categories = Array.isArray(d.categories) ? (d.categories as string[]) : [];
    docs.push({
      _id: `dish-${slug}`,
      _type: "dish",
      name: requireStr(d, "name", "dish"),
      slug: slugField(slug),
      subtitle: d.subtitle ?? undefined,
      description: d.description ?? undefined,
      price: typeof d.price === "number" ? d.price : undefined,
      cuisine: ref(`cuisine-${cuisineSlug}`),
      categoryTags: categories.map((catSlug, i) => ({
        ...ref(`category-${catSlug}`),
        _key: `cat-${i}-${catSlug}`,
      })),
      dietaryTags: Array.isArray(d.dietaryTags) ? d.dietaryTags : [],
      isActive: d.isActive === undefined ? true : Boolean(d.isActive),
    });
  }

  for (const p of input.presetMenus ?? []) {
    const slug = requireStr(p, "slug", "presetMenu");
    const sections = Array.isArray(p.sections) ? (p.sections as Json[]) : [];
    docs.push({
      _id: `preset-${slug}`,
      _type: "presetMenu",
      name: requireStr(p, "name", "presetMenu"),
      slug: slugField(slug),
      basePrice: typeof p.basePrice === "number" ? p.basePrice : undefined,
      priceNote: p.priceNote ?? undefined,
      description: p.description ?? undefined,
      sortOrder: p.sortOrder ?? 100,
      sections: sections.map((s, si) => {
        const dishSlugs = Array.isArray(s.dishes) ? (s.dishes as string[]) : [];
        return {
          _type: "section",
          _key: `section-${si}`,
          sectionName: requireStr(s, "sectionName", `preset ${slug} section`),
          chooseCount: typeof s.chooseCount === "number" ? s.chooseCount : 0,
          dishes: dishSlugs.map((ds, di) => ({
            ...ref(`dish-${ds}`),
            _key: `dish-${di}-${ds}`,
          })),
        };
      }),
    });
  }

  return docs;
}

function main() {
  let raw: string;
  try {
    raw = readFileSync(inputPath, "utf8");
  } catch {
    console.error(`✗ Could not read input JSON at "${inputPath}".`);
    console.error(`  Pass a path: node scripts/import-menu-data.ts ./data/menu-data.json`);
    process.exit(1);
  }

  const input = JSON.parse(raw) as InputData;
  const docs = build(input);
  const ndjson = docs.map((d) => JSON.stringify(d)).join("\n") + "\n";

  const counts = docs.reduce<Record<string, number>>((acc, d) => {
    const t = String(d._type);
    acc[t] = (acc[t] ?? 0) + 1;
    return acc;
  }, {});
  console.log("Transformed documents:", counts, `(total ${docs.length})`);

  const outFile = join(mkdtempSync(join(tmpdir(), "menu-import-")), "menu.ndjson");
  writeFileSync(outFile, ndjson, "utf8");
  console.log(`NDJSON written to ${outFile}`);

  if (dryRun) {
    console.log("--dry-run: skipping `sanity dataset import`.");
    return;
  }

  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    console.error("✗ NEXT_PUBLIC_SANITY_PROJECT_ID is not set. Load .env.local first.");
    process.exit(1);
  }

  console.log(`Importing into dataset "${dataset}" (--replace)…`);
  const res = spawnSync(
    "npx",
    ["sanity", "dataset", "import", outFile, dataset, "--replace"],
    { stdio: "inherit" },
  );
  process.exit(res.status ?? 0);
}

main();
