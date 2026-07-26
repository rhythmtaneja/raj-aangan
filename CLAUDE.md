@AGENTS.md

# ⏱️ CURRENT STATE — Menu Builder rework (read this first)

Menu Builder rework is DONE and building green with **real menu data** (still
pre-Sanity: hardcoded/generated files). **Next up = Phase 8: Sanity CMS wiring
for the new types** (needs explicit go-ahead). `queries.ts` and the Sanity
schemas were deliberately left UNTOUCHED during the rework.

**Flow.** Step 1 picks a **catering type**: `venue-event` or `outdoor`
(`state.cateringType`). Progress bar is dynamic (`flow.ts/getSteps(state)`).
- **venue-event** (same for every venue — no raj-aangan branching):
  Client → Venue → **Menu** → Presentation → Quote (`STEPS_VENUE_EVENT`, 5 steps).
  - `/menu-builder/menu` (`SetMenuStep`) = the 7 fixed **set menus** for ALL
    venues. A CTA there ("Build a Custom Menu →") sets `menuMode:"custom"` and
    goes straight to `/menu-builder/custom-menu` (`CustomMenuStep`) — the full
    à-la-carte accordion. Both are the "Menu" step in the bar. (The old
    `/menu-builder/cuisine` category-tiles step was REMOVED.)
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

**Responsiveness (done this cycle):** all `clamp(min,Xvw,max)` font ceilings
were **capped to their 1440px value** (`scripts/*` one-off; the vw coeff stays,
only the ceiling dropped) so laptops ≥1440px render identically and the client's
wider screens no longer diverge from the ~1440 Mac. Mobile fixes: BuilderLayout
sidebar stacks below content (no inline grid override; two-col only lg+),
ProgressBar has a compact "Step X of N" bar on mobile, card padding p-5 md:p-10,
SiteHeader nav wraps on phones.

**OPEN ITEMS (waiting on client / decisions):**
1. Real per-person prices for Signature / Royal Feast / Elite set menus.
2. Real add-on surcharge rule (currently ₹100/head placeholder per extra dish).
3. Real prices in `RAEC_master_menu.csv` `price` column (custom items).
4. Presentation step: per-live-counter mapping (which counter → which cutlery /
   presentation / stall options). Currently selecting any counter reveals ALL
   options — see TODO in `app/menu-builder/presentation/page.tsx`.
5. Mobile: header nav currently WRAPS; decide whether to build a hamburger drawer.
6. Responsiveness calibration: reference width assumed 1440 — if the owner's Mac
   `window.innerWidth` differs a lot, recompute (recluster from the vw coeffs).

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
- `schemaTypes/` — `dish`, `category`, `cuisine`, `presetMenu`, `venue`,
  `occasion` (WS1); `siteImages` singleton (WS2); `blogPost`, `author` (WS3).
- `structure.ts` — desk structure with singleton handling (Site Photos).
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
- `data.ts` — client-safe placeholder + generated data: re-exports `SET_MENUS`
  and `CUSTOM_MENU_SECTIONS` from `generated/`, plus `CATALOG_ITEMS` /
  `PACKAGING_STYLES` (placeholder) and lookups (`getSetMenuById`,
  `getCustomMenuItemById`, `getCatalogItemById`, `getPackagingById`).
- `generated/set-menus.ts`, `generated/custom-menu.ts` — GENERATED (see scripts).
- `flow.ts` — `getSteps(state)`, `stepIndexOf`, `venueKindOf` (kept for pricing
  labels only; routing no longer branches on venue kind).
- `pricing.ts` — GST 5% (placeholder), set-menu per-head + add-ons, custom
  per-head = Σ item prices, outdoor subtotal, `formatINR`. `queries.ts`/
  `fallback.ts`/`config.ts`/`catalog.tsx` still exist (Sanity catalog for
  occasions/venues; cuisines+dishes now unused by the wizard) — untouched.
- Shared components (`components/menu-builder/`): `BuilderLayout` (shell + nav +
  sidebar, responsive), `ProgressBar` (dynamic, mobile-compact), `NavFooter`,
  `BookingSummary` (3 variants), `SetMenuStep`, `CustomMenuStep`.
- Routes (`app/menu-builder/`): `client`, `venue`, `menu`, `custom-menu`,
  `presentation`, `catalog`, `packaging`, `quote` (+ `layout.tsx` fetches the
  Sanity catalog for occasions/venues, `loading.tsx` skeleton). Each page guards
  its prerequisites and redirects to Step 1 / Venue if deep-linked.

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
npm run import-menu -- ./data/menu-data.json   # idempotent menu import
```

## Setup & activation
See `SANITY_SETUP.md` for the three-command Sanity connect (login → init → dev),
the publish webhook, Vercel env vars, client access, and the menu import flow.

## Known environment issue
`npm install` here can fail with `ENOTEMPTY` on npm's rename step. Fix: remove
stale staging dirs first —
`find node_modules -maxdepth 2 -type d -name '.*-*' ! -name '.bin' ! -name '.cache' ! -name '.package-lock*' -prune -exec rm -rf {} +`
— then reinstall.
