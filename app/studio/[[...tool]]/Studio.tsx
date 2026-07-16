"use client";

// Client-only boundary for the embedded Studio. Keeping the sanity.config
// import here (not in the server page) ensures the Sanity library never
// enters the React Server Component graph — where its `swr` dependency has
// no default export and the build would fail.
import { NextStudio } from "next-sanity/studio";
import config from "@/sanity.config";

export default function Studio() {
  return <NextStudio config={config} />;
}
