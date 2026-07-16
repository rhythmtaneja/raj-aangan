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

## 3. Import the menu data (once you have the JSON)

```bash
set -a; . ./.env.local; set +a          # load env into the shell
npm run import-menu -- ./data/menu-data.json
```

The importer is **idempotent** — deterministic IDs mean re-running replaces
documents instead of duplicating them. See `scripts/import-menu-data.ts` for
the expected JSON shape. Dishes' images are added later in Studio; the import
only carries text, prices, and references.

Dry run (transform only, no upload):

```bash
node scripts/import-menu-data.ts ./data/menu-data.json --dry-run
```

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
| Site Photos    | Every swappable image on the public site (text stays in code) |
| Menu Builder   | Dishes, cuisines, categories, preset menus, venues, occasions |
| Blog           | Posts (rich text) and authors |
