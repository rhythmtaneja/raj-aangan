// ══════════════════════════════════════════════════════════════════
// PATH IN REPO: app/menu-builder/catalog/page.tsx
// ══════════════════════════════════════════════════════════════════
// Sub-flow C (Outdoor / Bulk) Step 2. Same accordion as the venue-event menu
// steps: the catalog's sections (Festive Snack Packets, Wedding Favour Boxes,
// Live Food Vans, …) are collapsed headings; opening one lists the boxes inside
// it with their contents underneath, each with a + that adds it to the order.
//
// Once a box is added the + becomes a quantity stepper — bulk orders are priced
// per box, so "how many" still has to be answerable. Continue unlocks as soon
// as one box has a quantity.
//
// A section with no variants (older Sanity data) falls back to a single row for
// the section itself, so the screen can never come up empty.
// ═══════════════════════════════════════════════════════════════════════════

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BuilderLayout from "@/components/menu-builder/BuilderLayout";
import { useBooking } from "@/lib/menu-builder/context";
import { useCatalog } from "@/lib/menu-builder/catalog";
import { formatINR } from "@/lib/menu-builder/pricing";
import {
  MB_COLORS,
  STEPS_OUTDOOR,
  type CatalogItem,
  type CatalogVariant,
} from "@/lib/menu-builder/types";

const serif = { fontFamily: "var(--font-cormorant-garamond)" } as const;

// ═══════════════════════════════════════════════════════════════════════════
// ─── TUNE THESE KNOBS ──────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════

const CARD_BG      = MB_COLORS.card;
const INK          = MB_COLORS.ink;
const INK_MUTED    = MB_COLORS.inkMuted;
const GOLD         = MB_COLORS.gold;
const CARD_PADDING = "p-5 md:p-10";

// ═══════════════════════════════════════════════════════════════════════════

const CATALOG_STEP_INDEX = 2; // Client, [Catalog], Packaging, Quote

/** Price shown for a box: its own if it has one, else the section's. */
const priceLabel = (item: CatalogItem, variant?: CatalogVariant): string => {
  const price = variant?.price ?? item.price;
  return price == null ? "On request" : `${formatINR(price)} ${item.unit}`;
};

