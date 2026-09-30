import { NextResponse } from "next/server";
import { SITE_EMAIL } from "@/lib/site-info";

export const runtime = "nodejs";

const RESEND_ENDPOINT = "https://api.resend.com/emails";

const FROM_EMAIL = process.env.FROM_EMAIL || "onboarding@resend.dev";

type Payload = {
  name: string;
  company: string;
  designation: string;
  email: string;
  phone: string;
  interest: string;
  range: string;
  message: string;

  website?: string;
};

const MAX = {
  name: 120,
  company: 160,
  designation: 120,
  email: 254,
  phone: 40,
  interest: 60,
  range: 60,
  message: 4000,
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(
  body: unknown,
): { ok: true; data: Payload } | { ok: false; error: string } {
  if (typeof body !== "object" || body === null)
    return { ok: false, error: "Malformed request." };
  const b = body as Record<string, unknown>;

  const str = (k: keyof typeof MAX) => {
    const v = b[k];
    return typeof v === "string" ? v.trim().slice(0, MAX[k]) : "";
  };

  const data: Payload = {
    name: str("name"),
    company: str("company"),
    designation: str("designation"),
    email: str("email"),
    phone: str("phone"),
    interest: str("interest"),
    range: str("range"),
    message: str("message"),
    website: typeof b.website === "string" ? b.website : "",
  };

  if (!data.name) return { ok: false, error: "Please tell us your name." };
  if (!EMAIL_RE.test(data.email))
    return { ok: false, error: "Please enter a valid email address." };

  return { ok: true, data };
}

const HITS = new Map<string, { n: number; resetAt: number }>();
const WINDOW_MS = 10 * 60_000;
const MAX_PER_WINDOW = 5;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const rec = HITS.get(ip);

  if (!rec || now > rec.resetAt) {
    HITS.set(ip, { n: 1, resetAt: now + WINDOW_MS });

    if (HITS.size > 500) {
      for (const [k, v] of HITS) if (now > v.resetAt) HITS.delete(k);
    }
    return false;
  }

  rec.n += 1;
  return rec.n > MAX_PER_WINDOW;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Malformed request." },
      { status: 400 },
    );
  }

  const result = validate(body);
  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: result.error },
      { status: 400 },
    );
  }
  const data = result.data;

  if (data.website) {
    return NextResponse.json({ ok: true });
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (rateLimited(ip)) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Too many enquiries from this connection. Please try again shortly.",
      },
      { status: 429 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFY_EMAIL || SITE_EMAIL;

  if (!apiKey) {
    console.warn(
      "[investor-enquiry] RESEND_API_KEY is not set — enquiry NOT delivered.",
      { from: data.email, name: data.name },
    );
    return NextResponse.json(
      {
        ok: false,
        reason: "unconfigured",
        error: "Email delivery is not configured yet.",
      },
      { status: 503 },
    );
  }

  const rows: [string, string][] = [
    ["Name", data.name],
    ["Company / Fund", data.company],
    ["Designation", data.designation],
    ["Email", data.email],
    ["Phone", data.phone],
    ["Investment interest", data.interest],
    ["Investment range", data.range],
  ];

  const text = [
    "New investor enquiry — rajaangan.com/investors",
    "",
    ...rows.map(([k, v]) => `${k}: ${v || "—"}`),
    "",
    "Message:",
    data.message || "—",
  ].join("\n");

  const html = `
    <h2 style="font-family:Georgia,serif">New investor enquiry</h2>
    <table style="font-family:system-ui,sans-serif;font-size:14px;border-collapse:collapse">
      ${rows
        .map(
          ([k, v]) =>
            `<tr><td style="padding:4px 16px 4px 0;color:#666">${k}</td><td style="padding:4px 0"><strong>${escapeHtml(
              v || "—",
            )}</strong></td></tr>`,
        )
        .join("")}
    </table>
    <p style="font-family:system-ui,sans-serif;font-size:14px;white-space:pre-wrap">${escapeHtml(
      data.message || "—",
    )}</p>`;

  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `Raj Aangan Investors <${FROM_EMAIL}>`,
        to: [to],

        reply_to: data.email,
        subject: `Investor enquiry — ${data.name}${data.company ? ` (${data.company})` : ""}`,
        text,
        html,
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error(
        "[investor-enquiry] Resend rejected the send:",
        res.status,
        detail,
      );
      return NextResponse.json(
        {
          ok: false,
          error:
            "We could not send that just now. Please use WhatsApp or email below.",
        },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[investor-enquiry] Network error calling Resend:", err);
    return NextResponse.json(
      {
        ok: false,
        error:
          "We could not send that just now. Please use WhatsApp or email below.",
      },
      { status: 502 },
    );
  }
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
