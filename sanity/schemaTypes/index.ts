import type { SchemaTypeDefinition } from "sanity";

// Menu Builder — the reworked wizard (Phase 8). These are the types the live
// Menu Builder actually reads; see lib/menu-builder/queries.ts.
import setMenu from "./setMenu";
import customMenuSection from "./customMenuSection";
import cuisineGroup from "./cuisineGroup";
import presentationOption from "./presentationOption";
import outdoorCatalogItem from "./outdoorCatalogItem";
import packagingStyle from "./packagingStyle";
import pricingSettings from "./pricingSettings";
import venue from "./venue";
import occasion from "./occasion";

// Menu Builder — legacy (Workstream 1, pre-rework). Kept so existing content
// isn't orphaned; hidden from the desk in structure.ts because the wizard no
// longer reads them.
import dish from "./dish";
import category from "./category";
import cuisine from "./cuisine";
import presetMenu from "./presetMenu";

// Site photos (Workstream 2)
import siteImages from "./siteImages";

// Blog (Workstream 3)
import blogPost from "./blogPost";
import author from "./author";

export const schemaTypes: SchemaTypeDefinition[] = [
  // menu builder (current)
  setMenu,
  customMenuSection,
  cuisineGroup,
  presentationOption,
  outdoorCatalogItem,
  packagingStyle,
  pricingSettings,
  venue,
  occasion,
  // menu builder (legacy — not read by the wizard)
  dish,
  category,
  cuisine,
  presetMenu,
  // site photos
  siteImages,
  // blog
  blogPost,
  author,
];
