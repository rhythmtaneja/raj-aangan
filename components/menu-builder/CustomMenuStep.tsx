// ══════════════════════════════════════════════════════════════════
// PATH IN REPO: components/menu-builder/CustomMenuStep.tsx
// ══════════════════════════════════════════════════════════════════
// The from-scratch custom builder. Shows the à-la-carte master menu
// (CUSTOM_MENU_SECTIONS, generated from RAEC_master_menu.csv) as an accordion —
// same interaction as the set-menu step: section headings collapsed by
// default, click to expand into the dishes (grouped by subsection where the
// source has them), each an add-to-cart row with its price.
//
// Only the sections belonging to the cuisines picked on the previous step
// (/menu-builder/cuisine) are listed — pick Drinks + Chaat + Soup and just
// those three cuisines' sections show up. No cuisine picked (deep link) → the
// full master menu, so the screen is never empty.
//
// No "choose N" limits here — add as many as you like. Continue unlocks once
// at least one dish is chosen. Selections reuse the shared ADD_DISH/REMOVE_DISH
// reducer (state.selectedDishes), keyed by the master item id.
// ═══════════════════════════════════════════════════════════════════════════

"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import BuilderLayout from "@/components/menu-builder/BuilderLayout";
import { useBooking } from "@/lib/menu-builder/context";
import { useCatalog } from "@/lib/menu-builder/catalog";
import { getSteps, menuStepIndex } from "@/lib/menu-builder/flow";
import { formatINR } from "@/lib/menu-builder/pricing";
import { MB_COLORS, type CustomMenuItem, type CustomMenuSection } from "@/lib/menu-builder/types";

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

