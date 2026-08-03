// ══════════════════════════════════════════════════════════════════
// PATH IN REPO: components/menu-builder/ProgressBar.tsx
// ══════════════════════════════════════════════════════════════════
// Now DYNAMIC: takes a `steps` array (one per sub-flow) plus the current
// step's 1-based index. Grid columns are computed inline (2N-1 cells:
// N circles + N-1 connectors) so it works for 4-step and 6-step flows alike
// without any Tailwind class that would need JIT-safelisting.
// ═══════════════════════════════════════════════════════════════════════════

"use client";

import Link from "next/link";
import { MB_COLORS, type WizardStep } from "@/lib/menu-builder/types";

// ═══════════════════════════════════════════════════════════════════════════
// ─── TUNE THESE KNOBS ──────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════

// These are in REM, not px. The whole desktop layout scales off the root
// font-size (see globals.css), so px step-circles would stay 36px while the
// bar around them shrank — they grew from 2.5% to 4.7% of the viewport across
// the browser-zoom range and shoved every row below them out of place.
// They stay plain numbers (not "2.25rem" strings) because the layout below
// does arithmetic on them; `remOf()` renders them.
const CIRCLE_SIZE        = 2.25;   // rem — 36px at the 1440px reference
const CIRCLE_RING_WIDTH  = 0.125;  // rem — 2px; outer white ring on current step
const CIRCLE_RING_GAP    = 0.1875; // rem — 3px; gap between circle and ring
const CONNECTOR_HEIGHT   = 1;      // px — hairline, deliberately NOT scaled
const CONNECTOR_COLOR    = "rgba(255,255,255,0.30)";
const LABEL_MARGIN_TOP   = 0.75;   // rem — 12px

const remOf = (n: number) => `${n}rem`;
const SECTION_PAD_Y      = "pt-4 pb-6 md:pt-6 md:pb-10";

// ═══════════════════════════════════════════════════════════════════════════

type Props = {
  /** The step-set for the active sub-flow. */
  steps: WizardStep[];
  /** 1-based index of the current step within `steps`. */
  currentStep: number;
};

export default function ProgressBar({ steps, currentStep }: Props) {
  // 2N-1 cells: circle, connector, circle, connector, ... circle
  const cols = Math.max(1, steps.length * 2 - 1);
  const current = steps[currentStep - 1];

  return (
    <div className={`w-full ${SECTION_PAD_Y}`}>
      {/* Mobile: compact "Step X of N" + progress line (the circle row would
          overflow a phone once there are 5–6 steps). */}
      <div className="px-4 md:hidden">
        <div className="flex items-baseline justify-between text-white">
          <span
            className="text-sm uppercase tracking-wide"
            style={{ fontFamily: "var(--font-cormorant-garamond)" }}
          >
            {current?.label}
          </span>
          <span className="text-xs text-white/70">
            Step {currentStep} of {steps.length}
          </span>
        </div>
        <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-white/20">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${(currentStep / steps.length) * 100}%`,
              backgroundColor: MB_COLORS.gold,
            }}
          />
        </div>
      </div>

      {/* Desktop: full circle bar */}
      <div
        className="mx-auto hidden max-w-4xl items-start px-6 md:grid"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {steps.map((step, i) => (
          <div key={step.slug} className="contents">
            <StepCircle
              number={i + 1}
              label={step.label}
              slug={step.slug}
              currentStep={currentStep}
            />
            {i < steps.length - 1 && (
              <div
                className="col-span-1"
                style={{
                  height: CONNECTOR_HEIGHT,
                  backgroundColor: CONNECTOR_COLOR,
                  marginTop: remOf(CIRCLE_SIZE / 2 + CIRCLE_RING_GAP),
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function StepCircle({
  number,
  label,
  slug,
  currentStep,
}: {
  number: number;
  label: string;
  slug: string;
  currentStep: number;
}) {
  const isCurrent = number === currentStep;
  const isCompleted = number < currentStep;
  const isReachable = number <= currentStep; // can go back to earlier steps

  // Visual states:
  //   current   → gold fill + white text + white ring around
  //   completed → gold fill + white text
  //   future    → transparent fill + white border + white text
  const filled = isCurrent || isCompleted;

  const inner = (
    <div className="flex flex-col items-center">
      {/* Ring wrapper (only visible on current) */}
      <div
        className="relative flex items-center justify-center rounded-full"
        style={{
          width: remOf(CIRCLE_SIZE + (isCurrent ? (CIRCLE_RING_GAP + CIRCLE_RING_WIDTH) * 2 : 0)),
          height: remOf(CIRCLE_SIZE + (isCurrent ? (CIRCLE_RING_GAP + CIRCLE_RING_WIDTH) * 2 : 0)),
          border: isCurrent ? `${CIRCLE_RING_WIDTH}rem solid #ffffff` : undefined,
        }}
      >
        <div
          className="flex items-center justify-center rounded-full font-semibold"
          style={{
            width:  remOf(CIRCLE_SIZE),
            height: remOf(CIRCLE_SIZE),
            backgroundColor: filled ? MB_COLORS.gold : "transparent",
            color: "#ffffff",
            border: filled ? "none" : "1px solid rgba(255,255,255,0.65)",
            fontSize: "0.875rem", // rem, not 14px — must scale with the circle
          }}
        >
          {isCompleted ? (
            <svg className="w-[1rem] h-[1rem]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            number
          )}
        </div>
      </div>
      <div
        className="text-white text-[clamp(0.75rem,0.85vw,0.75rem)] uppercase tracking-wide"
        style={{ marginTop: remOf(LABEL_MARGIN_TOP), fontFamily: "var(--font-cormorant-garamond)" }}
      >
        {label}
      </div>
    </div>
  );

  // Clickable if it's the current step or a completed step (allows going back)
  if (isReachable) {
    return (
      <Link href={`/menu-builder/${slug}`} className="col-span-1 flex justify-center hover:opacity-90">
        {inner}
      </Link>
    );
  }
  return <div className="col-span-1 flex justify-center opacity-70">{inner}</div>;
}
