// ══════════════════════════════════════════════════════════════════
// PATH IN REPO: app/menu-builder/cuisine/page.tsx
// ══════════════════════════════════════════════════════════════════
// Custom builder — step 1 of 2. Reached from the "Build a Custom Menu" CTA on
// the Menu step. Picks meal type(s) + cuisine categories; the per-person
// budget section was removed (custom menus price by the dishes chosen). Both
// this and /custom-menu are sub-screens of the Menu step in the progress bar.
// ═══════════════════════════════════════════════════════════════════════════

"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import BuilderLayout from "@/components/menu-builder/BuilderLayout";
import { useBooking } from "@/lib/menu-builder/context";
import { useCatalog } from "@/lib/menu-builder/catalog";
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
const CARD_PADDING = "p-8 md:p-10";
const CAT_IMG_H = 130;

// ═══════════════════════════════════════════════════════════════════════════

export default function CustomCuisinePage() {
  const { state, dispatch, hydrated } = useBooking();
  const { cuisines } = useCatalog();
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

  const steps = getSteps(state);

  const toggleMeal = (meal: MealType) =>
    dispatch({ type: "TOGGLE_ARRAY", field: "mealTypes", value: meal });

  const toggleCategory = (id: string) =>
    dispatch({ type: "TOGGLE_ARRAY", field: "selectedCuisineCategories", value: id });

  return (
    <BuilderLayout
      steps={steps}
      currentStep={stepIndexOf(steps, "menu")}
      backHref="/menu-builder/menu"
      nextHref="/menu-builder/custom-menu"
      nextLabel="Build Menu"
    >
      <div className={CARD_PADDING} style={{ backgroundColor: CARD_BG }}>
        <h2
          style={{ ...serif, color: INK }}
          className="text-[clamp(1.6rem,2.3vw,33px)] font-semibold"
        >
          Cuisine Preferences
        </h2>
        <p style={{ color: INK_MUTED }} className="mt-1 text-sm">
          Pick all that apply — menu items will be shown per selection.
        </p>

        {/* MEAL TYPE PILLS */}
        <div className="mt-6 flex flex-wrap gap-3">
          {MEAL_TYPES.map((m) => (
            <Pill
              key={m}
              selected={state.mealTypes.includes(m)}
              onClick={() => toggleMeal(m)}
            >
              {m}
            </Pill>
          ))}
          <Pill selected={false} onClick={() => { /* placeholder: add function */ }}>
            + Add Function
          </Pill>
        </div>

        {/* CUISINE CATEGORIES */}
        <h3
          style={{ ...serif, color: INK }}
          className="mt-10 text-[clamp(1.4rem,2vw,29px)] font-semibold"
        >
          Select Cuisine Categories
        </h3>
        <div className="mt-2 h-px w-full" style={{ backgroundColor: GOLD }} />

        <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {cuisines.map((cat) => {
            const selected = hydrated && state.selectedCuisineCategories.includes(cat.id);
            return (
              <button
                key={cat.id}
                onClick={() => toggleCategory(cat.id)}
                className="group relative overflow-hidden text-left"
                style={{
                  height: CAT_IMG_H,
                  borderRadius: 6,
                  outline: selected ? `2px solid ${GOLD}` : "none",
                }}
              >
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 640px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute z-10"
                  style={{ inset: "8px", border: "1px solid rgba(255,255,255,0.5)" }}
                />
                <div className="absolute inset-x-0 bottom-0 z-20 flex flex-col bg-white/95 px-3 py-2">
                  <span
                    style={{ ...serif, color: selected ? GOLD : INK }}
                    className="text-sm font-medium"
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
