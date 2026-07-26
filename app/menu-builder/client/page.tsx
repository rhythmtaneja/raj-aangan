// ══════════════════════════════════════════════════════════════════
// PATH IN REPO: app/menu-builder/client/page.tsx
// ══════════════════════════════════════════════════════════════════
// Step 1 — Client / Event. Now the shared entry point for all three
// sub-flows. Adds a "Catering Type" section (first) that picks the flow and
// controls which fields show, plus branches the Next button:
//   • venue-event → /menu-builder/venue
//   • outdoor     → /menu-builder/catalog
// "Non Veg" removed from Dietary Preference (see DIETARY_PREFERENCES).
// ══════════════════════════════════════════════════════════════════

"use client";

import Image from "next/image";
import BuilderLayout from "@/components/menu-builder/BuilderLayout";
import { useBooking } from "@/lib/menu-builder/context";
import { useCatalog } from "@/lib/menu-builder/catalog";
import { getSteps } from "@/lib/menu-builder/flow";
import {
  CATERING_TYPES,
  DIETARY_PREFERENCES,
  MB_COLORS,
  MEAL_TYPES,
  type CateringType,
  type DietaryPreference,
  type MealType,
} from "@/lib/menu-builder/types";

const serif = { fontFamily: "var(--font-cormorant-garamond)" } as const;

// ═══════════════════════════════════════════════════════════════════════════
// ─── TUNE THESE KNOBS ──────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════

const CARD_BG            = MB_COLORS.card;
const INK                = MB_COLORS.ink;
const INK_MUTED          = MB_COLORS.inkMuted;
const GOLD               = MB_COLORS.gold;
const CARD_PADDING       = "p-8 md:p-10";
const SECTION_GAP        = "mt-8";
const CATERING_IMAGE_H   = 120;
const OCCASION_IMAGE_H    = 104;
const MIN_GUESTS         = 100;
const GUEST_STEP         = 50;

// ═══════════════════════════════════════════════════════════════════════════

export default function Step1ClientPage() {
  const { state, dispatch, hydrated } = useBooking();
  const { occasions } = useCatalog();

  const steps = getSteps(state);
  const outdoor = state.cateringType === "outdoor";

  const setField = <K extends keyof typeof state>(field: K, value: (typeof state)[K]) =>
    dispatch({ type: "SET_FIELD", field, value });

  const chooseCateringType = (id: CateringType) => setField("cateringType", id);

  const toggleOccasion = (id: string) =>
    dispatch({ type: "TOGGLE_ARRAY", field: "occasions", value: id });

  const toggleMeal = (meal: MealType) =>
    dispatch({ type: "TOGGLE_ARRAY", field: "mealTypes", value: meal });

  const toggleDietary = (d: DietaryPreference) =>
    dispatch({ type: "TOGGLE_ARRAY", field: "dietaryPreferences", value: d });

  const incGuests = () => setField("guests", state.guests + GUEST_STEP);
  const decGuests = () => setField("guests", Math.max(MIN_GUESTS, state.guests - GUEST_STEP));

  // Next button routes by catering type; disabled until a type is chosen.
  const nextHref =
    state.cateringType === "outdoor"
      ? "/menu-builder/catalog"
      : "/menu-builder/venue";

  return (
    <BuilderLayout
      steps={steps}
      currentStep={1}
      backHref="/catering"
      backLabel="Back to Catering"
      nextHref={nextHref}
      nextLabel="Next"
      nextDisabled={!hydrated || !state.cateringType}
    >
      <div className={CARD_PADDING} style={{ backgroundColor: CARD_BG }}>
        <h2
          style={{ ...serif, color: INK }}
          className="text-[clamp(1.6rem,2.3vw,33px)] font-semibold"
        >
          Menu Builder
        </h2>
        <p style={{ color: INK_MUTED }} className="mt-1 text-xs uppercase tracking-widest">
          Craft your event experience
        </p>

        {/* ─── Catering Type (first section) ─────────────────────────────── */}
        <Divider label="Catering Type" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {CATERING_TYPES.map((ct) => (
            <MediaCard
              key={ct.id}
              label={ct.label}
              image={ct.image}
              imageHeight={CATERING_IMAGE_H}
              selected={hydrated && state.cateringType === ct.id}
              onClick={() => chooseCateringType(ct.id)}
            />
          ))}
        </div>

        {/* ─── Occasion (venue-event only) ───────────────────────────────── */}
        {!outdoor && (
          <>
            <Divider label="OCCASSION TYPE" />
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {occasions.map((o) => (
                <MediaCard
                  key={o.id}
                  label={o.label}
                  image={o.image}
                  imageHeight={OCCASION_IMAGE_H}
                  selected={state.occasions.includes(o.id)}
                  showCheck
                  onClick={() => toggleOccasion(o.id)}
                />
              ))}
            </div>
          </>
        )}

        {/* ─── Client + Contact (always) ─────────────────────────────────── */}
        <div className={`${SECTION_GAP} grid grid-cols-1 gap-6 md:grid-cols-2`}>
          <TextInput
            label="Client"
            placeholder="Your Name"
            value={hydrated ? state.clientName : ""}
            onChange={(v) => setField("clientName", v)}
          />
          <TextInput
            label="Contact / Phone"
            placeholder=""
            value={hydrated ? state.contactPhone : ""}
            onChange={(v) => setField("contactPhone", v)}
          />
        </div>

        {/* ─── Meal Type (venue-event only) ──────────────────────────────── */}
        {!outdoor && (
          <div className={SECTION_GAP}>
            <Label>Meal Type</Label>
            <div className="mt-3 flex flex-wrap gap-3">
              {MEAL_TYPES.map((m) => (
                <Pill
                  key={m}
                  selected={state.mealTypes.includes(m)}
                  onClick={() => toggleMeal(m)}
                >
                  {m}
                </Pill>
              ))}
            </div>
          </div>
        )}

        {/* ─── Date (+ Event Days for venue-event) ───────────────────────── */}
        <div className={`${SECTION_GAP} grid grid-cols-1 gap-6 md:grid-cols-2`}>
          <TextInput
            label={outdoor ? "Delivery Date" : "Event Date"}
            placeholder="dd/mm/yyyy"
            value={hydrated ? state.eventDate : ""}
            onChange={(v) => setField("eventDate", v)}
            type="date"
          />
          {!outdoor && (
            <TextInput
              label="No. of Event Days"
              placeholder="1"
              value={hydrated ? String(state.eventDays) : "1"}
              onChange={(v) => setField("eventDays", Math.max(1, parseInt(v) || 1))}
              type="number"
            />
          )}
        </div>

        {/* ─── Guests (venue-event only) ─────────────────────────────────── */}
        {!outdoor && (
          <div className={SECTION_GAP}>
            <Label>Number of Guests</Label>
            <div className="mt-3 inline-flex items-center gap-3">
              <StepButton onClick={decGuests}>−</StepButton>
              <div
                className="min-w-[80px] text-center text-lg font-medium"
                style={{ color: INK }}
              >
                {hydrated ? state.guests : "—"}
              </div>
              <StepButton onClick={incGuests}>+</StepButton>
            </div>
            <p style={{ color: INK_MUTED }} className="mt-2 text-xs">
              Minimum {MIN_GUESTS} guests · Adjust in multiples of {GUEST_STEP}
            </p>
          </div>
        )}

        {/* ─── Dietary Preference (always) ───────────────────────────────── */}
        <div className={SECTION_GAP}>
          <Label>Dietary Preference</Label>
          <div className="mt-3 flex flex-wrap gap-3">
            {DIETARY_PREFERENCES.map((d) => (
              <Pill
                key={d}
                selected={state.dietaryPreferences.includes(d)}
                onClick={() => toggleDietary(d)}
              >
                {d}
              </Pill>
            ))}
          </div>
        </div>

        {!state.cateringType && hydrated && (
          <p style={{ color: INK_MUTED }} className="mt-8 text-xs">
            Choose a catering type above to continue.
          </p>
        )}
      </div>
    </BuilderLayout>
  );
}

