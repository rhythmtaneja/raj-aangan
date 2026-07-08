// ══════════════════════════════════════════════════════════════════
// PATH IN REPO: app/menu-builder/menu/page.tsx
// ⚠️  RENAME THIS FILE TO page.tsx BEFORE PLACING IN THE FOLDER
// ══════════════════════════════════════════════════════════════════
//
// NOTE (from Claude): This step was NOT in the 5 screenshots you sent.
// It's best-guess based on the flow, matching the visual language of the
// other steps. Sections included per your answer #6 (fold Cutlery /
// Presentation / Stall Themes into Step 4):
//   1. Meal-type filter pills at top
//   2. Dish list grouped by "section" (e.g. "Signature Welcome Elixirs")
//      with tag filters, ₹price, and Add to cart / checkmark toggle
//   3. Cutlery choices (6 photo cards)
//   4. Presentation Style choices (6 photo cards)
//   5. Stall Themes (6 photo cards)
//   6. Live Counter Design (pills)
// Retune once you send the actual Figma for this screen.
//
// ═══════════════════════════════════════════════════════════════════════════

"use client";

import { useState } from "react";
import Image from "next/image";
import BuilderLayout from "@/components/menu-builder/BuilderLayout";
import { useBooking } from "@/lib/menu-builder/context";
import {
  CUTLERY_OPTIONS,
  DISHES,
  LIVE_COUNTERS,
  PRESENTATION_STYLES,
  STALL_THEMES,
} from "@/lib/menu-builder/data";
import {
  DISH_FILTER_TAGS,
  MB_COLORS,
  MEAL_TYPES,
  type DishTag,
  type MealType,
} from "@/lib/menu-builder/types";

const serif = { fontFamily: "var(--font-cormorant-garamond)" } as const;

// ═══════════════════════════════════════════════════════════════════════════
// ─── TUNE THESE KNOBS ──────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════

const CARD_BG        = MB_COLORS.card;
const INK            = MB_COLORS.ink;
const INK_MUTED      = MB_COLORS.inkMuted;
const GOLD           = MB_COLORS.gold;
const CARD_PADDING   = "p-8 md:p-10";
const ADDON_IMG_H    = 130;

// ═══════════════════════════════════════════════════════════════════════════

