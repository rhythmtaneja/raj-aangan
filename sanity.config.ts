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
  plugins: [
    structureTool({ structure }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
  schema: {
    types: schemaTypes,
    templates: (templates) => [
      ...templates.filter(({ schemaType }) => !SINGLETONS.has(schemaType)),

      ...PRESENTATION_KINDS.map((k) => ({
        id: `presentationOption-${k.value}`,
        title: k.title,
        schemaType: "presentationOption",
        value: { kind: k.value },
      })),
    ],
  },
  document: {
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
