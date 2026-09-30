import type { SchemaTypeDefinition } from "sanity";

import setMenu from "./setMenu";
import customMenuSection from "./customMenuSection";
import cuisineGroup from "./cuisineGroup";
import presentationOption from "./presentationOption";
import outdoorCatalogItem from "./outdoorCatalogItem";
import packagingStyle from "./packagingStyle";
import pricingSettings from "./pricingSettings";
import venue from "./venue";
import occasion from "./occasion";

import dish from "./dish";
import category from "./category";
import cuisine from "./cuisine";
import presetMenu from "./presetMenu";

import siteImages from "./siteImages";

import blogPost from "./blogPost";
import author from "./author";

export const schemaTypes: SchemaTypeDefinition[] = [
  setMenu,
  customMenuSection,
  cuisineGroup,
  presentationOption,
  outdoorCatalogItem,
  packagingStyle,
  pricingSettings,
  venue,
  occasion,

  dish,
  category,
  cuisine,
  presetMenu,

  siteImages,

  blogPost,
  author,
];
