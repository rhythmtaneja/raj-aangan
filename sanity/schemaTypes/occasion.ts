import { defineField, defineType } from "sanity";

// Step 1 occasion cards (Wedding, Sangeet, Haldi…).
export default defineType({
  name: "occasion",
  title: "Occasion",
  type: "document",
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "Stable id stored on the booking, e.g. “wedding”.",
      options: { source: "label", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      description: "Card image on the Step 1 occasion grid. ~600×400px.",
      options: { hotspot: true },
    }),
    defineField({
      name: "sortOrder",
      title: "Sort Order",
      type: "number",
      initialValue: 100,
    }),
  ],
  orderings: [
    { title: "Sort order", name: "sortOrderAsc", by: [{ field: "sortOrder", direction: "asc" }] },
  ],
  preview: {
    select: { title: "label", media: "image" },
  },
});
