// ══════════════════════════════════════════════════════════════════
// PATH IN REPO: scripts/seed-menu-builder.ts
// ══════════════════════════════════════════════════════════════════
// Pushes the Menu Builder's current content into Sanity so the client starts
// with a filled-in CMS instead of an empty one:
//
//   7   set menus            (generated/set-menus.ts)      → setMenu
//   55  à-la-carte sections  (generated/custom-menu.ts)    → customMenuSection
//   15  cuisine cards        (cuisine-groups.ts)           → cuisineGroup
//   30  presentation options (config.ts)                   → presentationOption
//   6   outdoor items + 4 packaging styles (data.ts)       → outdoorCatalogItem
//                                                            / packagingStyle
//   1   pricing & quote settings (config.ts)               → pricingSettings
//
// Local /public photos are uploaded as Sanity image assets along the way
// (via NDJSON `_sanityAsset`), so the cards keep their imagery and the client
// can swap any of them in Studio.
//
// IDEMPOTENT: every document gets a deterministic _id (setMenu-<slug>, …) and
// the import runs with --replace, so re-running updates in place. Array items
// keep the ids the app already uses as their _key, so a guest's saved
// selections survive the migration.
//
// USAGE:
//   npm run seed-menu-builder              # import into the configured dataset
//   npm run seed-menu-builder -- --dry-run # just write the NDJSON, no import
//   npm run seed-menu-builder -- --only=setMenu,cuisineGroup
//
// Requires NEXT_PUBLIC_SANITY_PROJECT_ID + NEXT_PUBLIC_SANITY_DATASET in the
// environment (`set -a; . ./.env.local; set +a`) and a logged-in Sanity CLI
// (`npx sanity login`).
// ═══════════════════════════════════════════════════════════════════════════

import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

import {
  CUTLERY_OPTIONS,
  DEFAULT_PRICING_SETTINGS,
  LIVE_COUNTERS,
  LIVE_COUNTER_TILES,
  PRESENTATION_STYLES,
  STALL_THEMES,
} from "../lib/menu-builder/config";
import { CUISINE_GROUPS_WITH_REST } from "../lib/menu-builder/cuisine-groups";
import { CATALOG_ITEMS, PACKAGING_STYLES } from "../lib/menu-builder/data";
import { CUSTOM_MENU_SECTIONS } from "../lib/menu-builder/generated/custom-menu";
import { SET_MENUS } from "../lib/menu-builder/generated/set-menus";

type Doc = Record<string, unknown>;

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const onlyArg = args.find((a) => a.startsWith("--only="));
const only = onlyArg ? onlyArg.slice("--only=".length).split(",").map((s) => s.trim()) : null;

const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";
const REPO_ROOT = resolve(import.meta.dirname, "..");

const wanted = (type: string) => !only || only.includes(type);

// ─── Helpers ───────────────────────────────────────────────────────────────

