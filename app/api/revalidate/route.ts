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
