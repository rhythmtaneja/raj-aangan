"use client";

import Link from "next/link";
import { MB_COLORS, type WizardStep } from "@/lib/menu-builder/types";

const CIRCLE_SIZE = 2.25;
const CIRCLE_RING_WIDTH = 0.125;
const CIRCLE_RING_GAP = 0.1875;
const CONNECTOR_HEIGHT = 1;
const CONNECTOR_COLOR = "rgba(255,255,255,0.30)";
const LABEL_MARGIN_TOP = 0.75;

const remOf = (n: number) => `${n}rem`;
const SECTION_PAD_Y = "pt-4 pb-6 md:pt-6 md:pb-10";

type Props = {
  steps: WizardStep[];

  currentStep: number;
};

export default function ProgressBar({ steps, currentStep }: Props) {
  const cols = Math.max(1, steps.length * 2 - 1);
  const current = steps[currentStep - 1];

  return (
    <div className={`w-full ${SECTION_PAD_Y}`}>
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
  const isReachable = number <= currentStep;

  const filled = isCurrent || isCompleted;

  const inner = (
    <div className="flex flex-col items-center">
      <div
        className="relative flex items-center justify-center rounded-full"
        style={{
          width: remOf(
            CIRCLE_SIZE +
              (isCurrent ? (CIRCLE_RING_GAP + CIRCLE_RING_WIDTH) * 2 : 0),
          ),
          height: remOf(
            CIRCLE_SIZE +
              (isCurrent ? (CIRCLE_RING_GAP + CIRCLE_RING_WIDTH) * 2 : 0),
          ),
          border: isCurrent
            ? `${CIRCLE_RING_WIDTH}rem solid #ffffff`
            : undefined,
        }}
      >
        <div
          className="flex items-center justify-center rounded-full font-semibold"
          style={{
            width: remOf(CIRCLE_SIZE),
            height: remOf(CIRCLE_SIZE),
            backgroundColor: filled ? MB_COLORS.gold : "transparent",
            color: "#ffffff",
            border: filled ? "none" : "1px solid rgba(255,255,255,0.65)",
            fontSize: "0.875rem",
          }}
        >
          {isCompleted ? (
            <svg
              className="w-[1rem] h-[1rem]"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ffffff"
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            number
          )}
        </div>
      </div>
      <div
        className="text-white text-[clamp(0.75rem,0.85vw,0.75rem)] uppercase tracking-wide"
        style={{
          marginTop: remOf(LABEL_MARGIN_TOP),
          fontFamily: "var(--font-cormorant-garamond)",
        }}
      >
        {label}
      </div>
    </div>
  );

  if (isReachable) {
    return (
      <Link
        href={`/menu-builder/${slug}`}
        className="col-span-1 flex justify-center hover:opacity-90"
      >
        {inner}
      </Link>
    );
  }
  return (
    <div className="col-span-1 flex justify-center opacity-70">{inner}</div>
  );
}