// ─── Inline UI primitives ──────────────────────────────────────────────────

// Shared image card — photo on top, cream footer with a gold serif label.
// Used for both the Catering Type and Occasion Type grids (figma reference).
function MediaCard({
  label,
  image,
  imageHeight,
  selected,
  showCheck = false,
  onClick,
}: {
  label: string;
  image: string;
  imageHeight: number;
  selected: boolean;
  showCheck?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group overflow-hidden rounded-[10px] border text-left transition-all"
      style={{
        borderColor: selected ? GOLD : MB_COLORS.border,
        boxShadow: selected ? `0 0 0 1px ${GOLD}` : "0 1px 3px rgba(0,0,0,0.06)",
        backgroundColor: MB_COLORS.cardCream,
      }}
    >
      <div className="relative w-full overflow-hidden" style={{ height: imageHeight }}>
        <Image
          src={image}
          alt={label}
          fill
          sizes="(max-width: 640px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      </div>
      <div className="flex items-center justify-between gap-2 px-3 py-2.5">
        <span
          style={{ ...serif, color: GOLD }}
          className="text-sm font-medium leading-snug"
        >
          {label}
        </span>
        {showCheck && selected && (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke={MB_COLORS.greenCheck}
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="shrink-0"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </div>
    </button>
  );
}

function Divider({ label }: { label: string }) {
  return (
    <div className="mt-8 mb-5 flex items-center gap-4">
      <h3
        style={{ ...serif, color: INK }}
        className="shrink-0 text-[clamp(1.15rem,1.7vw,22px)] font-semibold tracking-wide"
      >
        {label}
      </h3>
      <div className="h-px flex-1" style={{ backgroundColor: MB_COLORS.border }} />
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ ...serif, color: INK }} className="text-[15px] font-semibold">
      {children}
    </p>
  );
}

function TextInput({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full rounded border border-gray-300 px-4 py-2.5 text-sm focus:border-gray-600 focus:outline-none"
        style={{ color: INK }}
      />
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

function StepButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex h-9 w-9 items-center justify-center rounded border text-lg leading-none hover:bg-gray-50"
      style={{ borderColor: MB_COLORS.border, color: INK }}
    >
      {children}
    </button>
  );
}
