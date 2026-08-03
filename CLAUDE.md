@AGENTS.md

# ⏱️ CURRENT STATE — Menu Builder + Phase 8 CMS (read this first)

Menu Builder rework is DONE, and **Phase 8 (Sanity CMS wiring) is DONE and
LIVE** — project `ze6ciec4` / dataset `production` is connected and **seeded
(120 docs + 31 image assets, 2026-07-28)**. Studio at `/studio` is fully
populated; the client can edit real content today. Everything still runs
identically with no Sanity project at all (graceful fallback preserved).

🚨 **All Phase 8 work is UNCOMMITTED** — 34 changed/untracked files, local only.
Last commit is `5086f31`. Push before anything else. See "Remaining work" below.

**Flow.** Step 1 picks a **catering type**: `venue-event` or `outdoor`
(`state.cateringType`). Progress bar is dynamic (`flow.ts/getSteps(state)`).
- **venue-event** (same for every venue — no raj-aangan branching):
  Client → Venue → **Menu** → Presentation → Quote (`STEPS_VENUE_EVENT`, 5 steps).
  - `/menu-builder/menu` (`SetMenuStep`) = the 7 fixed **set menus** for ALL
    venues. A CTA there ("Build a Custom Menu →") sets `menuMode:"custom"` and
    goes to **`/menu-builder/cuisine`** (cuisine cards) → then
    `/menu-builder/custom-menu` (`CustomMenuStep`, à-la-carte accordion).
  - In custom mode the bar becomes **6 steps** (`STEPS_VENUE_EVENT_CUSTOM`,
    Cuisine inserted before Menu; the Menu step's slug is `custom-menu`, so both
    menu screens resolve their index via `flow.ts/menuStepIndex`).
  - The cuisine picks (`state.selectedCuisineCategories`) FILTER the à-la-carte
    sections shown next; de-selecting a cuisine prunes its picked dishes.
  - `menuMode` ("set" | "custom") drives quote/summary display + pricing.
- **outdoor**: Client → Catalog → Packaging → Quote (`STEPS_OUTDOOR`).

**Menu DATA (all real, generated).**
- **7 set menus** → `lib/menu-builder/generated/set-menus.ts` (`SET_MENUS`), from
  `scripts/gen_set_menus.py` (image menus inline + `docs/menu-source/set-menus.csv`).
  Breakfast ₹450, Lunch ₹750, Maharani ₹1250, Maharaja ₹1750 (real);
  Signature ₹1450 / Royal Feast ₹2200 / Elite ₹2800 (**PLACEHOLDER prices**).
  UI = accordion (headings collapse; click to expand items) with add-to-cart
  toggles. **Soft "Choose N"**: first N picks (in order) included; extras are
  paid ADD-ONS (`ADDON_PRICE_PER_ITEM=100`/head **placeholder** in pricing.ts).
- **Custom à-la-carte** (1128 items, 55 sections) → `generated/custom-menu.ts`
  (`CUSTOM_MENU_SECTIONS`), from `scripts/gen_custom_menu.py` +
  `docs/menu-source/raw/RAEC_master_menu.csv`. Same accordion design, WITH price
  per item. Item `price` is **null for now** (client fills later); custom
  per-head = sum of selected item prices (`getCustomMenuPerHead`). Grouped by
  section → subsection (blank subsection = flat).
- Outdoor catalog + packaging = still placeholder in `lib/menu-builder/data.ts`.
- Selections reuse `state.selectedDishes` (ADD_DISH/REMOVE_DISH), keyed by the
  master item id; set-menu picks use `state.setMenuSelections`.

**Regenerate data:** `python3 scripts/gen_set_menus.py` /
`python3 scripts/gen_custom_menu.py` (self-contained; read the CSVs directly).

# 🗄️ Phase 8 — CMS (DONE + LIVE + SEEDED)

Everything the builder shows is now Sanity-managed, with the generated/static
data demoted to a fallback. **One rule: UI components never import the data —
they read `useCatalog()`.** Whether a value came from Sanity or the fallback is
decided in `queries.ts` alone.

- **Schemas** (`sanity/schemaTypes/`): `setMenu`, `customMenuSection`,
  `cuisineGroup`, `presentationOption` (5 kinds via a `kind` field),
  `outdoorCatalogItem`, `packagingStyle`, `pricingSettings` (**singleton**:
  GST, add-on price, discount codes, quote heading/terms/validity/deposit/
  contact). Legacy `dish`/`category`/`cuisine`/`presetMenu` are still
  registered but HIDDEN from the desk — nothing reads them.
