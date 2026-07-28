// ══════════════════════════════════════════════════════════════════
// PATH IN REPO: sanity.config.ts
// ══════════════════════════════════════════════════════════════════
// Studio configuration. Loaded by the embedded Studio at /studio and by
// the Sanity CLI (import / deploy). Reads projectId + dataset from env.
//
// Two bits of client-friendliness live here:
//   • SINGLETONS (Site Photos, Pricing & Quote Settings) can't be created,
//     duplicated or deleted — only edited.
//   • Presentation options get one "create" template per kind, so the +
//     button inside e.g. the Cutlery list makes a cutlery option.
// ══════════════════════════════════════════════════════════════════

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { apiVersion, dataset, studioProjectId } from "./sanity/env";
import { schemaTypes } from "./sanity/schemaTypes";
import { PRESENTATION_KINDS } from "./sanity/schemaTypes/presentationOption";
import { SINGLETONS, structure } from "./sanity/structure";

export default defineConfig({
  name: "raj-aangan",
  title: "Raj Aangan Admin",
  basePath: "/studio",
  projectId: studioProjectId,
  dataset,
  plugins: [structureTool({ structure }), visionTool({ defaultApiVersion: apiVersion })],
  schema: {
    types: schemaTypes,
    templates: (templates) => [
      // Hide singleton types from the global "create new" menu.
      ...templates.filter(({ schemaType }) => !SINGLETONS.has(schemaType)),
      // One pre-filled template per presentation option kind, used by the
      // + button inside each filtered list in the desk.
      ...PRESENTATION_KINDS.map((k) => ({
        id: `presentationOption-${k.value}`,
        title: k.title,
        schemaType: "presentationOption",
        value: { kind: k.value },
      })),
    ],
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
