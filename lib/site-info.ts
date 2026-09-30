export const SITE_ADDRESS_LINES = [
  "Raj Aangan Resort, The Haveli Ralawata,",
  "Near SBI Bank, Patrakar Colony, Mansarover, Jaipur",
] as const;

export const SITE_ADDRESS = SITE_ADDRESS_LINES.join(" ");

export const SITE_EMAIL = "info@rajaangan.com";

export const SITE_PHONE = "+91 98290 12815";
export const SITE_PHONE_HREF = "tel:+919829012815";

export const SITE_MAP_HREF = `https://maps.google.com/?q=${encodeURIComponent(SITE_ADDRESS)}`;

export const SITE_SOCIALS = [
  { label: "Instagram", href: "#" },
  { label: "Facebook", href: "#" },

  { label: "WhatsApp", href: `https://wa.me/${SITE_PHONE.replace(/\D/g, "")}` },
] as const;

export const SITE_LEGAL = [
  { label: "Privacy", href: "#" },
  { label: "Terms", href: "#" },
] as const;

export const SITE_CREDIT = {
  label: "Rhythm Taneja",
  href: "https://www.linkedin.com/in/rhythm-taneja/",
} as const;
