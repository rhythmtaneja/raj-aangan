// ══════════════════════════════════════════════════════════════════
// PATH IN REPO: components/menu-builder/BookingSummary.tsx
// ══════════════════════════════════════════════════════════════════
// The sticky live-preview sidebar. Renders one of three variants:
//   • venue-event + set package → fields, total captioned with the menu name
//   • venue-event + custom menu → fields + selected dishes + per-head total
//   • outdoor                   → minimal: Client + Date (+ est. total)
// ═══════════════════════════════════════════════════════════════════════════

"use client";

import { useBooking } from "@/lib/menu-builder/context";
import { useCatalog } from "@/lib/menu-builder/catalog";
import { usePricingData } from "@/lib/menu-builder/catalog-hooks";
import { venueKindOf } from "@/lib/menu-builder/flow";
import {
  formatINR,
  getOutdoorEstimatedTotal,
  getOutdoorSubtotal,
  getVenueEventEstimatedTotal,
  getVenueEventPerHead,
  getVenueLogisticsPerHead,
  type PricingData,
} from "@/lib/menu-builder/pricing";
import { MB_COLORS, type WizardStep } from "@/lib/menu-builder/types";

const serif = { fontFamily: "var(--font-cormorant-garamond)" } as const;

// ═══════════════════════════════════════════════════════════════════════════
// ─── TUNE THESE KNOBS ──────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════

const TITLE_COLOR = MB_COLORS.ink;
const LABEL_COLOR = MB_COLORS.inkMuted;
const VALUE_COLOR = MB_COLORS.ink;
const ROW_LABEL_COLOR = MB_COLORS.ink;
const DIVIDER_COLOR = MB_COLORS.borderLight;
const GOLD = MB_COLORS.gold;

// ═══════════════════════════════════════════════════════════════════════════

type Props = {
  steps: WizardStep[];
  /** 1-based index of the current step within `steps`. */
  currentStep: number;
};

export default function BookingSummary({ currentStep }: Props) {
  const { state, hydrated } = useBooking();
  const { venues, occasions, getCustomItem, getSetMenu } = useCatalog();
  const pricingData = usePricingData();

  const outdoor = state.cateringType === "outdoor";

  return (
    <div>
      <h3
        style={{ ...serif, color: TITLE_COLOR }}
        className="text-[clamp(1.3rem,1.7vw,1.4375rem)] font-semibold"
      >
        Booking Summary
      </h3>
      <p style={{ color: LABEL_COLOR }} className="mt-1 text-xs uppercase tracking-widest">
        Live Preview
      </p>

      {outdoor ? (
        <OutdoorSummary
          hydrated={hydrated}
          state={state}
          currentStep={currentStep}
          pricingData={pricingData}
        />
      ) : (
        <VenueEventSummary
          hydrated={hydrated}
          state={state}
          currentStep={currentStep}
          venues={venues}
          occasions={occasions}
          pricingData={pricingData}
          getCustomItem={getCustomItem}
          getSetMenu={getSetMenu}
        />
      )}
    </div>
  );
}

// ─── Outdoor variant (minimal) ─────────────────────────────────────────────

function OutdoorSummary({
  hydrated,
  state,
  currentStep,
  pricingData,
}: {
  hydrated: boolean;
  state: ReturnType<typeof useBooking>["state"];
  currentStep: number;
  pricingData: PricingData;
}) {
  const itemCount = Object.values(state.catalogSelections).reduce((a, b) => a + b, 0);
  const showTotal = currentStep >= 2 && getOutdoorSubtotal(state, pricingData) > 0;

  return (
    <>
      <div className="mt-6">
        <Row label="Client" value={hydrated ? state.clientName || "—" : "—"} />
        <Row label="Date" value={hydrated ? state.eventDate || "—" : "—"} />
        {showTotal && <Row label="Items" value={String(itemCount)} />}
      </div>

      {showTotal && (
        <div className="mt-6">
          <TotalBlock
            total={getOutdoorEstimatedTotal(state, pricingData)}
            caption="incl. GST"
            subCaption={`${itemCount} item${itemCount === 1 ? "" : "s"} · bulk / delivery`}
          />
        </div>
      )}
    </>
  );
}

// ─── Venue-event variant (set package + custom) ────────────────────────────

