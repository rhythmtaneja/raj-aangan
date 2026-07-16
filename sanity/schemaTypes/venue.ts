import { defineField, defineType } from "sanity";

export default defineType({
  name: "venue",
  title: "Venue",
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
      name: "type",
      title: "Type",
      type: "string",
      options: {
        list: [
          { title: "Our Property", value: "our-property" },
          { title: "Partner", value: "partner" },
        ],
        layout: "radio",
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "category",
      title: "Setting",
      type: "string",
      options: {
        list: [
          { title: "Indoor", value: "Indoor" },
          { title: "Outdoor", value: "Outdoor" },
          { title: "Both", value: "Both" },
        ],
        layout: "radio",
      },
      initialValue: "Both",
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "address",
      title: "Address",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "description",
      title: "Short Descriptor",
      type: "string",
      description: 'Rendered under the name, e.g. “Heritage Outdoor Lawn”.',
    }),
    defineField({
      name: "capacity",
      title: "Capacity",
      type: "string",
      description: 'e.g. “200-2000”. Leave empty if not specified.',
    }),
    defineField({
      name: "logisticsPerHead",
      title: "Logistics Per Head (₹)",
      type: "number",
      description: "Per-head logistics surcharge. 0 = included in base rate.",
      initialValue: 0,
      validation: (r) => r.min(0),
    }),
    defineField({
      name: "pricingNote",
      title: "Pricing Note",
      type: "string",
      description: 'Display text, e.g. “Included in base rate” or “+ 25/ Head Logistic”.',
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
    select: { title: "name", subtitle: "type", media: "image" },
  },
});
