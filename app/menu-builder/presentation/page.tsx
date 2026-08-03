// ══════════════════════════════════════════════════════════════════
// PATH IN REPO: app/menu-builder/presentation/page.tsx
// ══════════════════════════════════════════════════════════════════
// Sub-flow B — Live Counters & Presentation. Inserted between Menu and Quote
// in the cuisine flow. Sections:
//   • Choose Your Live Counters (multi-select image grid)
//   • Cutlery (single-select image grid)
//   • Presentation Style (single-select image grid)
//   • Stall Theme (single-select image grid)
//   • Live Counter Design (multi-select pill list)
// All optional — nothing here blocks Continue.
// ═══════════════════════════════════════════════════════════════════════════

"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import BuilderLayout from "@/components/menu-builder/BuilderLayout";
import { useBooking } from "@/lib/menu-builder/context";
import { useCatalog } from "@/lib/menu-builder/catalog";
import { getSteps, stepIndexOf } from "@/lib/menu-builder/flow";
import { MB_COLORS } from "@/lib/menu-builder/types";

const serif = { fontFamily: "var(--font-cormorant-garamond)" } as const;

// ═══════════════════════════════════════════════════════════════════════════
// ─── TUNE THESE KNOBS ──────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════

const CARD_BG      = MB_COLORS.card;
const INK          = MB_COLORS.ink;
const INK_MUTED    = MB_COLORS.inkMuted;
const GOLD         = MB_COLORS.gold;
const CARD_PADDING = "p-5 md:p-10";
const TILE_IMG_H   = 130;

// ═══════════════════════════════════════════════════════════════════════════

export default function PresentationStepPage() {
  const { state, dispatch, hydrated } = useBooking();
  const { presentation } = useCatalog();
  const router = useRouter();

  const steps = getSteps(state);
  const p = state.presentationChoices;

  // Route protection — the Presentation step belongs to the venue-event flow.
  useEffect(() => {
    if (!hydrated) return;
    if (state.cateringType !== "venue-event") router.replace("/menu-builder/client");
  }, [hydrated, state.cateringType, router]);

  if (!hydrated || state.cateringType !== "venue-event") return null;

  // Back goes to whichever Menu sub-screen the guest came from.
  const backHref =
    state.menuMode === "custom" ? "/menu-builder/custom-menu" : "/menu-builder/menu";

  const toggleMulti = (field: "liveCounters" | "liveCounterDesigns", value: string) =>
    dispatch({ type: "TOGGLE_PRESENTATION_MULTI", field, value });

  const setSingle = (
    field: "cutlery" | "presentationStyle" | "stallTheme",
    value: string,
  ) => dispatch({ type: "SET_PRESENTATION_SINGLE", field, value });

  return (
    <BuilderLayout
      steps={steps}
      currentStep={stepIndexOf(steps, "presentation")}
      backHref={backHref}
      nextHref="/menu-builder/quote"
      nextLabel="Review & Quote"
    >
      <div className={CARD_PADDING} style={{ backgroundColor: CARD_BG }}>
        <h2
          style={{ ...serif, color: INK }}
          className="text-[clamp(1.6rem,2.3vw,2.0625rem)] font-semibold"
        >
          Live Counters, Cutlery & Presentation
        </h2>
        <p style={{ color: INK_MUTED }} className="mt-1 text-sm">
          Pick your live counters first — cutlery, presentation style and counter
          design will show grouped for each stall you choose.
        </p>

        {/* Live Counters — multi-select image grid (always shown) */}
        <SectionLabel>Choose Your Live Counters</SectionLabel>
        <PhotoGrid
          items={presentation.liveCounterTiles}
          isSelected={(id) => p.liveCounters.includes(id)}
          onToggle={(id) => toggleMulti("liveCounters", id)}
        />

        {/*
          The cutlery / presentation / stall categories belong to the chosen
          live counters and only appear once at least one counter is selected.
          TODO: once the client shares which counter maps to which options,
          filter each category by the selected counters. For now, selecting any
          counter reveals the full set of options.
        */}
        {p.liveCounters.length === 0 ? (
          <p
            className="mt-8 rounded-lg border border-dashed px-5 py-6 text-sm"
            style={{ borderColor: GOLD, color: INK_MUTED, backgroundColor: `${GOLD}0d` }}
          >
            Choose a live counter above to configure its cutlery, presentation
            style and stall theme.
          </p>
        ) : (
          <>
            {/* Cutlery — single-select image grid */}
            <SectionLabel>Cutlery</SectionLabel>
            <PhotoGrid
              items={presentation.cutlery}
              isSelected={(id) => p.cutlery === id}
              onToggle={(id) => setSingle("cutlery", id)}
            />

            {/* Presentation Style — single-select image grid */}
            <SectionLabel>Presentation Style</SectionLabel>
            <PhotoGrid
              items={presentation.presentationStyles}
              isSelected={(id) => p.presentationStyle === id}
              onToggle={(id) => setSingle("presentationStyle", id)}
            />

            {/* Stall Theme — single-select image grid */}
            <SectionLabel>Stall Theme</SectionLabel>
            <PhotoGrid
              items={presentation.stallThemes}
              isSelected={(id) => p.stallTheme === id}
              onToggle={(id) => setSingle("stallTheme", id)}
            />

            {/* Live Counter Design — multi-select pills */}
            <SectionLabel>Live Counter Design</SectionLabel>
            <div className="flex flex-wrap gap-3">
              {presentation.liveCounters.map((lc) => (
                <Pill
                  key={lc.id}
                  selected={p.liveCounterDesigns.includes(lc.id)}
                  onClick={() => toggleMulti("liveCounterDesigns", lc.id)}
                >
                  {lc.name}
                </Pill>
              ))}
            </div>
          </>
        )}
      </div>
    </BuilderLayout>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-8 mb-5 flex items-center gap-4">
      <h3
        style={{ ...serif, color: INK }}
        className="shrink-0 text-[clamp(1.15rem,1.7vw,1.375rem)] font-semibold tracking-wide"
      >
        {children}
      </h3>
      <div className="h-px flex-1" style={{ backgroundColor: "#e5e5e5" }} />
    </div>
  );
}

function PhotoGrid({
  items,
  isSelected,
  onToggle,
}: {
  items: { id: string; name: string; image: string }[];
  isSelected: (id: string) => boolean;
  onToggle: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {items.map((it) => {
        const selected = isSelected(it.id);
        return (
          <button
            key={it.id}
            onClick={() => onToggle(it.id)}
            className="group relative overflow-hidden text-left"
            style={{
              height: TILE_IMG_H,
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
              style={{ inset: "0.5rem", border: "1px solid rgba(255,255,255,0.5)" }}
            />
            {selected && (
              <div
                className="absolute right-2 top-2 z-20 flex h-6 w-6 items-center justify-center rounded-full"
                style={{ backgroundColor: GOLD }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            )}
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
