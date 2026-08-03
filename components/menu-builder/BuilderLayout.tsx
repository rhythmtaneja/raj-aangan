// ══════════════════════════════════════════════════════════════════
// PATH IN REPO: components/menu-builder/BuilderLayout.tsx
// ══════════════════════════════════════════════════════════════════
// CHANGES vs previous version:
//   • Now takes a `steps` array (the active sub-flow's step-set) plus a
//     1-based `currentStep` index, both forwarded to the dynamic ProgressBar
//     and to BookingSummary. Callers pick their step-set via flow.ts/getSteps.
//   • `backLabel` prop still plumbed through to NavFooter.
// ══════════════════════════════════════════════════════════════════

"use client";

import Link from "next/link";
import { type ReactNode } from "react";
import { MB_COLORS, type WizardStep } from "@/lib/menu-builder/types";
import ProgressBar from "./ProgressBar";
import BookingSummary from "./BookingSummary";
import NavFooter from "./NavFooter";

// ═══════════════════════════════════════════════════════════════════════════
// ─── TUNE THESE KNOBS ──────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════

const HEADER_PAD = "px-4 pt-5 pb-2 md:px-10 md:pt-6";
const CONTENT_PAD_X = "px-4 md:px-10";
const CONTENT_MAX_W = "max-w-7xl";
// Content + live-preview summary live in ONE white panel (figma). Two columns
// split by a vertical divider from lg up; the summary stacks below on smaller.
const GRID_COLS = "lg:grid-cols-[minmax(0,1fr)_22.5rem]";
const SUMMARY_PAD = "p-6 md:p-8";

// ═══════════════════════════════════════════════════════════════════════════

type Props = {
  /** The active sub-flow's step-set (from flow.ts/getSteps). */
  steps: WizardStep[];
  /** 1-based index of this page within `steps`. */
  currentStep: number;
  children: ReactNode;

  /** Nav footer — see NavFooter.tsx for full docs. */
  backHref?: string;
  backLabel?: string;
  nextHref?: string;
  nextLabel?: string;
  onNext?: () => void | boolean;
  nextDisabled?: boolean;
};

export default function BuilderLayout({
  steps,
  currentStep,
  children,
  backHref,
  backLabel,
  nextHref,
  nextLabel,
  onNext,
  nextDisabled,
}: Props) {
  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: MB_COLORS.bg }}>
      {/* Top: Menu + Booking pills (like the minimal SiteHeader) */}
      <div className={`flex items-center justify-between ${HEADER_PAD}`}>
        <Link
          href="/"
          className="flex items-center gap-3 rounded-full bg-[#191919] px-6 py-3 text-white transition-opacity hover:opacity-90"
        >
          <MenuIcon />
          <span className="font-semibold text-sm md:text-base">Menu</span>
        </Link>
        <button
          className="flex items-center gap-3 rounded-full bg-[#191919] px-6 py-3 text-white transition-opacity hover:opacity-90"
        >
          <BagIcon />
          <span className="font-semibold text-sm md:text-base">Booking</span>
        </button>
      </div>

      {/* Dynamic progress indicator */}
      <ProgressBar steps={steps} currentStep={currentStep} />

      {/* One white panel holding the step content (left) and the live-preview
          summary (right), split by a vertical divider on lg+. On smaller screens
          the summary stacks below with a horizontal divider instead. */}
      <div className={`mx-auto ${CONTENT_MAX_W} ${CONTENT_PAD_X} pb-16`}>
        <div
          className={`grid grid-cols-1 ${GRID_COLS} overflow-hidden rounded-sm`}
          style={{ backgroundColor: MB_COLORS.card }}
        >
          <main className="min-w-0">{children}</main>
          <div
            className={`border-t lg:border-t-0 lg:border-l ${SUMMARY_PAD}`}
            style={{ borderColor: MB_COLORS.border }}
          >
            <BookingSummary steps={steps} currentStep={currentStep} />
          </div>
        </div>

        {/* Nav sits below the panel on the navy background (figma reference). */}
        <NavFooter
          backHref={backHref}
          backLabel={backLabel}
          nextHref={nextHref}
          nextLabel={nextLabel}
          onNext={onNext}
          nextDisabled={nextDisabled}
        />
      </div>
    </div>
  );
}

function MenuIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
      <line x1="3" y1="7" x2="21" y2="7" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="17" x2="21" y2="17" />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="8" width="16" height="12" rx="2" />
      <path d="M9 8V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
    </svg>
  );
}
