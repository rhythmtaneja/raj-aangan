// ══════════════════════════════════════════════════════════════════
// PATH IN REPO: app/api/investor-enquiry/route.ts
// ══════════════════════════════════════════════════════════════════
/**
 * POST /api/investor-enquiry — receives the form in the Investors page.
 *
 * ─ WHY THIS EXISTS RATHER THAN A `mailto:` ─────────────────────────────────
 * The form used to open a prefilled mail draft. That works, but it depends on
 * the sender having a configured mail client, and on a phone it often does
 * nothing at all. An investor enquiry is the highest-value message this site
 * can receive, so it gets a real server endpoint.
 *
 * ─ TRANSPORT: RESEND OVER REST, NO NEW DEPENDENCY ──────────────────────────
 * `.env.local` already reserves RESEND_API_KEY and NOTIFY_EMAIL ("Workstream 4
 * — fallback email"), so Resend is the service this project had already chosen.
 * The `resend` npm package is NOT installed and is not needed: the API is one
 * POST, and calling it with `fetch` keeps the dependency count where it is.
 *
 * ─ ⚠️ CURRENTLY UNCONFIGURED, AND IT SAYS SO ───────────────────────────────
 * RESEND_API_KEY and NOTIFY_EMAIL are both empty in `.env.local`. Rather than
 * pretend, this route returns 503 with `reason: "unconfigured"`, and the form
 * catches that and shows the enquirer WhatsApp / phone / email instead. So the
 * page is never a dead end, and the moment those two values are filled in the
 * endpoint starts delivering with no code change.
 *
 * TO GO LIVE:
 *   1. RESEND_API_KEY  — from resend.com/api-keys
 *   2. NOTIFY_EMAIL    — where enquiries should land
 *   3. FROM_EMAIL      — a domain verified in Resend. NOT a gmail.com address:
 *                        Resend will reject an unverified sender, and the
 *                        route surfaces that error rather than swallowing it.
 */

import { NextResponse } from "next/server";
import { SITE_EMAIL } from "@/lib/site-info";

/* Node runtime, not edge: the in-memory rate limiter below wants a process
   that lives longer than a single request. */
export const runtime = "nodejs";

const RESEND_ENDPOINT = "https://api.resend.com/emails";

/* Must be a domain verified in Resend. `onboarding@resend.dev` is Resend's own
   sandbox sender — it works immediately but ONLY delivers to the account
   owner's address, so it is fine for a smoke test and not for production. */
const FROM_EMAIL = process.env.FROM_EMAIL || "onboarding@resend.dev";

// ─── Validation ────────────────────────────────────────────────────────────

type Payload = {
  name: string;
  company: string;
  designation: string;
  email: string;
  phone: string;
  interest: string;
  range: string;
  message: string;
  /** Honeypot. Real users never see it, so anything in it is a bot. */
  website?: string;
};

const MAX = { name: 120, company: 160, designation: 120, email: 254, phone: 40, interest: 60, range: 60, message: 4000 };

/** Deliberately loose — the RFC-correct regex rejects valid addresses. */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(body: unknown): { ok: true; data: Payload } | { ok: false; error: string } {
  if (typeof body !== "object" || body === null) return { ok: false, error: "Malformed request." };
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
  if (!EMAIL_RE.test(data.email)) return { ok: false, error: "Please enter a valid email address." };

  return { ok: true, data };
}

// ─── Rate limiting ─────────────────────────────────────────────────────────
/**
 * Best-effort, in-memory, per-IP. It resets on every deploy and is per-instance
 * rather than global, so it is a speed bump for casual abuse, NOT a security
 * control. If this page ever attracts real spam, move to Upstash or put the
 * limit at the CDN — do not try to make this Map authoritative.
 */
const HITS = new Map<string, { n: number; resetAt: number }>();
const WINDOW_MS = 10 * 60_000;
const MAX_PER_WINDOW = 5;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const rec = HITS.get(ip);

  if (!rec || now > rec.resetAt) {
    HITS.set(ip, { n: 1, resetAt: now + WINDOW_MS });
    /* Opportunistic sweep so the Map cannot grow without bound on a
       long-running instance. */
    if (HITS.size > 500) {
      for (const [k, v] of HITS) if (now > v.resetAt) HITS.delete(k);
    }
    return false;
  }

  rec.n += 1;
  return rec.n > MAX_PER_WINDOW;
}

// ─── Handler ───────────────────────────────────────────────────────────────

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Malformed request." }, { status: 400 });
  }

  const result = validate(body);
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 400 });
  }
  const data = result.data;

  /* Honeypot: accept and discard. Returning 200 means a bot has no signal that
     it was caught, so it does not come back and try to work around it. */
  if (data.website) {
    return NextResponse.json({ ok: true });
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "Too many enquiries from this connection. Please try again shortly." },
      { status: 429 }
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFY_EMAIL || SITE_EMAIL;

  if (!apiKey) {
    /* See the header note: honest 503, and the form shows WhatsApp / phone /
       email so the enquirer still has a way through. */
    console.warn(
      "[investor-enquiry] RESEND_API_KEY is not set — enquiry NOT delivered.",
      { from: data.email, name: data.name }
    );
    return NextResponse.json(
      { ok: false, reason: "unconfigured", error: "Email delivery is not configured yet." },
      { status: 503 }
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
              v || "—"
            )}</strong></td></tr>`
        )
        .join("")}
    </table>
    <p style="font-family:system-ui,sans-serif;font-size:14px;white-space:pre-wrap">${escapeHtml(
      data.message || "—"
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
        /* So the recipient can hit Reply and reach the investor directly
           rather than replying to the sending domain. */
        reply_to: data.email,
        subject: `Investor enquiry — ${data.name}${data.company ? ` (${data.company})` : ""}`,
        text,
        html,
      }),
    });

    if (!res.ok) {
      /* Surfaced, not swallowed: an unverified FROM domain is the usual cause
         and it is invisible unless the message is logged. */
      const detail = await res.text();
      console.error("[investor-enquiry] Resend rejected the send:", res.status, detail);
      return NextResponse.json(
        { ok: false, error: "We could not send that just now. Please use WhatsApp or email below." },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[investor-enquiry] Network error calling Resend:", err);
    return NextResponse.json(
      { ok: false, error: "We could not send that just now. Please use WhatsApp or email below." },
      { status: 502 }
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
