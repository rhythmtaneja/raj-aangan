// ══════════════════════════════════════════════════════════════════
// PATH IN REPO: app/investors/page.tsx
// ══════════════════════════════════════════════════════════════════
/**
 * /investors — the Investor Relations page.
 *
 * BUILT FROM: pending-work/Investor/layout.jpeg (the client's section tree,
 * which sets the ORDER) and RAEC_Investor_Relations_Website_Strategy.pdf
 * (which sets the CONTENT of each section). Where they disagree — the doc
 * lists Venues/Catering/Events/Experiences as the verticals, the drawing lists
 * Events & Weddings / Catering / Venue-Hospitality / Corporate Events — the
 * drawing wins, because it matches the routes this site already ships.
 *
 * ─ WHY THIS PAGE WAS REDESIGNED (Sep 2026) ───────────────────────────────
 * The first build followed the strategy doc's §4 art direction to the letter
 * (ivory, charcoal, champagne gold, sans-serif body, left-aligned, sticky chip
 * nav). Taken alone that is defensible; dropped into THIS site it read as a
 * different product, and the client's note was that it "looks different from
 * the entire website… seems AI page".
 *
 * It is now built from the site's own vocabulary instead:
 *   • NumeralMarker + uppercase label + gold hairline + serif heading — the
 *     exact opener AboutSection and WhatWeOfferSection use.
 *   • Cormorant Garamond for BODY copy, not just headings. The serif body is
 *     this site's voice; sans body copy alone broke the family resemblance.
 *   • The house palette: #fdfbf5 / #f5efe6 / #f1ece3 creams, #191919 ink,
 *     #0f2f3b navy, #bf9a3f gold. No near-miss neutrals.
 *   • Centred layouts, CountUp stats, Parallax, Reveal-with-stagger, inset
 *     white photo frames and the shared 1200ms hover-zoom.
 *   • The sticky chip nav is GONE. Nothing else on this site has one, and it
 *     was the single most out-of-place element on the page.
 * See components/sections/investors/theme.ts for the token-by-token account.
 *
 * ─ WHAT WAS DELIBERATELY NOT COPIED FROM CARAVELA ────────────────────────
 * The reference (caravelabeachresortgoa.com/investor-relations.html) is a
 * LISTED company's IR page: SEBI LODR disclosures, trading-window closures,
 * IEPF, shareholding patterns, AGM notices. The strategy doc is explicit that
 * none of it belongs here (§7) — RAEC is privately held, and publishing
 * listed-company furniture would be pretending to be something it is not.
 * What IS borrowed is the shape that works: a plain narrative before any
 * figure, a clean document library, and a leadership profile.
 *
 * ─ ⚠️ BEFORE THIS GOES LIVE ──────────────────────────────────────────────
 * Several figures are still placeholders and render as em-dashes; Leadership
 * and News hide themselves entirely, because inventing people or
 * announcements is not a styling decision. Read the header of
 * lib/investor-content.ts — it lists everything outstanding in one place.
 */

import type { Metadata } from "next";

import InvestorHero from "@/components/sections/investors/InvestorHero";
import InvestorSnapshot from "@/components/sections/investors/InvestorSnapshot";
import InvestorAbout from "@/components/sections/investors/InvestorAbout";
import InvestorBusiness from "@/components/sections/investors/InvestorBusiness";
import InvestorWhy from "@/components/sections/investors/InvestorWhy";
import InvestorMarket from "@/components/sections/investors/InvestorMarket";
import InvestorStrategy from "@/components/sections/investors/InvestorStrategy";
import InvestorPerformance from "@/components/sections/investors/InvestorPerformance";
import InvestorRoadmap from "@/components/sections/investors/InvestorRoadmap";
import InvestorLeadership from "@/components/sections/investors/InvestorLeadership";
import InvestorDocuments from "@/components/sections/investors/InvestorDocuments";
import InvestorNews from "@/components/sections/investors/InvestorNews";
import InvestorClosing from "@/components/sections/investors/InvestorClosing";
import FooterSection from "@/components/sections/FooterSection";
import { LEADERSHIP, NEWS } from "@/lib/investor-content";

export const metadata: Metadata = {
  title: "Investor Relations | Raj Aangan Events & Caterers",
  description:
    "Raj Aangan is building an integrated hospitality and events platform — venues, catering, event execution and curated experiences under one ecosystem.",
};

type SectionComponent = (props: { numeral: string }) => React.ReactElement | null;

/** I, II, III… Only ever needs to reach the section count. */
const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];

export default function InvestorsPage() {
  /*
    The numerals are assigned HERE rather than hardcoded in each section.
    Leadership and News remove themselves when their content arrays are empty
    — which they are — and hardcoded numerals would then read I, II … VIII, X,
    XII with visible gaps in the sequence. Building the list first and
    numbering what survives keeps it contiguous however many sections are
    switched off.
  */
  /*
    ⚠️ EXPLICIT `id`, NOT `Component.name`.

    This list was keyed on `Section.name` and every key came back as the empty
    string — "Encountered two children with the same key, ``". A function's
    `.name` is not a contract: the bundler wraps and renames these components,
    and an anonymous wrapper reports "". React then could not tell the eight
    sections apart, which is a correctness bug, not just a warning — it is
    free to reuse or drop the wrong instance on a re-render.

    The string below is the key. It never changes, whatever the bundler does.
  */
  const sections: { id: string; Component: SectionComponent }[] = [
    { id: "snapshot", Component: InvestorSnapshot },
    { id: "about", Component: InvestorAbout },
    { id: "business", Component: InvestorBusiness },
    { id: "why", Component: InvestorWhy },
    { id: "market", Component: InvestorMarket },
    { id: "strategy", Component: InvestorStrategy },
    { id: "performance", Component: InvestorPerformance },
    { id: "roadmap", Component: InvestorRoadmap },
    ...(LEADERSHIP.length > 0
      ? [{ id: "leadership", Component: InvestorLeadership }]
      : []),
    { id: "documents", Component: InvestorDocuments },
    ...(NEWS.length > 0 ? [{ id: "news", Component: InvestorNews }] : []),
    { id: "closing", Component: InvestorClosing },
  ];

  return (
    <main className="bg-[#fdfbf5]">
      <InvestorHero />

      {sections.map(({ id, Component }, i) => (
        <Component key={id} numeral={ROMAN[i]} />
      ))}

      <FooterSection />
    </main>
  );
}
