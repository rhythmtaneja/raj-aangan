import { defineField, defineType } from "sanity";

// A cuisine = a Step-3 category the guest picks (Drinks, Chaat, Thai, Italian…).
// Maps to the site's `CuisineCategory` type. Item counts are computed live.
export default defineType({
  name: "cuisine",
  title: "Cuisine",
  type: "document",
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      description: "Shown on the Step 3 cuisine card, e.g. “Thai”, “Chaat”, “Drinks”.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "Stable id used to link dishes to this cuisine. Click Generate.",
      options: { source: "label", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      description: "Card image on the Step 3 cuisine picker. ~600×400px looks best.",
      options: { hotspot: true },
    }),
    defineField({
      name: "sortOrder",
      title: "Sort Order",
      type: "number",
      description: "Lower numbers appear first.",
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
    select: { title: "label", media: "coverImage" },
  },
});