- **Desk** (`sanity/structure.ts`): one "Menu Builder" folder, presentation
  options split into 5 filtered lists (each with a pre-filled + button, via
  templates in `sanity.config.ts`). `SINGLETONS` now exported from structure.ts.
- **Queries** (`queries.ts`): `getSetMenus`, `getCustomMenuSections`,
  `getCuisineCards(sections)`, `getPresentationCatalog`,
  `getOutdoorCatalogItems`, `getPackagingStyles`, `getPricingSettings` — each
  falls back per-collection (an empty Sanity list keeps the hardcoded one).
  `getCatalog()` fetches all of it in parallel for `app/menu-builder/layout.tsx`.
- **Context** (`catalog.tsx`): provides the catalog PLUS lookups (`getSetMenu`,
  `getCustomItem`, `getCatalogItem`, `getPackaging`, `getCuisineCard`,
  `sectionsForCuisines`, `itemIdsForCuisine`). `catalog-hooks.ts/usePricingData()`
  bundles what `pricing.ts` needs.
- **Pricing** (`pricing.ts`): no constants left — every fn takes
  `(state, data: PricingData)`. Adds real discount codes (`findDiscountCode`)
  applied pre-GST, and per-menu add-on overrides.
- **Shared helpers** (`menu-utils.ts`): counts / filtering used by both the
  fallback (`cuisine-groups.ts`) and the Sanity path.
- **Seed**: `npm run seed-menu-builder` (`scripts/seed-menu-builder.ts`) →
  120 docs (55 sections/1128 dishes, 7 set menus, 15 cuisine cards, 32
  presentation options, 6+4 outdoor, 1 settings) + uploads the `/public` photos
  as assets. Idempotent (deterministic `_id`s + `--replace`); array `_key`s ARE
  the existing app ids, so saved bookings survive. `--dry-run` / `--only=`.
  Runs plain TS through `scripts/ts-loader.mjs` (resolve hook that adds `.ts`
  and maps `@/`) — no new dependency.
  **✅ ALREADY RUN (2026-07-28)** — 120 docs + 31 image assets are in
  `production`. Verified: 7 setMenu / 55 customMenuSection / 15 cuisineGroup /
  32 presentationOption / 6 outdoorCatalogItem / 4 packagingStyle / 1
  pricingSettings. Needs the Sanity CLI logged in (`npx sanity login`), NOT the
  write token (it shells out to `sanity dataset import`).
  ⛔ **DO NOT re-run the whole seed** — it now overwrites the client's Studio
  edits. Use `--only=<type>` to refresh one collection, and say so first.
- **Client docs**: `docs/CMS_GUIDE.md` (field-by-field), `SANITY_SETUP.md` §3.

**Responsiveness (done this cycle):** all `clamp(min,Xvw,max)` font ceilings
were **capped to their 1440px value** (`scripts/*` one-off; the vw coeff stays,
only the ceiling dropped) so laptops ≥1440px render identically and the client's
wider screens no longer diverge from the ~1440 Mac. Mobile fixes: BuilderLayout
sidebar stacks below content (no inline grid override; two-col only lg+),
ProgressBar has a compact "Step X of N" bar on mobile, card padding p-5 md:p-10,
SiteHeader nav wraps on phones.

# 📐 ZOOM-PROOF LAYOUT — THE ONE RULE (2026-08-03)

The desktop design is a **single-scalar uniform scale**. `globals.css` sets
`html { font-size: clamp(8.5333px, 100vw/90, 20px) }` — 16px at the 1440px
reference — and EVERY length in the app is a `rem` multiple of it. Between
**768px and 1800px the page is a pure proportional scale of itself**: nothing
can drift, no line-wrap point can flip. Browser zoom divides the CSS viewport
(a 1440 window reports 1152 @125%, 960 @150%, 823 @175%, 720 @200%), so this
gives an identical composition from 100% through ~187% zoom, and 200% lands
below 768px → the phone design. Verified: 0 of 451 elements on `/` shift
position by >0.6% of viewport width across that whole range.

**Three rules follow. Breaking any one re-breaks zoom:**
1. **Never size anything in px.** Not `style={{width: 320}}`, not `<svg
   width="24">` without a rem class, not `width={110}` on `next/image`
   without a rem className. A px value freezes while everything around it
   shrinks — it silently doubles in relative size across the zoom range.
   1px hairlines/borders are the ONLY exception (they scale under real zoom).
2. **Desktop layout switches on `md:` (768px) ONLY** — never `lg:`/`xl:`.
   Media-query breakpoints resolve against the browser's initial 16px, not
   the fluid root, so `lg:`(1024) and `xl:`(1280) fire *inside* the zoom
   range and reflow the page at 150%/125% zoom. All former lg:/xl: desktop
   variants were moved to md:.
