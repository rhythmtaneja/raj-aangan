// ══════════════════════════════════════════════════════════════════
// PATH IN REPO: app/menu-builder/cuisine/page.tsx
// ══════════════════════════════════════════════════════════════════
// Custom builder — step 1 of 2, reached from the "Build a Custom Menu" CTA on
// the Menu step. Picks meal type(s) + cuisine categories; the categories chosen
// here are exactly what /menu-builder/custom-menu then lists (see
// lib/menu-builder/cuisine-groups.ts for the card → master-menu-section map).
//
// The per-person budget block from the original design is deliberately gone —
// custom menus price by the dishes chosen.
//
// This is its own step in the progress bar (Cuisine, before Menu) whenever
// menuMode === "custom" — see STEPS_VENUE_EVENT_CUSTOM in types.ts.
// ═══════════════════════════════════════════════════════════════════════════

"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import BuilderLayout from "@/components/menu-builder/BuilderLayout";
import { useBooking } from "@/lib/menu-builder/context";
import { CUISINE_CARDS, itemIdsForCuisine } from "@/lib/menu-builder/cuisine-groups";
import { getSteps, stepIndexOf } from "@/lib/menu-builder/flow";
import { MB_COLORS, MEAL_TYPES, type MealType } from "@/lib/menu-builder/types";

const serif = { fontFamily: "var(--font-cormorant-garamond)" } as const;

// ═══════════════════════════════════════════════════════════════════════════
// ─── TUNE THESE KNOBS ──────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════

const CARD_BG = MB_COLORS.card;
const INK = MB_COLORS.ink;
const INK_MUTED = MB_COLORS.inkMuted;
const GOLD = MB_COLORS.gold;
const CARD_PADDING = "p-5 md:p-10";

// Cuisine card — 293 × 299 px in the Figma. The grid never stretches a card
// past 293px wide; below that it shrinks (min 150px) and keeps the ratio.
const CAT_CARD_W = 293;
const CAT_CARD_H = 299;
const CAT_CARD_MIN_W = 150;
const CAT_LABEL_PAD = "px-3 py-2.5";

// ═══════════════════════════════════════════════════════════════════════════

export default function CustomCuisinePage() {
  const { state, dispatch, hydrated } = useBooking();
  const router = useRouter();

  // Route protection — venue-event flow with a venue selected.
  useEffect(() => {
    if (!hydrated) return;
    if (state.cateringType !== "venue-event") {
      router.replace("/menu-builder/client");
    } else if (!state.venueId && !state.customVenueAddress.trim()) {
      router.replace("/menu-builder/venue");
    }
  }, [hydrated, state.cateringType, state.venueId, state.customVenueAddress, router]);

  // Landing here IS opting into the custom builder (covers deep links and
  // browser-back), which is what puts Cuisine in the progress bar.
  useEffect(() => {
    if (!hydrated) return;
    if (state.menuMode !== "custom") {
      dispatch({ type: "SET_FIELD", field: "menuMode", value: "custom" });
    }
  }, [hydrated, state.menuMode, dispatch]);

  const steps = getSteps(state);
  const selectedCuisines = hydrated ? state.selectedCuisineCategories : [];

  const toggleMeal = (meal: MealType) =>
    dispatch({ type: "TOGGLE_ARRAY", field: "mealTypes", value: meal });

  const toggleCategory = (id: string) => {
    const removing = state.selectedCuisineCategories.includes(id);
    dispatch({ type: "TOGGLE_ARRAY", field: "selectedCuisineCategories", value: id });
    // Dropping a cuisine drops any dish already picked from it, so the summary
    // and the quote never carry dishes the guest can no longer see.
    if (removing) {
      const gone = new Set(itemIdsForCuisine(id));
      state.selectedDishes
        .filter((d) => gone.has(d.dishId))
        .forEach((d) => dispatch({ type: "REMOVE_DISH", dishId: d.dishId }));
    }
  };

  return (
    <BuilderLayout
      steps={steps}
      currentStep={stepIndexOf(steps, "cuisine")}
      backHref="/menu-builder/menu"
      backLabel="Back to Set Menus"
      nextHref="/menu-builder/custom-menu"
      nextLabel="Build Menu"
      nextDisabled={!hydrated || selectedCuisines.length === 0}
    >
      <div className={CARD_PADDING} style={{ backgroundColor: CARD_BG }}>
        <h2
          style={{ ...serif, color: INK }}
          className="text-[clamp(1.6rem,2.3vw,33px)] font-semibold"
        >
          Cuisine Preferences
        </h2>
        <p style={{ color: INK_MUTED }} className="mt-1 text-sm">
          Pick all that apply — the next step shows the menu items for each
          category you choose.
        </p>

        {/* MEAL TYPE PILLS */}
        <div className="mt-6 flex flex-wrap gap-3">
          {MEAL_TYPES.map((m) => (
            <Pill
              key={m}
              selected={hydrated && state.mealTypes.includes(m)}
              onClick={() => toggleMeal(m)}
            >
              {m}
            </Pill>
          ))}
        </div>

        {/* CUISINE CATEGORIES */}
        <h3
          style={{ ...serif, color: INK }}
          className="mt-10 text-[clamp(1.4rem,2vw,29px)] font-semibold"
        >
          Select Cuisine Categories
        </h3>
        <div className="mt-2 h-px w-full" style={{ backgroundColor: GOLD }} />

        <div
          className="mt-5 grid gap-4 sm:gap-5"
          style={{
            gridTemplateColumns: `repeat(auto-fill, minmax(min(100%, ${CAT_CARD_MIN_W}px), ${CAT_CARD_W}px))`,
          }}
        >
          {CUISINE_CARDS.map((cat) => {
            const selected = selectedCuisines.includes(cat.id);
            return (
              <button
                key={cat.id}
                onClick={() => toggleCategory(cat.id)}
                aria-pressed={selected}
                className="group relative w-full overflow-hidden text-left"
                style={{
                  maxWidth: CAT_CARD_W,
                  aspectRatio: `${CAT_CARD_W} / ${CAT_CARD_H}`,
                  borderRadius: 6,
                  outline: selected ? `2px solid ${GOLD}` : "none",
                  outlineOffset: -2,
                }}
              >
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes={`(max-width: 640px) 50vw, ${CAT_CARD_W}px`}
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute z-10"
                  style={{ inset: "8px", border: "1px solid rgba(255,255,255,0.5)" }}
                />
                {selected && <SelectedTick />}
                <div
                  className={`absolute inset-x-0 bottom-0 z-20 flex flex-col bg-white/95 ${CAT_LABEL_PAD}`}
                >
                  <span
                    style={{ ...serif, color: selected ? GOLD : INK }}
                    className="text-sm font-medium leading-tight"
                  >
                    {cat.name}
                  </span>
                  <span style={{ color: INK_MUTED }} className="text-[11px]">
                    {cat.itemCount} {cat.itemCount === 1 ? "Item" : "Items"}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <p style={{ color: INK_MUTED }} className="mt-6 text-xs">
          {selectedCuisines.length === 0
            ? "Select at least one category to continue."
            : `${selectedCuisines.length} ${
                selectedCuisines.length === 1 ? "category" : "categories"
              } selected — only these will appear in your menu.`}
        </p>
      </div>
    </BuilderLayout>
  );
}

// ─── Inline primitives ────────────────────────────────────────────────────

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

function SelectedTick() {
  return (
    <span
      className="absolute right-3 top-3 z-20 flex h-6 w-6 items-center justify-center rounded-full"
      style={{ backgroundColor: GOLD }}
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </span>
  );
}
