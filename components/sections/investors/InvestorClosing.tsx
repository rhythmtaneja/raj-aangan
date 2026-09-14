// ══════════════════════════════════════════════════════════════════
// PATH IN REPO: components/sections/investors/InvestorClosing.tsx
// ══════════════════════════════════════════════════════════════════
/**
 * XI — PARTNER WITH RAJ AANGAN + INVESTOR ENQUIRIES.
 *
 * The strategy doc's §13 (Investment Opportunity) and §15 (Investor Contact)
 * merged into one closing section, because split across two they were an
 * argument followed immediately by the form for that argument, with a section
 * break in between doing nothing.
 *
 * Built on ContactForm.tsx's shape — a white card on the navy band — so the
 * investors page closes the same way the contact page does.
 *
 * ⚠️ MAKES NO CLAIM ABOUT A LIVE ROUND. The doc says to state whether RAEC is
 * "actively fundraising" and on what basis (§3). RAEC has not said. So this
 * describes the KINDS of partnership open for discussion and stops there — no
 * raise size, no valuation, no "currently raising". Adding any of those
 * without written confirmation would be a securities-adjacent claim invented
 * by a website.
 *
 * ─ THE FORM POSTS TO A REAL ENDPOINT ───────────────────────────────────────
 * POST /api/investor-enquiry. That route validates, rate-limits and sends via
 * Resend. It is currently UNCONFIGURED (no RESEND_API_KEY), and returns 503
 * `reason: "unconfigured"` when so — which this component catches and answers
 * by showing WhatsApp, phone and email instead. So the enquirer is never left
 * at a dead end, and nothing here has to change when the key is added.
 */

"use client";

import { useState } from "react";
import Reveal from "@/components/anim/Reveal";
import SectionHeading, { type SectionProps } from "./SectionHeading";
import { ENQUIRY, OPPORTUNITY } from "@/lib/investor-content";
import { SITE_EMAIL, SITE_PHONE, SITE_PHONE_HREF, SITE_SOCIALS } from "@/lib/site-info";
import {
  BODY_SM,
  CREAM,
  GOLD,
  H3,
  NAVY,
  SECTION_PAD,
  TEXT_BODY,
  TEXT_LABEL,
  TEXT_MUTED,
  serif,
} from "./theme";

/* Built from the canonical phone in lib/site-info, so it cannot drift. */
const WHATSAPP_HREF =
  SITE_SOCIALS.find((s) => s.label === "WhatsApp")?.href ??
  `https://wa.me/${SITE_PHONE.replace(/\D/g, "")}`;

/* See lib/investor-content: investors@raec.in is used only once RAEC actually
   creates and monitors it. Until then a monitored inbox beats a prestigious
   one that bounces. */
const TO_EMAIL = ENQUIRY.useDedicatedEmail ? ENQUIRY.dedicatedEmail : SITE_EMAIL;

const EMPTY = {
  name: "",
  company: "",
  designation: "",
  email: "",
  phone: "",
  interest: "",
  range: "",
  message: "",
  /* Honeypot — hidden from people, irresistible to bots. Named `website`
     because that is what autofill-driven spam scripts look for. */
  website: "",
};

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "sent" }
  /** Delivery is not configured or failed — show the direct channels. */
  | { kind: "fallback"; message: string }
  /** The enquirer can fix this one (bad email, missing name). */
  | { kind: "error"; message: string };

