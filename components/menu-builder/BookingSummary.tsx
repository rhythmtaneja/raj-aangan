// ══════════════════════════════════════════════════════════════════
// PATH IN REPO: components/menu-builder/BookingSummary.tsx
// ══════════════════════════════════════════════════════════════════
// The sticky live-preview sidebar. Now renders one of three variants based
// on the active sub-flow:
//   • venue-event + cuisine    → full: fields + selected dishes + est. total
//   • venue-event + set-menu   → fields (set-menu name replaces "Meal")
//   • outdoor                  → minimal: Client + Date (+ est. total)
// ═══════════════════════════════════════════════════════════════════════════

"use client";

import { useBooking } from "@/lib/menu-builder/context";
import { useCatalog } from "@/lib/menu-builder/catalog";
import { getSetMenuById } from "@/lib/menu-builder/data";
import { isSetMenuFlow, venueKindOf } from "@/lib/menu-builder/flow";
import {
  formatINR,
  getOutdoorEstimatedTotal,
  getOutdoorSubtotal,
  getPerHeadRate,
  getSetMenuEstimatedTotal,
  getSetMenuPerHead,
  getTotalWithGst,
  getVenueLogisticsPerHead,
} from "@/lib/menu-builder/pricing";
import { MB_COLORS, type WizardStep } from "@/lib/menu-builder/types";

const serif = { fontFamily: "var(--font-cormorant-garamond)" } as const;

// ═══════════════════════════════════════════════════════════════════════════
// ─── TUNE THESE KNOBS ──────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════

const STICKY_TOP = "top-8";
const CARD_BG = MB_COLORS.card;
const CARD_PADDING = "p-8";
const TITLE_COLOR = MB_COLORS.ink;
const LABEL_COLOR = MB_COLORS.inkMuted;
const VALUE_COLOR = MB_COLORS.ink;
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
  const { venues, occasions, dishes } = useCatalog();

  const outdoor = state.cateringType === "outdoor";
  const setMenuFlow = isSetMenuFlow(state, venues);

  return (
    <aside className={`sticky ${STICKY_TOP} h-fit`}>
      <div className={`${CARD_PADDING} rounded-sm`} style={{ backgroundColor: CARD_BG }}>
        <h3
          style={{ ...serif, color: TITLE_COLOR }}
          className="text-[clamp(1.15rem,1.35vw,26px)] font-semibold uppercase tracking-wide"
        >
          Booking Summary
        </h3>
        <p style={{ color: LABEL_COLOR }} className="mt-1 text-xs uppercase tracking-widest">
          Live Preview
        </p>

        {outdoor ? (
          <OutdoorSummary hydrated={hydrated} state={state} currentStep={currentStep} />
        ) : (
          <VenueEventSummary
            hydrated={hydrated}
            state={state}
            currentStep={currentStep}
            setMenuFlow={setMenuFlow}
            venues={venues}
            occasions={occasions}
            dishes={dishes}
          />
        )}
      </div>
    </aside>
  );
}

// ─── Outdoor variant (minimal) ─────────────────────────────────────────────

function OutdoorSummary({
  hydrated,
  state,
  currentStep,
}: {
  hydrated: boolean;
  state: ReturnType<typeof useBooking>["state"];
  currentStep: number;
}) {
  const itemCount = Object.values(state.catalogSelections).reduce((a, b) => a + b, 0);
  const showTotal = currentStep >= 2 && getOutdoorSubtotal(state) > 0;

  return (
    <>
      <div className="mt-6 space-y-3">
        <Row label="Client" value={hydrated ? state.clientName || "—" : "—"} />
        <Row label="Date" value={hydrated ? state.eventDate || "—" : "—"} />
      </div>

      {showTotal && (
        <>
          <Divider />
          <Row label="Items" value={String(itemCount)} />
          <div className="mt-4">
            <TotalBlock
              total={getOutdoorEstimatedTotal(state)}
              caption="incl. GST"
              subCaption={`${itemCount} item${itemCount === 1 ? "" : "s"} · bulk / delivery`}
            />
          </div>
        </>
      )}
    </>
  );
}

