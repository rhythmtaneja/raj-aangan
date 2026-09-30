import { createClient } from "next-sanity";
import { apiVersion, dataset, studioProjectId } from "./env";

export const client = createClient({
  projectId: studioProjectId,
  dataset,
  apiVersion,

  useCdn: true,

  token: process.env.SANITY_API_READ_TOKEN,
  perspective: "published",
});
