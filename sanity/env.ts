// ══════════════════════════════════════════════════════════════════
// PATH IN REPO: sanity/env.ts
// ══════════════════════════════════════════════════════════════════
// Central place for Sanity connection values. Everything is read from
// env vars so nothing sensitive is hardcoded.
//
// IMPORTANT — graceful degradation:
//   The whole site is built to work even BEFORE a Sanity project exists.
//   When NEXT_PUBLIC_SANITY_PROJECT_ID is unset, `isSanityConfigured` is
//   false and every query in lib/menu-builder/queries.ts (and the site
//   image helpers) falls back to the hardcoded data / public paths.
//   Fill in the env vars (see .env.local.example) to flip everything live.
// ══════════════════════════════════════════════════════════════════

export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-01-01";

export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";

/** True once a real Sanity project id is present. Drives all fallbacks. */
export const isSanityConfigured = projectId.length > 0;

/**
 * Studio needs a syntactically valid projectId to even construct its config
 * at build time. When none is set yet we hand it a harmless placeholder so
 * `next build` stays green; the /studio route itself guards on
 * `isSanityConfigured` and shows a setup notice instead of a broken Studio.
 */
export const studioProjectId = projectId || "placeholder";
