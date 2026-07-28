// ══════════════════════════════════════════════════════════════════
// PATH IN REPO: sanity/schemaTypes/pricingSettings.ts
// ══════════════════════════════════════════════════════════════════
// SINGLETON — "Pricing & Quote Settings". Every number and piece of wording
// the quote depends on that isn't attached to one menu: GST, the add-on
// surcharge, discount codes, and the quote page's terms / notes.
//
// Code equivalent (fallback when Sanity is empty or unset): the constants in
// lib/menu-builder/pricing.ts + the quote page's copy.
// ═══════════════════════════════════════════════════════════════════════════

import { defineArrayMember, defineField, defineType } from "sanity";

export default defineType({
  name: "pricingSettings",
  title: "Pricing & Quote Settings",
  type: "document",
  groups: [
    { name: "charges", title: "Taxes & Charges", default: true },
    { name: "discounts", title: "Discounts" },
    { name: "quote", title: "Quote Page" },
  ],
  fields: [
    // ── Taxes & charges ────────────────────────────────────────────────────
    defineField({
      name: "gstPercent",
      title: "GST (%)",
      type: "number",
      group: "charges",
      description: "Applied to every estimate. Currently 5%.",
      initialValue: 5,
      validation: (r) => r.required().min(0).max(100),
    }),
    defineField({
      name: "addOnPricePerItem",
      title: "Add-on Price Per Extra Dish (₹ per head)",
      type: "number",
      group: "charges",
      description:
        "Default surcharge when a guest picks more dishes than a set-menu course allows. A single menu can override this on its Pricing tab.",
      initialValue: 100,
      validation: (r) => r.required().min(0),
    }),
    defineField({
      name: "minimumGuests",
      title: "Minimum Guests",
      type: "number",
      group: "charges",
      description: "Shown as guidance on the Client step. 0 = no minimum.",
      initialValue: 0,
      validation: (r) => r.min(0),
    }),

    // ── Discounts ──────────────────────────────────────────────────────────
    defineField({
      name: "showDiscountField",
      title: "Show the Discount Code Box",
      type: "boolean",
      group: "discounts",
      description: "Turn off to hide discount codes from the quote page entirely.",
      initialValue: true,
    }),
    defineField({
      name: "discountCodes",
      title: "Discount Codes",
      type: "array",
      group: "discounts",
      description:
        "Codes a guest can type on the quote page. Leave empty and any code entered is rejected.",
      of: [
        defineArrayMember({
          type: "object",
          name: "discountCode",
          fields: [
            defineField({
              name: "code",
              title: "Code",
              type: "string",
              description: 'e.g. “RAEC30”. Case-insensitive for guests.',
              validation: (r) => r.required(),
            }),
            defineField({
              name: "percentOff",
              title: "Percent Off (%)",
              type: "number",
              description: "Applied to the pre-GST subtotal.",
              validation: (r) => r.required().min(0).max(100),
            }),
            defineField({
              name: "minGuests",
              title: "Minimum Guests",
              type: "number",
              description: "0 = applies to any booking size.",
              initialValue: 0,
              validation: (r) => r.min(0),
            }),
            defineField({
              name: "expiresOn",
              title: "Expires On",
              type: "date",
              description: "Optional. The code stops working after this date.",
            }),
            defineField({
              name: "isActive",
              title: "Active",
              type: "boolean",
              initialValue: true,
            }),
          ],
          preview: {
            select: {
              title: "code",
              percentOff: "percentOff",
              isActive: "isActive",
              expiresOn: "expiresOn",
            },
            prepare({ title, percentOff, isActive, expiresOn }) {
              const bits = [`${percentOff ?? 0}% off`];
              if (expiresOn) bits.push(`until ${expiresOn}`);
              if (isActive === false) bits.push("inactive");
              return { title, subtitle: bits.join(" · ") };
            },
          },
        }),
      ],
    }),
    defineField({
      name: "invalidCodeMessage",
      title: "Message for an Invalid Code",
      type: "string",
      group: "discounts",
      initialValue: "That code isn't valid.",
    }),

    // ── Quote page ─────────────────────────────────────────────────────────
    defineField({
      name: "quoteHeading",
      title: "Quote Heading",
      type: "string",
      group: "quote",
      initialValue: "Review & Quote",
    }),
    defineField({
      name: "quoteSubheading",
      title: "Quote Sub-heading",
      type: "string",
      group: "quote",
      initialValue:
        "Everything you have chosen review before generating the final quote.",
    }),
    defineField({
      name: "quoteValidityDays",
      title: "Quote Valid For (days)",
      type: "number",
      group: "quote",
      description: "0 hides the validity line.",
      initialValue: 0,
      validation: (r) => r.min(0),
    }),
    defineField({
      name: "depositPercent",
      title: "Booking Deposit (%)",
      type: "number",
      group: "quote",
      description: "0 hides the deposit line.",
      initialValue: 0,
      validation: (r) => r.min(0).max(100),
    }),
    defineField({
      name: "quoteTerms",
      title: "Terms & Notes",
      type: "array",
      group: "quote",
      description:
        "Bullet points printed under the estimate — inclusions, exclusions, payment terms, anything the guest should know.",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "contactPhone",
      title: "Contact Phone",
      type: "string",
      group: "quote",
      description: "Shown on the quote so guests know who to call.",
    }),
    defineField({
      name: "contactEmail",
      title: "Contact Email",
      type: "string",
      group: "quote",
    }),
  ],
  preview: {
    select: { gst: "gstPercent" },
    prepare({ gst }) {
      return {
        title: "Pricing & Quote Settings",
        subtitle: typeof gst === "number" ? `GST ${gst}%` : "Not configured",
      };
    },
  },
});
