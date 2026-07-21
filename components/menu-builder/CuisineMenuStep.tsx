// ══════════════════════════════════════════════════════════════════
// PATH IN REPO: components/menu-builder/CuisineMenuStep.tsx
// ══════════════════════════════════════════════════════════════════
// Sub-flow B Menu step. Dishes are filtered by the cuisines chosen on the
// previous step (via each dish's cuisineCategoryId), plus meal-type function
// chips and a dietary/tag filter row. Cutlery / presentation / stalls now
// live on the separate Presentation step, so they're gone from here.
// ═══════════════════════════════════════════════════════════════════════════

"use client";

import { useState } from "react";
import BuilderLayout from "@/components/menu-builder/BuilderLayout";
import { useBooking } from "@/lib/menu-builder/context";
import { useCatalog } from "@/lib/menu-builder/catalog";
import { getSteps, stepIndexOf } from "@/lib/menu-builder/flow";
import {
  DISH_FILTER_TAGS,
  MB_COLORS,
  MEAL_TYPES,
  type Dish,
  type DishTag,
  type MealType,
} from "@/lib/menu-builder/types";

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

export default function CuisineMenuStep() {
  const { state, dispatch, hydrated } = useBooking();
  const { dishes, cuisines, venues } = useCatalog();

  const steps = getSteps(state, venues);

  const [activeFilter, setActiveFilter] = useState<DishTag | "All">("All");
  const [activeMeal, setActiveMeal] = useState<MealType>(state.mealTypes[0] || "Lunch");

  const toggleDish = (dishId: string) => {
    const already = state.selectedDishes.some((d) => d.dishId === dishId);
    if (already) dispatch({ type: "REMOVE_DISH", dishId });
    else dispatch({ type: "ADD_DISH", dishId, mealType: activeMeal });
  };

  // Filter by the cuisines chosen on the previous step (falling back to all
  // dishes if the user picked none), then by the active dietary/tag chip.
  const cuisineFiltered =
    state.selectedCuisineCategories.length > 0
      ? dishes.filter((d) => state.selectedCuisineCategories.includes(d.cuisineCategoryId))
      : dishes;

  const filteredDishes = cuisineFiltered.filter((d) =>
    activeFilter === "All" ? true : d.tags.includes(activeFilter as DishTag),
  );

  // Group dishes by their section (e.g. "Signature Welcome Elixirs")
  const grouped = filteredDishes.reduce<Record<string, Dish[]>>((acc, dish) => {
    (acc[dish.section] = acc[dish.section] || []).push(dish);
    return acc;
  }, {});

  const isDishSelected = (dishId: string) =>
    hydrated && state.selectedDishes.some((d) => d.dishId === dishId);

  const selectedCuisineNames = cuisines
    .filter((c) => state.selectedCuisineCategories.includes(c.id))
    .map((c) => c.name);

  return (
    <BuilderLayout
      steps={steps}
      currentStep={stepIndexOf(steps, "menu")}
      backHref="/menu-builder/cuisine"
      nextHref="/menu-builder/presentation"
      nextLabel="Next"
    >
      <div className={CARD_PADDING} style={{ backgroundColor: CARD_BG }}>
        <h2
          style={{ ...serif, color: INK }}
          className="text-[clamp(1.6rem,2.3vw,42px)] font-semibold"
        >
          Select Menu Items
        </h2>
        <p style={{ color: INK_MUTED }} className="mt-1 text-sm">
          {selectedCuisineNames.length > 0
            ? `Showing dishes for ${selectedCuisineNames.join(", ")}.`
            : "Select dishes per function. Prices update live based on pax count."}
        </p>

        {/* Meal-type function pills */}
        <div className="mt-6 flex flex-wrap gap-3">
          {MEAL_TYPES.map((m) => (
            <Pill key={m} selected={activeMeal === m} onClick={() => setActiveMeal(m)}>
              {m}
            </Pill>
          ))}
          <Pill selected={false} onClick={() => { /* placeholder: add function */ }}>
            + Add Function
          </Pill>
        </div>

        {/* Function summary bar */}
        <div
          className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded border px-4 py-3"
          style={{ borderColor: GOLD }}
        >
          <span style={{ color: INK }} className="text-sm">
            <strong>{activeMeal}</strong> — {hydrated ? state.guests : "—"} pax ·{" "}
            {state.selectedDishes.length} dishes selected
          </span>
        </div>

        {/* Dietary / tag filter chips */}
        <div className="mt-4 flex flex-wrap gap-2">
          <TagChip selected={activeFilter === "All"} onClick={() => setActiveFilter("All")}>
            All
          </TagChip>
          {DISH_FILTER_TAGS.map((tag) => (
            <TagChip key={tag} selected={activeFilter === tag} onClick={() => setActiveFilter(tag)}>
              {tag}
            </TagChip>
          ))}
        </div>

        {/* Dish list grouped by section */}
        {Object.keys(grouped).length === 0 ? (
          <p style={{ color: INK_MUTED }} className="mt-8 text-sm">
            No dishes match this filter. Try a different tag or add more cuisines.
          </p>
        ) : (
          <div className="mt-6 space-y-8">
            {Object.entries(grouped).map(([section, sectionDishes]) => (
              <div key={section}>
                <h3
                  style={{ ...serif, color: INK }}
                  className="text-[clamp(1.2rem,1.5vw,26px)] font-semibold"
                >
                  {section}
                </h3>
                <div className="mt-1 h-px w-full" style={{ backgroundColor: GOLD }} />

                <ul className="mt-3 divide-y" style={{ borderColor: MB_COLORS.borderLight }}>
                  {sectionDishes.map((dish) => (
                    <li key={dish.id} className="flex items-center justify-between gap-4 py-3">
                      <div className="min-w-0">
                        <p style={{ ...serif, color: INK }} className="text-lg font-medium">
                          {dish.name}
                        </p>
                        <p style={{ color: INK_MUTED }} className="text-xs">
                          {dish.subtitle}
                          {dish.subtitle && " / "}
                          <span style={{ color: GOLD }}>₹{dish.price}</span>
                        </p>
                      </div>
                      <DishToggle
                        selected={isDishSelected(dish.id)}
                        onClick={() => toggleDish(dish.id)}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </BuilderLayout>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────

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

function TagChip({
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
      className="rounded-full px-3 py-1 text-xs transition-colors"
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

function DishToggle({ selected, onClick }: { selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 rounded border px-4 py-1.5 text-sm transition-colors"
      style={{
        borderColor: selected ? GOLD : MB_COLORS.border,
        backgroundColor: selected ? `${GOLD}22` : "transparent",
        color: INK,
      }}
    >
      {selected ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth={3}>
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ) : (
        <>
          <span style={{ color: GOLD }}>+</span>
          <span>Add to cart</span>
        </>
      )}
    </button>
  );
}
