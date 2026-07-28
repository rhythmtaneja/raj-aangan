// ══════════════════════════════════════════════════════════════════
// PATH IN REPO: sanity/schemaTypes/customMenuSection.ts
// ══════════════════════════════════════════════════════════════════
// One section of the à-la-carte master menu used by the custom builder
// (/menu-builder/custom-menu) — e.g. "The Great Indian Chaat Experience".
// Mirrors `CustomMenuSection` in lib/menu-builder/types.ts: a section holds
// subsections, and a subsection holds the dishes with their per-plate prices.
//
// A section with a single blank-labelled subsection renders as a flat list.
// Item ids come from the array `_key`s (seeded from the generated file).
// ═══════════════════════════════════════════════════════════════════════════

import { defineArrayMember, defineField, defineType } from "sanity";

export default defineType({
  name: "customMenuSection",
  title: "À-la-carte Section",
  type: "document",
  fields: [
    defineField({
      name: "label",
      title: "Section Name",
      type: "string",
      description: 'The heading guests see, e.g. “The Soup Atelier”.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "Used as the section's id. Generate once and leave it alone.",
      options: { source: "label", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "isActive",
      title: "Show in the Menu Builder",
      type: "boolean",
      description: "Turn off to hide this whole section from guests.",
      initialValue: true,
    }),
    defineField({
      name: "sortOrder",
      title: "Sort Order",
      type: "number",
      description:
        "Lower numbers appear first. Keeps the menu in course order (drinks → starters → mains → desserts).",
      initialValue: 100,
    }),
    defineField({
      name: "subsections",
      title: "Groups",
      type: "array",
      description:
        "Optional sub-headings inside the section. Leave the name blank for a plain list of dishes.",
      of: [
        defineArrayMember({
          type: "object",
          name: "subsection",
          fields: [
            defineField({
              name: "label",
              title: "Group Name",
              type: "string",
              description: 'Leave blank for a flat list, e.g. “The Nawabi Chaat Atelier”.',
            }),
            defineField({
              name: "items",
              title: "Dishes",
              type: "array",
              of: [
                defineArrayMember({
                  type: "object",
                  name: "item",
                  fields: [
                    defineField({
                      name: "name",
                      title: "Dish Name",
                      type: "string",
                      validation: (r) => r.required(),
                    }),
                    defineField({
                      name: "traditionalName",
                      title: "Traditional Name",
                      type: "string",
                      description: "Optional second line, e.g. “Aloo Bukhara / Plum”.",
                    }),
                    defineField({
                      name: "description",
                      title: "Description",
                      type: "string",
                      description: "Optional — used instead of the traditional name when set.",
                    }),
                    defineField({
                      name: "price",
                      title: "Price (₹ per plate)",
                      type: "number",
                      description:
                        "Per-head price added to the quote when a guest picks this dish. Leave empty until the real price is known.",
                      validation: (r) => r.min(0),
                    }),
                    defineField({
                      name: "isActive",
                      title: "Available",
                      type: "boolean",
                      description: "Turn off to hide just this dish.",
                      initialValue: true,
                    }),
                  ],
                  preview: {
                    select: {
                      title: "name",
                      traditionalName: "traditionalName",
                      description: "description",
                      price: "price",
                      isActive: "isActive",
                    },
                    prepare({ title, traditionalName, description, price, isActive }) {
                      const bits = [traditionalName || description, price ? `₹${price}` : null]
                        .filter(Boolean)
                        .join(" · ");
                      return {
                        title,
                        subtitle: isActive === false ? `${bits} · hidden` : bits,
                      };
                    },
                  },
                }),
              ],
            }),
          ],
          preview: {
            select: { title: "label", items: "items" },
            prepare({ title, items }) {
              const count = Array.isArray(items) ? items.length : 0;
              return {
                title: title || "(flat list)",
                subtitle: `${count} ${count === 1 ? "dish" : "dishes"}`,
              };
            },
          },
        }),
      ],
    }),
  ],
  orderings: [
    {
      title: "Menu order",
      name: "sortOrderAsc",
      by: [{ field: "sortOrder", direction: "asc" }],
    },
    {
      title: "Name A–Z",
      name: "labelAsc",
      by: [{ field: "label", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "label", subsections: "subsections", isActive: "isActive" },
    prepare({ title, subsections, isActive }) {
      const groups = Array.isArray(subsections) ? subsections : [];
      const items = groups.reduce(
        (n: number, g: { items?: unknown[] }) => n + (Array.isArray(g.items) ? g.items.length : 0),
        0,
      );
      const label = `${items} ${items === 1 ? "dish" : "dishes"}`;
      return { title, subtitle: isActive === false ? `${label} · hidden` : label };
    },
  },
});
