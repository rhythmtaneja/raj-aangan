// ══════════════════════════════════════════════════════════════════
// PATH IN REPO: scripts/ts-loader.mjs
// ══════════════════════════════════════════════════════════════════
// Lets plain `node` run our TypeScript sources directly.
//
// Node 24 strips types on its own, but it still resolves imports the Node
// way — our app code uses bundler-style extensionless imports
// ("./generated/custom-menu"), which Node can't find. This registers a resolve
// hook that retries a failed specifier as "<spec>.ts" / "<spec>/index.ts",
// and maps the "@/" path alias to the repo root, so scripts can import the
// same modules the app does instead of duplicating data.
//
// Usage:  node --import ./scripts/ts-loader.mjs scripts/seed-menu-builder.ts
// ═══════════════════════════════════════════════════════════════════════════

import { register } from "node:module";
import { pathToFileURL } from "node:url";

register("./ts-loader-hooks.mjs", pathToFileURL(import.meta.filename));
