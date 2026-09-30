import { pathToFileURL } from "node:url";
import { resolve as resolvePath } from "node:path";

const ROOT = pathToFileURL(resolvePath(import.meta.dirname, "..")).href + "/";

const candidates = (specifier) => [
  `${specifier}.ts`,
  `${specifier}.tsx`,
  `${specifier}/index.ts`,
];

export async function resolve(specifier, context, next) {
  const spec = specifier.startsWith("@/")
    ? new URL(specifier.slice(2), ROOT).href
    : specifier;

  try {
    return await next(spec, context);
  } catch (err) {
    if (
      err?.code !== "ERR_MODULE_NOT_FOUND" &&
      err?.code !== "ERR_UNSUPPORTED_DIR_IMPORT"
    ) {
      throw err;
    }
    for (const candidate of candidates(spec)) {
      try {
        return await next(candidate, context);
      } catch {}
    }
    throw err;
  }
}
