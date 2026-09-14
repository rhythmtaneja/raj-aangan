// ══════════════════════════════════════════════════════════════════
// PATH IN REPO: lib/investor-content.ts
// ══════════════════════════════════════════════════════════════════
/**
 * All copy and data for /investors, in one file.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️  READ THIS BEFORE THE PAGE GOES LIVE  ⚠️
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * This is an INVESTOR RELATIONS page. Every number on it is a representation
 * about the business, and a wrong one is not a typo — it is a false statement
 * to someone deciding whether to put money in. The client's own strategy doc
 * is explicit about this:
 *
 *     "Present only verified figures."
 *     "Every market statistic should be sourced from a credible, current
 *      reference."
 *              — RAEC_Investor_Relations_Website_Strategy.pdf, §3
 *
 * So NOTHING numeric here was invented to fill the layout. Every figure RAEC
 * has not supplied is `null`, and every component renders `null` as an em-dash
 * with its label intact. The page therefore looks deliberately unfinished
 * rather than confidently wrong, and no reviewer can mistake a placeholder for
 * a real result.
 *
 * TO FILL THIS IN: search this file for `null` and for `UNVERIFIED`. Replace a
 * value only when someone at RAEC has confirmed it. Market statistics also
 * need `source` + `sourceUrl` filled in — an unsourced market claim on an IR
 * page is the same problem as an unverified company figure.
 *
 * The prose is a different matter and IS written: positioning, section copy
 * and vertical descriptions are drawn from the strategy doc and from what the
 * rest of this site already says about the business. Review it for tone, but
 * it makes no factual claims that the site does not already make.
 * ═══════════════════════════════════════════════════════════════════════════
 */

/* From the plain data module, NOT from PartnersGridSection. That component is
   `"use client"`, and a server component importing a value out of a client
   module gets a client-reference proxy rather than the array — which rendered
   this metric as "0 partner venues". See lib/venue-partners.ts. */
import { PARTNERS } from "@/lib/venue-partners";

/** Rendered wherever a figure has not been supplied yet. */
export const UNVERIFIED = "—" as const;

// ═══════════════════════════════════════════════════════════════════════════
// 01 — HERO
// ═══════════════════════════════════════════════════════════════════════════

