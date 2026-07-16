import { defineArrayMember, defineField, defineType } from "sanity";

// A preset menu (e.g. "Maharaja Vyanjan") encodes the "choose any N" rules as
// real data: each section names how many dishes the guest may pick.
export default defineType({
  name: "presetMenu",
  title: "Preset Menu",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      description: 'e.g. “Maharaja Vyanjan”.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "basePrice",
      title: "Base Price (₹ per head)",
      type: "number",
      validation: (r) => r.min(0),
    }),
    defineField({
      name: "priceNote",
      title: "Price Note",
      type: "string",
      description: 'e.g. “per plate, min 300 guests”.',
    }),
    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "sortOrder",
      title: "Sort Order",
      type: "number",
      initialValue: 100,
    }),
    defineField({
      name: "sections",
      title: "Sections",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "section",
          fields: [
            defineField({
              name: "sectionName",
              title: "Section Name",
              type: "string",
              description: 'e.g. “Snacks”, “Soups”, “Main Course”.',
              validation: (r) => r.required(),
            }),
            defineField({
              name: "chooseCount",
              title: "Choose Count",
              type: "number",
              description: 'How many dishes the guest may pick from this section (e.g. 5 for “choose any 5 snacks”). 0 = all included.',
              initialValue: 0,
              validation: (r) => r.min(0),
            }),
            defineField({
              name: "dishes",
              title: "Dishes",
              type: "array",
              of: [{ type: "reference", to: [{ type: "dish" }] }],
            }),
          ],
          preview: {
            select: { title: "sectionName", chooseCount: "chooseCount", dishes: "dishes" },
            prepare({ title, chooseCount, dishes }) {
              const count = Array.isArray(dishes) ? dishes.length : 0;
              return {
                title,
                subtitle: chooseCount
                  ? `Choose any ${chooseCount} of ${count}`
                  : `${count} dishes (all included)`,
              };
            },
          },
        }),
      ],
    }),
  ],
  orderings: [
    { title: "Sort order", name: "sortOrderAsc", by: [{ field: "sortOrder", direction: "asc" }] },
  ],
  preview: {
    select: { title: "name", subtitle: "priceNote", media: "coverImage" },
  },
});