function VenueEventSummary({
  hydrated,
  state,
  currentStep,
  venues,
  occasions,
  pricingData,
  getCustomItem,
  getSetMenu,
}: {
  hydrated: boolean;
  state: ReturnType<typeof useBooking>["state"];
  currentStep: number;
  venues: ReturnType<typeof useCatalog>["venues"];
  occasions: ReturnType<typeof useCatalog>["occasions"];
  pricingData: PricingData;
  getCustomItem: ReturnType<typeof useCatalog>["getCustomItem"];
  getSetMenu: ReturnType<typeof useCatalog>["getSetMenu"];
}) {
  const customMenu = state.menuMode === "custom";
  const venue = state.venueId ? venues.find((v) => v.id === state.venueId) : null;
  const occasionsLabel =
    state.occasions.length > 0
      ? state.occasions
          .map((id) => occasions.find((o) => o.id === id)?.label)
          .filter((label): label is string => Boolean(label))
          .join(", ")
      : null;
  const setMenu = getSetMenu(state.selectedSetMenuId);

  const showItemsAndTotal = currentStep >= 3;

  const perHead =
    getVenueEventPerHead(state, pricingData) + getVenueLogisticsPerHead(state, venues);
  const total = getVenueEventEstimatedTotal(state, pricingData);

  return (
    <>
      <div className="mt-6">
        <Row label="Client" value={hydrated ? state.clientName || "—" : "—"} />
        <Row label="Occasion" value={hydrated ? occasionsLabel || "—" : "—"} />
        <Row label="Date" value={hydrated ? state.eventDate || "—" : "—"} />
        <Row label="Guests" value={hydrated ? String(state.guests) : "—"} />
        <Row label="Venue" value={hydrated ? venue?.name || state.customVenueAddress || "—" : "—"} />
        <Row label="Meal" value={hydrated ? state.mealTypes.join(", ") || "—" : "—"} />
        <Row label="Diet" value={hydrated ? state.dietaryPreferences.join(", ") || "—" : "—"} />
      </div>

      {/* Custom menu: selected dishes list */}
      {customMenu && showItemsAndTotal && state.selectedDishes.length > 0 && (
        <>
          <Divider />
          <h4
            style={{ ...serif, color: TITLE_COLOR }}
            className="mb-3 text-base font-semibold tracking-wide"
          >
            Selected Item{" "}
            <span style={{ color: LABEL_COLOR }} className="font-normal normal-case">
              {state.selectedDishes.length} Items
            </span>
          </h4>
          <ul className="space-y-2">
            {state.selectedDishes.map(({ dishId }) => {
              const item = getCustomItem(dishId);
              if (!item) return null;
              return (
                <li
                  key={dishId}
                  className="flex items-center justify-between text-[clamp(0.8rem,0.85vw,0.75rem)]"
                  style={{ color: VALUE_COLOR }}
                >
                  <span className="truncate pr-2">
                    {item.name}
                    {item.price != null && (
                      <span style={{ color: GOLD }} className="ml-2">/ ₹{item.price}</span>
                    )}
                  </span>
                  <RemoveButton dishId={dishId} />
                </li>
              );
            })}
          </ul>
        </>
      )}

      {showItemsAndTotal && (
        <>
          <Divider />
          <TotalBlock
            total={total}
            caption={
              !customMenu && setMenu
                ? `incl. GST · ${setMenu.name}`
                : `incl. GST · ${formatINR(perHead)}/head`
            }
            subCaption={
              `${state.guests} guests · ${state.eventDays} day${state.eventDays > 1 ? "s" : ""}` +
              (venueKindOf(venue) === "partner"
                ? " · Partner venue"
                : venue
                  ? " · RAEC owned"
                  : "")
            }
          />
        </>
      )}
    </>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────

function TotalBlock({
  total,
  caption,
  subCaption,
}: {
  total: number;
  caption: string;
  subCaption: string;
}) {
  return (
    <div>
      <h4
        style={{ ...serif, color: TITLE_COLOR }}
        className="text-base font-semibold tracking-wide"
      >
        Estimated Total
      </h4>
      <p
        style={{ ...serif, color: GOLD }}
        className="mt-2 text-[clamp(1.6rem,2vw,1.8125rem)] font-semibold leading-none"
      >
        {formatINR(total)}
      </p>
      <p style={{ color: LABEL_COLOR }} className="mt-2 text-xs">
        {caption}
      </p>
      <p style={{ color: LABEL_COLOR }} className="text-xs">
        {subCaption}
      </p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-2 items-baseline gap-3 py-2.5 text-[clamp(0.9rem,1vw,0.9375rem)]">
      <span style={{ ...serif, color: ROW_LABEL_COLOR }}>{label}</span>
      <span style={{ ...serif, color: VALUE_COLOR }} className="truncate">
        {value}
      </span>
    </div>
  );
}

function Divider() {
  return <div className="my-5 h-px w-full" style={{ backgroundColor: DIVIDER_COLOR }} />;
}

function RemoveButton({ dishId }: { dishId: string }) {
  const { dispatch } = useBooking();
  return (
    <button
      onClick={() => dispatch({ type: "REMOVE_DISH", dishId })}
      className="ml-2 shrink-0 text-lg leading-none hover:opacity-70"
      style={{ color: LABEL_COLOR }}
      aria-label="Remove item"
    >
      ×
    </button>
  );
}
