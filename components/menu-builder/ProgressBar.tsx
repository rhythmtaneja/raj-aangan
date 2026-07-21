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

const CIRCLE_SIZE_PX     = 36;
const CIRCLE_RING_WIDTH  = 2;    // outer white ring on current step
const CIRCLE_RING_GAP    = 3;    // gap between circle and ring
const CONNECTOR_HEIGHT   = 1;    // line thickness between circles
const CONNECTOR_COLOR    = "rgba(255,255,255,0.30)";
const LABEL_MARGIN_TOP   = 12;
const SECTION_PAD_Y      = "pt-6 pb-10";

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

  return (
    <div className={`w-full ${SECTION_PAD_Y}`}>
      <div
        className="mx-auto grid max-w-4xl items-start px-6"
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
                  marginTop: CIRCLE_SIZE_PX / 2 + CIRCLE_RING_GAP,
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
          width: CIRCLE_SIZE_PX + (isCurrent ? (CIRCLE_RING_GAP + CIRCLE_RING_WIDTH) * 2 : 0),
          height: CIRCLE_SIZE_PX + (isCurrent ? (CIRCLE_RING_GAP + CIRCLE_RING_WIDTH) * 2 : 0),
          border: isCurrent ? `${CIRCLE_RING_WIDTH}px solid #ffffff` : undefined,
        }}
      >
        <div
          className="flex items-center justify-center rounded-full font-semibold"
          style={{
            width:  CIRCLE_SIZE_PX,
            height: CIRCLE_SIZE_PX,
            backgroundColor: filled ? MB_COLORS.gold : "transparent",
            color: "#ffffff",
            border: filled ? "none" : "1px solid rgba(255,255,255,0.65)",
            fontSize: 14,
          }}
        >
          {isCompleted ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            number
          )}
        </div>
      </div>
      <div
        className="text-white text-[clamp(0.75rem,0.85vw,15px)] uppercase tracking-wide"
        style={{ marginTop: LABEL_MARGIN_TOP, fontFamily: "var(--font-cormorant-garamond)" }}
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
