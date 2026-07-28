// ══════════════════════════════════════════════════════════════════
// PATH IN REPO: sanity/schemaTypes/outdoorCatalogItem.ts
// ══════════════════════════════════════════════════════════════════
// A line item in the Outdoor Catering / Bulk Orders catalog
// (/menu-builder/catalog) — sweet boxes, meal boxes, bulk mithai, etc.
// Mirrors `CatalogItem` in lib/menu-builder/types.ts.
// ═══════════════════════════════════════════════════════════════════════════

import { defineField, defineType } from "sanity";

export const CATALOG_CATEGORIES = [
  { title: "Sweet Box", value: "sweet-box" },
  { title: "Meal Box", value: "meal-box" },
  { title: "Snack Packet", value: "snack-packet" },
  { title: "Bulk Mithai", value: "bulk-mithai" },
  { title: "Live Counter Van", value: "live-counter-van" },
] as const;

export default defineType({
  name: "outdoorCatalogItem",
  title: "Outdoor Catalog Item",
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
      description: "Used as the item's id. Generate once and leave it alone.",
      options: { source: "name", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: { list: [...CATALOG_CATEGORIES] },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "string",
      description: 'One line under the name, e.g. “Assorted mithai, festive packaging”.',
    }),
    defineField({
      name: "price",
      title: "Price (₹)",
      type: "number",
      validation: (r) => r.required().min(0),
    }),
    defineField({
      name: "unit",
      title: "Unit",
      type: "string",
      description: 'e.g. “per box”, “per kg”, “per packet”, “per day”.',
      initialValue: "per box",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "image",
      title: "Photo",
      type: "image",
      options: { hotspot: true },
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
    select: { title: "name", price: "price", unit: "unit", media: "image", isActive: "isActive" },
    prepare({ title, price, unit, media, isActive }) {
      const label = `₹${(price ?? 0).toLocaleString("en-IN")} ${unit ?? ""}`.trim();
      return { title, subtitle: isActive === false ? `${label} · hidden` : label, media };
    },
  },
});
