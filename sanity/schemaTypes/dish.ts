import { defineField, defineType } from "sanity";

export const DIETARY_TAGS = [
  { title: "Veg", value: "veg" },
  { title: "Non Veg", value: "non-veg" },
  { title: "Jain", value: "jain" },
  { title: "Satvik", value: "satvik" },
  { title: "Vegan", value: "vegan" },
  { title: "Gluten Free", value: "gluten-free" },
] as const;

export default defineType({
  name: "dish",
  title: "Dish",
  type: "document",
  fields: [
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
      options: { source: "name", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle",
      type: "string",
      description: 'Small line under the name, e.g. “Aloo Bukhara / Plum Juice”.',
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "price",
      title: "Price (₹)",
      type: "number",
      description: "Leave empty if this dish has no standalone price.",
      validation: (r) => r.min(0),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "cuisine",
      title: "Cuisine",
      type: "reference",
      to: [{ type: "cuisine" }],
      description: "The Step 3 cuisine this dish belongs to.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "categoryTags",
      title: "Categories",
      type: "array",
      of: [{ type: "reference", to: [{ type: "category" }] }],
      description: "Section(s) this dish appears under. The first one is its display section.",
    }),
    defineField({
      name: "dietaryTags",
      title: "Dietary Tags",
      type: "array",
      of: [{ type: "string" }],
      options: { list: [...DIETARY_TAGS] },
    }),
    defineField({
      name: "isActive",
      title: "Active",
      type: "boolean",
      description: "Uncheck to hide this dish from the site without deleting it.",
      initialValue: true,
    }),
  ],
  orderings: [
    { title: "Name A→Z", name: "nameAsc", by: [{ field: "name", direction: "asc" }] },
  ],
  preview: {
    select: { title: "name", subtitle: "subtitle", media: "image" },
  },
});