export default function InvestorClosing({ numeral }: SectionProps) {
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  function set<K extends keyof typeof EMPTY>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus({ kind: "sending" });

    try {
      const res = await fetch("/api/investor-enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok && data.ok) {
        setStatus({ kind: "sent" });
        setForm(EMPTY);
        return;
      }

      /* 400 = the enquirer can correct it; keep them in the form.
         Everything else = our problem, so hand over the direct channels. */
      if (res.status === 400 && data.error) {
        setStatus({ kind: "error", message: data.error });
        return;
      }

      setStatus({
        kind: "fallback",
        message:
          data.error ||
          "We could not send that just now. Please reach us directly — these all go to the same team.",
      });
    } catch {
      setStatus({
        kind: "fallback",
        message:
          "Your connection dropped before we could send that. Please reach us directly — these all go to the same team.",
      });
    }
  }

  return (
    <section
      id="enquiry"
      className={`flex w-full flex-col items-center text-center ${SECTION_PAD}`}
      style={{ backgroundColor: NAVY }}
    >
      <SectionHeading
        light
        numeral={numeral}
        label="Investors"
        eyebrow="Investment Opportunity"
        title={OPPORTUNITY.title}
        intro={OPPORTUNITY.body}
      />

      {/* ─ The four partnership routes ─────────────────────────────────── */}
      <Reveal
        stagger
        staggerEach={0.09}
        className="mt-14 grid w-full max-w-300 grid-cols-2 gap-x-6 gap-y-10 md:mt-20 md:grid-cols-4 md:gap-x-10"
      >
        {OPPORTUNITY.routes.map((r) => (
          <div key={r.title} className="flex flex-col items-center px-1 text-center">
            <h3
              style={{ ...serif, color: "#ffffff" }}
              className="font-semibold text-[1.0625rem] md:text-[clamp(1.2rem,1.6vw,1.4375rem)]"
            >
              {r.title}
            </h3>
            <span aria-hidden className="mt-3 block h-px w-8" style={{ backgroundColor: GOLD }} />
            <p
              style={{ ...serif, color: "rgba(255,255,255,0.7)" }}
              className="mt-3 text-[0.9375rem] leading-relaxed md:text-[1rem]"
            >
              {r.body}
            </p>
          </div>
        ))}
      </Reveal>

      {/* ─ The enquiry card ────────────────────────────────────────────── */}
      <Reveal>
        <div
          className="mt-16 w-full max-w-[52rem] px-6 py-12 text-left md:mt-24 md:px-14 md:py-16"
          style={{ backgroundColor: CREAM }}
        >
          <div className="text-center">
            <h3 style={{ ...serif, color: TEXT_MUTED }} className={H3}>
              {ENQUIRY.title}
            </h3>
            <span aria-hidden className="mx-auto mt-3 block h-px w-16" style={{ backgroundColor: GOLD }} />
            <p style={{ ...serif, color: TEXT_BODY }} className={`mx-auto mt-5 max-w-[32rem] ${BODY_SM}`}>
              {ENQUIRY.body}
            </p>
          </div>

          {status.kind === "sent" ? (
            <div className="mt-10 text-center">
              <p style={{ ...serif, color: TEXT_MUTED }} className="text-[1.25rem] md:text-[1.5rem]">
                Thank you — your enquiry is with the leadership team.
              </p>
              <p style={{ ...serif, color: TEXT_BODY }} className={`mx-auto mt-3 max-w-[30rem] ${BODY_SM}`}>
                We reply to investor enquiries directly. If it is urgent, WhatsApp reaches us fastest.
              </p>
              <DirectChannels />
            </div>
          ) : status.kind === "fallback" ? (
            <div className="mt-10 text-center">
              <p style={{ ...serif, color: TEXT_BODY }} className={`mx-auto max-w-[32rem] ${BODY_SM}`}>
                {status.message}
              </p>
              <DirectChannels />
              <button
                type="button"
                onClick={() => setStatus({ kind: "idle" })}
                style={{ ...serif, color: TEXT_LABEL }}
                className="mt-8 text-[0.8125rem] uppercase tracking-[0.2em] transition-opacity hover:opacity-70"
              >
                ← Back to the form
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-6">
              {/* Honeypot. `aria-hidden` + tabIndex -1 keeps it away from
                  screen readers and keyboards; off-screen rather than
                  `display:none`, which some bots detect. */}
              <div aria-hidden className="absolute left-[-9999px] h-px w-px overflow-hidden">
                <label>
                  Website
                  <input
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={form.website}
                    onChange={(e) => set("website", e.target.value)}
                  />
                </label>
              </div>

              {/* 2-up from md only. At 390px a half-width input is a worse
                  target than a full-width one. */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Field label="Name" required value={form.name} onChange={(v) => set("name", v)} autoComplete="name" />
                <Field label="Company / Fund" value={form.company} onChange={(v) => set("company", v)} autoComplete="organization" />
                <Field label="Designation" value={form.designation} onChange={(v) => set("designation", v)} autoComplete="organization-title" />
                <Field label="Email" type="email" required value={form.email} onChange={(v) => set("email", v)} autoComplete="email" />
                <Field label="Phone" type="tel" value={form.phone} onChange={(v) => set("phone", v)} autoComplete="tel" />
                <Select label="Investment interest" options={ENQUIRY.interests} value={form.interest} onChange={(v) => set("interest", v)} />
              </div>

              <Select label="Investment range" options={ENQUIRY.ranges} value={form.range} onChange={(v) => set("range", v)} />

              <label className="flex flex-col gap-2">
                <span className={LABEL_CLS} style={{ ...serif, color: TEXT_LABEL }}>
                  Message
                </span>
                <textarea
                  rows={4}
                  value={form.message}
                  onChange={(e) => set("message", e.target.value)}
                  style={{ ...serif, color: TEXT_MUTED, borderColor: "rgba(25,25,25,0.2)" }}
                  className="w-full resize-none border-b bg-transparent pb-2 text-[1.0625rem] outline-none transition-colors focus:border-b-[#191919]"
                />
              </label>

              {status.kind === "error" && (
                <p style={{ ...serif, color: "#8a3a3a" }} className="text-[0.9375rem]" role="alert">
                  {status.message}
                </p>
              )}

              <button
                type="submit"
                disabled={status.kind === "sending"}
                style={{ ...serif, backgroundColor: status.kind === "sending" ? "#4a4a4a" : "#191919" }}
                className="mt-2 w-full rounded-full px-10 py-4 text-[0.9375rem] uppercase tracking-[0.14em] text-white transition-opacity duration-300 hover:opacity-90 disabled:cursor-wait md:w-auto md:self-center md:px-14"
              >
                {status.kind === "sending" ? "Sending…" : "Send enquiry"}
              </button>

              <p
                style={{ ...serif, color: TEXT_LABEL }}
                className="text-center text-[0.8125rem] opacity-70"
              >
                Enquiries are treated as confidential. Data-room access requires a signed NDA.
              </p>
            </form>
          )}
        </div>
      </Reveal>
    </section>
  );
}

