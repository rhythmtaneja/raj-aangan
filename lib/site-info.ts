// ══════════════════════════════════════════════════════════════════
// PATH IN REPO: lib/site-info.ts
// ══════════════════════════════════════════════════════════════════
// SINGLE SOURCE OF TRUTH for the business's contact details.
//
// The address / email / phone used to be copy-pasted per section, and the
// footer had drifted from the contact page (a different street line and a
// different email domain). Anything that displays these values must import
// them from here — never re-type the strings in a component.
// ═══════════════════════════════════════════════════════════════════════════

/** Postal address, one entry per rendered line. */
export const SITE_ADDRESS_LINES = [
  "Raj Aangan Resort, The Haveli Ralawata,",
  "Near SBI Bank, Patrakar Colony, Mansarover, Jaipur",
] as const;

/** Same address as a single flat string (maps links, metadata, schema.org). */
export const SITE_ADDRESS = SITE_ADDRESS_LINES.join(" ");

/** Primary public email — used in the footer and the contact page. */
export const SITE_EMAIL = "info@rajaangan.com";

/** Primary public phone. `SITE_PHONE_HREF` is the dial-able `tel:` form. */
export const SITE_PHONE = "+91 98290 12815";
export const SITE_PHONE_HREF = "tel:+919829012815";

/** Google Maps link, built from the canonical address so the two can't drift. */
export const SITE_MAP_HREF = `https://maps.google.com/?q=${encodeURIComponent(SITE_ADDRESS)}`;
