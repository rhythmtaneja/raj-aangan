import type { StructureResolver } from "sanity/structure";

// Singleton document types — edited as a single entry, not a list.
const SINGLETONS = new Set(["siteImages"]);

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      // ── Site Photos (singleton) ──
      S.listItem()
        .title("Site Photos")
        .id("siteImages")
        .child(S.document().schemaType("siteImages").documentId("siteImages")),

      S.divider(),

      // ── Menu Builder ──
      S.listItem()
        .title("Menu Builder")
        .child(
          S.list()
            .title("Menu Builder")
            .items([
              S.documentTypeListItem("presetMenu").title("Preset Menus"),
              S.documentTypeListItem("dish").title("Dishes"),
              S.documentTypeListItem("cuisine").title("Cuisines"),
              S.documentTypeListItem("category").title("Categories"),
              S.documentTypeListItem("venue").title("Venues"),
              S.documentTypeListItem("occasion").title("Occasions"),
            ]),
        ),

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

      // Anything else registered later, minus the ones already placed above.
      ...S.documentTypeListItems().filter((item) => {
        const id = item.getId();
        return (
          id &&
          !SINGLETONS.has(id) &&
          ![
            "presetMenu",
            "dish",
            "cuisine",
            "category",
            "venue",
            "occasion",
            "blogPost",
            "author",
          ].includes(id)
        );
      }),
    ]);