/** A local /public path → an NDJSON asset reference the importer uploads. */
function asset(publicPath: string | undefined): Doc | undefined {
  if (!publicPath || publicPath.startsWith("http")) return undefined;
  const abs = join(REPO_ROOT, "public", publicPath.replace(/^\//, ""));
  if (!existsSync(abs)) {
    console.warn(`  ⚠ image not found, leaving empty: ${publicPath}`);
    return undefined;
  }
  return { _sanityAsset: `image@file://${abs}` };
}

const slug = (current: string) => ({ _type: "slug", current });

/** Drop undefined values so the NDJSON stays clean. */
function clean<T extends Doc>(doc: T): T {
  for (const key of Object.keys(doc)) {
    if (doc[key] === undefined) delete doc[key];
  }
  return doc;
}

// ─── Document builders ─────────────────────────────────────────────────────

function setMenuDocs(): Doc[] {
  return SET_MENUS.map((menu, i) =>
    clean({
      _id: `setMenu-${menu.id}`,
      _type: "setMenu",
      name: menu.name,
      slug: slug(menu.id),
      perPersonPrice: menu.perPersonPrice,
      priceNote: menu.priceNote,
      coverImage: asset(menu.coverImage),
      description: menu.description,
      mealTypeFit: menu.mealTypeFit,
      isActive: true,
      sortOrder: (i + 1) * 10,
      sections: menu.sections.map((section) => ({
        _key: section.id,
        _type: "section",
        label: section.label,
        chooseCount: section.chooseCount,
        dishOptions: section.dishOptions.map((opt) =>
          clean({
            _key: opt.id,
            _type: "dishOption",
            name: opt.name,
            subtitle: opt.subtitle,
          }),
        ),
      })),
    }),
  );
}

function customMenuSectionDocs(): Doc[] {
  return CUSTOM_MENU_SECTIONS.map((section, i) => ({
    _id: `customMenuSection-${section.id}`,
    _type: "customMenuSection",
    label: section.label,
    slug: slug(section.id),
    isActive: true,
    // Menu order matters (drinks → starters → mains → desserts), so keep the
    // master menu's own order and leave gaps for inserts.
    sortOrder: (i + 1) * 10,
    subsections: section.subsections.map((sub, j) => ({
      _key: `${section.id}-group-${j + 1}`,
      _type: "subsection",
      label: sub.label,
      items: sub.items.map((item) =>
        clean({
          _key: item.id,
          _type: "item",
          name: item.name,
          traditionalName: item.traditionalName,
          description: item.description,
          price: item.price ?? undefined,
          isActive: true,
        }),
      ),
    })),
  }));
}

function cuisineGroupDocs(): Doc[] {
  return CUISINE_GROUPS_WITH_REST.map((group, i) =>
    clean({
      _id: `cuisineGroup-${group.id}`,
      _type: "cuisineGroup",
      name: group.name,
      slug: slug(group.id),
      image: asset(group.image),
      isActive: true,
      sortOrder: (i + 1) * 10,
      sections: group.sectionIds.map((sectionId) => ({
        _key: sectionId,
        _type: "reference",
        _ref: `customMenuSection-${sectionId}`,
      })),
    }),
  );
}

function presentationOptionDocs(): Doc[] {
  const lists: { kind: string; items: { id: string; name: string; image?: string }[] }[] = [
    { kind: "cutlery", items: CUTLERY_OPTIONS },
    { kind: "presentationStyle", items: PRESENTATION_STYLES },
    { kind: "stallTheme", items: STALL_THEMES },
    { kind: "liveCounterTile", items: LIVE_COUNTER_TILES },
    { kind: "liveCounter", items: LIVE_COUNTERS },
  ];
  return lists.flatMap(({ kind, items }) =>
    items.map((item, i) =>
      clean({
        _id: `presentationOption-${kind}-${item.id}`,
        _type: "presentationOption",
        kind,
        name: item.name,
        slug: slug(item.id),
        image: asset(item.image),
        isActive: true,
        sortOrder: (i + 1) * 10,
      }),
    ),
  );
}

function outdoorDocs(): Doc[] {
  return CATALOG_ITEMS.map((item, i) =>
    clean({
      _id: `outdoorCatalogItem-${item.id}`,
      _type: "outdoorCatalogItem",
      name: item.name,
      slug: slug(item.id),
      category: item.category,
      description: item.description,
      price: item.price,
      unit: item.unit,
      image: asset(item.image),
      isActive: true,
      sortOrder: (i + 1) * 10,
    }),
  );
}

function packagingDocs(): Doc[] {
  return PACKAGING_STYLES.map((style, i) => ({
    _id: `packagingStyle-${style.id}`,
    _type: "packagingStyle",
    label: style.label,
    slug: slug(style.id),
    isActive: true,
    sortOrder: (i + 1) * 10,
  }));
}

function pricingSettingsDoc(): Doc {
  const s = DEFAULT_PRICING_SETTINGS;
  return {
    _id: "pricingSettings",
    _type: "pricingSettings",
    gstPercent: s.gstPercent,
    addOnPricePerItem: s.addOnPricePerItem,
    minimumGuests: s.minimumGuests,
    showDiscountField: s.showDiscountField,
    discountCodes: [],
    invalidCodeMessage: s.invalidCodeMessage,
    quoteHeading: s.quoteHeading,
    quoteSubheading: s.quoteSubheading,
    quoteValidityDays: s.quoteValidityDays,
    depositPercent: s.depositPercent,
    quoteTerms: s.quoteTerms,
  };
}

// ─── Assemble ──────────────────────────────────────────────────────────────

const groups: { type: string; docs: Doc[] }[] = [
  { type: "customMenuSection", docs: customMenuSectionDocs() },
  { type: "setMenu", docs: setMenuDocs() },
  { type: "cuisineGroup", docs: cuisineGroupDocs() },
  { type: "presentationOption", docs: presentationOptionDocs() },
  { type: "outdoorCatalogItem", docs: outdoorDocs() },
  { type: "packagingStyle", docs: packagingDocs() },
  { type: "pricingSettings", docs: [pricingSettingsDoc()] },
];

const selected = groups.filter((g) => wanted(g.type));
const docs = selected.flatMap((g) => g.docs);

console.log("Menu Builder → Sanity seed");
console.log(`  project: ${projectId || "(unset)"}   dataset: ${dataset}`);
for (const g of selected) {
  console.log(`  ${String(g.docs.length).padStart(4)}  ${g.type}`);
}
console.log(`  ${String(docs.length).padStart(4)}  documents total`);

const ndjson = docs.map((d) => JSON.stringify(d)).join("\n") + "\n";
const outDir = mkdtempSync(join(tmpdir(), "raec-seed-"));
const outFile = join(outDir, "menu-builder.ndjson");
writeFileSync(outFile, ndjson, "utf8");
console.log(`\nNDJSON written: ${outFile}`);

if (dryRun) {
  console.log("--dry-run: not importing. Inspect the file above, then re-run without the flag.");
  process.exit(0);
}

if (!projectId) {
  console.error(
    "\nNEXT_PUBLIC_SANITY_PROJECT_ID is not set — load your env first:\n" +
      "  set -a; . ./.env.local; set +a\n",
  );
  process.exit(1);
}

// `--replace` keeps the run idempotent; `--allow-assets-in-different-dataset`
// isn't needed because every asset is uploaded fresh from /public.
const result = spawnSync(
  "npx",
  ["sanity", "dataset", "import", outFile, dataset, "--replace"],
  { stdio: "inherit", cwd: REPO_ROOT },
);

if (result.status !== 0) {
  console.error("\nImport failed. Is the Sanity CLI logged in? Try: npx sanity login");
  process.exit(result.status ?? 1);
}

console.log("\n✓ Seed complete. Open /studio → Menu Builder to review.");