/* ─── Direct channels ──────────────────────────────────────────────────────
   Shown after a successful send and whenever delivery fails. WhatsApp first:
   it is the channel this business actually runs on, and it is the one that
   works regardless of whether the mail endpoint is configured. */

function DirectChannels() {
  return (
    <div className="mt-8 flex flex-col items-center gap-3 md:flex-row md:justify-center md:gap-8">
      <a
        href={WHATSAPP_HREF}
        target="_blank"
        rel="noopener noreferrer"
        style={{ ...serif, backgroundColor: "#191919" }}
        className="w-full rounded-full px-8 py-3.5 text-center text-[0.9375rem] uppercase tracking-[0.14em] text-white transition-opacity hover:opacity-90 md:w-auto md:px-10"
      >
        WhatsApp us
      </a>
      <a
        href={`mailto:${TO_EMAIL}`}
        style={{ ...serif, color: TEXT_MUTED }}
        className="text-[1rem] transition-opacity hover:opacity-70"
      >
        {TO_EMAIL}
      </a>
      <a
        href={SITE_PHONE_HREF}
        style={{ ...serif, color: TEXT_MUTED }}
        className="text-[1rem] transition-opacity hover:opacity-70"
      >
        {SITE_PHONE}
      </a>
    </div>
  );
}

/* ─── Fields ──────────────────────────────────────────────────────────────
   Underlined rather than boxed, and set in the same Cormorant as the rest of
   the page. `required` is on the two fields an enquiry is useless without;
   the server re-checks both — client validation is a convenience, never a
   guarantee. */

const LABEL_CLS = "text-[0.75rem] uppercase tracking-[0.2em]";

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className={LABEL_CLS} style={{ ...serif, color: TEXT_LABEL }}>
        {label}
        {required && <span style={{ color: GOLD }}> *</span>}
      </span>
      <input
        type={type}
        required={required}
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ ...serif, color: TEXT_MUTED, borderColor: "rgba(25,25,25,0.2)" }}
        className="w-full border-b bg-transparent pb-2 text-[1.0625rem] outline-none transition-colors focus:border-b-[#191919]"
      />
    </label>
  );
}

function Select({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className={LABEL_CLS} style={{ ...serif, color: TEXT_LABEL }}>
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          ...serif,
          color: value ? TEXT_MUTED : TEXT_LABEL,
          borderColor: "rgba(25,25,25,0.2)",
        }}
        className="w-full appearance-none border-b bg-transparent pb-2 text-[1.0625rem] outline-none transition-colors focus:border-b-[#191919]"
      >
        <option value="">Select…</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}