3. **Marquee/carousel loop distances must be MEASURED from the DOM and
   rebuilt in a `ResizeObserver`**, never computed from constants and never
   via a lazy `x: () => -measure()` (a function-based value is resolved on
   the tween's first rendered frame — if that lands before layout settles it
   caches 0 and the marquee animates 0→0 forever). Pattern: eager `build()`
   + `new ResizeObserver(build)`. See CuisineSection / EventsHero /
   DecorStylingCarousel. For a `gap`-only track the advance is
   `(scrollWidth + gap)/2`; with `paddingLeft: gap` it is `scrollWidth/2`.

The `clamp(min, Xvw, max)` font sizes are CORRECT and must stay: inside the
band the vw term equals the rem ceiling, so they resolve proportionally; below
768px the root reverts to a fixed 16px and the clamp's `min`/vw term becomes
the phone sizing. Don't "simplify" them to plain rem — that breaks mobile.

TRADE-OFF: a genuinely narrow *desktop window* (~768–1000px at 100% zoom) now
renders the full desktop design at a 8.5–11px root, i.e. small text. Under
zoom the physical size is unchanged, so this only affects deliberately narrow
windows. Raise the clamp MIN in `globals.css` if that ever matters more.

# ✅ REMAINING WORK (as of 2026-07-28)

## A. Ours — blocking, do in this order
1. **Commit + push the 34 uncommitted files.** The entire Phase 8 CMS (all
   `sanity/schemaTypes/*`, `scripts/seed-menu-builder.ts`, `scripts/ts-loader*`,
   `lib/menu-builder/{queries,catalog,catalog-hooks,menu-utils,pricing}`,
   `docs/CMS_GUIDE.md`) is local-only. Suggested split: schemas / queries+context
   / seed script / docs. `npx tsc --noEmit` is green.
2. **Deploy on Vercel.** Root directory MUST be `raj-aangan/` (Next app is a
   subdir). Env vars needed: `NEXT_PUBLIC_SANITY_PROJECT_ID=ze6ciec4`,
   `NEXT_PUBLIC_SANITY_DATASET=production`, `SANITY_REVALIDATE_SECRET=<random>`.
3. **Publish webhook** (SANITY_SETUP.md §4). Code already exists at
   `app/api/revalidate/route.ts`; what's missing is `SANITY_REVALIDATE_SECRET`
   (empty in `.env.local`) + registering the hook on sanity.io/manage.
   Without it, Studio edits take up to **30s** to appear (`REVALIDATE = 30` in
   `queries.ts`, `useCdn: true` in `client.ts`). Only works once deployed —
   Sanity cannot call `localhost`.
   ⚠️ Do NOT let the client start entering prices before this exists; they'll
   hit the 30s delay and think the CMS is broken.
4. **Decide `/studio` vs `/admin`.** Studio is a normal route
   (`app/studio/[[...tool]]/page.tsx`) that ships with the site — no separate
   deploy, lands at `<domain>/studio`. To truly move it: rename the folder AND
   change `basePath` in `sanity.config.ts:25`. Both must match. A plain
   `next.config.ts` redirect works too but the URL bar still shows `/studio`.

## B. Ours — code work, not data entry
5. **Presentation step per-live-counter mapping** (which counter → which
   cutlery / presentation / stall options). Selecting any counter currently
   reveals ALL options — TODO in `app/menu-builder/presentation/page.tsx`.
   Not in the CMS at all yet; needs schema work.
6. Mobile: header nav currently WRAPS; decide whether to build a hamburger drawer.
7. ~~Responsiveness calibration~~ — DONE 2026-08-03, see "ZOOM-PROOF LAYOUT"
   above. Reference width 1440 confirmed; the fluid-root floor was moved from
   12px (which bit at 1080px, mid-zoom-range) down to 768/90, all lg:/xl:
   desktop variants moved to md:, and every fixed-px element (header + footer
   logos, 26 inline SVG icons, ProgressBar step circles, Cuisine/Decor carousel
   cards, the nav hover indicator) converted to rem.

## C. Client's — data entry in Studio, no code change
8. Real per-person prices for Signature (₹1450) / Royal Feast (₹2200) /
   Elite (₹2800) — all PLACEHOLDERS → Set Menus → Pricing.
9. Real add-on surcharge (₹100/head placeholder) → Pricing & Quote Settings,
   or the per-menu override.
10. Prices for the 1128 à-la-carte items, currently all null → À-la-carte Menu.
    (Alternative: refill the `price` column in `RAEC_master_menu.csv`,
    regenerate, then re-seed with `--only=customMenuSection`.)
