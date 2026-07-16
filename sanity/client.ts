// ══════════════════════════════════════════════════════════════════
// PATH IN REPO: sanity/client.ts
// ══════════════════════════════════════════════════════════════════
// Server-side read client. Used by lib/menu-builder/queries.ts and the
// site-image / blog fetchers. NEVER import this into a "use client" file
// — the read token must stay on the server.
// ══════════════════════════════════════════════════════════════════

import { createClient } from "next-sanity";
import { apiVersion, dataset, studioProjectId } from "./env";

// `studioProjectId` falls back to a valid placeholder when the real id is
// unset, so constructing the client never throws at module load. Every query
// in queries.ts is gated behind `isSanityConfigured`, so this placeholder
// client is never actually used to fetch until a real project id is present.
export const client = createClient({
  projectId: studioProjectId,
  dataset,
  apiVersion,
  // Published, CDN-cached content for the public site.
  useCdn: true,
  // Optional read token — only needed for private datasets / drafts.
  // Public datasets (Sanity free tier default) read fine without it.
  token: process.env.SANITY_API_READ_TOKEN,
  perspective: "published",
});
