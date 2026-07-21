@AGENTS.md

Menu Builder rework: Phases 1–7 DONE (three sub-flows — Raj Aangan set-menu,
partner-venue cuisine, outdoor bulk — all built with hardcoded placeholder data
in `lib/menu-builder/data.ts`, dynamic step-sets, route protection). Phase 8
(Sanity wiring for set menus / catalog / packaging / presentation) is NOT
started — do not begin it without explicit confirmation. `queries.ts` was left
untouched per the rework brief. Reference designs: `docs/reference/screens/`.

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

### Menu Builder (WS1) — `lib/menu-builder/`
- `queries.ts` — server-only GROQ fetchers (`getOccasions`, `getVenues`,
  `getCuisines`, `getAllDishes`, `getPresetMenus`, `getCatalog`), ISR-tagged by
  `_type`, each falling back to `fallback.ts` on empty/error/unconfigured.
- `fallback.ts` — the old hardcoded catalog (was `data.ts`, now deleted).
- `config.ts` — static, non-Sanity wizard config (budget tiers, cutlery,
  presentation, stalls, live counters — out of CMS scope this phase).
- `catalog.tsx` — client `CatalogProvider` / `useCatalog()`. The wizard layout
  (`app/menu-builder/layout.tsx`, a server component) fetches once and provides it.
- `pricing.ts` — reads venue logistics from the Sanity-fed `venues` (passed in);
  GST% / discount% remain placeholder constants pending client numbers.
- Wizard pages (`app/menu-builder/{client,venue,cuisine,menu,quote}/`) consume
  `useCatalog()`; `loading.tsx` is the skeleton. The flow is visually identical.

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
npm run dev            # site :3000, Studio :3000/studio
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
