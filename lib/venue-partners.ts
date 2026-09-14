// ══════════════════════════════════════════════════════════════════
// PATH IN REPO: lib/venue-partners.ts
// ══════════════════════════════════════════════════════════════════
/**
 * The Jaipur venue partner network — the data only, with no React around it.
 *
 * ─ WHY THIS IS ITS OWN MODULE ───────────────────────────────────────────
 * It used to live inside components/sections/venue/PartnersGridSection.tsx,
 * which is a `"use client"` file. That is fine while only that component reads
 * it, but the moment a SERVER component imports a value out of a client module
 * it does not get the value — React hands it a client-reference proxy, and the
 * array silently reads as empty. That is exactly what happened when the
 * investor snapshot tried to count the network: the page rendered
 * "0 partner venues", which on an investor page is not a cosmetic bug.
 *
 * Plain data with no "use client" directive can be imported from either side
 * of the boundary and is always the real array. Anything that needs to COUNT
 * or read these venues should import from here, not from the grid component.
 *
 * PartnersGridSection re-exports it so existing imports keep working.
 */

export type Partner = {
  name: string;
  location: string;
  /** Free text — venues report rooms as "45", "55 + 25", "51+". */
  rooms: string;
  /** Free text — a range ("250–800") or "To be confirmed". */
  guests: string;
  description: string;
  image: string;
  href?: string;
};

