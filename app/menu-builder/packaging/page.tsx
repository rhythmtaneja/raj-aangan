// ══════════════════════════════════════════════════════════════════
// PATH IN REPO: app/menu-builder/packaging/page.tsx
// ══════════════════════════════════════════════════════════════════
// Sub-flow C (Outdoor / Bulk) Step 3. Single-select packaging style + the
// delivery date & address. Continue unlocks once a packaging style is chosen
// and both delivery fields are filled.
// ═══════════════════════════════════════════════════════════════════════════

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import BuilderLayout from "@/components/menu-builder/BuilderLayout";
import { useBooking } from "@/lib/menu-builder/context";
import { PACKAGING_STYLES } from "@/lib/menu-builder/data";
import { MB_COLORS, STEPS_OUTDOOR } from "@/lib/menu-builder/types";

const serif = { fontFamily: "var(--font-cormorant-garamond)" } as const;

// ═══════════════════════════════════════════════════════════════════════════
// ─── TUNE THESE KNOBS ──────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════

const CARD_BG      = MB_COLORS.card;
const INK          = MB_COLORS.ink;
const INK_MUTED    = MB_COLORS.inkMuted;
const GOLD         = MB_COLORS.gold;
const CARD_PADDING = "p-8 md:p-10";

// ═══════════════════════════════════════════════════════════════════════════

const PACKAGING_STEP_INDEX = 3; // Client, Catalog, [Packaging], Quote

export default function PackagingStepPage() {
  const { state, dispatch, hydrated } = useBooking();
  const router = useRouter();

  // Route protection — outdoor sub-flow, and needs a catalog selection.
  useEffect(() => {
    if (!hydrated) return;
    if (state.cateringType !== "outdoor") {
      router.replace("/menu-builder/client");
    } else if (!Object.values(state.catalogSelections).some((q) => q > 0)) {
      router.replace("/menu-builder/catalog");
    }
  }, [hydrated, state.cateringType, state.catalogSelections, router]);

  if (!hydrated || state.cateringType !== "outdoor") return null;

  const pickStyle = (id: string) => dispatch({ type: "SET_PACKAGING_STYLE", styleId: id });
  const setDate = (v: string) => dispatch({ type: "SET_FIELD", field: "eventDate", value: v });
  const setAddress = (v: string) => dispatch({ type: "SET_DELIVERY_ADDRESS", value: v });

  const canContinue = Boolean(
    state.packagingStyleId && state.eventDate && state.deliveryAddress.trim(),
  );

  return (
    <BuilderLayout
      steps={STEPS_OUTDOOR}
      currentStep={PACKAGING_STEP_INDEX}
      backHref="/menu-builder/catalog"
      nextHref="/menu-builder/quote"
      nextLabel="Review & Quote"
      nextDisabled={!canContinue}
    >
      <div className={CARD_PADDING} style={{ backgroundColor: CARD_BG }}>
        <h2
          style={{ ...serif, color: INK }}
          className="text-[clamp(1.6rem,2.3vw,42px)] font-semibold"
        >
          Packaging & Delivery
        </h2>
        <p style={{ color: INK_MUTED }} className="mt-1 text-sm">
          Choose how your order should be packaged and where it should go.
        </p>

        {/* Packaging style — single-select pills */}
        <SectionLabel>Packaging Style</SectionLabel>
        <div className="flex flex-wrap gap-3">
          {PACKAGING_STYLES.map((s) => (
            <Pill
              key={s.id}
              selected={state.packagingStyleId === s.id}
              onClick={() => pickStyle(s.id)}
            >
              {s.label}
            </Pill>
          ))}
        </div>

        {/* Delivery details */}
        <SectionLabel>Delivery Details</SectionLabel>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <Label>Delivery Date</Label>
            <input
              type="date"
              value={state.eventDate}
              onChange={(e) => setDate(e.target.value)}
              className="mt-2 w-full rounded border border-gray-300 px-4 py-2.5 text-sm focus:border-gray-600 focus:outline-none"
              style={{ color: INK }}
            />
          </div>
          <div>
            <Label>Delivery Address</Label>
            <input
              type="text"
              value={state.deliveryAddress}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Address, Jaipur"
              className="mt-2 w-full rounded border border-gray-300 px-4 py-2.5 text-sm focus:border-gray-600 focus:outline-none"
              style={{ color: INK }}
            />
          </div>
        </div>

        {!canContinue && (
          <p style={{ color: INK_MUTED }} className="mt-6 text-xs">
            Pick a packaging style and fill in the delivery date & address to continue.
          </p>
        )}
      </div>
    </BuilderLayout>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-8 mb-4 flex items-center gap-4">
      <p style={{ color: INK }} className="text-xs font-semibold uppercase tracking-widest">
        {children}
      </p>
      <div className="h-px flex-1" style={{ backgroundColor: GOLD }} />
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ color: INK }} className="text-sm font-medium">
      {children}
    </p>
  );
}

function Pill({
  children,
  selected,
  onClick,
}: {
  children: React.ReactNode;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-full px-5 py-2 text-sm transition-colors"
      style={{
        backgroundColor: selected ? GOLD : "transparent",
        color: selected ? "#ffffff" : INK,
        border: selected ? `1px solid ${GOLD}` : `1px solid ${MB_COLORS.border}`,
      }}
    >
      {children}
    </button>
  );
}
