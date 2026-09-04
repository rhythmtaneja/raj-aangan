// ══════════════════════════════════════════════════════════════════
// PATH IN REPO: app/menu-builder/presentation/page.tsx
// ══════════════════════════════════════════════════════════════════
// Sub-flow B — Live Counters & Presentation. Inserted between Menu and Quote
// in the venue-event flow.
//   • Choose Your Live Counters (multi-select image grid)
//   • Then ONE configurator block PER selected counter, in the order they were
//     picked ("1. Chaat Counter", "2. Pasta Counter", …). Each block carries
//     its own Cutlery / Presentation Style / Stall Theme / Counter Design, so
//     two counters never share a choice.
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
import { EMPTY_COUNTER_CONFIG, MB_COLORS, type CounterConfig } from "@/lib/menu-builder/types";

const serif = { fontFamily: "var(--font-cormorant-garamond)" } as const;

// ═══════════════════════════════════════════════════════════════════════════
// ─── TUNE THESE KNOBS ──────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════

const CARD_BG      = MB_COLORS.card;
const INK          = MB_COLORS.ink;
const INK_MUTED    = MB_COLORS.inkMuted;
const GOLD         = MB_COLORS.gold;
const CARD_PADDING = "p-5 md:p-10";
const TILE_IMG_H   = "8.125rem";

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

  const toggleCounter = (counterId: string) =>
    dispatch({ type: "TOGGLE_LIVE_COUNTER", counterId });

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
          design then open separately for each stall you choose.
        </p>

        {/* Live Counters — multi-select image grid (always shown) */}
        <SectionLabel>Choose Your Live Counters</SectionLabel>
        <PhotoGrid
          items={presentation.liveCounterTiles}
          isSelected={(id) => p.liveCounters.includes(id)}
          onToggle={toggleCounter}
        />

        {p.liveCounters.length === 0 ? (
          <p
            className="mt-8 rounded-lg border border-dashed px-5 py-6 text-sm"
            style={{ borderColor: GOLD, color: INK_MUTED, backgroundColor: `${GOLD}0d` }}
          >
            Choose a live counter above to configure its cutlery, presentation
            style and stall theme.
          </p>
        ) : (
          p.liveCounters.map((counterId, index) => {
            const tile = presentation.liveCounterTiles.find((t) => t.id === counterId);
            const config: CounterConfig =
              p.counterConfigs[counterId] ?? EMPTY_COUNTER_CONFIG;
            return (
              <CounterBlock
                key={counterId}
                index={index + 1}
                name={tile?.name ?? counterId}
                config={config}
                cutlery={presentation.cutlery}
                presentationStyles={presentation.presentationStyles}
                stallThemes={presentation.stallThemes}
                designs={presentation.liveCounters}
                onSingle={(field, value) =>
                  dispatch({ type: "SET_COUNTER_SINGLE", counterId, field, value })
                }
                onDesign={(value) =>
                  dispatch({ type: "TOGGLE_COUNTER_DESIGN", counterId, value })
                }
                onRemove={() => toggleCounter(counterId)}
              />
            );
          })
        )}
      </div>
    </BuilderLayout>
  );
}

// ─── One selected counter's full option set ────────────────────────────────

type Tile = { id: string; name: string; image: string };

function CounterBlock({
  index,
  name,
  config,
  cutlery,
  presentationStyles,
  stallThemes,
  designs,
  onSingle,
  onDesign,
  onRemove,
}: {
  index: number;
  name: string;
  config: CounterConfig;
  cutlery: Tile[];
  presentationStyles: Tile[];
  stallThemes: Tile[];
  designs: { id: string; name: string }[];
  onSingle: (field: "cutlery" | "presentationStyle" | "stallTheme", value: string) => void;
  onDesign: (value: string) => void;
  onRemove: () => void;
}) {
  return (
    <section
      className="mt-10 rounded-lg border p-5 md:p-8"
      style={{ borderColor: `${GOLD}66`, backgroundColor: `${GOLD}08` }}
    >
      <div className="flex items-baseline justify-between gap-4">
        <h3
          style={{ ...serif, color: INK }}
          className="text-[clamp(1.3rem,1.9vw,1.625rem)] font-semibold"
        >
          <span style={{ color: GOLD }}>{index}.</span> {name}
        </h3>
        <button
          onClick={onRemove}
          className="shrink-0 text-xs underline transition-opacity hover:opacity-70"
          style={{ color: INK_MUTED }}
        >
          Remove
        </button>
      </div>
      <p style={{ color: INK_MUTED }} className="mt-1 text-sm">
        Choose the cutlery, styling and stall look for this counter.
      </p>

      <SectionLabel>Cutlery</SectionLabel>
      <PhotoGrid
        items={cutlery}
        isSelected={(id) => config.cutlery === id}
        onToggle={(id) => onSingle("cutlery", id)}
      />

      <SectionLabel>Presentation Style</SectionLabel>
      <PhotoGrid
        items={presentationStyles}
        isSelected={(id) => config.presentationStyle === id}
        onToggle={(id) => onSingle("presentationStyle", id)}
      />

      <SectionLabel>Stall Theme</SectionLabel>
      <PhotoGrid
        items={stallThemes}
        isSelected={(id) => config.stallTheme === id}
        onToggle={(id) => onSingle("stallTheme", id)}
      />

      <SectionLabel>Live Counter Design</SectionLabel>
      <div className="flex flex-wrap gap-3">
        {designs.map((lc) => (
          <Pill
            key={lc.id}
            selected={config.designs.includes(lc.id)}
            onClick={() => onDesign(lc.id)}
          >
            {lc.name}
          </Pill>
        ))}
      </div>
    </section>
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
  items: Tile[];
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
              borderRadius: "0.375rem",
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
                <svg className="w-[0.875rem] h-[0.875rem]" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
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
