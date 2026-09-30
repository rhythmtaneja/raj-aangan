import { PARTNERS } from "@/lib/venue-partners";

export const UNVERIFIED = "—" as const;

export const HERO = {
  eyebrow: "INVESTOR RELATIONS",

  title: "Building the future of experiences & hospitality",
  intro:
    "Raj Aangan is building an integrated hospitality and events platform — combining venues, catering, event execution and curated experiences under one ecosystem.",
  primaryCta: { label: "Investment opportunity", href: "#opportunity" },
  secondaryCta: { label: "Investor enquiries", href: "#enquiry" },
} as const;

export type Metric = {
  label: string;

  count: number | null;

  suffix?: string;

  note?: string;
};

const PEAK_VENUE_CAPACITY = Math.max(
  0,
  ...PARTNERS.flatMap((p) =>
    (p.guests.match(/[\d,]+/g) ?? []).map((n) => Number(n.replace(/,/g, ""))),
  ).filter((n) => Number.isFinite(n)),
);

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
  {
    label: "Business verticals",
    count: 4,
    note: "venues · catering · events · experiences",
  },
  { label: "Revenue growth", count: null, note: "year on year" },
  { label: "Average event value", count: null },
];

export const ABOUT = {
  title: "A Jaipur hospitality company, built as a platform",
  paragraphs: [
    "Raj Aangan Events & Caterers is a Jaipur-based hospitality and events company delivering curated experiences across weddings, private celebrations, corporate events and large-format catering.",
    "What began as a catering and event business now operates as an integrated ecosystem: a network of partner venues across the city, an in-house culinary operation, full event planning and execution, and the production and experience services that sit around them.",
    "That integration is the business. Most operators in this market sell one service and broker the rest. Raj Aangan controls more of the guest experience, which means more of the value of each event stays inside the business — and each capability creates demand for the others.",
  ],
} as const;

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

export type MarketStat = {
  stat: string | null;
  label: string;

  source: string;
  sourceUrl: string;
};

export const MARKET_INTRO =
  "Raj Aangan operates across four overlapping demand pools, each large, each growing, and each reached through the same venues, kitchens and teams.";

export const MARKET: MarketStat[] = [
  {
    stat: null,
    label: "Indian wedding market, annual value",
    source: "",
    sourceUrl: "",
  },
  {
    stat: null,
    label: "Weddings held in India each year",
    source: "",
    sourceUrl: "",
  },
  {
    stat: null,
    label: "Destination-wedding share of the market",
    source: "",
    sourceUrl: "",
  },
  {
    stat: null,
    label: "Indian MICE market, annual value",
    source: "",
    sourceUrl: "",
  },
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

export type PerformanceYear = {
  year: string;

  revenue: number | null;
  ebitdaMargin: number | null;
  events: number | null;
};

export const PERFORMANCE_UNIT = "₹ crore";
export const PERFORMANCE_YEARS: PerformanceYear[] = [];

export const PERFORMANCE_FALLBACK =
  "Raj Aangan is privately held and does not publish financial statements. Audited financials, revenue and EBITDA history, event volume and unit economics are shared with qualified investors under NDA through the investor data room.";

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

export type Leader = {
  name: string;
  role: string;

  photo: string | null;

  bio: string;
};

export const LEADERSHIP: Leader[] = [];

export type InvestorDoc = {
  title: string;
  description: string;
  href: string;

  meta?: string;
};

export const DOCUMENTS: InvestorDoc[] = [
  {
    title: "Company profile",
    description: "Business overview, verticals and operating footprint.",
    href: "#",
  },
  {
    title: "Investor presentation",
    description: "The investment case, market and growth plan.",
    href: "#",
  },
  {
    title: "Business overview",
    description: "How the four verticals operate and reinforce each other.",
    href: "#",
  },
  {
    title: "Financial highlights",
    description: "Summary performance indicators.",
    href: "#",
  },
  {
    title: "Expansion plan",
    description: "Roadmap, target markets and capital requirement.",
    href: "#",
  },
];

export const DATA_ROOM = {
  title: "Investor data room",
  body: "Audited financials, unit economics, contracts and corporate documents are held in a private data room rather than published here. Qualified investors can request access through the enquiry form below.",
} as const;

export type NewsItem = {
  date: string;
  category: string;
  title: string;
  body: string;
  href?: string;
};

export const NEWS: NewsItem[] = [];

export const OPPORTUNITY = {
  title: "Partner with Raj Aangan",
  body: "Raj Aangan is open to conversations with growth capital, strategic hospitality partners, venue and real-estate partners, and institutional investors. What the business needs from a partner varies by route — the starting point is a conversation about which one fits.",

  routes: [
    {
      title: "Growth capital",
      body: "Funding capacity, market expansion and the platform build.",
    },
    {
      title: "Strategic partnership",
      body: "Hospitality, venue or F&B operators with complementary reach.",
    },
    {
      title: "Venue & real estate",
      body: "Property partners looking to put existing sites to work.",
    },
    {
      title: "Institutional",
      body: "Structured investment into the integrated platform.",
    },
  ],
} as const;

export const ENQUIRY = {
  title: "Investor enquiries",
  body: "For investment, partnership or data-room access. Enquiries from this form are routed to the leadership team directly.",

  useDedicatedEmail: false,
  dedicatedEmail: "investors@raec.in",

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
