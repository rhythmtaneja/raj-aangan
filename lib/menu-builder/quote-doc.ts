export type QuoteLine = { label: string; value: string };

export type QuoteSection = {
  title: string;

  lines?: QuoteLine[];

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

export function whatsAppText(doc: QuoteDoc): string {
  const out: string[] = [`*${doc.title}*`];
  if (doc.subtitle) out.push(doc.subtitle);

  for (const section of doc.sections) {
    const body: string[] = [];
    for (const line of section.lines ?? [])
      body.push(`• ${line.label}: ${line.value}`);
    for (const note of section.notes ?? []) body.push(`• ${note}`);
    if (body.length === 0) continue;
    out.push("", `*${section.title}*`, ...body);
  }

  out.push("", `*${doc.totalLabel}: ${doc.totalValue}*`);
  if (doc.contact) out.push("", doc.contact);
  return out.join("\n");
}

export function whatsAppUrl(number: string, text: string): string {
  const digits = number.replace(/\D/g, "");
  const withCountry = digits.length === 10 ? `91${digits}` : digits;
  return `https://wa.me/${withCountry}?text=${encodeURIComponent(text)}`;
}
