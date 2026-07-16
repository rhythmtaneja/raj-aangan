# Session handoff — Raj Aangan CMS phase

_Last updated: 2026-07-17_

Read `CLAUDE.md` first for the architecture map. This doc is the running status
+ what to pick up next.

## Status at a glance

| Workstream | State | Notes |
| ---------- | ----- | ----- |
| Foundation (embedded Studio, fallback arch) | ✅ Done | Builds green, 23/23 pages prerender, smoke-tested |
| WS1 — Menu Builder CMS | ✅ Done | Schemas, queries, wizard refactor, import script |
| WS2 — Site Photos | ◑ Partial | Heroes + gallery grids wired; array galleries remain |
| WS3 — Blog | ✅ Done | Grid, `[slug]`, PortableText, RSS, SEO |
| WS4 — Cronberry CRM | ⛔ Deferred | Not started (client said "later") |

**Nothing is committed** — all work is in the working tree. Verify with
`git status`. Consider committing in logical chunks (foundation → WS1 → WS3 → WS2).

## Verified this session
- `npx tsc --noEmit` — clean.
- `SANITY_TELEMETRY_DISABLED=1 npx next build` — clean, 23/23 pages.
- `npx next start` smoke test (via Node `fetch`, curl isn't on PATH): `/`,
  `/menu-builder/client`, `/blog`, `/blog/rss.xml`, `/studio`, `/gallery` all 200;
  Studio shows the "not connected" notice; wizard + blog render fallback data.
- Import script dry-run produced correct NDJSON with deterministic IDs.

## The one thing only the user can do
Sanity project creation needs an interactive login. Until then everything runs on
fallback data. Three commands (full detail in `SANITY_SETUP.md`):
```bash
npx sanity login
npx sanity init --env      # Create new project, dataset: production
npm run dev
```
Then add env vars to Vercel and configure the publish webhook → `/api/revalidate`.

## Pick up next: finish WS2 (Site Photos)

Heroes + gallery grids are done. **Remaining image slots** — schema fields already
exist in `sanity/schemaTypes/siteImages.ts`; each needs per-component prop
threading with a `?? FALLBACK` coalesce (same pattern as the heroes):

1. **Home about-rows** — `siteImages.homeAboutRow1Left/Right`,
   `homeAboutRow2Left/Right`. Check `components/sections/AboutSection.tsx`
   (has an `ABOUT_IMAGES` array + inline `/images/about-1.jpg`). Confirm the
   real layout has 2 rows / 4 slots — adjust schema if the component differs.
2. **About story strip** — `siteImages.aboutStoryImages[]` →
   `components/sections/about/AboutStorySection.tsx` (`TOP_PHOTO` + array).
3. **Events marquee + categories** — `eventsHeroImages[]`,
   `eventsWeddingCategoryImages[]`, etc. →
   `components/sections/events/*` and `app/events/page.tsx`. **Caution:** verify
   the actual event categories in code before trusting the schema's guessed
   category names (wedding/birthday/corporate/social).
4. **Venue property galleries** — `venuePartnersImages[]`,
   `venueRajAanganImages[]`, `venueRajGharanaImages[]` →
   `components/sections/venue/{PartnersGridSection,VenuePropertiesSection,...}.tsx`
   (these hold structured objects with `image` fields, not bare strings — thread
   carefully, may want to only swap the `image` and keep other fields hardcoded).

**Method that worked:** add an optional prop to the presentational component,
default-coalesce to the existing constant, then have the (server) page fetch
`getSiteImages()` and pass the resolved value. Typecheck + build after each page.

**Watch-outs discovered:**
- The `siteImages` schema fields for events/about/venue were written from the
  project spec, not from reading each component. **Reconcile field names with the
  actual components** as you wire — rename schema fields to match reality where
  they diverge, and keep `lib/site-images/{types,queries}.ts` in sync (three
  places: schema field, `SiteImages` type, `getSiteImages()` mapping + `EMPTY`).

## Then: WS4 (Cronberry CRM) when the user is ready

Deferred by the user. When starting:
- Needs `zod` (+ optional `resend`) installed — **use the ENOTEMPTY workaround**
  in CLAUDE.md / memory before/after installing.
- Build `booking` schema, `app/api/booking/submit/route.ts` (Zod validate →
  Sanity write → Cronberry forward), `lib/cronberry/client.ts` (stub returning
  fake lead id, `TODO` for real endpoint), Studio retry action, wire the Step-5
  "Save Booking" button in `app/menu-builder/quote/page.tsx` (currently a toast
  stub), optional fire-and-forget Resend email.
- Requires a `SANITY_API_WRITE_TOKEN` (read token isn't enough for writes).

## Gotchas to remember (also in CLAUDE.md)
- Sanity config must be imported only from a **client** component
  (`app/studio/[[...tool]]/Studio.tsx`) — RSC import breaks the build via `swr`.
- Next 16: async `params`, `revalidateTag(tag, "max")` (2nd arg required).
- `npm install` ENOTEMPTY → clear staging dirs first (command in CLAUDE.md).
- Placeholder image for missing Sanity images: `/public/images/mb-placeholder.jpg`.
- Pricing GST%/discount% are still placeholders — swap when client confirms.

## Key files created this session
```
sanity/ (env, client, image, schemaTypes/*, structure)
sanity.config.ts, sanity.cli.ts
app/studio/[[...tool]]/{page,layout,Studio}.tsx
app/api/revalidate/route.ts
lib/menu-builder/{queries,fallback,config,catalog}.ts(x)   (data.ts deleted)
lib/blog/{types,queries}.ts + components/blog/PortableTextRenderer.tsx
app/blog/[slug]/page.tsx, app/blog/rss.xml/route.ts
lib/site-images/{types,queries}.ts
scripts/import-menu-data.ts
SANITY_SETUP.md, .env.local.example
```