// ─── Venue-event variant (cuisine + set-menu) ──────────────────────────────

function VenueEventSummary({
  hydrated,
  state,
  currentStep,
  setMenuFlow,
  venues,
  occasions,
  dishes,
}: {
  hydrated: boolean;
  state: ReturnType<typeof useBooking>["state"];
  currentStep: number;
  setMenuFlow: boolean;
  venues: ReturnType<typeof useCatalog>["venues"];
  occasions: ReturnType<typeof useCatalog>["occasions"];
  dishes: ReturnType<typeof useCatalog>["dishes"];
}) {
  const venue = state.venueId ? venues.find((v) => v.id === state.venueId) : null;
  const occasion =
    state.occasions.length > 0
      ? occasions.find((o) => o.id === state.occasions[0])?.label
      : null;
  const setMenu = getSetMenuById(state.selectedSetMenuId);

  const showItemsAndTotal = currentStep >= 3;

  const perHead = setMenuFlow
    ? getSetMenuPerHead(state)
    : getPerHeadRate(state) + getVenueLogisticsPerHead(state, venues);
  const total = setMenuFlow ? getSetMenuEstimatedTotal(state) : getTotalWithGst(state, venues);

  return (
    <>
      <div className="mt-6 space-y-3">
        <Row label="Client" value={hydrated ? state.clientName || "—" : "—"} />
        <Row label="Occasion" value={hydrated ? occasion || "—" : "—"} />
        <Row label="Date" value={hydrated ? state.eventDate || "—" : "—"} />
        <Row label="Guests" value={hydrated ? String(state.guests) : "—"} />
      </div>

      <Divider />

      <div className="space-y-3">
        <Row label="Venue" value={hydrated ? venue?.name || state.customVenueAddress || "—" : "—"} />
        <Row label="Meal" value={hydrated ? state.mealTypes.join(", ") || "—" : "—"} />
        <Row label="Diet" value={hydrated ? state.dietaryPreferences.join(", ") || "—" : "—"} />
      </div>

      {/* Cuisine flow: selected dishes list */}
      {!setMenuFlow && showItemsAndTotal && state.selectedDishes.length > 0 && (
        <>
          <Divider />
          <h4
            style={{ ...serif, color: TITLE_COLOR }}
            className="mb-3 text-sm font-semibold uppercase tracking-wide"
          >
            Selected Item{" "}
            <span style={{ color: LABEL_COLOR }} className="font-normal normal-case">
              {state.selectedDishes.length} Items
            </span>
          </h4>
          <ul className="space-y-2">
            {state.selectedDishes.map(({ dishId }) => {
              const dish = dishes.find((d) => d.id === dishId);
              if (!dish) return null;
              return (
                <li
                  key={dishId}
                  className="flex items-center justify-between text-[clamp(0.8rem,0.85vw,14px)]"
                  style={{ color: VALUE_COLOR }}
                >
                  <span className="truncate pr-2">
                    {dish.name}
                    {currentStep >= 4 && (
                      <span style={{ color: GOLD }} className="ml-2">
                        / ₹{dish.price}
                      </span>
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
              setMenuFlow && setMenu
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
  extra,
}: {
  total: number;
  caption: string;
  subCaption: string;
  extra?: React.ReactNode;
}) {
  return (
    <div>
      <h4
        style={{ ...serif, color: TITLE_COLOR }}
        className="text-sm font-semibold uppercase tracking-wide"
      >
        Estimated Total
      </h4>
      <p
        style={{ ...serif, color: GOLD }}
        className="mt-2 text-[clamp(1.6rem,2vw,36px)] font-semibold leading-none"
      >
        {formatINR(total)}
      </p>
      <p style={{ color: LABEL_COLOR }} className="mt-2 text-xs">
        {caption}
      </p>
      <p style={{ color: LABEL_COLOR }} className="text-xs">
        {subCaption}
      </p>
      {extra}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 text-[clamp(0.85rem,0.95vw,16px)]">
      <span style={{ color: LABEL_COLOR }}>{label}</span>
      <span style={{ color: VALUE_COLOR }} className="text-right truncate">
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
