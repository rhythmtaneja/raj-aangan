// ══════════════════════════════════════════════════════════════════
// PATH IN REPO: sanity/schemaTypes/setMenu.ts
// ══════════════════════════════════════════════════════════════════
// One of the fixed, all-inclusive packages shown on the Menu step
// (/menu-builder/menu) — Breakfast, Lunch, Maharani, Maharaja, Signature,
// Royal Feast, Elite. Mirrors the `SetMenu` type in lib/menu-builder/types.ts.
//
// Ids the wizard stores in the guest's booking come from the array `_key`s, so
// the seed script writes the existing generated ids as keys (see
// scripts/seed-menu-builder.ts). Editing a menu in Studio keeps those keys.
// ═══════════════════════════════════════════════════════════════════════════

import { defineArrayMember, defineField, defineType } from "sanity";

const MEAL_TYPES = [
  "Breakfast",
  "Lunch",
  "High Tea",
  "Brunch",
  "Dinner",
  "Cocktail",
] as const;

export default defineType({
  name: "setMenu",
  title: "Set Menu",
  type: "document",
  groups: [
    { name: "main", title: "Menu", default: true },
    { name: "pricing", title: "Pricing" },
    { name: "courses", title: "Courses & Dishes" },
  ],
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      group: "main",
      description: 'Shown on the menu card, e.g. “Maharani Dinner Menu”.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "main",
      description: "Used as the menu's id. Generate once and leave it alone.",
      options: { source: "name", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      group: "main",
      options: { hotspot: true },
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      group: "main",
      description:
        'Small print under the menu, e.g. “RO water and 200ml bottles are included in the package.”',
    }),
    defineField({
      name: "mealTypeFit",
      title: "Suits Meal Types",
      type: "array",
      group: "main",
      description:
        "Which meal types this package is meant for. Informational for now — every menu is shown to the guest.",
      of: [defineArrayMember({ type: "string" })],
      options: { list: MEAL_TYPES.map((m) => ({ title: m, value: m })) },
    }),
    defineField({
      name: "isActive",
      title: "Show in the Menu Builder",
      type: "boolean",
      group: "main",
      description: "Turn off to hide this package from guests without deleting it.",
      initialValue: true,
    }),
    defineField({
      name: "sortOrder",
      title: "Sort Order",
      type: "number",
      group: "main",
      description: "Lower numbers appear first.",
      initialValue: 100,
    }),

    // ── Pricing ────────────────────────────────────────────────────────────
    defineField({
      name: "perPersonPrice",
      title: "Price Per Person (₹)",
      type: "number",
      group: "pricing",
      description: "The package rate per guest, before GST.",
      validation: (r) => r.required().min(0),
    }),
    defineField({
      name: "priceNote",
      title: "Price Note",
      type: "string",
      group: "pricing",
      description: 'Optional line under the price, e.g. “min 300 guests”.',
    }),
    defineField({
      name: "addOnPricePerItem",
      title: "Add-on Price Per Extra Dish (₹ per head)",
      type: "number",
      group: "pricing",
      description:
        "Charged per head for each dish a guest picks BEYOND a course's “choose N” limit. Leave empty to use the global value in Pricing & Quote Settings.",
      validation: (r) => r.min(0),
    }),

    // ── Courses ────────────────────────────────────────────────────────────
    defineField({
      name: "sections",
      title: "Courses",
      type: "array",
      group: "courses",
      description:
        "Each course is a heading in the accordion, with the dishes a guest can choose from.",
      of: [
        defineArrayMember({
          type: "object",
          name: "section",
          fields: [
            defineField({
              name: "label",
              title: "Course Name",
              type: "string",
              description: 'e.g. “Snacks”, “Main Course”, “Desserts”.',
              validation: (r) => r.required(),
            }),
            defineField({
              name: "chooseCount",
              title: "Choose How Many",
              type: "number",
              description:
                "How many dishes are included in the package price. Extra picks become paid add-ons. 0 = everything included.",
              initialValue: 0,
              validation: (r) => r.min(0),
            }),
            defineField({
              name: "note",
              title: "Course Note",
              type: "string",
              description: "Optional small print shown under the course heading.",
            }),
            defineField({
              name: "dishOptions",
              title: "Dishes",
              type: "array",
              of: [
                defineArrayMember({
                  type: "object",
                  name: "dishOption",
                  fields: [
                    defineField({
                      name: "name",
                      title: "Dish Name",
                      type: "string",
                      validation: (r) => r.required(),
                    }),
                    defineField({
                      name: "subtitle",
                      title: "Second Line",
                      type: "string",
                      description: "Optional — e.g. the traditional name.",
                    }),
                  ],
                  preview: { select: { title: "name", subtitle: "subtitle" } },
                }),
              ],
            }),
          ],
          preview: {
            select: { title: "label", chooseCount: "chooseCount", dishes: "dishOptions" },
            prepare({ title, chooseCount, dishes }) {
              const count = Array.isArray(dishes) ? dishes.length : 0;
              return {
                title,
                subtitle: chooseCount
                  ? `Choose ${chooseCount} of ${count}`
                  : `${count} dishes (all included)`,
              };
            },
          },
        }),
      ],
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
    select: {
      title: "name",
      price: "perPersonPrice",
      media: "coverImage",
      isActive: "isActive",
    },
    prepare({ title, price, media, isActive }) {
      const rate = typeof price === "number" ? `₹${price.toLocaleString("en-IN")} / head` : "No price";
      return {
        title,
        subtitle: isActive === false ? `${rate} · hidden` : rate,
        media,
      };
    },
  },
});
