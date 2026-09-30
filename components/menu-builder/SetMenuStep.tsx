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

const CARD_BG = MB_COLORS.card;
const INK = MB_COLORS.ink;
const INK_MUTED = MB_COLORS.inkMuted;
const GOLD = MB_COLORS.gold;
const CARD_PADDING = "p-5 md:p-10";

const MENU_CARD_WIDTH = "15.25rem";
const MENU_CARD_GAP = "gap-8";
const MENU_CARD_HEIGHT = "md:h-[13.9375rem]";
const MENU_IMAGE_HEIGHT = "md:h-[10.3125rem]";

export default function SetMenuStep() {
  const { state, dispatch, hydrated } = useBooking();
  const { setMenus, getSetMenu } = useCatalog();
  const pricingData = usePricingData();
  const router = useRouter();

  const steps = getSteps(state);

  const selectedId = state.selectedSetMenuId;
  const selectedMenu = getSetMenu(selectedId);

  const addOnPrice = getAddOnPricePerItem(state, pricingData);

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const toggleSection = (id: string) =>
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));

  const pickMenu = (id: string) =>
    dispatch({ type: "SET_SET_MENU", setMenuId: id });

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

  const chosenIn = (sectionId: string): string[] =>
    state.setMenuSelections[sectionId] ?? [];

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

        <div
          className="mt-10 flex flex-col items-start gap-3 rounded-lg border border-dashed p-6 md:flex-row md:items-center md:justify-between"
          style={{ borderColor: GOLD, backgroundColor: `${GOLD}0d` }}
        >
          <div>
            <p
              style={{ ...serif, color: INK }}
              className="text-lg font-semibold"
            >
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

        {selectedMenu && (
          <div className="mt-10">
            <div className="mb-3 flex flex-col items-start gap-2 md:flex-row md:items-center md:gap-4">
              <h3
                style={{ ...serif, color: INK }}
                className="min-w-0 text-[clamp(1.15rem,1.7vw,1.375rem)] font-semibold leading-snug tracking-wide md:shrink-0"
              >
                {selectedMenu.name} — Choose Your Dishes
              </h3>
              <div
                className="hidden h-px flex-1 md:block"
                style={{ backgroundColor: "#e5e5e5" }}
              />
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
                    <button
                      onClick={() => toggleSection(section.id)}
                      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors"
                      style={{
                        backgroundColor: isOpen ? `${GOLD}12` : "transparent",
                      }}
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
                            {section.chooseCount > 1
                              ? " (extras become add-ons)"
                              : ""}
                          </p>
                        </div>
                      </div>
                      <span
                        className="shrink-0 rounded-full px-3 py-1 text-xs font-medium"
                        style={{
                          backgroundColor: met
                            ? `${GOLD}22`
                            : MB_COLORS.borderLight,
                          color: met ? GOLD : INK_MUTED,
                        }}
                      >
                        {chosen.length}/{section.chooseCount}
                        {extra > 0 ? ` · +${extra} add-on` : ""}
                      </span>
                    </button>

                    {isOpen && (
                      <ul
                        className="divide-y border-t px-5"
                        style={{ borderColor: MB_COLORS.borderLight }}
                      >
                        {section.dishOptions.map((opt) => {
                          const idx = hydrated ? chosen.indexOf(opt.id) : -1;
                          const isSelected = idx >= 0;
                          const isAddOn =
                            isSelected && idx >= section.chooseCount;
                          return (
                            <li
                              key={opt.id}
                              className="flex items-center justify-between gap-4 py-3"
                            >
                              <div className="min-w-0">
                                <p
                                  style={{ ...serif, color: INK }}
                                  className="text-lg font-medium leading-tight"
                                >
                                  {opt.name}
                                </p>
                                {opt.subtitle && (
                                  <p
                                    style={{ color: INK_MUTED }}
                                    className="mt-0.5 line-clamp-1 text-xs"
                                  >
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
        boxShadow: selected
          ? `0 0 0 1px ${GOLD}`
          : "0 1px 3px rgba(0,0,0,0.06)",
      }}
    >
      <div
        className={`relative aspect-[1.48/1] w-full overflow-hidden bg-[#f4f0e8] ${MENU_IMAGE_HEIGHT}`}
      >
        <Image
          src={menu.coverImage}
          alt={menu.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 244px, 244px"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      </div>
      <div className="flex min-h-[3.25rem] items-center px-3 py-2.5">
        <span
          style={{ ...serif, color: GOLD }}
          className="text-sm font-medium leading-snug"
        >
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
        <svg
          className="w-[0.875rem] h-[0.875rem]"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke={GOLD}
          strokeWidth={3}
        >
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
