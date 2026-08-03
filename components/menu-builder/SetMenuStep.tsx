// ══════════════════════════════════════════════════════════════════
// PATH IN REPO: components/menu-builder/SetMenuStep.tsx
// ══════════════════════════════════════════════════════════════════
// The venue-event Menu step — shown for EVERY venue. Per-person pricing cards
// pick a fixed package; each course then renders its dishes in the same
// add-to-cart style as the custom builder (title + description + toggle).
//
// Soft "choose N" rule: the first N picks (in order) are included in the
// package price; any further picks are flagged as paid ADD-ONS and surcharge
// the package. Dish selection is optional, so guests can continue as soon as
// they choose a package.
// ═══════════════════════════════════════════════════════════════════════════

"use client";

import Image from "next/image";
import { useState, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import BuilderLayout from "@/components/menu-builder/BuilderLayout";
import { useBooking } from "@/lib/menu-builder/context";
import { useCatalog } from "@/lib/menu-builder/catalog";
import { usePricingData } from "@/lib/menu-builder/catalog-hooks";
import { getSteps, menuStepIndex } from "@/lib/menu-builder/flow";
import { formatINR, getAddOnPricePerItem } from "@/lib/menu-builder/pricing";
import {
  MB_COLORS,
  type SetMenu,
  type SetMenuSection,
} from "@/lib/menu-builder/types";

const serif = { fontFamily: "var(--font-cormorant-garamond)" } as const;

// ═══════════════════════════════════════════════════════════════════════════
// ─── TUNE THESE KNOBS ──────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════

const CARD_BG = MB_COLORS.card;
const INK = MB_COLORS.ink;
const INK_MUTED = MB_COLORS.inkMuted;
const GOLD = MB_COLORS.gold;
const CARD_PADDING = "p-5 md:p-10";
// Set-menu card knobs. Desktop dimensions match the Figma reference.
const MENU_CARD_WIDTH = "15.25rem";
const MENU_CARD_GAP = "gap-8";
const MENU_CARD_HEIGHT = "sm:h-[13.9375rem]";
const MENU_IMAGE_HEIGHT = "sm:h-[10.3125rem]";

// ═══════════════════════════════════════════════════════════════════════════

export default function SetMenuStep() {
  const { state, dispatch, hydrated } = useBooking();
  const { setMenus, getSetMenu } = useCatalog();
  const pricingData = usePricingData();
  const router = useRouter();

  // Step-set follows the mode: 5 steps on the set path, 6 (with Cuisine) once
  // the guest has opted into the custom builder.
  const steps = getSteps(state);

  const selectedId = state.selectedSetMenuId;
  const selectedMenu = getSetMenu(selectedId);
  // Surcharge per extra pick: the menu's own override, else the global setting.
  const addOnPrice = getAddOnPricePerItem(state, pricingData);

  // Accordion: which course sections are expanded. Collapsed by default so the
  // guest sees only headings; selections persist in state regardless.
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const toggleSection = (id: string) =>
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));

  const pickMenu = (id: string) => dispatch({ type: "SET_SET_MENU", setMenuId: id });

  // Custom path = cuisine categories first, then the dishes in those cuisines.
  const goCustom = () => {
    dispatch({ type: "SET_FIELD", field: "menuMode", value: "custom" });
    router.push("/menu-builder/cuisine");
  };

  const toggleDish = (section: SetMenuSection, optionId: string) =>
    dispatch({
      type: "TOGGLE_SET_MENU_DISH",
      sectionId: section.id,
      optionId,
      chooseCount: section.chooseCount,
    });

  const chosenIn = (sectionId: string): string[] => state.setMenuSelections[sectionId] ?? [];

  // Used only for the per-course selection status; selecting dishes is optional.
  const allSectionsComplete = Boolean(
    selectedMenu &&
    selectedMenu.sections.every((s) => chosenIn(s.id).length >= s.chooseCount),
  );

  return (
    <BuilderLayout
      steps={steps}
      currentStep={menuStepIndex(state, steps)}
      backHref="/menu-builder/venue"
      nextHref="/menu-builder/presentation"
      nextLabel="Next"
      nextDisabled={!hydrated || !selectedMenu}
    >
      <div className={CARD_PADDING} style={{ backgroundColor: CARD_BG }}>
        <h2
          style={{ ...serif, color: INK }}
          className="text-[clamp(1.6rem,2.3vw,2.0625rem)] font-semibold"
        >
          Choose Your Menu
        </h2>
        <p style={{ color: INK_MUTED }} className="mt-1 text-sm">
          Pick one of our fixed, all-inclusive packages, then choose your dishes
          per course. Extra picks beyond a course&apos;s limit are added as
          add-ons. Prefer full control? Build a custom menu instead.
        </p>

        {/* Fixed menu cards */}
        <div
          className={`mt-6 grid grid-cols-2 md:grid-cols-[repeat(2,minmax(0,var(--menu-card-width)))] md:grid-cols-[repeat(3,minmax(0,var(--menu-card-width)))] ${MENU_CARD_GAP}`}
          style={{ "--menu-card-width": MENU_CARD_WIDTH } as CSSProperties}
        >
          {setMenus.map((menu) => (
            <SetMenuCard
              key={menu.id}
              menu={menu}
              selected={hydrated && selectedId === menu.id}
              onClick={() => pickMenu(menu.id)}
            />
          ))}
        </div>

        {/* Custom builder CTA */}
        <div
          className="mt-10 flex flex-col items-start gap-3 rounded-lg border border-dashed p-6 sm:flex-row sm:items-center sm:justify-between"
          style={{ borderColor: GOLD, backgroundColor: `${GOLD}0d` }}
        >
          <div>
            <p style={{ ...serif, color: INK }} className="text-lg font-semibold">
              Don&apos;t want a fixed package?
            </p>
            <p style={{ color: INK_MUTED }} className="text-sm">
              Build your own menu by selecting each dish from scratch.
            </p>
          </div>
          <button
            onClick={goCustom}
            className="shrink-0 rounded-full border px-6 py-2.5 text-sm font-medium transition-colors hover:bg-white"
            style={{ borderColor: GOLD, color: GOLD }}
          >
            Build a Custom Menu →
          </button>
        </div>

        {/* Section pickers for the selected menu */}
        {selectedMenu && (
          <div className="mt-10">
            <div className="mb-3 flex items-center gap-4">
              <h3
                style={{ ...serif, color: INK }}
                className="shrink-0 text-[clamp(1.15rem,1.7vw,1.375rem)] font-semibold tracking-wide"
              >
                {selectedMenu.name} — Choose Your Dishes
              </h3>
              <div className="h-px flex-1" style={{ backgroundColor: "#e5e5e5" }} />
            </div>
            {selectedMenu.description && (
              <p style={{ color: INK_MUTED }} className="mb-6 text-sm">
                {selectedMenu.description}
              </p>
            )}

            <div className="space-y-3">
              {selectedMenu.sections.map((section) => {
                const chosen = chosenIn(section.id);
                const extra = Math.max(0, chosen.length - section.chooseCount);
                const met = chosen.length >= section.chooseCount;
                const isOpen = !!openSections[section.id];
                return (
                  <div
                    key={section.id}
                    className="overflow-hidden rounded-lg border"
                    style={{ borderColor: isOpen ? GOLD : MB_COLORS.border }}
                  >
                    {/* Heading — click to expand / collapse */}
                    <button
                      onClick={() => toggleSection(section.id)}
                      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors"
                      style={{ backgroundColor: isOpen ? `${GOLD}12` : "transparent" }}
                      aria-expanded={isOpen}
                    >
                      <div className="flex items-center gap-3">
                        <Chevron open={isOpen} />
                        <div>
                          <h3
                            style={{ ...serif, color: INK }}
                            className="text-[clamp(1.15rem,1.4vw,1.25rem)] font-semibold leading-tight"
                          >
                            {section.label}
                          </h3>
                          <p style={{ color: INK_MUTED }} className="text-xs">
                            Choose any {section.chooseCount}
                            {section.chooseCount > 1 ? " (extras become add-ons)" : ""}
                          </p>
                        </div>
                      </div>
                      <span
                        className="shrink-0 rounded-full px-3 py-1 text-xs font-medium"
                        style={{
                          backgroundColor: met ? `${GOLD}22` : MB_COLORS.borderLight,
                          color: met ? GOLD : INK_MUTED,
                        }}
                      >
                        {chosen.length}/{section.chooseCount}
                        {extra > 0 ? ` · +${extra} add-on` : ""}
                      </span>
                    </button>

                    {/* Items — only when expanded */}
                    {isOpen && (
                      <ul
                        className="divide-y border-t px-5"
                        style={{ borderColor: MB_COLORS.borderLight }}
                      >
                        {section.dishOptions.map((opt) => {
                          const idx = hydrated ? chosen.indexOf(opt.id) : -1;
                          const isSelected = idx >= 0;
                          const isAddOn = isSelected && idx >= section.chooseCount;
                          return (
                            <li key={opt.id} className="flex items-center justify-between gap-4 py-3">
                              <div className="min-w-0">
                                <p style={{ ...serif, color: INK }} className="text-lg font-medium leading-tight">
                                  {opt.name}
                                </p>
                                {opt.subtitle && (
                                  <p style={{ color: INK_MUTED }} className="mt-0.5 line-clamp-1 text-xs">
                                    {opt.subtitle}
                                  </p>
                                )}
                              </div>
                              <AddToCartToggle
                                selected={isSelected}
                                isAddOn={isAddOn}
                                addOnPrice={addOnPrice}
                                onClick={() => toggleDish(section, opt.id)}
                              />
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>

            {!allSectionsComplete && (
              <p style={{ color: INK_MUTED }} className="mt-8 text-xs">
                Dish choices are optional — you can continue now or select items
                from any course before moving on.
              </p>
            )}
          </div>
        )}
      </div>
    </BuilderLayout>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────

function SetMenuCard({
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
      className={`group overflow-hidden rounded-[0.625rem] border text-left transition-all ${MENU_CARD_HEIGHT}`}
      style={{
        borderColor: selected ? GOLD : MB_COLORS.border,
        backgroundColor: MB_COLORS.cardCream,
        boxShadow: selected ? `0 0 0 1px ${GOLD}` : "0 1px 3px rgba(0,0,0,0.06)",
      }}
    >
      <div className={`relative aspect-[1.48/1] w-full overflow-hidden bg-[#f4f0e8] ${MENU_IMAGE_HEIGHT}`}>
        <Image
          src={menu.coverImage}
          alt={menu.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 244px, 244px"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      </div>
      <div className="flex min-h-[3.25rem] items-center px-3 py-2.5">
        <span style={{ ...serif, color: GOLD }} className="text-sm font-medium leading-snug">
          {menu.name}
        </span>
      </div>
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

function AddToCartToggle({
  selected,
  isAddOn,
  addOnPrice,
  onClick,
}: {
  selected: boolean;
  isAddOn: boolean;
  /** Per-head surcharge for an extra pick (Sanity: menu override → settings). */
  addOnPrice: number;
  onClick: () => void;
}) {
  if (selected) {
    return (
      <button
        onClick={onClick}
        className="flex shrink-0 items-center gap-1.5 rounded border px-4 py-1.5 text-sm transition-colors"
        style={{ borderColor: GOLD, backgroundColor: `${GOLD}22`, color: INK }}
        title={isAddOn ? `Add-on · +${formatINR(addOnPrice)}/head` : "Included"}
      >
        <svg className="w-[0.875rem] h-[0.875rem]" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth={3}>
          <polyline points="20 6 9 17 4 12" />
        </svg>
        {isAddOn ? (
          <span style={{ color: GOLD }} className="font-medium">
            Add-on +{formatINR(addOnPrice)}
          </span>
        ) : (
          <span>Added</span>
        )}
      </button>
    );
  }
  return (
    <button
      onClick={onClick}
      className="flex shrink-0 items-center gap-1.5 rounded border px-4 py-1.5 text-sm transition-colors hover:bg-gray-50"
      style={{ borderColor: MB_COLORS.border, color: INK }}
    >
      <span style={{ color: GOLD }}>+</span>
      <span>Add</span>
    </button>
  );
}
