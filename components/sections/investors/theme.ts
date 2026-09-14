// ══════════════════════════════════════════════════════════════════
// PATH IN REPO: components/sections/investors/theme.ts
// ══════════════════════════════════════════════════════════════════
/**
 * The Investors page's tokens — lifted from the REST OF THIS SITE, not from
 * the strategy PDF.
 *
 * ─ WHY THIS FILE WAS REWRITTEN ─────────────────────────────────────────────
 * The first version of this page followed the strategy doc's §4 direction
 * literally: "ivory/warm white, charcoal/near-black and a restrained
 * champagne/gold accent… elegant serif headlines paired with a clean
 * sans-serif for body copy". Read on its own that is reasonable advice. Built
 * against this site it produced a page that did not belong to it — and the
 * client's reaction was that it "looks different from the entire website".
 *
 * The four things that actually broke the family resemblance, measured against
 * the other sections:
 *
 *   1. BODY COPY WAS SANS. Everywhere else on this site — AboutSection,
 *      WhatWeOfferSection, AboutStorySection, IntroSection — paragraph text is
 *      Cormorant Garamond. The serif body IS the house voice. Sans body copy
 *      alone made the page read as a different product.
 *   2. WRONG NEUTRALS. #f7f4ef / #141414 are near-misses of the site's own
 *      #fdfbf5 / #191919. Near-misses look like a mistake; #191919 appears 105
 *      times across this codebase and is unambiguously the house ink.
 *   3. WRONG GOLD. #d0b880 is the contact form's BUTTON fill. The gold this
 *      site draws RULES and HEADINGS with is #bf9a3f.
 *   4. LEFT-ALIGNED, WITH A STICKY CHIP NAV. Every marketing section here is
 *      centred, and nothing else on the site has an in-page nav. That nav was
 *      the single most out-of-place element on the page; it is gone.
 *
 * So the tokens below are quoted from existing sections rather than invented,
 * with the source noted. If you change one, change it because the rest of the
 * site changed.
 */

// ─── GROUNDS ───────────────────────────────────────────────────────────────
// The site runs a warm cream ladder and scrubs `--page-bg` between sections
// (FeaturedSection → ServicesSection → CuisineSection → AboutSection):
//   #ffffff → #dac8b0 → #d4dad3 → #ebe5db → #f1ece3
// The investors page borrows the top of that ladder, which is where the
// reading-heavy sections of the site already live.
export const CREAM = "#fdfbf5";      // = WhatWeOfferSection.SECTION_BG
export const CREAM_WARM = "#f5efe6";  // used across the venue/contact pages
export const CREAM_DEEP = "#f1ece3";  // = AboutSection.BG_END_COLOR

// ─── DARK BANDS ────────────────────────────────────────────────────────────
export const INK = "#191919";         // the house ink — 105 uses across the app
export const NAVY = "#0f2f3b";        // = ContactForm.SECTION_BG

// ─── TYPE COLOURS ──────────────────────────────────────────────────────────
export const TEXT_BODY = "#2a2a2a";   // = AboutSection paragraph colour
export const TEXT_MUTED = "#3a3a3a";  // = AboutSection Stat colour
export const TEXT_LABEL = "#444444";  // = the uppercase label colour everywhere

// ─── GOLD ──────────────────────────────────────────────────────────────────
export const GOLD = "#bf9a3f";        // = AboutSection's hairline + heading gold
export const GOLD_SOFT = "#b08d57";   // the site's secondary gold

/** Cormorant Garamond — headings AND body copy. See note 1 above. */
export const serif = { fontFamily: "var(--font-cormorant-garamond)" } as const;

// ─── SHARED CLASS STRINGS ──────────────────────────────────────────────────
// Quoted from the existing sections so the investors page inherits the exact
// same sizes rather than approximating them.

/** Uppercase label beside a NumeralMarker. = AboutSection / WhatWeOfferSection. */
export const NUMERAL_LABEL =
  "leading-none uppercase tracking-[0.2em] text-[clamp(1rem,1.25vw,1.125rem)]";

/** The small eyebrow that sits above a heading, over its gold hairline. */
export const EYEBROW =
  "font-semibold uppercase tracking-[0.2em] text-[clamp(0.8rem,0.94vw,0.875rem)]";

/** Section heading. = AboutSection's h2 clamp. */
export const H2 =
  "font-semibold text-[1.75rem] md:text-[clamp(2rem,3.4vw,3.0625rem)]";

/** Sub-heading inside a section (card titles, phase names). */
export const H3 =
  "font-semibold text-[1.25rem] md:text-[clamp(1.4rem,2vw,1.8125rem)]";

/** Body paragraph. = AboutSection's paragraph clamp. SERIF — see note 1. */
export const BODY =
  "leading-relaxed text-[1.0625rem] md:text-[clamp(1.1rem,1.45vw,1.3125rem)]";

/** Smaller body, for card descriptions and captions. */
export const BODY_SM =
  "leading-relaxed text-[0.9375rem] md:text-[clamp(0.95rem,1.15vw,1.0625rem)]";

/** Section padding. = the site's `px-6 py-24` / `py-32` rhythm. */
export const SECTION_PAD = "px-6 py-20 md:py-32";

/** Inner frame on a photo. = AboutSection / WhatWeOfferSection recipe. */
export const PHOTO_FRAME_INSET = "1.25rem";
export const PHOTO_FRAME_COLOR = "rgba(255,255,255,0.7)";
export const HOVER_TRANSITION = "transition-transform duration-[1200ms] ease-out";
export const HOVER_SCALE = "group-hover:scale-105";

/** Outlined pill, matching AboutSection's CircleButton className. */
export const PILL_DARK =
  "rounded-full border border-[#191919] px-8 py-3 text-sm font-medium text-[#191919]";
