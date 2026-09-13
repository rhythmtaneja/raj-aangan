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

/**
 * Social profiles.
 *
 * ⚠️ PLACEHOLDERS — the real handles were never supplied. They render as
 * normal links, so they must be filled in before launch or they will send
 * visitors nowhere. Search for "#" in this file to find everything still
 * outstanding.
 */
export const SITE_SOCIALS = [
  { label: "Instagram", href: "#" },
  { label: "Facebook", href: "#" },
  /* WhatsApp deep-link: wa.me/<number, digits only, with country code>.
     Built from the canonical phone so the two cannot drift. */
  { label: "WhatsApp", href: `https://wa.me/${SITE_PHONE.replace(/\D/g, "")}` },
] as const;

/**
 * Legal pages.
 *
 * ⚠️ PLACEHOLDERS — neither route exists yet (`app/privacy/` and `app/terms/`
 * are not built). Point these at the real pages once they are written.
 */
export const SITE_LEGAL = [
  { label: "Privacy", href: "#" },
  { label: "Terms", href: "#" },
] as const;

/** Build credit shown in the footer. */
export const SITE_CREDIT = {
  label: "Rhythm Taneja",
  href: "https://www.linkedin.com/in/rhythm-taneja/",
} as const;
