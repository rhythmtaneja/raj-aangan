// ══════════════════════════════════════════════════════════════════
// PATH IN REPO: components/menu-builder/SetMenuStep.tsx
// ══════════════════════════════════════════════════════════════════
// Sub-flow A (Raj Aangan) Set Menu step. A row of per-person pricing cards
// (text only — name + big gold price + "per person") picks one set menu;
// below it each course renders a "choose N" pill list with a live n/N badge
// and a hard cap. Continue is blocked until every course is filled.
// Matches docs/reference/screens/raj-aangan-set_menus.png.
// ═══════════════════════════════════════════════════════════════════════════

"use client";

import BuilderLayout from "@/components/menu-builder/BuilderLayout";
import { useBooking } from "@/lib/menu-builder/context";
import { SET_MENUS, getSetMenuById } from "@/lib/menu-builder/data";
import { formatINR } from "@/lib/menu-builder/pricing";
import {
  MB_COLORS,
  STEPS_VENUE_EVENT_SET_MENU,
  type SetMenu,
  type SetMenuSection,
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

const SET_MENU_STEP_INDEX = 3; // Client, Venue, [Set Menu], Presentation, Quote

export default function SetMenuStep() {
  const { state, dispatch, hydrated } = useBooking();

  const selectedId = state.selectedSetMenuId ?? SET_MENUS[0]?.id ?? null;
  const selectedMenu = getSetMenuById(selectedId);

  const pickMenu = (id: string) => dispatch({ type: "SET_SET_MENU", setMenuId: id });

  const toggleDish = (section: SetMenuSection, optionId: string) =>
    dispatch({
      type: "TOGGLE_SET_MENU_DISH",
      sectionId: section.id,
      optionId,
      chooseCount: section.chooseCount,
    });

  const sectionCount = (sectionId: string) =>
    state.setMenuSelections[sectionId]?.length ?? 0;

  const allSectionsComplete = Boolean(
    selectedMenu &&
      selectedMenu.sections.every((s) => sectionCount(s.id) === s.chooseCount),
  );

  return (
    <BuilderLayout
      steps={STEPS_VENUE_EVENT_SET_MENU}
      currentStep={SET_MENU_STEP_INDEX}
      backHref="/menu-builder/venue"
      nextHref="/menu-builder/presentation"
      nextLabel="Next"
      nextDisabled={!hydrated || !allSectionsComplete}
    >
      <div className={CARD_PADDING} style={{ backgroundColor: CARD_BG }}>
        <h2
          style={{ ...serif, color: INK }}
          className="text-[clamp(1.6rem,2.3vw,42px)] font-semibold"
        >
          Raj Aangan Set Menus
        </h2>
        <p style={{ color: INK_MUTED }} className="mt-1 text-sm">
          This property runs fixed, all-inclusive packages — pick one, then
          choose your dishes within it.
        </p>

        {/* Pricing cards (text only) */}
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {SET_MENUS.map((menu) => (
            <PricingCard
              key={menu.id}
              menu={menu}
              selected={hydrated && selectedId === menu.id}
              onClick={() => pickMenu(menu.id)}
            />
          ))}
        </div>

        {/* Section pickers for the selected menu */}
        {selectedMenu && (
          <div className="mt-10">
            <div className="mb-2 flex items-center gap-4">
              <p style={{ color: INK }} className="text-xs font-semibold uppercase tracking-widest">
                {selectedMenu.name} — Choose Your Dishes
              </p>
              <div className="h-px flex-1" style={{ backgroundColor: MB_COLORS.borderLight }} />
            </div>
            {selectedMenu.description && (
              <p style={{ color: INK_MUTED }} className="mb-6 text-sm">
                {selectedMenu.description}
              </p>
            )}

            <div className="space-y-8">
              {selectedMenu.sections.map((section) => {
                const chosen = state.setMenuSelections[section.id] ?? [];
                const atMax = chosen.length >= section.chooseCount;
                return (
                  <div key={section.id}>
                    <div className="flex items-center justify-between gap-4">
                      <h3
                        style={{ ...serif, color: INK }}
                        className="text-[clamp(1.2rem,1.5vw,26px)] font-semibold"
                      >
                        {section.label}
                      </h3>
                      <span
                        className="shrink-0 rounded-full px-3 py-1 text-xs font-medium"
                        style={{ backgroundColor: `${GOLD}22`, color: GOLD }}
                      >
                        {chosen.length}/{section.chooseCount} selected
                      </span>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-3">
                      {section.dishOptions.map((opt) => {
                        const isSelected = hydrated && chosen.includes(opt.id);
                        const disabled = !isSelected && atMax;
                        return (
                          <button
                            key={opt.id}
                            onClick={() => toggleDish(section, opt.id)}
                            disabled={disabled}
                            className="rounded-full px-5 py-2 text-sm transition-colors"
                            style={{
                              backgroundColor: isSelected ? GOLD : "transparent",
                              color: isSelected ? "#ffffff" : disabled ? MB_COLORS.inkLight : INK,
                              border: `1px solid ${isSelected ? GOLD : MB_COLORS.border}`,
                              opacity: disabled ? 0.5 : 1,
                              cursor: disabled ? "not-allowed" : "pointer",
                            }}
                          >
                            {opt.name}
                            {opt.subtitle && (
                              <span className="ml-1 opacity-70">· {opt.subtitle}</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {!allSectionsComplete && (
              <p style={{ color: INK_MUTED }} className="mt-8 text-xs">
                Complete every course to continue.
              </p>
            )}
          </div>
        )}
      </div>
    </BuilderLayout>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────

function PricingCard({
  menu,
  selected,
  onClick,
}: {
  menu: SetMenu;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col rounded-lg border p-5 text-left transition-colors"
      style={{
        borderColor: selected ? GOLD : MB_COLORS.border,
        backgroundColor: selected ? `${GOLD}1f` : "transparent",
        outline: selected ? `1px solid ${GOLD}` : "none",
      }}
    >
      <p style={{ ...serif, color: INK }} className="text-base font-semibold leading-tight">
        {menu.name}
      </p>
      <p style={{ ...serif, color: GOLD }} className="mt-3 text-[clamp(1.5rem,1.9vw,32px)] font-semibold leading-none">
        {formatINR(menu.perPersonPrice)}
      </p>
      <p style={{ color: INK_MUTED }} className="mt-2 text-xs">
        per person
      </p>
    </button>
  );
}