export default function CustomMenuStep() {
  const { state, dispatch, hydrated } = useBooking();
  const { sectionsForCuisines, getCuisineCard } = useCatalog();
  const steps = getSteps(state);

  const [open, setOpen] = useState<Record<string, boolean>>({});
  const toggleSection = (id: string) => setOpen((p) => ({ ...p, [id]: !p[id] }));

  // Only the cuisines picked on the previous step (all of them pre-hydration,
  // so server and first client render agree).
  const cuisineIds = useMemo(
    () => (hydrated ? state.selectedCuisineCategories : []),
    [hydrated, state.selectedCuisineCategories],
  );
  const sections = useMemo(
    () => sectionsForCuisines(cuisineIds),
    [sectionsForCuisines, cuisineIds],
  );
  const cuisineNames = cuisineIds
    .map((id) => getCuisineCard(id)?.name)
    .filter(Boolean) as string[];

  const selectedSet = new Set(state.selectedDishes.map((d) => d.dishId));
  const activeMeal = state.mealTypes[0] || "Dinner";

  const toggleItem = (id: string) => {
    if (selectedSet.has(id)) dispatch({ type: "REMOVE_DISH", dishId: id });
    else dispatch({ type: "ADD_DISH", dishId: id, mealType: activeMeal });
  };

  const totalSelected = state.selectedDishes.length;

  const sectionSelectedCount = (section: CustomMenuSection) =>
    section.subsections.reduce(
      (n, ss) => n + ss.items.filter((it) => selectedSet.has(it.id)).length,
      0,
    );

  return (
    <BuilderLayout
      steps={steps}
      currentStep={menuStepIndex(state, steps)}
      backHref="/menu-builder/cuisine"
      backLabel="Back to Cuisines"
      nextHref="/menu-builder/presentation"
      nextLabel="Next"
      nextDisabled={!hydrated || totalSelected === 0}
    >
      <div className={CARD_PADDING} style={{ backgroundColor: CARD_BG }}>
        <h2
          style={{ ...serif, color: INK }}
          className="text-[clamp(1.6rem,2.3vw,2.0625rem)] font-semibold"
        >
          Build Your Custom Menu
        </h2>
        <p style={{ color: INK_MUTED }} className="mt-1 text-sm">
          {cuisineNames.length > 0
            ? "Add the dishes you want from the cuisines you picked — no fixed package, no limits. "
            : "Browse every course and add the dishes you want — no fixed package, no limits. "}
          <span style={{ color: GOLD }}>
            {hydrated ? totalSelected : 0} selected
          </span>
          .
        </p>

        {cuisineNames.length > 0 && (
          <p style={{ color: INK_MUTED }} className="mt-3 text-xs">
            <span style={{ color: INK }}>Cuisines:</span> {cuisineNames.join(" · ")}{" "}
            <Link
              href="/menu-builder/cuisine"
              className="underline underline-offset-2"
              style={{ color: GOLD }}
            >
              Edit
            </Link>
          </p>
        )}

        <div className="mt-6 space-y-3">
          {sections.map((section) => {
            const isOpen = !!open[section.id];
            const count = hydrated ? sectionSelectedCount(section) : 0;
            return (
              <div
                key={section.id}
                className="overflow-hidden rounded-lg border"
                style={{ borderColor: isOpen ? GOLD : MB_COLORS.border }}
              >
                {/* Heading — click to expand / collapse */}
                <button
                  onClick={() => toggleSection(section.id)}
                  className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition-colors md:px-5"
                  style={{ backgroundColor: isOpen ? `${GOLD}12` : "transparent" }}
                  aria-expanded={isOpen}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <Chevron open={isOpen} />
                    <h3
                      style={{ ...serif, color: INK }}
                      className="text-[clamp(1.15rem,1.4vw,1.5rem)] font-semibold leading-tight"
                    >
                      {section.label}
                    </h3>
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

                {/* Items — only when expanded */}
                {isOpen && (
                  <div className="border-t px-4 md:px-5" style={{ borderColor: MB_COLORS.borderLight }}>
                    {section.subsections.map((sub, i) => (
                      <div key={i}>
                        {sub.label && (
                          <p
                            style={{ ...serif, color: INK }}
                            className="mt-4 text-base font-semibold tracking-wide"
                          >
                            {sub.label}
                          </p>
                        )}
                        <ul className="divide-y" style={{ borderColor: MB_COLORS.borderLight }}>
                          {sub.items.map((it) => (
                            <ItemRow
                              key={it.id}
                              item={it}
                              selected={hydrated && selectedSet.has(it.id)}
                              onToggle={() => toggleItem(it.id)}
                            />
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {totalSelected === 0 && (
          <p style={{ color: INK_MUTED }} className="mt-6 text-xs">
            Open a course above and add at least one dish to continue.
          </p>
        )}
      </div>
    </BuilderLayout>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────

function ItemRow({
  item,
  selected,
  onToggle,
}: {
  item: CustomMenuItem;
  selected: boolean;
  onToggle: () => void;
}) {
  const sub = item.traditionalName || item.description;
  return (
    <li className="flex items-center justify-between gap-4 py-3">
      <div className="min-w-0">
        <p style={{ ...serif, color: INK }} className="text-lg font-medium leading-tight">
          {item.name}
        </p>
        {sub && (
          <p style={{ color: INK_MUTED }} className="mt-0.5 line-clamp-1 text-xs">
            {sub}
          </p>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-3">
        {item.price != null && (
          <span style={{ color: GOLD }} className="text-sm font-medium">
            {formatINR(item.price)}
          </span>
        )}
        <AddToCartToggle selected={selected} onClick={onToggle} />
      </div>
    </li>
  );
}

function AddToCartToggle({ selected, onClick }: { selected: boolean; onClick: () => void }) {
  if (selected) {
    return (
      <button
        onClick={onClick}
        className="flex items-center gap-1.5 rounded border px-4 py-1.5 text-sm transition-colors"
        style={{ borderColor: GOLD, backgroundColor: `${GOLD}22`, color: INK }}
      >
        <svg className="w-[0.875rem] h-[0.875rem]" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth={3}>
          <polyline points="20 6 9 17 4 12" />
        </svg>
        <span>Added</span>
      </button>
    );
  }
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 rounded border px-4 py-1.5 text-sm transition-colors hover:bg-gray-50"
      style={{ borderColor: MB_COLORS.border, color: INK }}
    >
      <span style={{ color: GOLD }}>+</span>
      <span>Add</span>
    </button>
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
