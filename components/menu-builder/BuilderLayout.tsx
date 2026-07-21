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

const HEADER_PAD = "px-6 pt-6 pb-2 md:px-10";
const CONTENT_PAD_X = "px-6 md:px-10";
const CONTENT_MAX_W = "max-w-7xl";
const GAP = "gap-6 md:gap-10";
const SIDEBAR_W = "360px";

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

      {/* Main content + sticky sidebar */}
      <div
        className={`mx-auto grid ${CONTENT_MAX_W} grid-cols-1 ${GAP} ${CONTENT_PAD_X} pb-16 md:grid-cols-[1fr_${SIDEBAR_W}]`}
        style={{
          gridTemplateColumns: `minmax(0, 1fr) ${SIDEBAR_W}`,
        }}
      >
        <main className="min-w-0">{children}</main>
        <BookingSummary steps={steps} currentStep={currentStep} />
      </div>

      {/* Bottom nav — Back / Next */}
      <NavFooter
        backHref={backHref}
        backLabel={backLabel}
        nextHref={nextHref}
        nextLabel={nextLabel}
        onNext={onNext}
        nextDisabled={nextDisabled}
      />
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
