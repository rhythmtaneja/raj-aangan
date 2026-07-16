import type { Viewport } from "next";
import { isSanityConfigured } from "@/sanity/env";
import Studio from "./Studio";

export const dynamic = "force-static";

// Studio renders best without mobile zoom, matching next-sanity's own viewport.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function StudioPage() {
  if (!isSanityConfigured) return <StudioNotConfigured />;
  return <Studio />;
}

function StudioNotConfigured() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        background: "#0f2f3b",
        color: "#fdfbf5",
        fontFamily: "system-ui, sans-serif",
        textAlign: "center",
      }}
    >
      <div style={{ maxWidth: 560 }}>
        <h1 style={{ fontSize: "1.6rem", marginBottom: "1rem", color: "#d4a574" }}>
          Sanity Studio isn&apos;t connected yet
        </h1>
        <p style={{ lineHeight: 1.6, opacity: 0.9 }}>
          Set <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code> (and{" "}
          <code>NEXT_PUBLIC_SANITY_DATASET</code>) in your environment, then
          rebuild. Until then the public site runs on its built-in fallback
          content. See <code>.env.local.example</code> and{" "}
          <code>SANITY_SETUP.md</code> for the three-command setup.
        </p>
      </div>
    </main>
  );
}
