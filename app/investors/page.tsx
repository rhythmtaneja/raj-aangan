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

type SectionComponent = (props: {
  numeral: string;
}) => React.ReactElement | null;

const ROMAN = [
  "I",
  "II",
  "III",
  "IV",
  "V",
  "VI",
  "VII",
  "VIII",
  "IX",
  "X",
  "XI",
  "XII",
];

export default function InvestorsPage() {
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
