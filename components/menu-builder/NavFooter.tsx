// ══════════════════════════════════════════════════════════════════
// PATH IN REPO: components/menu-builder/NavFooter.tsx
// ══════════════════════════════════════════════════════════════════
// CHANGES vs previous version:
//   • New backLabel prop — override the default "Back" text.
//     Step 1 uses this to say "Back to Catering" since it leaves the
//     wizard entirely rather than going to a previous step.
// ══════════════════════════════════════════════════════════════════

"use client";

import Link from "next/link";
import { MB_COLORS } from "@/lib/menu-builder/types";

// ═══════════════════════════════════════════════════════════════════════════
// ─── TUNE THESE KNOBS ──────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════

const SECTION_PAD    = "pt-8 pb-2";   // no horizontal pad — aligns to card edges
const BUTTON_HEIGHT  = "py-3.5 px-10";
const BUTTON_FONT    = "text-[clamp(0.9rem,1.05vw,0.9375rem)] font-medium tracking-wide";

// ═══════════════════════════════════════════════════════════════════════════

type Props = {
  /** Href for the "Back" button. Omit to hide it (e.g. before Step 1 added its back). */
  backHref?: string;
  /** Optional override for the Back button text. Defaults to "Back". */
  backLabel?: string;
  /** Href for the primary "Next" button. */
  nextHref?: string;
  /** Button label — defaults to "Next". */
  nextLabel?: string;
  /** Optional click handler for the primary button. Return false to block navigation. */
  onNext?: () => void | boolean;
  /** Disable the next button (e.g. required fields missing). */
  nextDisabled?: boolean;
};

export default function NavFooter({
  backHref,
  backLabel = "Back",
  nextHref,
  nextLabel = "Next",
  onNext,
  nextDisabled = false,
}: Props) {
  return (
    <div
      className={`relative w-full ${SECTION_PAD} flex items-center justify-end gap-4`}
      style={{ backgroundColor: MB_COLORS.bg }}
    >
      {/* Back and Next align with the left and right edges of the shared panel. */}
      {backHref && (
        <Link
          href={backHref}
          className={`absolute left-0 inline-block rounded-full ${BUTTON_HEIGHT} ${BUTTON_FONT} uppercase text-[#191919] transition-opacity hover:opacity-90`}
          style={{ backgroundColor: MB_COLORS.gold }}
        >
          {backLabel}
        </Link>
      )}

      {/* Primary Next / action button — aligned below the booking summary edge. */}
      <NextButton
        href={nextHref}
        label={nextLabel}
        onClick={onNext}
        disabled={nextDisabled}
      />
    </div>
  );
}

function NextButton({
  href,
  label,
  onClick,
  disabled,
}: {
  href?: string;
  label: string;
  onClick?: () => void | boolean;
  disabled: boolean;
}) {
  const base = `inline-block rounded-full ${BUTTON_HEIGHT} ${BUTTON_FONT} uppercase text-[#191919] transition-opacity`;
  const disabledClass = disabled ? "cursor-not-allowed opacity-50" : "hover:opacity-90";

  if (onClick && !href) {
    return (
      <button
        onClick={disabled ? undefined : () => onClick()}
        className={`${base} ${disabledClass}`}
        style={{ backgroundColor: MB_COLORS.gold }}
        disabled={disabled}
      >
        {label}
      </button>
    );
  }
  if (href) {
    return (
      <Link
        href={disabled ? "#" : href}
        onClick={onClick as React.MouseEventHandler}
        className={`${base} ${disabledClass}`}
        style={{ backgroundColor: MB_COLORS.gold }}
        aria-disabled={disabled}
      >
        {label}
      </Link>
    );
  }
  return null;
}
