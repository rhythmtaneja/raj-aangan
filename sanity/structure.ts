// ══════════════════════════════════════════════════════════════════
// PATH IN REPO: sanity/structure.ts
// ══════════════════════════════════════════════════════════════════
// The Studio's left-hand desk. Organised around what the client actually
// edits: the Menu Builder first (set menus, à-la-carte menu, cuisine cards,
// presentation options, outdoor catalog and the pricing / quote settings),
// then Site Photos and the Blog.
//
// The pre-rework Menu Builder types (dish / category / cuisine / presetMenu)
// are deliberately NOT listed — nothing reads them any more, and showing them
// would leave the client editing content that never appears on the site.
// ═══════════════════════════════════════════════════════════════════════════

import type { StructureResolver } from "sanity/structure";
import { PRESENTATION_KINDS } from "./schemaTypes/presentationOption";

/** Document types edited as a single entry, not a list. */
export const SINGLETONS = new Set(["siteImages", "pricingSettings"]);

/** Types placed by hand below — anything else falls through to the bottom. */
const PLACED = [
  "setMenu",
  "customMenuSection",
  "cuisineGroup",
  "presentationOption",
  "outdoorCatalogItem",
  "packagingStyle",
  "pricingSettings",
  "venue",
  "occasion",
  "siteImages",
  "blogPost",
  "author",
  // legacy, intentionally hidden
  "dish",
  "category",
  "cuisine",
  "presetMenu",
];

const bySortOrder = [{ field: "sortOrder", direction: "asc" as const }];

export const structure: StructureResolver = (S) => {
  /** A list of one `kind` of presentation option, with a matching + button. */
  const presentationList = (title: string, kind: string) =>
    S.listItem()
      .title(title)
      .id(`presentation-${kind}`)
      .child(
        S.documentList()
          .title(title)
          .filter('_type == "presentationOption" && kind == $kind')
          .params({ kind })
          .defaultOrdering(bySortOrder)
          .initialValueTemplates([
            S.initialValueTemplateItem(`presentationOption-${kind}`),
          ]),
      );

  /** A plain document list ordered by sortOrder. */
  const orderedList = (type: string, title: string) =>
    S.documentTypeListItem(type)
      .title(title)
      .child(S.documentTypeList(type).title(title).defaultOrdering(bySortOrder));

  return S.list()
    .title("Content")
    .items([
      // ── Menu Builder ──────────────────────────────────────────────────
      S.listItem()
        .title("Menu Builder")
        .child(
          S.list()
            .title("Menu Builder")
            .items([
              orderedList("setMenu", "Set Menus"),
              orderedList("customMenuSection", "À-la-carte Menu"),
              orderedList("cuisineGroup", "Cuisine Cards"),

              S.divider(),

              S.listItem()
                .title("Presentation Options")
                .child(
                  S.list()
                    .title("Presentation Options")
                    .items([
                      ...PRESENTATION_KINDS.map((k) =>
                        presentationList(`${k.title}`, k.value),
                      ),
                      S.divider(),
                      S.documentTypeListItem("presentationOption").title("All Options"),
                    ]),
                ),

              S.listItem()
                .title("Outdoor Catering")
                .child(
                  S.list()
                    .title("Outdoor Catering")
                    .items([
                      orderedList("outdoorCatalogItem", "Catalog Items"),
                      orderedList("packagingStyle", "Packaging Styles"),
                    ]),
                ),

              S.divider(),

              orderedList("venue", "Venues"),
              orderedList("occasion", "Occasions"),

              S.divider(),

              // Singleton — pricing, discounts and quote wording.
              S.listItem()
                .title("Pricing & Quote Settings")
                .id("pricingSettings")
                .child(
                  S.document()
                    .schemaType("pricingSettings")
                    .documentId("pricingSettings")
                    .title("Pricing & Quote Settings"),
                ),
            ]),
        ),

      S.divider(),

      // ── Site Photos (singleton) ──
      S.listItem()
        .title("Site Photos")
        .id("siteImages")
        .child(S.document().schemaType("siteImages").documentId("siteImages")),

      S.divider(),

      // ── Blog ──
      S.listItem()
        .title("Blog")
        .child(
          S.list()
            .title("Blog")
            .items([
              S.documentTypeListItem("blogPost").title("Posts"),
              S.documentTypeListItem("author").title("Authors"),
            ]),
        ),

      S.divider(),

      // Anything registered later that isn't placed above.
      ...S.documentTypeListItems().filter((item) => {
        const id = item.getId();
        return id ? !PLACED.includes(id) : false;
      }),
    ]);
};
