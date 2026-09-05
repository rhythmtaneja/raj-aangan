// ══════════════════════════════════════════════════════════════════
// PATH IN REPO: scripts/seed-blog.ts
// ══════════════════════════════════════════════════════════════════
// Pushes the five hand-written posts in lib/blog/posts.ts into Sanity as
// `blogPost` documents, so the client can edit every part of them in Studio
// (title, date, cover photo, category, tags, and the article itself) instead
// of us editing the repo.
//
// The LocalBlock format is converted to Portable Text — headings, paragraphs,
// bullet/numbered lists, quotes and **bold** all survive the trip, and the
// cover photos in /public/images/blog are uploaded as Sanity image assets.
//
// IDEMPOTENT-ish: each document gets a deterministic _id (blogPost-<slug>)
// and the import runs with --replace.
//   ⛔ Re-running OVERWRITES whatever the client has since edited in Studio.
//      Only re-run for a post they have not touched, or after agreeing it.
//
// USAGE:
//   set -a; . ./.env.local; set +a
//   npm run seed-blog                    # import
//   npm run seed-blog -- --dry-run       # write the NDJSON only
//   npm run seed-blog -- --only=wedding-trends-for-2026
//
// Requires a logged-in Sanity CLI (`npx sanity login`).
// ═══════════════════════════════════════════════════════════════════════════

import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

import { LOCAL_BLOG_POSTS } from "../lib/blog/posts";
import type { LocalBlock } from "../lib/blog/types";

type Doc = Record<string, unknown>;

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const onlyArg = args.find((a) => a.startsWith("--only="));
const only = onlyArg ? onlyArg.slice("--only=".length).split(",").map((s) => s.trim()) : null;

const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";
const REPO_ROOT = resolve(import.meta.dirname, "..");

// ─── Helpers ───────────────────────────────────────────────────────────────

function asset(publicPath: string): Doc | undefined {
  const abs = join(REPO_ROOT, "public", publicPath.replace(/^\//, ""));
  if (!existsSync(abs)) {
    console.warn(`  ⚠ image not found, leaving empty: ${publicPath}`);
    return undefined;
  }
  return { _sanityAsset: `image@file://${abs}` };
}

/** "06.03.2026" (DD.MM.YYYY) + an hour offset → an ISO datetime. */
function isoDate(display: string, hour: number): string {
  const [dd, mm, yyyy] = display.split(".");
  return new Date(Date.UTC(+yyyy, +mm - 1, +dd, hour)).toISOString();
}

/**
 * Text with **bold** runs → Portable Text spans. A span carrying the "strong"
 * decorator is exactly what Studio produces when the client bolds a word, so
 * the round-trip is lossless.
 */
function spans(text: string, keyPrefix: string): Doc[] {
  return text
    .split(/(\*\*[^*]+\*\*)/g)
    .filter((part) => part !== "")
    .map((part, i) => {
      const strong = part.startsWith("**") && part.endsWith("**") && part.length > 4;
      return {
        _key: `${keyPrefix}s${i}`,
        _type: "span",
        text: strong ? part.slice(2, -2) : part,
        marks: strong ? ["strong"] : [],
      };
    });
}

function textBlock(key: string, style: string, text: string, listItem?: string): Doc {
  return {
    _key: key,
    _type: "block",
    style,
    markDefs: [],
    children: spans(text, key),
    ...(listItem ? { listItem, level: 1 } : {}),
  };
}

/** LocalBlock[] → Portable Text. */
function toPortableText(blocks: LocalBlock[]): Doc[] {
  const out: Doc[] = [];
  blocks.forEach((block, i) => {
    const key = `b${i}`;
    switch (block.type) {
      case "p":
        if (block.text.trim()) out.push(textBlock(key, "normal", block.text));
        break;
      case "h2":
        out.push(textBlock(key, "h2", block.text));
        break;
      case "h3":
        out.push(textBlock(key, "h3", block.text));
        break;
      case "quote":
        out.push(textBlock(key, "blockquote", block.text));
        break;
      case "list":
      case "numbers": {
        const kind = block.type === "list" ? "bullet" : "number";
        block.items.forEach((item, j) =>
          out.push(textBlock(`${key}i${j}`, "normal", item, kind)),
        );
        break;
      }
      case "image": {
        const image = asset(block.src);
        if (image) {
          out.push({
            _key: key,
            _type: "image",
            ...image,
            alt: block.alt ?? "",
            caption: block.caption ?? "",
          });
        }
        break;
      }
    }
  });
  return out;
}

// ─── Assemble ──────────────────────────────────────────────────────────────

const posts = LOCAL_BLOG_POSTS.filter((p) => !only || only.includes(p.slug));

const docs: Doc[] = posts.map((post, i) => {
  const doc: Doc = {
    _id: `blogPost-${post.slug}`,
    _type: "blogPost",
    title: post.title,
    slug: { _type: "slug", current: post.slug },
    coverImage: asset(post.image),
    // Same display date for all five; the descending hour keeps the grid in
    // the order they were written (the query sorts publishedAt desc).
    publishedAt: isoDate(post.date, 12 - i),
    category: post.category,
    body: toPortableText(post.body),
    isFeatured: false,
  };
  if (post.excerpt) doc.excerpt = post.excerpt;
  if (post.tags?.length) doc.tags = post.tags;
  for (const key of Object.keys(doc)) if (doc[key] === undefined) delete doc[key];
  return doc;
});

console.log("Blog → Sanity seed");
console.log(`  project: ${projectId || "(unset)"}   dataset: ${dataset}`);
for (const [i, post] of posts.entries()) {
  console.log(`  ${String((docs[i].body as Doc[]).length).padStart(4)} blocks  ${post.slug}`);
}
console.log(`  ${String(docs.length).padStart(4)}  documents total`);

const ndjson = docs.map((d) => JSON.stringify(d)).join("\n") + "\n";
const outDir = mkdtempSync(join(tmpdir(), "raec-blog-seed-"));
const outFile = join(outDir, "blog.ndjson");
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

const result = spawnSync(
  "npx",
  ["sanity", "dataset", "import", outFile, dataset, "--replace"],
  { stdio: "inherit", cwd: REPO_ROOT },
);

if (result.status !== 0) {
  console.error("\nImport failed. Is the Sanity CLI logged in? Try: npx sanity login");
  process.exit(result.status ?? 1);
}

console.log("\n✓ Seed complete. Open /studio → Blog → Posts to review.");
