import { createImageUrlBuilder } from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";
import { dataset, projectId, studioProjectId } from "./env";

const builder = createImageUrlBuilder({ projectId: studioProjectId, dataset });

export function urlFor(source: unknown) {
  if (!source || !projectId) return null;
  try {
    return builder.image(source as SanityImageSource);
  } catch {
    return null;
  }
}

export function imageUrl(
  source: unknown,
  fallback: string,
  width = 1600,
): string {
  const b = urlFor(source);
  if (!b) return fallback;
  return b.width(width).quality(80).auto("format").url();
}
