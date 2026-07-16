// ══════════════════════════════════════════════════════════════════
// PATH IN REPO: sanity.config.ts
// ══════════════════════════════════════════════════════════════════
// Studio configuration. Loaded by the embedded Studio at /studio and by
// the Sanity CLI (import / deploy). Reads projectId + dataset from env.
// ══════════════════════════════════════════════════════════════════

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { apiVersion, dataset, studioProjectId } from "./sanity/env";
import { schemaTypes } from "./sanity/schemaTypes";
import { structure } from "./sanity/structure";

const SINGLETONS = new Set(["siteImages"]);

export default defineConfig({
  name: "raj-aangan",
  title: "Raj Aangan Admin",
  basePath: "/studio",
  projectId: studioProjectId,
  dataset,
  plugins: [structureTool({ structure }), visionTool({ defaultApiVersion: apiVersion })],
  schema: {
    types: schemaTypes,
    // Hide singleton types from the global "create new" menu.
    templates: (templates) =>
      templates.filter(({ schemaType }) => !SINGLETONS.has(schemaType)),
  },
  document: {
    // Remove create/delete/duplicate actions on singleton documents.
    actions: (input, context) =>
      SINGLETONS.has(context.schemaType)
        ? input.filter(
            ({ action }) =>
              action &&
              ["publish", "discardChanges", "restore"].includes(action),
          )
        : input,
  },
});
