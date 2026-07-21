// ══════════════════════════════════════════════════════════════════
// PATH IN REPO: app/menu-builder/catalog/page.tsx
// ══════════════════════════════════════════════════════════════════
// Sub-flow C (Outdoor / Bulk) Step 2. A 2-column catalog of bulk items with
// per-card quantity steppers. Continue unlocks once at least one item has a
// quantity > 0.
// ═══════════════════════════════════════════════════════════════════════════

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import BuilderLayout from "@/components/menu-builder/BuilderLayout";
import { useBooking } from "@/lib/menu-builder/context";
import { CATALOG_ITEMS } from "@/lib/menu-builder/data";
import { formatINR } from "@/lib/menu-builder/pricing";
import { MB_COLORS, STEPS_OUTDOOR, type CatalogItem } from "@/lib/menu-builder/types";

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

const CATALOG_STEP_INDEX = 2; // Client, [Catalog], Packaging, Quote

export default function CatalogStepPage() {
  const { state, dispatch, hydrated } = useBooking();
  const router = useRouter();

  // Route protection — outdoor sub-flow only.
  useEffect(() => {
    if (!hydrated) return;
    if (state.cateringType !== "outdoor") router.replace("/menu-builder/client");
  }, [hydrated, state.cateringType, router]);

  if (!hydrated || state.cateringType !== "outdoor") return null;

  const setQty = (itemId: string, quantity: number) =>
    dispatch({ type: "SET_CATALOG_QUANTITY", itemId, quantity });

  const hasSelection = Object.values(state.catalogSelections).some((q) => q > 0);

  return (
    <BuilderLayout
      steps={STEPS_OUTDOOR}
      currentStep={CATALOG_STEP_INDEX}
      backHref="/menu-builder/client"
      nextHref="/menu-builder/packaging"
      nextLabel="Continue"
      nextDisabled={!hasSelection}
    >
      <div className={CARD_PADDING} style={{ backgroundColor: CARD_BG }}>
        <h2
          style={{ ...serif, color: INK }}
          className="text-[clamp(1.6rem,2.3vw,42px)] font-semibold"
        >
          Outdoor Catering Catalog
        </h2>
        <p style={{ color: INK_MUTED }} className="mt-1 text-sm">
          Bulk orders and off-site deliveries — food packets, sweet boxes,
          corporate gifting and more.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
          {CATALOG_ITEMS.map((item) => (
            <CatalogCard
              key={item.id}
              item={item}
              qty={state.catalogSelections[item.id] ?? 0}
              onChange={(q) => setQty(item.id, q)}
            />
          ))}
        </div>

        {!hasSelection && (
          <p style={{ color: INK_MUTED }} className="mt-6 text-xs">
            Add a quantity to at least one item to continue.
          </p>
        )}
      </div>
    </BuilderLayout>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────

function CatalogCard({
  item,
  qty,
  onChange,
}: {
  item: CatalogItem;
  qty: number;
  onChange: (q: number) => void;
}) {
  const selected = qty > 0;
  return (
    <div
      className="flex flex-col rounded-lg border p-5"
      style={{
        borderColor: selected ? GOLD : MB_COLORS.border,
        backgroundColor: selected ? `${GOLD}12` : "transparent",
        outline: selected ? `1px solid ${GOLD}` : "none",
      }}
    >
      <h3 style={{ ...serif, color: INK }} className="text-lg font-semibold leading-tight">
        {item.name}
      </h3>
      <p style={{ color: INK_MUTED }} className="mt-1 text-xs">
        {item.description}
      </p>
      <div className="mt-4 flex items-center justify-between">
        <p style={{ color: INK }} className="text-base font-semibold">
          {formatINR(item.price)}
          <span style={{ color: INK_MUTED }} className="text-xs font-normal"> {item.unit}</span>
        </p>
        <QtyStepper qty={qty} onChange={onChange} />
      </div>
    </div>
  );
}

function QtyStepper({ qty, onChange }: { qty: number; onChange: (q: number) => void }) {
  return (
    <div className="inline-flex items-center gap-2">
      <button
        onClick={() => onChange(qty - 1)}
        disabled={qty === 0}
        className="flex h-8 w-8 items-center justify-center rounded border text-lg leading-none transition-colors hover:bg-gray-50 disabled:opacity-40"
        style={{ borderColor: MB_COLORS.border, color: INK }}
        aria-label="Decrease quantity"
      >
        −
      </button>
      <span
        className="min-w-[24px] text-center text-base font-medium"
        style={{ color: qty > 0 ? INK : MB_COLORS.inkLight }}
      >
        {qty}
      </span>
      <button
        onClick={() => onChange(qty + 1)}
        className="flex h-8 w-8 items-center justify-center rounded border text-lg leading-none transition-colors"
        style={{ borderColor: GOLD, backgroundColor: `${GOLD}22`, color: GOLD }}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}