11. Photo for the "Salads & Wellness Bowls" cuisine card (uses
    `mb-placeholder.jpg`) → Cuisine Cards.

## D. Handover — must not be forgotten
12. **Transfer the Sanity project to the client's account** (or invite their
    team as Editor at sanity.io/manage → Members). It currently sits under
    `rhythm1501taneja@gmail.com` — if the engagement ends they lose their CMS.
13. Point the client at `docs/CMS_GUIDE.md` (field-by-field walkthrough).
14. 🚨 **Bookings are saved NOWHERE.** A finished quote lives only in the
    guest's `localStorage` (`context.tsx`) — no server record, no email, no
    lead capture. That's Workstream 4 (deferred), but it must be flagged to
    the client IN WRITING before handover: a quote tool that silently drops
    every lead is worse than none.

# 📌 Live CMS facts
- Sanity project `ze6ciec4`, dataset `production` (public read).
- Studio: `/studio` locally and on any deploy. Desk = `sanity/structure.ts`.
- Sanity IS the database — nothing else to provision. No Postgres, no separate
  host. Free tier (~100k API req/month) is plenty for this site.
- `.env.local` has the project id/dataset set; `SANITY_API_READ_TOKEN`,
  `SANITY_API_WRITE_TOKEN` and `SANITY_REVALIDATE_SECRET` are all still EMPTY.
  Read/write tokens aren't needed yet (dataset is public; seed uses CLI auth).

Reference designs: `docs/reference/screens/`. Data sources: `docs/menu-source/`.

# Raj Aangan — project guide

Next.js 16 (App Router) + TypeScript + Tailwind v4 + GSAP, deployed on Vercel
(repo `rhythmtaneja/raj-aangan`). The public marketing site is complete. The
current phase adds a **Sanity CMS admin platform** for the client's team plus a
CRM integration, all landing in one embedded Sanity Studio at `/studio`.

> **Important:** the Next.js app lives in this `raj-aangan/` subdirectory — that
> subdir is the git repo root. Run all `npm`/`next`/`sanity` commands from here.

## Golden rule: graceful fallback

Everything is built to **build and run with or without a live Sanity project**.
When `NEXT_PUBLIC_SANITY_PROJECT_ID` is unset, `sanity/env.ts` exports
`isSanityConfigured = false` and every query returns hardcoded fallback data, so
the site never breaks during migration. Do not add code paths that throw when
Sanity is absent — always coalesce to a fallback.

## Architecture map

### Sanity foundation (`sanity/`)
- `env.ts` — connection values from env; `isSanityConfigured`, `studioProjectId`
  (a valid placeholder when unset so clients/builders never throw at module load).
- `client.ts` — server-only read client. Never import into a `"use client"` file.
- `image.ts` — `urlFor()` / `imageUrl()` CDN helpers (returns fallback on miss).
- `schemaTypes/` — Menu Builder (Phase 8): `setMenu`, `customMenuSection`,
  `cuisineGroup`, `presentationOption`, `outdoorCatalogItem`, `packagingStyle`,
  `pricingSettings` (singleton), plus `venue`, `occasion`. Legacy WS1 types
  (`dish`, `category`, `cuisine`, `presetMenu`) stay registered but hidden.
  `siteImages` singleton (WS2); `blogPost`, `author` (WS3).
- `structure.ts` — desk (Menu Builder folder first) + exported `SINGLETONS`
  (`siteImages`, `pricingSettings`).
- `sanity.config.ts` / `sanity.cli.ts` — Studio + CLI config (root of repo).

### Studio route (`app/studio/[[...tool]]/`)
- `page.tsx` (server) guards on `isSanityConfigured`, else renders a setup notice.
- `Studio.tsx` (**client**) holds the `sanity.config` + `NextStudio` import.
  **Critical:** the config must only be imported from a client component —
  importing it into an RSC pulls Sanity's `swr` dependency into the server graph,
  whose `react-server` build has no default export, and the build fails.

### Menu Builder — `lib/menu-builder/` + `app/menu-builder/` (see CURRENT STATE above)
- `types.ts` — all domain types + `BookingState` + step-sets (`STEPS_VENUE_EVENT`,
  `STEPS_OUTDOOR`) + `MB_COLORS` + `CATERING_TYPES`. `menuMode` field lives here.
- `context.tsx` — `useBooking()` reducer (SET_FIELD, ADD_DISH/REMOVE_DISH,
  SET_SET_MENU, TOGGLE_SET_MENU_DISH [soft cap, no block], presentation actions,
  outdoor actions, RESET_WIZARD). Persists to localStorage.
