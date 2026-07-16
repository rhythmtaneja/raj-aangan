import { defineField, defineType } from "sanity";

// A category = a course grouping a dish belongs to (e.g. "Paneer Preparation",
// "Welcome Elixirs"). `parentSection` buckets it into a coarse course so the
// wizard can derive Starter/Main/Dessert/Beverage filter tags.
export const PARENT_SECTIONS = [
  { title: "Starters", value: "starters" },
  { title: "Mains", value: "mains" },
  { title: "Desserts", value: "desserts" },
  { title: "Beverages", value: "beverages" },
  { title: "Live Counters", value: "live-counters" },
] as const;

export default defineType({
  name: "category",
  title: "Category",
  type: "document",
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      description: 'Section header shown above dishes, e.g. “Paneer Preparation”.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "label", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "parentSection",
      title: "Course",
      type: "string",
      description: "Which broad course this category falls under. Drives dish filter tags.",
      options: { list: [...PARENT_SECTIONS], layout: "radio" },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "sortOrder",
      title: "Sort Order",
      type: "number",
      description: "Lower numbers appear first within their course.",
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
    select: { title: "label", subtitle: "parentSection" },
  },
});
