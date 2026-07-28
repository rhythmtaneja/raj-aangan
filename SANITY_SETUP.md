# Sanity setup — Raj Aangan admin

The site is built to run **with or without** a live Sanity project. Until you
connect one, every page falls back to the hardcoded content/images already in
the repo. Connecting Sanity is three commands.

## 1. Create the project (one time)

```bash
npx sanity login                 # opens browser — sign in with the client's account
npx sanity init --env            # choose "Create new project", dataset: production
                                 # this writes NEXT_PUBLIC_SANITY_PROJECT_ID etc. to .env.local
```

If `sanity init` doesn't write env vars, copy `.env.local.example` to
`.env.local` and paste the **Project ID** from https://sanity.io/manage.

Minimum required in `.env.local`:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=xxxxxxxx
NEXT_PUBLIC_SANITY_DATASET=production
```

## 2. Run it

```bash
npm run dev
```

- Site: http://localhost:3000
- Studio: http://localhost:3000/studio

Add the same env vars in **Vercel → Project → Settings → Environment
Variables**, then redeploy. Studio ships at `https://<your-domain>/studio`.

## 3. Seed the Menu Builder (do this once, right after step 1)

This copies everything the Menu Builder currently shows — the 7 set menus, the
1,128-dish à-la-carte menu, the 15 cuisine cards, the presentation options, the
outdoor catalog and the pricing/quote settings — into Sanity, **including the
photos** from `/public`, so the client opens Studio to a filled-in CMS.

```bash
set -a; . ./.env.local; set +a          # load env into the shell
npx sanity login                        # if you aren't logged in already
npm run seed-menu-builder
```

120 documents, idempotent: every document has a deterministic `_id`
(`setMenu-breakfast-menu`, `customMenuSection-the-soup-atelier`, …) and the
import runs with `--replace`, so re-running updates in place instead of
duplicating. Array items keep the ids the app already uses as their `_key`, so
guests' saved selections survive the migration.

```bash
npm run seed-menu-builder -- --dry-run              # write the NDJSON, don't import
npm run seed-menu-builder -- --only=setMenu,cuisineGroup
```

> Re-running the seed **overwrites** the client's Studio edits for the
> documents it touches. After the first run, use `--only=…` or don't run it.

Legacy importer (pre-rework dish/cuisine/presetMenu types, kept for reference):
`npm run import-menu -- ./data/menu-data.json`.

## 4. Live updates (publish → site refresh in ~30s)

The site tags every fetch by document type and revalidates on a Sanity
webhook. In https://sanity.io/manage → **API → Webhooks**, add:

- **URL:** `https://<your-domain>/api/revalidate`
- **Trigger on:** Create, Update, Delete
- **Projection:** `{ "_type": _type, "slug": slug.current }`
- **Secret:** a random string, also set as `SANITY_REVALIDATE_SECRET` in Vercel

Without the webhook, edits still appear within the 30-second ISR window.

## Access for the client

Invite the client's team in https://sanity.io/manage → **Members** (Editor
role). They log into `/studio` with their own Sanity account — no code access,
no separate deploy.

## What lives where

| Studio section | Editable content |
| -------------- | ---------------- |
| Menu Builder → Set Menus | The 7 fixed packages: per-person price, cover photo, description, courses, “choose N”, every dish, add-on surcharge |
| Menu Builder → À-la-carte Menu | The 55 master-menu sections and all 1,128 dishes: name, traditional name, **price per plate**, availability, order |
| Menu Builder → Cuisine Cards | The cards on the Cuisine step: name, photo, and which à-la-carte sections each one unlocks |
| Menu Builder → Presentation Options | Cutlery, presentation styles, stall themes, live counters (photos + names) |
| Menu Builder → Outdoor Catering | Bulk catalog items (price, unit, photo) and packaging styles |
| Menu Builder → Venues / Occasions | Venue cards, capacity, per-head logistics; occasion tiles |
| Menu Builder → Pricing & Quote Settings | GST %, add-on price, minimum guests, discount codes, quote heading/terms/validity/deposit, contact details |
| Site Photos    | Every swappable image on the public site (text stays in code) |
| Blog           | Posts (rich text) and authors |

Full field-by-field walkthrough for the client: [`docs/CMS_GUIDE.md`](docs/CMS_GUIDE.md).

Anything left empty in Studio falls back to what the code ships with, so the
site never renders blank — see `lib/menu-builder/queries.ts`.
