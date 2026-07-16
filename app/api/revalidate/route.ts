// ══════════════════════════════════════════════════════════════════
// PATH IN REPO: app/api/revalidate/route.ts
// ══════════════════════════════════════════════════════════════════
// Sanity → Next webhook. On publish, Sanity POSTs here; we revalidate the
// cache tag for the changed document type so the site reflects edits within
// ~30s. Configure the webhook in SANITY_SETUP.md with a GROQ projection of
// `{ "_type": _type, "slug": slug.current }` and the shared secret.
// ══════════════════════════════════════════════════════════════════

import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

type WebhookPayload = { _type?: string; slug?: string };

export async function POST(req: NextRequest) {
  try {
    const { isValidSignature, body } = await parseBody<WebhookPayload>(
      req,
      process.env.SANITY_REVALIDATE_SECRET,
    );

    if (!isValidSignature) {
      return NextResponse.json(
        { revalidated: false, message: "Invalid signature" },
        { status: 401 },
      );
    }

    if (!body?._type) {
      return NextResponse.json(
        { revalidated: false, message: "Missing _type in payload" },
        { status: 400 },
      );
    }

    // Revalidate the tag for this document type (e.g. "dish", "blogPost").
    // Second arg is the Next 16 cacheLife profile for the stale window.
    revalidateTag(body._type, "max");

    return NextResponse.json({
      revalidated: true,
      type: body._type,
      now: Date.now(),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ revalidated: false, message }, { status: 500 });
  }
}
