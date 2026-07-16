import type { SchemaTypeDefinition } from "sanity";

// Menu Builder (Workstream 1)
import dish from "./dish";
import category from "./category";
import cuisine from "./cuisine";
import presetMenu from "./presetMenu";
import venue from "./venue";
import occasion from "./occasion";

// Site photos (Workstream 2)
import siteImages from "./siteImages";

// Blog (Workstream 3)
import blogPost from "./blogPost";
import author from "./author";

export const schemaTypes: SchemaTypeDefinition[] = [
  // menu builder
  dish,
  category,
  cuisine,
  presetMenu,
  venue,
  occasion,
  // site photos
  siteImages,
  // blog
  blogPost,
  author,
];