export const PARTNERS: Partner[] = [
  {
    name: "Hotel New Haveli",
    location: "Mansarovar, Jaipur",
    rooms: "55 + 25",
    guests: "250–800",
    description: "A versatile Jaipur wedding destination with elegant banquet spaces and expansive outdoor lawns, ideal for weddings, receptions, and memorable multi-function celebrations.",
    image: "/images/partner-rajmahal.jpg",
  },
  {
    name: "Hotel Rudra Vilas",
    location: "Mansarovar, Jaipur",
    rooms: "45",
    guests: "300",
    description: "A royal-style wedding destination combining comfortable guest accommodation with a magnificent lawn, royal banquet hall, and dedicated spaces for intimate wedding functions.",
    image: "/images/partner-samode.jpg",
  },
  {
    name: "Kalyan Heritage and Paradise",
    location: "Jagatpura, Jaipur",
    rooms: "24",
    guests: "300–2,000",
    description: "A heritage-inspired Jaipur destination featuring landscaped gardens, banquet facilities, and comfortable accommodation, creating an elegant setting for weddings and celebrations.",
    image: "/images/partner-marriott.jpg",
  },
  {
    name: "The Andaaj Bagh",
    location: "Jagatpura, Jaipur",
    rooms: "36",
    guests: "500–700",
    description: "A spacious wedding destination near Jaipur Airport, offering a large lawn and banquet setting designed for grand weddings, receptions, and social celebrations.",
    image: "/images/partner-rajmahal.jpg",
  },
  {
    name: "Varmala Resort and Banquet",
    location: "Jagatpura, Jaipur",
    rooms: "75",
    guests: "1,000–1,200",
    description: "A destination-wedding resort combining generous banquet and lawn spaces with guest accommodation, making it well suited to large weddings and multi-day celebrations.",
    image: "/images/partner-samode.jpg",
  },
  {
    name: "Atlantics Luxury Banquet",
    location: "Sitapura, Jaipur",
    rooms: "2",
    guests: "To be confirmed",
    description: "A Jaipur banquet destination included in the Raj Aangan venue network, suited to celebrations and events. Guest capacity should be confirmed directly with the venue.",
    image: "/images/partner-marriott.jpg",
  },
  {
    name: "Chandan Van",
    location: "Sitapura, Jaipur",
    rooms: "2",
    guests: "1,500–4,500",
    description: "A large-format Jaipur event destination with expansive lawns and a substantial indoor hall, designed to accommodate grand weddings and high-guest-count celebrations.",
    image: "/images/partner-rajmahal.jpg",
  },
  {
    name: "JJ Valley Hotel",
    location: "Mansarovar, Jaipur",
    rooms: "26",
    guests: "100–1,500",
    description: "A comfortable Mansarovar wedding hotel with guest accommodation, an expansive outdoor lawn, and an indoor banquet space for weddings and pre-wedding functions.",
    image: "/images/partner-samode.jpg",
  },
  {
    name: "Harika Bagh Hotel & Resort",
    location: "Jagatpura, Jaipur",
    rooms: "51+",
    guests: "500–1,000",
    description: "A luxury wedding resort blending landscaped lawns, spacious banquet halls, guest accommodation, and complete event support for intimate ceremonies and grand celebrations.",
    image: "/images/partner-marriott.jpg",
  },
  {
    name: "The Victoria Palace",
    location: "Mansarovar, Jaipur",
    rooms: "35",
    guests: "200–750",
    description: "A Mansarovar wedding venue combining an air-conditioned banquet hall, outdoor lawn, and guest accommodation for weddings, receptions, and social celebrations.",
    image: "/images/partner-rajmahal.jpg",
  },
  {
    name: "Alankara Hotel & Resorts",
    location: "Dholai, Jaipur",
    rooms: "80",
    guests: "600–1,000",
    description: "A contemporary luxury resort blending European-inspired architecture with lush lawns, a grand banquet hall, poolside spaces, and 80 rooms for destination-style weddings.",
    image: "/images/partner-samode.jpg",
  },
  {
    name: "Maan Palace",
    location: "Jaipur",
    rooms: "70",
    guests: "500–2,000",
    description: "A large Jaipur wedding property featuring a grand lawn, multiple indoor halls, and extensive guest accommodation, suited to both intimate functions and large celebrations.",
    image: "/images/partner-marriott.jpg",
  },
  {
    name: "Anant Mahal",
    location: "Mansarovar, Jaipur",
    rooms: "100",
    guests: "750–1,500",
    description: "A royal-style Jaipur wedding property with expansive lawns, banquet spaces, poolside options, and approximately 100 guest rooms for elegant multi-function celebrations.",
    image: "/images/partner-rajmahal.jpg",
  },
  {
    name: "The Gopal Bagh Resort",
    location: "Mansarovar, Jaipur",
    rooms: "60",
    guests: "200–850",
    description: "A wedding-focused resort designed for elegant celebrations, offering a destination-style setting with guest accommodation and event spaces for intimate and larger gatherings.",
    image: "/images/partner-samode.jpg",
  },
  {
    name: "Hari Van – A Royal Wedding Destination",
    location: "Sanganer, Jaipur",
    rooms: "60",
    guests: "350–1,500",
    description: "A grand royal wedding destination featuring multiple banquet halls, an expansive lawn, guest accommodation, and event facilities for large-scale multi-function celebrations.",
    image: "/images/partner-marriott.jpg",
  },
  {
    name: "Khanaram Paradise",
    location: "Mansarovar, Jaipur",
    rooms: "15",
    guests: "To be confirmed",
    description: "A Jaipur venue included in the Raj Aangan partner network. It offers a dedicated setting for celebrations, with guest capacity to be confirmed directly before publishing.",
    image: "/images/partner-rajmahal.jpg",
  },
  {
    name: "Ganesh Bagh Marriage Hall",
    location: "Mansarovar, Jaipur",
    rooms: "6",
    guests: "250–2,000",
    description: "A large Jaipur marriage venue with an expansive lawn and indoor hall, suited to sizeable weddings, receptions, and social celebrations.",
    image: "/images/partner-samode.jpg",
  },
  {
    name: "Eden Garden & Resorts",
    location: "Mansarovar, Jaipur",
    rooms: "25",
    guests: "250–2,000",
    description: "A versatile Jaipur resort offering a grand lawn, banquet space, poolside setting, and guest accommodation for residential weddings and multi-function celebrations.",
    image: "/images/partner-marriott.jpg",
  },
  {
    name: "Kasturi Bagh – The Luxury Wedding Resort",
    location: "Jagatpura, Jaipur",
    rooms: "50",
    guests: "200–2,000",
    description: "A luxury wedding destination with spacious lawns, a large air-conditioned banquet hall, guest accommodation, and ample space for grand celebrations.",
    image: "/images/partner-rajmahal.jpg",
  },
  {
    name: "Abhaneri",
    location: "Jagatpura, Jaipur",
    rooms: "2",
    guests: "To be confirmed",
    description: "A heritage-oriented wedding venue in Jagatpura offering an intimate setting for celebrations. Guest capacity should be confirmed directly with the venue.",
    image: "/images/partner-samode.jpg",
  },
  {
    name: "FabHotel Prime Viona",
    location: "Mansarovar, Jaipur",
    rooms: "22",
    guests: "To be confirmed",
    description: "A hotel property in Mansarovar offering guest accommodation and standard hospitality facilities. Dedicated wedding capacity should be confirmed with the property.",
    image: "/images/partner-marriott.jpg",
  },
  {
    name: "Royal Crystal Resort",
    location: "Mansarovar, Jaipur",
    rooms: "32",
    guests: "500–1,500",
    description: "A spacious Dholai wedding resort with a large lawn, banquet hall, and 32 guest rooms, suited to grand weddings and destination-style celebrations.",
    image: "/images/partner-rajmahal.jpg",
  },
  {
    name: "Aura Banquet",
    location: "Mansarovar, Jaipur",
    rooms: "4",
    guests: "To be confirmed",
    description: "A dedicated Jaipur banquet venue included in the Raj Aangan partner network, suitable for celebrations and events. Guest capacity should be confirmed before publishing.",
    image: "/images/partner-samode.jpg",
  },
  {
    name: "Crown Heavens",
    location: "Jaisinghpura, Jaipur",
    rooms: "90+",
    guests: "To be confirmed",
    description: "A Jaipur venue included in the Raj Aangan partner network, offering a destination setting for celebrations. Guest capacity should be confirmed directly with the venue.",
    image: "/images/partner-marriott.jpg",
  },
];
