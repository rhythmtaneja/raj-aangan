// ══════════════════════════════════════════════════════════════════
// PATH IN REPO: app/menu-builder/client/page.tsx
// ⚠️  RENAME THIS FILE TO page.tsx BEFORE PLACING IN THE FOLDER
// ══════════════════════════════════════════════════════════════════
// CHANGES vs previous version:
//   • Added backHref="/catering" + backLabel="Back to Catering" on Step 1.
//     Gives users a way out of the wizard back to the catering page.
// ══════════════════════════════════════════════════════════════════

"use client";

import Image from "next/image";
import BuilderLayout from "@/components/menu-builder/BuilderLayout";
import { useBooking } from "@/lib/menu-builder/context";
import { useCatalog } from "@/lib/menu-builder/catalog";
import {
  DIETARY_PREFERENCES,
  MB_COLORS,
  MEAL_TYPES,
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
const OCCASION_CARD_H    = 130;
const OCCASION_FRAME_INSET = "8px";
const MIN_GUESTS         = 100;
const GUEST_STEP         = 50;

// ═══════════════════════════════════════════════════════════════════════════

export default function Step1ClientPage() {
  const { state, dispatch, hydrated } = useBooking();
  const { occasions } = useCatalog();

  const setField = <K extends keyof typeof state>(field: K, value: (typeof state)[K]) =>
    dispatch({ type: "SET_FIELD", field, value });

  const toggleOccasion = (id: string) =>
    dispatch({ type: "TOGGLE_ARRAY", field: "occasions", value: id });

  const toggleMeal = (meal: MealType) =>
    dispatch({ type: "TOGGLE_ARRAY", field: "mealTypes", value: meal });

  const toggleDietary = (d: DietaryPreference) =>
    dispatch({ type: "TOGGLE_ARRAY", field: "dietaryPreferences", value: d });

  const incGuests = () => setField("guests", state.guests + GUEST_STEP);
  const decGuests = () => setField("guests", Math.max(MIN_GUESTS, state.guests - GUEST_STEP));

  return (
    <BuilderLayout
      currentStep={1}
      backHref="/catering"
      backLabel="Back to Catering"
      nextHref="/menu-builder/venue"
      nextLabel="Next"
    >
      <div className={CARD_PADDING} style={{ backgroundColor: CARD_BG }}>
        <h2
          style={{ ...serif, color: INK }}
          className="text-[clamp(1.6rem,2.3vw,42px)] font-semibold"
        >
          Menu Builder
        </h2>
        <p style={{ color: INK_MUTED }} className="mt-1 text-xs uppercase tracking-widest">
          Craft your event experience
        </p>

        <Divider label="Occassion Type" />

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {occasions.map((o) => {
            const selected = state.occasions.includes(o.id);
            return (
              <button
                key={o.id}
                onClick={() => toggleOccasion(o.id)}
                className="group relative overflow-hidden text-left"
                style={{
                  height: OCCASION_CARD_H,
                  borderRadius: 6,
                  outline: selected ? `2px solid ${GOLD}` : "none",
                }}
              >
                <Image
                  src={o.image}
                  alt={o.label}
                  fill
                  sizes="(max-width: 640px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute z-10"
                  style={{
                    inset: OCCASION_FRAME_INSET,
                    border: "1px solid rgba(255,255,255,0.5)",
                  }}
                />
                <div className="absolute inset-x-0 bottom-0 z-20 flex items-center justify-between bg-white/95 px-3 py-2">
                  <span
                    style={{ ...serif, color: selected ? GOLD : INK }}
                    className="text-sm font-medium"
                  >
                    {o.label}
                  </span>
                  {selected && (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={MB_COLORS.greenCheck}
                      strokeWidth={3}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <div className={`${SECTION_GAP} grid grid-cols-1 gap-6 md:grid-cols-2`}>
          <TextInput
            label="Client"
            placeholder="Your Name"
            value={hydrated ? state.clientName : ""}
            onChange={(v) => setField("clientName", v)}
          />
          <TextInput
            label="Contact / Phone"
            placeholder="+91 985463768"
            value={hydrated ? state.contactPhone : ""}
            onChange={(v) => setField("contactPhone", v)}
          />
        </div>

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

        <div className={`${SECTION_GAP} grid grid-cols-1 gap-6 md:grid-cols-2`}>
          <TextInput
            label="Event Date"
            placeholder="dd/mm/yyyy"
            value={hydrated ? state.eventDate : ""}
            onChange={(v) => setField("eventDate", v)}
            type="date"
          />
          <TextInput
            label="No. of Event Days"
            placeholder="1"
            value={hydrated ? String(state.eventDays) : "1"}
            onChange={(v) => setField("eventDays", Math.max(1, parseInt(v) || 1))}
            type="number"
          />
        </div>

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
      </div>
    </BuilderLayout>
  );
}

// ─── Inline UI primitives ──────────────────────────────────────────────────

function Divider({ label }: { label: string }) {
  return (
    <div className="mt-8 mb-4 flex items-center gap-4">
      <p style={{ color: INK }} className="text-xs font-semibold uppercase tracking-widest">
        {label}
      </p>
      <div className="h-px flex-1" style={{ backgroundColor: GOLD }} />
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ color: INK }} className="text-sm font-medium">
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
