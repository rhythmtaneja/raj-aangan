// ══════════════════════════════════════════════════════════════════
// PATH IN REPO: sanity/schemaTypes/packagingStyle.ts
// ══════════════════════════════════════════════════════════════════
// Packaging choice on the outdoor sub-flow (/menu-builder/packaging).
// Mirrors `PackagingStyle` in lib/menu-builder/types.ts.
// ═══════════════════════════════════════════════════════════════════════════

import { defineField, defineType } from "sanity";

export default defineType({
  name: "packagingStyle",
  title: "Packaging Style",
  type: "document",
  fields: [
    defineField({
      name: "label",
      title: "Name",
      type: "string",
      description: 'e.g. “Eco Kraft Box”.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "Used as the option's id. Generate once and leave it alone.",
      options: { source: "label", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "string",
      description: "Optional one-liner shown under the name.",
    }),
    defineField({
      name: "pricePerUnit",
      title: "Extra Cost Per Unit (₹)",
      type: "number",
      description:
        "Optional packaging surcharge. Not added to the quote yet — reserved for when packaging pricing is agreed.",
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
      initialValue: 100,
    }),
  ],
  orderings: [
    {
      title: "Sort order",
      name: "sortOrderAsc",
      by: [{ field: "sortOrder", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "label", subtitle: "description", isActive: "isActive" },
    prepare({ title, subtitle, isActive }) {
      return { title, subtitle: isActive === false ? `${subtitle ?? ""} · hidden`.trim() : subtitle };
    },
  },
});
