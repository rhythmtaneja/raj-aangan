// ══════════════════════════════════════════════════════════════════
// PATH IN REPO: scripts/ts-loader-hooks.mjs
// ══════════════════════════════════════════════════════════════════
// Resolve hooks registered by ts-loader.mjs. See that file for the why.
// ═══════════════════════════════════════════════════════════════════════════

import { pathToFileURL } from "node:url";
import { resolve as resolvePath } from "node:path";

const ROOT = pathToFileURL(resolvePath(import.meta.dirname, "..")).href + "/";

/** Candidate specifiers to try when the literal one doesn't resolve. */
const candidates = (specifier) => [
  `${specifier}.ts`,
  `${specifier}.tsx`,
  `${specifier}/index.ts`,
];

export async function resolve(specifier, context, next) {
  // "@/lib/..." → repo-root relative (matches tsconfig paths).
  const spec = specifier.startsWith("@/")
    ? new URL(specifier.slice(2), ROOT).href
    : specifier;

  try {
    return await next(spec, context);
  } catch (err) {
    if (err?.code !== "ERR_MODULE_NOT_FOUND" && err?.code !== "ERR_UNSUPPORTED_DIR_IMPORT") {
      throw err;
    }
    for (const candidate of candidates(spec)) {
      try {
        return await next(candidate, context);
      } catch {
        // keep trying
      }
    }
    throw err;
  }
}
