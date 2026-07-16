// ══════════════════════════════════════════════════════════════════
// PATH IN REPO: sanity/image.ts
// ══════════════════════════════════════════════════════════════════
// urlFor() — turns a Sanity image reference into an optimized CDN URL.
// Safe to import from client components (no token, just projectId/dataset).
// ══════════════════════════════════════════════════════════════════

import { createImageUrlBuilder } from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";
import { dataset, projectId, studioProjectId } from "./env";

const builder = createImageUrlBuilder({ projectId: studioProjectId, dataset });

/**
 * Build an optimized image URL from a Sanity image source.
 *   urlFor(img).width(2400).quality(80).auto("format").url()
 *
 * Returns `null` when the source is missing OR Sanity isn't configured yet,
 * so callers can fall back to their hardcoded /public path.
 */
export function urlFor(source: unknown) {
  if (!source || !projectId) return null;
  try {
    return builder.image(source as SanityImageSource);
  } catch {
    return null;
  }
}

/**
 * Convenience: resolve a Sanity image to a ready-to-use CDN string with sane
 * defaults, or return the provided fallback path. `width` sizes the largest
 * render; next/image still handles srcset/lazy-loading downstream.
 */
export function imageUrl(
  source: unknown,
  fallback: string,
  width = 1600,
): string {
  const b = urlFor(source);
  if (!b) return fallback;
  return b.width(width).quality(80).auto("format").url();
}
