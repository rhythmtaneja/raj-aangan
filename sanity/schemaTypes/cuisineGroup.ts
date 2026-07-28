// ══════════════════════════════════════════════════════════════════
// PATH IN REPO: sanity/schemaTypes/cuisineGroup.ts
// ══════════════════════════════════════════════════════════════════
// A cuisine card on /menu-builder/cuisine (Drinks, Chaat, Thai, …). Each card
// points at the à-la-carte sections it unlocks: pick Drinks + Soup and the
// next step lists only those sections' dishes.
//
// Code equivalent (used as the fallback): lib/menu-builder/cuisine-groups.ts.
// The dish count on the card is COUNTED from the linked sections — there is
// nothing to keep in sync by hand.
// ═══════════════════════════════════════════════════════════════════════════

import { defineArrayMember, defineField, defineType } from "sanity";

export default defineType({
  name: "cuisineGroup",
  title: "Cuisine Card",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      description: 'Shown on the card, e.g. “Pan Asian”.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "Used as the card's id. Generate once and leave it alone.",
      options: { source: "name", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "image",
      title: "Card Photo",
      type: "image",
      description: "Shown behind the card label (Figma size: 293 × 299 px).",
      options: { hotspot: true },
    }),
    defineField({
      name: "sections",
      title: "À-la-carte Sections",
      type: "array",
      description:
        "The menu sections this card unlocks. A section can belong to more than one card.",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "customMenuSection" }],
        }),
      ],
      validation: (r) => r.required().min(1),
    }),
    defineField({
      name: "isActive",
      title: "Show in the Menu Builder",
      type: "boolean",
      description: "Turn off to hide this card from guests without deleting it.",
      initialValue: true,
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
    select: { title: "name", media: "image", sections: "sections", isActive: "isActive" },
    prepare({ title, media, sections, isActive }) {
      const count = Array.isArray(sections) ? sections.length : 0;
      const label = `${count} ${count === 1 ? "section" : "sections"}`;
      return {
        title,
        subtitle: isActive === false ? `${label} · hidden` : label,
        media,
      };
    },
  },
});
