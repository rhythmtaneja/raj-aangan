// ══════════════════════════════════════════════════════════════════
// PATH IN REPO: sanity/schemaTypes/presentationOption.ts
// ══════════════════════════════════════════════════════════════════
// Every picture-tile / pill option on the Presentation step, in one type with
// a "kind" selector (the desk splits them into five lists):
//   • cutlery          — Base Table Cutlery tiles
//   • presentationStyle— Presentation Style tiles
//   • stallTheme       — Stall Design Theme tiles
//   • liveCounterTile  — "Choose Your Live Counters" photo tiles
//   • liveCounter      — live-counter design pills
//
// Code equivalent (fallback): lib/menu-builder/config.ts.
// ═══════════════════════════════════════════════════════════════════════════

import { defineField, defineType } from "sanity";

export const PRESENTATION_KINDS = [
  { title: "Cutlery", value: "cutlery" },
  { title: "Presentation Style", value: "presentationStyle" },
  { title: "Stall Theme", value: "stallTheme" },
  { title: "Live Counter (photo tile)", value: "liveCounterTile" },
  { title: "Live Counter Design (pill)", value: "liveCounter" },
] as const;

export default defineType({
  name: "presentationOption",
  title: "Presentation Option",
  type: "document",
  fields: [
    defineField({
      name: "kind",
      title: "Which List",
      type: "string",
      description: "Where this option appears on the Presentation step.",
      options: { list: [...PRESENTATION_KINDS] },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "Used as the option's id. Generate once and leave it alone.",
      options: { source: "name", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "image",
      title: "Photo",
      type: "image",
      description: "Not needed for the pill-style live counter designs.",
      options: { hotspot: true },
      hidden: ({ parent }) => parent?.kind === "liveCounter",
    }),
    defineField({
      name: "pricePerHead",
      title: "Extra Cost Per Head (₹)",
      type: "number",
      description:
        "Optional surcharge. Not added to the quote yet — reserved for when presentation pricing is agreed.",
      validation: (r) => r.min(0),
    }),
    defineField({
      name: "isActive",
      title: "Show in the Menu Builder",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "sortOrder",
      title: "Sort Order",
      type: "number",
      description: "Lower numbers appear first within its list.",
      initialValue: 100,
    }),
  ],
  orderings: [
    {
      title: "List, then sort order",
      name: "kindThenSort",
      by: [
        { field: "kind", direction: "asc" },
        { field: "sortOrder", direction: "asc" },
      ],
    },
  ],
  preview: {
    select: { title: "name", kind: "kind", media: "image", isActive: "isActive" },
    prepare({ title, kind, media, isActive }) {
      const label = PRESENTATION_KINDS.find((k) => k.value === kind)?.title ?? kind;
      return {
        title,
        subtitle: isActive === false ? `${label} · hidden` : label,
        media,
      };
    },
  },
});
