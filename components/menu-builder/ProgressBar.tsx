// ══════════════════════════════════════════════════════════════════
// PATH IN REPO: components/menu-builder/ProgressBar.tsx
// ══════════════════════════════════════════════════════════════════

"use client";

import Link from "next/link";
import { MB_COLORS, STEPS, type StepNumber } from "@/lib/menu-builder/types";

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
  currentStep: StepNumber;
};

export default function ProgressBar({ currentStep }: Props) {
  return (
    <div className={`w-full ${SECTION_PAD_Y}`}>
      <div className="mx-auto grid max-w-4xl grid-cols-9 items-start px-6">
        {/* Row alternates: circle, connector, circle, connector, ... (9 cells for 5 circles + 4 connectors) */}
        {STEPS.map((step, i) => (
          <div key={step.slug} className="contents">
            <StepCircle
              step={step.number as StepNumber}
              label={step.label}
              slug={step.slug}
              currentStep={currentStep}
            />
            {i < STEPS.length - 1 && (
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
  step,
  label,
  slug,
  currentStep,
}: {
  step: StepNumber;
  label: string;
  slug: string;
  currentStep: StepNumber;
}) {
  const isCurrent = step === currentStep;
  const isCompleted = step < currentStep;
  const isReachable = step <= currentStep; // can go back to earlier steps

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
            color: filled ? "#ffffff" : "#ffffff",
            border: filled ? "none" : "1px solid rgba(255,255,255,0.65)",
            fontSize: 14,
          }}
        >
          {step}
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