- `queries.ts` — **the only Sanity door.** Per-collection fetch + fallback;
  `getCatalog()` runs them in parallel for the wizard layout.
- `catalog.tsx` — `useCatalog()`: the fetched catalog + lookups. UI reads this,
  never the raw data. `catalog-hooks.ts` — `usePricingData()`.
- `pricing.ts` — settings-driven math: `(state, PricingData)` everywhere, GST +
  discount codes (`findDiscountCode`, pre-GST) + per-menu add-on override.
- FALLBACK data (only used when Sanity is unset/empty/unreachable):
  `data.ts` (outdoor + packaging), `generated/set-menus.ts`,
  `generated/custom-menu.ts` (GENERATED — see scripts), `cuisine-groups.ts`
  (the card → section mapping, all 55 sections mapped exactly once),
  `config.ts` (presentation options + `DEFAULT_PRICING_SETTINGS`),
  `fallback.ts` (venues/occasions + legacy WS1 arrays).
- `menu-utils.ts` — pure helpers shared by the fallback and the Sanity path
  (`withCuisineCounts`, `sectionsForCuisines`, `itemIdsForCuisine`, maps).
- `flow.ts` — `getSteps(state)` (6 steps in custom mode), `stepIndexOf`,
  `menuStepIndex`, `venueKindOf` (pricing labels only).
- Shared components (`components/menu-builder/`): `BuilderLayout` (shell + nav +
  sidebar, responsive), `ProgressBar` (dynamic, mobile-compact), `NavFooter`,
  `BookingSummary` (3 variants), `SetMenuStep`, `CustomMenuStep`.
- Routes (`app/menu-builder/`): `client`, `venue`, `menu`, `cuisine`,
  `custom-menu`, `presentation`, `catalog`, `packaging`, `quote`
  (+ `layout.tsx` fetches the whole catalog once, `loading.tsx` skeleton). Each
  page guards its prerequisites and redirects to Step 1 / Venue / Cuisine if
  deep-linked.

### Blog (WS3) — `lib/blog/` + `app/blog/`
- `queries.ts` — `getAllBlogPosts`, `getBlogSlugs`, `getBlogPostBySlug` (fallback
  = the original placeholder cards).
- `app/blog/page.tsx` — server-fetched grid, layout unchanged.
- `app/blog/[slug]/page.tsx` — SSG (`generateStaticParams`) + `generateMetadata`
  (async `params`), luxury-styled post page.
- `components/blog/PortableTextRenderer.tsx` — Cormorant h2/h3, blockquotes,
  inline captioned images, links.
- `app/blog/rss.xml/route.ts` — RSS 2.0 feed.

### Site Photos (WS2) — `lib/site-images/`
- `queries.ts` — `getSiteImages()` resolves the `siteImages` singleton to URLs
  (nulls / empty arrays when unset → consumers use their `/public` fallbacks).
- Wired so far: every page hero + video poster + gallery grids. Consumers take an
  optional `bgImage?`/`poster?` prop and coalesce `?? FALLBACK_CONST`.

### CRM (WS4) — DEFERRED
Not started (per client's "4th task later"). Env placeholders are in
`.env.local.example`. Booking schema, `/api/booking/submit`, Cronberry adapter
stub, and Step-5 wiring remain.

## Next.js 16 gotchas (this repo)
- `params` in pages/layouts/routes is **async** — always `await props.params`.
- `revalidateTag(tag, profile)` requires the **second arg** (we use `"max"`).
- Turbopack is default; `next.config.ts` whitelists `cdn.sanity.io` remote images.
- Read `node_modules/next/dist/docs/` before using unfamiliar APIs (per AGENTS.md).

## Common commands
```bash
npm run dev            # site :3000, Studio :3000
npm run build          # production build (SANITY_TELEMETRY_DISABLED=1 to quiet)
npx tsc --noEmit       # typecheck
npm run seed-menu-builder                      # push menu data + photos to Sanity
npm run seed-menu-builder -- --dry-run         # ...write the NDJSON only
npm run import-menu -- ./data/menu-data.json   # legacy (pre-rework types)
```

## Setup & activation
See `SANITY_SETUP.md` for the three-command Sanity connect (login → init → dev),
the publish webhook, Vercel env vars, client access, and the menu import flow.

## Known environment issue
`npm install` here can fail with `ENOTEMPTY` on npm's rename step. Fix: remove
stale staging dirs first —
`find node_modules -maxdepth 2 -type d -name '.*-*' ! -name '.bin' ! -name '.cache' ! -name '.package-lock*' -prune -exec rm -rf {} +`
— then reinstall.