export default function CatalogStepPage() {
  const { state, dispatch, hydrated } = useBooking();
  const { catalogItems } = useCatalog();
  const router = useRouter();

  const [open, setOpen] = useState<Record<string, boolean>>({});
  const toggleSection = (id: string) => setOpen((p) => ({ ...p, [id]: !p[id] }));

  // Route protection — outdoor sub-flow only.
  useEffect(() => {
    if (!hydrated) return;
    if (state.cateringType !== "outdoor") router.replace("/menu-builder/client");
  }, [hydrated, state.cateringType, router]);

  if (!hydrated || state.cateringType !== "outdoor") return null;

  const setQty = (itemId: string, quantity: number) =>
    dispatch({ type: "SET_CATALOG_QUANTITY", itemId, quantity });

  const qtyOf = (id: string) => state.catalogSelections[id] ?? 0;

  // A section with no variants is orderable as itself (keyed by the section id).
  const rowsOf = (item: CatalogItem): { id: string; variant?: CatalogVariant }[] =>
    item.variants?.length
      ? item.variants.map((v) => ({ id: v.id, variant: v }))
      : [{ id: item.id }];

  const sectionCount = (item: CatalogItem) =>
    rowsOf(item).reduce((n, row) => n + (qtyOf(row.id) > 0 ? 1 : 0), 0);

  const totalBoxes = Object.values(state.catalogSelections).reduce((a, b) => a + b, 0);
  const hasSelection = totalBoxes > 0;

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
          className="text-[clamp(1.6rem,2.3vw,2.0625rem)] font-semibold"
        >
          Outdoor Catering Catalog
        </h2>
        <p style={{ color: INK_MUTED }} className="mt-1 text-sm">
          Bulk orders and off-site deliveries. Open a section to see what&apos;s
          inside each box and add the ones you want.{" "}
          <span style={{ color: GOLD }}>
            {totalBoxes} added
          </span>
          .
        </p>

        <div className="mt-6 space-y-3">
          {catalogItems.map((item) => {
            const isOpen = !!open[item.id];
            const count = sectionCount(item);
            return (
              <div
                key={item.id}
                className="overflow-hidden rounded-lg border"
                style={{ borderColor: isOpen ? GOLD : MB_COLORS.border }}
              >
                {/* Section heading — click to expand / collapse */}
                <button
                  onClick={() => toggleSection(item.id)}
                  className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition-colors md:px-5"
                  style={{ backgroundColor: isOpen ? `${GOLD}12` : "transparent" }}
                  aria-expanded={isOpen}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <Chevron open={isOpen} />
                    <div className="min-w-0">
                      <h3
                        style={{ ...serif, color: INK }}
                        className="text-[clamp(1.15rem,1.4vw,1.5rem)] font-semibold leading-tight"
                      >
                        {item.name}
                      </h3>
                      <p style={{ color: INK_MUTED }} className="mt-0.5 text-xs">
                        {item.description}
                        {" · "}
                        <span style={{ color: GOLD }}>{priceLabel(item)}</span>
                      </p>
                    </div>
                  </div>
                  {count > 0 && (
                    <span
                      className="shrink-0 rounded-full px-3 py-1 text-xs font-medium"
                      style={{ backgroundColor: `${GOLD}22`, color: GOLD }}
                    >
                      {count} added
                    </span>
                  )}
                </button>

                {/* Boxes — only when expanded */}
                {isOpen && (
                  <div
                    className="border-t px-4 md:px-5"
                    style={{ borderColor: MB_COLORS.borderLight }}
                  >
                    <p
                      style={{ color: INK_MUTED }}
                      className="mt-4 text-xs uppercase tracking-widest"
                    >
                      {item.variantLabel ?? "Box Category"}
                    </p>
                    <ul className="divide-y" style={{ borderColor: MB_COLORS.borderLight }}>
                      {rowsOf(item).map(({ id, variant }) => (
                        <BoxRow
                          key={id}
                          name={variant?.name ?? item.name}
                          contents={variant?.contents ?? []}
                          contentsLabel={item.contentsLabel ?? "Contents"}
                          price={priceLabel(item, variant)}
                          qty={qtyOf(id)}
                          onChange={(q) => setQty(id, q)}
                        />
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {!hasSelection && (
          <p style={{ color: INK_MUTED }} className="mt-6 text-xs">
            Open a section above and add at least one box to continue.
          </p>
        )}
      </div>
    </BuilderLayout>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────

function BoxRow({
  name,
  contents,
  contentsLabel,
  price,
  qty,
  onChange,
}: {
  name: string;
  contents: string[];
  contentsLabel: string;
  price: string;
  qty: number;
  onChange: (q: number) => void;
}) {
  return (
    <li className="flex flex-col gap-3 py-4 md:flex-row md:items-start md:justify-between md:gap-6">
      <div className="min-w-0">
        <p style={{ ...serif, color: INK }} className="text-lg font-medium leading-tight">
          {name}
        </p>
        {contents.length > 0 && (
          <p style={{ color: INK_MUTED }} className="mt-1 text-xs leading-relaxed">
            <span style={{ color: INK }}>{contentsLabel}:</span> {contents.join(", ")}
          </p>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-4 md:flex-col md:items-end md:gap-2">
        <span style={{ color: GOLD }} className="whitespace-nowrap text-sm font-medium">
          {price}
        </span>
        {qty > 0 ? (
          <QtyStepper qty={qty} onChange={onChange} />
        ) : (
          <button
            onClick={() => onChange(1)}
            className="flex items-center gap-1.5 rounded border px-4 py-1.5 text-sm transition-colors hover:bg-gray-50"
            style={{ borderColor: MB_COLORS.border, color: INK }}
          >
            <span style={{ color: GOLD }}>+</span>
            <span>Add</span>
          </button>
        )}
      </div>
    </li>
  );
}

function QtyStepper({ qty, onChange }: { qty: number; onChange: (q: number) => void }) {
  return (
    <div
      className="inline-flex items-center gap-2 rounded border px-1.5 py-1"
      style={{ borderColor: GOLD, backgroundColor: `${GOLD}12` }}
    >
      <button
        onClick={() => onChange(qty - 1)}
        className="flex h-7 w-7 items-center justify-center rounded text-lg leading-none transition-colors hover:bg-white"
        style={{ color: INK }}
        aria-label="Decrease quantity"
      >
        −
      </button>
      <span className="min-w-[1.5rem] text-center text-base font-medium" style={{ color: INK }}>
        {qty}
      </span>
      <button
        onClick={() => onChange(qty + 1)}
        className="flex h-7 w-7 items-center justify-center rounded text-lg leading-none transition-colors hover:bg-white"
        style={{ color: GOLD }}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke={GOLD}
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0 transition-transform duration-200 w-[1.125rem] h-[1.125rem]"
      style={{ transform: open ? "rotate(90deg)" : "rotate(0deg)" }}
    >
      <polyline points="9 6 15 12 9 18" />
    </svg>
  );
}
