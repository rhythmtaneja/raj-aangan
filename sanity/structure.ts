import type { StructureResolver } from "sanity/structure";
import { PRESENTATION_KINDS } from "./schemaTypes/presentationOption";

export const SINGLETONS = new Set(["siteImages", "pricingSettings"]);

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

  "dish",
  "category",
  "cuisine",
  "presetMenu",
];

const bySortOrder = [{ field: "sortOrder", direction: "asc" as const }];

export const structure: StructureResolver = (S) => {
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

  const orderedList = (type: string, title: string) =>
    S.documentTypeListItem(type)
      .title(title)
      .child(
        S.documentTypeList(type).title(title).defaultOrdering(bySortOrder),
      );

  return S.list()
    .title("Content")
    .items([
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
                      S.documentTypeListItem("presentationOption").title(
                        "All Options",
                      ),
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

      S.listItem()
        .title("Site Photos")
        .id("siteImages")
        .child(S.document().schemaType("siteImages").documentId("siteImages")),

      S.divider(),

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

      ...S.documentTypeListItems().filter((item) => {
        const id = item.getId();
        return id ? !PLACED.includes(id) : false;
      }),
    ]);
};