export default function Step4MenuPage() {
  const { state, dispatch, hydrated } = useBooking();
  const [activeFilter, setActiveFilter] = useState<DishTag | "All">("All");
  const [activeMeal, setActiveMeal] = useState<MealType>(state.mealTypes[0] || "Lunch");

  const toggleDish = (dishId: string) => {
    const already = state.selectedDishes.some((d) => d.dishId === dishId);
    if (already) dispatch({ type: "REMOVE_DISH", dishId });
    else dispatch({ type: "ADD_DISH", dishId, mealType: activeMeal });
  };

  const filteredDishes = DISHES.filter((d) =>
    activeFilter === "All" ? true : d.tags.includes(activeFilter as DishTag)
  );

  // Group dishes by their section (e.g. "Signature Welcome Elixirs")
  const grouped = filteredDishes.reduce<Record<string, typeof DISHES>>((acc, dish) => {
    (acc[dish.section] = acc[dish.section] || []).push(dish);
    return acc;
  }, {});

  const isDishSelected = (dishId: string) =>
    hydrated && state.selectedDishes.some((d) => d.dishId === dishId);

  return (
    <BuilderLayout
      currentStep={4}
      backHref="/menu-builder/cuisine"
      nextHref="/menu-builder/quote"
      nextLabel="Review & Quote"
    >
      <div className={CARD_PADDING} style={{ backgroundColor: CARD_BG }}>
        <h2
          style={{ ...serif, color: INK }}
          className="text-[clamp(1.6rem,2.3vw,42px)] font-semibold"
        >
          Select Menu Items
        </h2>
        <p style={{ color: INK_MUTED }} className="mt-1 text-sm">
          Select dishes per function. Prices update live based on pax count.
        </p>

        {/* Meal-type function pills */}
        <div className="mt-6 flex flex-wrap gap-3">
          {MEAL_TYPES.map((m) => (
            <Pill
              key={m}
              selected={activeMeal === m}
              onClick={() => setActiveMeal(m)}
            >
              {m}
            </Pill>
          ))}
          <Pill selected={false} onClick={() => { /* placeholder */ }}>
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

        {/* Dish filter chips */}
        <div className="mt-4 flex flex-wrap gap-2">
          <TagChip
            selected={activeFilter === "All"}
            onClick={() => setActiveFilter("All")}
          >
            All
          </TagChip>
          {DISH_FILTER_TAGS.map((tag) => (
            <TagChip
              key={tag}
              selected={activeFilter === tag}
              onClick={() => setActiveFilter(tag)}
            >
              {tag}
            </TagChip>
          ))}
        </div>

        {/* Dish list grouped by section */}
        <div className="mt-6 space-y-8">
          {Object.entries(grouped).map(([section, dishes]) => (
            <div key={section}>
              <h3
                style={{ ...serif, color: INK }}
                className="text-[clamp(1.2rem,1.5vw,26px)] font-semibold"
              >
                {section}
              </h3>
              <div className="mt-1 h-px w-full" style={{ backgroundColor: GOLD }} />

              <ul className="mt-3 divide-y" style={{ borderColor: MB_COLORS.borderLight }}>
                {dishes.map((dish) => (
                  <li
                    key={dish.id}
                    className="flex items-center justify-between gap-4 py-3"
                  >
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

        {/* ═══ Cutlery / Presentation / Stalls (per user answer #6) ══════════ */}

        <h2
          style={{ ...serif, color: INK }}
          className="mt-16 text-[clamp(1.6rem,2.3vw,42px)] font-semibold"
        >
          Choose your Cutlery, Presentation & Stall Themes
        </h2>
        <p style={{ color: INK_MUTED }} className="mt-1 text-sm">
          Visual add-ons that complement your selected menu and elevate the experience.
        </p>

        <PhotoGridSection
          title="Cutlery"
          items={CUTLERY_OPTIONS}
          selectedIds={hydrated ? state.cutleryIds : []}
          onToggle={(id) => dispatch({ type: "TOGGLE_ARRAY", field: "cutleryIds", value: id })}
        />

        <PhotoGridSection
          title="Presentation Style"
          items={PRESENTATION_STYLES}
          selectedIds={hydrated ? state.presentationStyleIds : []}
          onToggle={(id) => dispatch({ type: "TOGGLE_ARRAY", field: "presentationStyleIds", value: id })}
        />

        <h3
          style={{ ...serif, color: INK }}
          className="mt-10 text-[clamp(1.4rem,2vw,36px)] font-semibold"
        >
          Stall Themes
        </h3>
        <PhotoGrid
          items={STALL_THEMES}
          selectedIds={hydrated ? state.stallThemeIds : []}
          onToggle={(id) => dispatch({ type: "TOGGLE_ARRAY", field: "stallThemeIds", value: id })}
        />

        <h3
          style={{ ...serif, color: INK }}
          className="mt-10 text-[clamp(1.4rem,2vw,36px)] font-semibold"
        >
          Live Counter Design
        </h3>
        <div className="mt-3 h-px w-full" style={{ backgroundColor: GOLD }} />
        <div className="mt-4 flex flex-wrap gap-3">
          {LIVE_COUNTERS.map((lc) => (
            <Pill
              key={lc.id}
              selected={hydrated && state.liveCounterIds.includes(lc.id)}
              onClick={() => dispatch({ type: "TOGGLE_ARRAY", field: "liveCounterIds", value: lc.id })}
            >
              {lc.name}
            </Pill>
          ))}
        </div>
      </div>
    </BuilderLayout>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────

function PhotoGridSection({
  title,
  items,
  selectedIds,
  onToggle,
}: {
  title: string;
  items: { id: string; name: string; image: string }[];
  selectedIds: string[];
  onToggle: (id: string) => void;
}) {
  return (
    <>
      <div className="mt-8 mb-4 flex items-center gap-4">
        <p style={{ color: INK }} className="text-xs font-semibold uppercase tracking-widest">
          {title}
        </p>
        <div className="h-px flex-1" style={{ backgroundColor: GOLD }} />
      </div>
      <PhotoGrid items={items} selectedIds={selectedIds} onToggle={onToggle} />
    </>
  );
}

function PhotoGrid({
  items,
  selectedIds,
  onToggle,
}: {
  items: { id: string; name: string; image: string }[];
  selectedIds: string[];
  onToggle: (id: string) => void;
}) {
  return (
    <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
      {items.map((it) => {
        const selected = selectedIds.includes(it.id);
        return (
          <button
            key={it.id}
            onClick={() => onToggle(it.id)}
            className="group relative overflow-hidden text-left"
            style={{
              height: ADDON_IMG_H,
              borderRadius: 6,
              outline: selected ? `2px solid ${GOLD}` : "none",
            }}
          >
            <Image
              src={it.image}
              alt={it.name}
              fill
              sizes="(max-width: 640px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute z-10"
              style={{ inset: "8px", border: "1px solid rgba(255,255,255,0.5)" }}
            />
            <div className="absolute inset-x-0 bottom-0 z-20 bg-white/95 px-3 py-2">
              <span
                style={{ ...serif, color: selected ? GOLD : INK }}
                className="text-sm font-medium"
              >
                {it.name}
              </span>
            </div>
          </button>
        );
      })}
    </div>
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

function DishToggle({
  selected,
  onClick,
}: {
  selected: boolean;
  onClick: () => void;
}) {
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
        <>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth={3}>
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </>
      ) : (
        <>
          <span style={{ color: GOLD }}>+</span>
          <span>Add to cart</span>
        </>
      )}
    </button>
  );
}