export const HERO = {
  eyebrow: "INVESTOR RELATIONS",
  /* The strategy doc offers two headline variants (§1 and §3). This is the §3
     wording, which reads better as a page title and puts "experiences" first —
     the whole positioning argument is that RAEC is not just a wedding vendor. */
  title: "Building the future of experiences & hospitality",
  intro:
    "Raj Aangan is building an integrated hospitality and events platform — combining venues, catering, event execution and curated experiences under one ecosystem.",
  primaryCta: { label: "Investment opportunity", href: "#opportunity" },
  secondaryCta: { label: "Investor enquiries", href: "#enquiry" },
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// 02 — INVESTMENT SNAPSHOT
// ═══════════════════════════════════════════════════════════════════════════
/**
 * The eight metrics the strategy doc names. `value: null` renders as an
 * em-dash — see the warning at the top of this file before changing any.
 *
 * `venueNetwork` is the one figure that is NOT a placeholder: it is counted
 * live from the venue partner list this site already publishes on /venue, so
 * it cannot drift from what the rest of the site claims. If that list changes,
 * this number changes with it.
 */
export type Metric = {
  label: string;
  /** Numeric value, animated with <CountUp>. `null` = not verified yet. */
  count: number | null;
  /** e.g. "+" for "200+". */
  suffix?: string;
  /** Small qualifier under the number. */
  note?: string;
};

/**
 * Largest single-event capacity in the published venue network.
 *
 * DERIVED, NOT ASSERTED: parsed from the `guests` field of the venue partners
 * this site already lists on /venue/partners (ranges like "1,500–4,500", plus
 * a couple of "To be confirmed" entries which contribute nothing). So it can
 * never claim more than the site already claims elsewhere, and it moves on its
 * own if a venue is added or a capacity corrected.
 */
const PEAK_VENUE_CAPACITY = Math.max(
  0,
  ...PARTNERS.flatMap((p) =>
    (p.guests.match(/[\d,]+/g) ?? []).map((n) => Number(n.replace(/,/g, "")))
  ).filter((n) => Number.isFinite(n))
);

/**
 * The eight metrics the strategy doc names (§3).
 *
 * ⚠️ `count: null` renders as an em-dash. Read the warning at the top of this
 * file before filling any in.
 *
 * THREE OF THESE ARE NOT PLACEHOLDERS, and none of the three is invented:
 *
 *   • Events delivered, Annual guests, Years of operation — these are the
 *     figures the HOMEPAGE already publishes, in AboutSection's CountUp stats
 *     (200+ events / 10,000+ guests / 15+ years). They are RAEC's own public
 *     claims, so repeating them here adds no new assertion. If they are wrong,
 *     they are wrong on the homepage first and both should be corrected.
 *   • Partner venues and Peak venue capacity are counted and parsed live from
 *     the venue network on /venue/partners.
 *   • Business verticals is the count of the four in BUSINESS below.
 *
 * Still genuinely unknown, and therefore dashes: revenue growth and average
 * event value. Both are financial, and RAEC has published neither.
 */
export const SNAPSHOT: Metric[] = [
  { label: "Years of operation", count: 15, suffix: "+" },
  { label: "Events delivered", count: 200, suffix: "+" },
  { label: "Guests served", count: 10000, suffix: "+" },
  {
    label: "Peak venue capacity",
    count: PEAK_VENUE_CAPACITY,
    note: "guests, single event",
  },
  { label: "Partner venues", count: PARTNERS.length, note: "across Jaipur" },
  { label: "Business verticals", count: 4, note: "venues · catering · events · experiences" },
  { label: "Revenue growth", count: null, note: "year on year" },
  { label: "Average event value", count: null },
];

// ═══════════════════════════════════════════════════════════════════════════
// 03 — ABOUT RAJ AANGAN
// ═══════════════════════════════════════════════════════════════════════════

export const ABOUT = {
  title: "A Jaipur hospitality company, built as a platform",
  paragraphs: [
    "Raj Aangan Events & Caterers is a Jaipur-based hospitality and events company delivering curated experiences across weddings, private celebrations, corporate events and large-format catering.",
    "What began as a catering and event business now operates as an integrated ecosystem: a network of partner venues across the city, an in-house culinary operation, full event planning and execution, and the production and experience services that sit around them.",
    "That integration is the business. Most operators in this market sell one service and broker the rest. Raj Aangan controls more of the guest experience, which means more of the value of each event stays inside the business — and each capability creates demand for the others.",
  ],
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// 04 — OUR BUSINESS
// ═══════════════════════════════════════════════════════════════════════════
/* The four verticals are the client's own, from layout.jpeg. The strategy doc
   lists a slightly different cut (Venues / Catering / Events / Experiences);
   layout.jpeg wins because it matches the routes this site already ships. */

export const BUSINESS = [
  {
    num: "01",
    title: "Events & Weddings",
    href: "/events",
    body: "Planning and execution for weddings, receptions and multi-day celebrations — the highest-value, highest-visibility work the business does, and the entry point for most customer relationships.",
  },
  {
    num: "02",
    title: "Catering",
    href: "/catering",
    body: "Large-format culinary operations across regional, pan-Indian and international menus. The most repeatable and most scalable vertical: it travels to venues the business does not own.",
  },
  {
    num: "03",
    title: "Venue & Hospitality",
    href: "/venue",
    body: "A curated network of partner venues across Jaipur, from heritage properties to large banquet destinations, giving the business range across guest counts and budgets without the capital load of owning each site.",
  },
  {
    num: "04",
    title: "Corporate Events",
    href: "/events",
    body: "Conferences, offsites, product launches and MICE work. Counter-seasonal to the wedding calendar and contracted through businesses rather than families, which shortens the sales cycle and steadies utilisation.",
  },
] as const;

// ═══════════════════════════════════════════════════════════════════════════
// 05 — WHY RAJ AANGAN
// ═══════════════════════════════════════════════════════════════════════════
/* The six-card structure named in the strategy doc, §3. */

export const WHY = [
  {
    title: "Integrated business model",
    body: "Venue, catering, planning and production under one operator. Each event draws on several verticals, so revenue per event is structurally higher than a single-service competitor can reach.",
  },
  {
    title: "Large & growing market",
    body: "Indian weddings, destination celebrations and corporate events form one of the country's largest discretionary-spend categories, and Jaipur is among its most established destinations.",
  },
  {
    title: "High-value customers",
    body: "Celebrations and corporate programmes are planned months ahead, budgeted deliberately and rarely price-shopped at the margin — a customer profile that rewards reputation over discounting.",
  },
  {
    title: "Strong local position",
    body: "An established Jaipur operator with an existing venue network, supplier relationships and referral base — the assets that take years to build and are hardest for a new entrant to replicate.",
  },
  {
    title: "Scalable model",
    body: "Growth comes from utilisation, cross-sell and partnership rather than from buying property. Catering and event execution extend to new venues and new cities without the capital of ownership.",
  },
  {
    title: "Multiple revenue streams",
    body: "Venue rental, food & beverage, event management, décor and production, and strategic partnerships — several independent lines rather than one exposure.",
  },
] as const;

// ═══════════════════════════════════════════════════════════════════════════
// 06 — MARKET OPPORTUNITY
// ═══════════════════════════════════════════════════════════════════════════
/**
 * ⚠️ EVERY ENTRY HERE NEEDS A SOURCE BEFORE IT IS PUBLISHED.
 *
 * Market-size claims are the easiest thing on an IR page to get wrong and the
 * most damaging to be caught on. `stat: null` renders as an em-dash; the
 * component also refuses to render a stat whose `source` is empty, so an
 * unsourced number cannot reach the page even if someone fills in `stat` and
 * forgets the citation.
 */
export type MarketStat = {
  stat: string | null;
  label: string;
  /** Publication name, e.g. "WTTC Economic Impact 2024". Required to render. */
  source: string;
  sourceUrl: string;
};

export const MARKET_INTRO =
  "Raj Aangan operates across four overlapping demand pools, each large, each growing, and each reached through the same venues, kitchens and teams.";

export const MARKET: MarketStat[] = [
  { stat: null, label: "Indian wedding market, annual value", source: "", sourceUrl: "" },
  { stat: null, label: "Weddings held in India each year", source: "", sourceUrl: "" },
  { stat: null, label: "Destination-wedding share of the market", source: "", sourceUrl: "" },
  { stat: null, label: "Indian MICE market, annual value", source: "", sourceUrl: "" },
];

export const MARKET_PILLARS = [
  {
    title: "The wedding ecosystem",
    body: "India's largest discretionary-spend occasion, resilient through downturns and increasingly outsourced to professional operators rather than run by families.",
  },
  {
    title: "Destination weddings",
    body: "Jaipur is one of the country's defining destination-wedding cities. Destination events run longer, involve more functions and carry materially higher value per booking.",
  },
  {
    title: "Corporate & MICE",
    body: "Conferences, offsites and launches, contracted by businesses on a calendar that fills the gaps the wedding season leaves.",
  },
  {
    title: "Experiential hospitality",
    body: "Demand has moved from venue-and-meal toward designed, produced experiences — which is where an integrated operator earns more than a broker.",
  },
] as const;

// ═══════════════════════════════════════════════════════════════════════════
// 07 — GROWTH STRATEGY
// ═══════════════════════════════════════════════════════════════════════════
/* The five-step progression from the strategy doc, §3. */

export const STRATEGY = [
  {
    step: "01",
    title: "Strengthen Jaipur",
    body: "Deepen the home market: raise utilisation across the existing venue network, increase attach rates between catering and event services, and convert more of the referral base.",
  },
  {
    step: "02",
    title: "Expand catering",
    body: "Catering is the most portable capability in the business. Growing it — into venues RAEC does not operate, and into corporate and institutional contracts — grows revenue without new sites.",
  },
  {
    step: "03",
    title: "Build partnerships",
    body: "Formalise venue, hospitality and supplier relationships into structured partnerships with committed capacity, rather than event-by-event arrangements.",
  },
  {
    step: "04",
    title: "Expand geographically",
    body: "Take the operating model to comparable destination markets, led by catering and event execution, where the brand and playbook transfer without the capital of ownership.",
  },
  {
    step: "05",
    title: "Build the RAEC platform",
    body: "Bring venues, catering, events and experiences onto shared systems — booking, menu configuration, production and customer data — so each new market plugs into infrastructure that already exists.",
  },
] as const;

// ═══════════════════════════════════════════════════════════════════════════
// 08 — BUSINESS PERFORMANCE
// ═══════════════════════════════════════════════════════════════════════════
/**
 * ⚠️ NO FINANCIALS HAVE BEEN SUPPLIED.
 *
 * `PERFORMANCE_YEARS` is empty, and the component renders a short "available
 * on request" panel instead of a chart when it is. That is the correct
 * behaviour for a privately held company that has not released figures — it
 * is a normal, credible thing for an IR page to say, and far better than a
 * chart of numbers nobody has verified.
 *
 * To publish real figures: fill this array (oldest → newest) and the section
 * renders the bar chart automatically. Leave `null` for any single metric that
 * is not being disclosed; the chart skips it.
 */
export type PerformanceYear = {
  year: string;
  /** ₹ crore, or whatever unit PERFORMANCE_UNIT states. Keep units consistent. */
  revenue: number | null;
  ebitdaMargin: number | null;
  events: number | null;
};

export const PERFORMANCE_UNIT = "₹ crore";
export const PERFORMANCE_YEARS: PerformanceYear[] = [];

export const PERFORMANCE_FALLBACK =
  "Raj Aangan is privately held and does not publish financial statements. Audited financials, revenue and EBITDA history, event volume and unit economics are shared with qualified investors under NDA through the investor data room.";

// ═══════════════════════════════════════════════════════════════════════════
// 09 — EXPANSION ROADMAP
// ═══════════════════════════════════════════════════════════════════════════
/**
 * ⚠️ THE DATES ARE PLACEHOLDERS. The strategy doc asks for "a visual timeline
 * using RAEC's actual dates and milestones" — RAEC has not supplied them, so
 * `period: null` renders as an em-dash. The four PHASES are the structure the
 * doc recommends (Foundation → Capacity → Multi-city → Platform); the phase
 * names and descriptions are safe, the dates are not.
 */
export const ROADMAP = [
  {
    phase: "Phase 01",
    period: null as string | null,
    title: "Foundation",
    body: "Establish the integrated model in Jaipur across venues, catering, events and experiences, with the supplier base and venue network to support it.",
  },
  {
    phase: "Phase 02",
    period: null as string | null,
    title: "Capacity expansion",
    body: "Scale kitchen, production and delivery capacity so the business can run more concurrent events and take larger single bookings.",
  },
  {
    phase: "Phase 03",
    period: null as string | null,
    title: "Multi-city",
    body: "Extend catering and event execution into comparable destination markets, led by the capabilities that travel.",
  },
  {
    phase: "Phase 04",
    period: null as string | null,
    title: "Integrated platform",
    body: "Shared booking, menu, production and customer systems across every market and vertical — the operating layer that makes further expansion incremental.",
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// 10 — LEADERSHIP
// ═══════════════════════════════════════════════════════════════════════════
/**
 * ⚠️ EMPTY ON PURPOSE — no names, roles, photographs or biographies have been
 * supplied, and these are real people. Inventing a founder biography on an
 * investor page would be a fabrication about an identifiable person, so this
 * array ships empty and the section hides itself entirely until it is filled.
 *
 * The strategy doc asks for professional portraits and 80–100 word bios for
 * founder/chairman, managing director and key operating leadership. Photos go
 * in /public/images/investors/ and are referenced here by path.
 */
export type Leader = {
  name: string;
  role: string;
  /** Path under /public, e.g. "/images/investors/founder.jpg". */
  photo: string | null;
  /** 80–100 words per the strategy doc. */
  bio: string;
};

export const LEADERSHIP: Leader[] = [];

// ═══════════════════════════════════════════════════════════════════════════
// 11 — INVESTOR DOCUMENTS
// ═══════════════════════════════════════════════════════════════════════════
/**
 * ⚠️ EVERY `href` IS "#" — no documents exist yet. The section renders these
 * as disabled rows with a "Coming soon" marker rather than as live links, so
 * nobody clicks through to nothing. Replace the href with a real file under
 * /public/investors/ and the row becomes an active download automatically.
 *
 * The strategy doc is explicit that genuinely sensitive material should sit
 * behind the data room (the request form below), NOT be published here.
 */
export type InvestorDoc = {
  title: string;
  description: string;
  href: string;
  /** e.g. "PDF · 2.4 MB". Shown only when the doc is live. */
  meta?: string;
};

export const DOCUMENTS: InvestorDoc[] = [
  { title: "Company profile", description: "Business overview, verticals and operating footprint.", href: "#" },
  { title: "Investor presentation", description: "The investment case, market and growth plan.", href: "#" },
  { title: "Business overview", description: "How the four verticals operate and reinforce each other.", href: "#" },
  { title: "Financial highlights", description: "Summary performance indicators.", href: "#" },
  { title: "Expansion plan", description: "Roadmap, target markets and capital requirement.", href: "#" },
];

export const DATA_ROOM = {
  title: "Investor data room",
  body: "Audited financials, unit economics, contracts and corporate documents are held in a private data room rather than published here. Qualified investors can request access through the enquiry form below.",
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// 12 — NEWS & ANNOUNCEMENTS
// ═══════════════════════════════════════════════════════════════════════════
/**
 * ⚠️ EMPTY ON PURPOSE — announcing partnerships, launches or contracts that
 * have not happened would be a straightforwardly false statement to investors.
 * The section hides itself entirely while this array is empty.
 *
 * Add entries newest-first. `date` is an ISO string so it sorts and formats
 * predictably; write it as the date the thing actually happened.
 */
export type NewsItem = {
  date: string;
  category: string;
  title: string;
  body: string;
  href?: string;
};

export const NEWS: NewsItem[] = [];

// ═══════════════════════════════════════════════════════════════════════════
// 13 — INVESTMENT OPPORTUNITY + INVESTOR ENQUIRIES
// ═══════════════════════════════════════════════════════════════════════════

export const OPPORTUNITY = {
  title: "Partner with Raj Aangan",
  body: "Raj Aangan is open to conversations with growth capital, strategic hospitality partners, venue and real-estate partners, and institutional investors. What the business needs from a partner varies by route — the starting point is a conversation about which one fits.",
  /**
   * ⚠️ The strategy doc says to state whether RAEC is actively fundraising and
   * on what basis (growth capital / strategic / hospitality-real-estate /
   * institutional). RAEC has not said. Until they do, this section describes
   * openness to conversation and makes NO claim about a live round, a
   * valuation or a raise size. Do not add one without written confirmation.
   */
  routes: [
    { title: "Growth capital", body: "Funding capacity, market expansion and the platform build." },
    { title: "Strategic partnership", body: "Hospitality, venue or F&B operators with complementary reach." },
    { title: "Venue & real estate", body: "Property partners looking to put existing sites to work." },
    { title: "Institutional", body: "Structured investment into the integrated platform." },
  ],
} as const;

export const ENQUIRY = {
  title: "Investor enquiries",
  body: "For investment, partnership or data-room access. Enquiries from this form are routed to the leadership team directly.",
  /**
   * ⚠️ PLACEHOLDER. The strategy doc says to use a dedicated address such as
   * investors@raec.in "only if RAEC actually creates and monitors it". It does
   * not exist, so this falls back to the main business address from
   * lib/site-info.ts — a monitored inbox is better than a prestigious one that
   * bounces. Swap it when the dedicated mailbox is live.
   */
  useDedicatedEmail: false,
  dedicatedEmail: "investors@raec.in",
  /** Field list from the strategy doc, §3. */
  interests: [
    "Growth capital",
    "Strategic partnership",
    "Venue / real estate",
    "Institutional investment",
    "Data room access",
    "Other",
  ],
  ranges: [
    "Under ₹1 crore",
    "₹1–5 crore",
    "₹5–25 crore",
    "₹25 crore+",
    "Prefer not to say",
  ],
} as const;
