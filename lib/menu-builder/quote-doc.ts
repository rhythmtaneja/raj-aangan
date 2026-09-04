// ══════════════════════════════════════════════════════════════════
// PATH IN REPO: lib/menu-builder/quote-doc.ts
// ══════════════════════════════════════════════════════════════════
// A plain, render-agnostic description of the finished quote. Both quote
// layouts (venue-event / outdoor) build one of these, and the three actions on
// the Review screen consume it:
//   • WhatsApp  → whatsAppText()  → wa.me deep link
//   • Generate PDF → the print-only <QuotePrintable> block + window.print()
//   • Share     → navigator.share() with the same text, clipboard fallback
// Keeping one shape means the three never drift out of sync with the screen.
// ═══════════════════════════════════════════════════════════════════════════

export type QuoteLine = { label: string; value: string };

export type QuoteSection = {
  title: string;
  /** label / value rows (Client, Guests, …). */
  lines?: QuoteLine[];
  /** Free text paragraphs / bullets (menu items, counter picks, terms). */
  notes?: string[];
};

export type QuoteDoc = {
  title: string;
  subtitle?: string;
  sections: QuoteSection[];
  totalLabel: string;
  totalValue: string;
  contact?: string;
};

/** WhatsApp accepts plain text only; *bold* is its one bit of markup. */
export function whatsAppText(doc: QuoteDoc): string {
  const out: string[] = [`*${doc.title}*`];
  if (doc.subtitle) out.push(doc.subtitle);

  for (const section of doc.sections) {
    const body: string[] = [];
    for (const line of section.lines ?? []) body.push(`• ${line.label}: ${line.value}`);
    for (const note of section.notes ?? []) body.push(`• ${note}`);
    if (body.length === 0) continue;
    out.push("", `*${section.title}*`, ...body);
  }

  out.push("", `*${doc.totalLabel}: ${doc.totalValue}*`);
  if (doc.contact) out.push("", doc.contact);
  return out.join("\n");
}

/** `wa.me` deep link for a number in local (10-digit) or +91 form. */
export function whatsAppUrl(number: string, text: string): string {
  const digits = number.replace(/\D/g, "");
  const withCountry = digits.length === 10 ? `91${digits}` : digits;
  return `https://wa.me/${withCountry}?text=${encodeURIComponent(text)}`;
}
