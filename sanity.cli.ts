// ══════════════════════════════════════════════════════════════════
// PATH IN REPO: sanity.cli.ts
// ══════════════════════════════════════════════════════════════════
// Config for the Sanity CLI — used by `sanity dataset import` (the menu
// import script) and `sanity deploy`. Reads the same env vars as the app.
// ══════════════════════════════════════════════════════════════════

import { defineCliConfig } from "sanity/cli";
import { dataset, projectId } from "./sanity/env";

export default defineCliConfig({
  api: { projectId, dataset },
  // Studio is embedded in the Next.js app at /studio, not deployed standalone.
  autoUpdates: true,
});
