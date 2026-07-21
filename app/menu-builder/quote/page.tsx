// ══════════════════════════════════════════════════════════════════
// PATH IN REPO: app/menu-builder/quote/page.tsx
// ══════════════════════════════════════════════════════════════════
// One Quote route, two layouts:
//   • venue-event (set-menu OR cuisine) → <VenueEventQuote>  (quote-page.png)
//   • outdoor                            → <OutdoorQuote>     (outdoor-quote.png)
// The two venue-event sub-flows share the exact same quote design; only the
// pricing inputs differ. Discount code is placeholder-only (no valid codes).
// ═══════════════════════════════════════════════════════════════════════════

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BuilderLayout from "@/components/menu-builder/BuilderLayout";
import { useBooking } from "@/lib/menu-builder/context";
import { useCatalog } from "@/lib/menu-builder/catalog";
import { getCatalogItemById, getPackagingById, getSetMenuById } from "@/lib/menu-builder/data";
import { getSteps, isSetMenuFlow, stepIndexOf } from "@/lib/menu-builder/flow";
import {
  CUTLERY_OPTIONS,
  LIVE_COUNTERS,
  LIVE_COUNTER_TILES,
} from "@/lib/menu-builder/config";
import {
  formatINR,
  getGstPercent,
  getOutdoorSubtotal,
  getPerHeadRate,
  getSetMenuPerHead,
  getVenueLogisticsPerHead,
} from "@/lib/menu-builder/pricing";
import { MB_COLORS, STEPS_OUTDOOR } from "@/lib/menu-builder/types";

const serif = { fontFamily: "var(--font-cormorant-garamond)" } as const;

// ═══════════════════════════════════════════════════════════════════════════
// ─── TUNE THESE KNOBS ──────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════

const CARD_BG        = MB_COLORS.card;
const INK            = MB_COLORS.ink;
const INK_MUTED      = MB_COLORS.inkMuted;
const GOLD           = MB_COLORS.gold;
const CARD_PADDING   = "p-8 md:p-10";

const DISCOUNT_PLACEHOLDER = "Enter code e.g. RAEC30";
const NO_VALID_CODES_MSG   = "No valid discount codes yet.";
const START_OVER_CONFIRM   = "Start over? All your selections will be cleared.";

// ═══════════════════════════════════════════════════════════════════════════

export default function QuotePage() {
  const { state, hydrated } = useBooking();
  const { venues } = useCatalog();
  const router = useRouter();

  useEffect(() => {
    if (!hydrated) return;
    if (!state.cateringType) router.replace("/menu-builder/client");
  }, [hydrated, state.cateringType, router]);

  if (!hydrated || !state.cateringType) return null;

  return state.cateringType === "outdoor" ? (
    <OutdoorQuote />
  ) : (
    <VenueEventQuote setMenuFlow={isSetMenuFlow(state, venues)} />
  );
}

// ─── Venue-event quote (set-menu + cuisine share this) ─────────────────────

function VenueEventQuote({ setMenuFlow }: { setMenuFlow: boolean }) {
  const { state, dispatch } = useBooking();
  const { venues, occasions } = useCatalog();
  const router = useRouter();
  const { toast, showToast } = useToast();

  const steps = getSteps(state, venues);
  const venue = state.venueId ? venues.find((v) => v.id === state.venueId) : null;
  const occasion =
    state.occasions.length > 0
      ? state.occasions.map((id) => occasions.find((o) => o.id === id)?.label).filter(Boolean).join(", ")
      : "—";
  const setMenu = getSetMenuById(state.selectedSetMenuId);

  // Pricing inputs differ by sub-flow; the breakdown shape is identical.
  const perHeadBase = setMenuFlow ? getSetMenuPerHead(state) : getPerHeadRate(state);
  const venueLogistic = setMenuFlow ? 0 : getVenueLogisticsPerHead(state, venues);
  const subtotal = (perHeadBase + venueLogistic) * state.guests * state.eventDays;
  const gst = subtotal * (getGstPercent() / 100);
  const total = subtotal + gst;

  // Presentation summary
  const p = state.presentationChoices;
  const counterNames = [
    ...p.liveCounters.map((id) => LIVE_COUNTER_TILES.find((t) => t.id === id)?.name),
    ...p.liveCounterDesigns.map((id) => LIVE_COUNTERS.find((t) => t.id === id)?.name),
  ].filter(Boolean) as string[];
  const cutleryName = p.cutlery
    ? CUTLERY_OPTIONS.find((c) => c.id === p.cutlery)?.name ?? "—"
    : "—";

  const handleStartOver = () => startOver(dispatch, router);

  return (
    <BuilderLayout steps={steps} currentStep={stepIndexOf(steps, "quote")} backHref="/menu-builder/presentation">
      <div className={CARD_PADDING} style={{ backgroundColor: CARD_BG }}>
        <QuoteHeader
          title="Review & Quote"
          subtitle="Everything you have chosen review before generating the final quote."
        />

        <SectionTitle>Client &amp; Event</SectionTitle>
        <KV label="Client"    value={state.clientName || "—"} />
        <KV label="Contact"   value={state.contactPhone || "—"} />
        <KV label="Occasion"  value={occasion} />
        <KV label="Date"      value={state.eventDate || "—"} />
        <KV label="Duration"  value={`${state.eventDays} Day${state.eventDays > 1 ? "s" : ""}`} />
        <KV label="Guests"    value={String(state.guests)} />
        <KV label="Meal Type" value={state.mealTypes.join(", ") || "—"} />
        <KV label="Dietary"   value={state.dietaryPreferences.join(", ") || "—"} />

        <SectionTitle>Venue</SectionTitle>
        <KV label="Select"  value={venue?.name || state.customVenueAddress || "—"} />
        <KV label="Pricing" value={venue?.pricingNote || (setMenu ? `${formatINR(perHeadBase)} / head` : "—")} />

        <SectionTitle>Presentation &amp; Live Counters</SectionTitle>
        <p style={{ color: INK_MUTED }} className="py-1 text-sm">
          {counterNames.length > 0 ? counterNames.join(", ") : "No live counters selected"}
        </p>
        <KV label="Base Table Cutlery" value={cutleryName} />

        <SectionTitle>Discount Code</SectionTitle>
        <DiscountCode onApply={() => showToast(NO_VALID_CODES_MSG)} />

        <SectionTitle>Estimated Total</SectionTitle>
        <div className="space-y-1.5 text-sm">
          <KVRow label="Per head base" value={formatINR(perHeadBase)} />
          <KVRow label="Venue logistic / head" value={formatINR(venueLogistic)} />
          <KVRow
            label={`x ${state.guests} guest x ${state.eventDays} day${state.eventDays > 1 ? "s" : ""}`}
            value={formatINR(subtotal)}
          />
          <KVRow label={`GST (${getGstPercent()}%)`} value={formatINR(gst)} />
        </div>
        <EstimatedTotalRow value={formatINR(total)} />

        <ActionRow showToast={showToast} />
        <StartOver onClick={handleStartOver} />
        <Toast toast={toast} />
      </div>
    </BuilderLayout>
  );
}

// ─── Outdoor quote ─────────────────────────────────────────────────────────

function OutdoorQuote() {
  const { state, dispatch } = useBooking();
  const router = useRouter();
  const { toast, showToast } = useToast();

  const packaging = getPackagingById(state.packagingStyleId);
  const lineItems = Object.entries(state.catalogSelections)
    .filter(([, qty]) => qty > 0)
    .map(([itemId, qty]) => {
      const item = getCatalogItemById(itemId);
      return item ? { item, qty, lineTotal: item.price * qty } : null;
    })
    .filter(Boolean) as { item: NonNullable<ReturnType<typeof getCatalogItemById>>; qty: number; lineTotal: number }[];

  const subtotal = getOutdoorSubtotal(state);
  const gst = subtotal * (getGstPercent() / 100);
  const total = subtotal + gst;

  const handleStartOver = () => startOver(dispatch, router);

  return (
    <BuilderLayout steps={STEPS_OUTDOOR} currentStep={4} backHref="/menu-builder/packaging">
      <div className={CARD_PADDING} style={{ backgroundColor: CARD_BG }}>
        <QuoteHeader
          title="Review & Quote — Outdoor Order"
          subtitle="Everything you've chosen for this bulk / delivery order."
        />

        <SectionTitle>Client &amp; Delivery</SectionTitle>
        <KV label="Client"        value={state.clientName || "—"} />
        <KV label="Contact"       value={state.contactPhone || "—"} />
        <KV label="Delivery Date" value={state.eventDate || "—"} />
        <KV label="Address"       value={state.deliveryAddress || "—"} />
        <KV label="Packaging"     value={packaging?.label || "—"} />

        <SectionTitle>Order Items</SectionTitle>
        {lineItems.length === 0 ? (
          <p style={{ color: INK_MUTED }} className="text-sm">
            No items selected yet.
          </p>
        ) : (
          <ul className="divide-y" style={{ borderColor: MB_COLORS.borderLight }}>
            {lineItems.map(({ item, qty, lineTotal }) => (
              <li key={item.id} className="flex items-center justify-between gap-4 py-2 text-sm">
                <div className="min-w-0">
                  <p style={{ color: INK }} className="font-medium">{item.name}</p>
                  <p style={{ color: INK_MUTED }} className="text-xs">
                    {qty} × {formatINR(item.price)} {item.unit}
                  </p>
                </div>
                <span style={{ color: GOLD }} className="font-medium">{formatINR(lineTotal)}</span>
              </li>
            ))}
          </ul>
        )}

        <SectionTitle>Discount Code</SectionTitle>
        <DiscountCode onApply={() => showToast(NO_VALID_CODES_MSG)} />

        <SectionTitle>Estimated Total</SectionTitle>
        <div className="space-y-1.5 text-sm">
          <KVRow label="Subtotal" value={formatINR(subtotal)} />
          <KVRow label={`GST (${getGstPercent()}%)`} value={formatINR(gst)} />
        </div>
        <EstimatedTotalRow value={formatINR(total)} />

        <ActionRow showToast={showToast} />
        <StartOver onClick={handleStartOver} />
        <Toast toast={toast} />
      </div>
    </BuilderLayout>
  );
}

// ─── Shared behaviour ──────────────────────────────────────────────────────

function useToast() {
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };
  return { toast, showToast };
}

function startOver(
  dispatch: ReturnType<typeof useBooking>["dispatch"],
  router: ReturnType<typeof useRouter>,
) {
  if (typeof window !== "undefined" && !window.confirm(START_OVER_CONFIRM)) return;
  dispatch({ type: "RESET_WIZARD" });
  router.push("/menu-builder/client");
}

// ─── Shared UI ─────────────────────────────────────────────────────────────

function QuoteHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <>
      <h2 style={{ ...serif, color: INK }} className="text-[clamp(1.6rem,2.3vw,42px)] font-semibold">
        {title}
      </h2>
      <p style={{ color: INK_MUTED }} className="mt-1 text-sm">
        {subtitle}
      </p>
    </>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-8 mb-3 flex items-center gap-4">
      <h3 style={{ ...serif, color: INK }} className="text-[clamp(1.1rem,1.35vw,24px)] font-semibold">
        {children}
      </h3>
      <div className="h-px flex-1" style={{ backgroundColor: GOLD }} />
    </div>
  );
}

function KV({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="flex items-baseline justify-between gap-4 border-b py-2.5 text-sm"
      style={{ borderColor: MB_COLORS.borderLight }}
    >
      <span style={{ color: INK_MUTED }}>{label}</span>
      <span style={{ color: INK }} className="text-right">{value}</span>
    </div>
  );
}

function KVRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between">
      <span style={{ color: INK_MUTED }}>{label}</span>
      <span style={{ color: INK }} className="font-medium">{value}</span>
    </div>
  );
}

function EstimatedTotalRow({ value }: { value: string }) {
  return (
    <div className="mt-4 flex items-baseline justify-between border-t pt-4" style={{ borderColor: MB_COLORS.border }}>
      <span style={{ ...serif, color: INK }} className="text-[clamp(1.2rem,1.6vw,28px)] font-semibold">
        Estimated total
      </span>
      <span style={{ ...serif, color: GOLD }} className="text-[clamp(1.2rem,1.6vw,28px)] font-semibold">
        {value}
      </span>
    </div>
  );
}

function DiscountCode({ onApply }: { onApply: () => void }) {
  const [code, setCode] = useState("");
  return (
    <div className="flex gap-3">
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder={DISCOUNT_PLACEHOLDER}
        className="flex-1 rounded border border-gray-300 px-4 py-2.5 text-sm focus:border-gray-600 focus:outline-none"
        style={{ color: INK }}
      />
      <button
        onClick={onApply}
        className="rounded px-6 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
        style={{ backgroundColor: GOLD }}
      >
        Apply
      </button>
    </div>
  );
}

function ActionRow({ showToast }: { showToast: (msg: string) => void }) {
  const copyLink = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast("Link copied to clipboard.");
    }
  };
  return (
    <>
      <div className="mt-8 flex flex-wrap gap-3">
        <SecondaryButton label="Generate PDF" onClick={() => showToast("PDF generation coming soon.")} />
        <SecondaryButton label="Share Link" onClick={copyLink} />
        <SecondaryButton label="WhatsApp" onClick={() => showToast("WhatsApp share coming soon.")} />
        <PrimaryButton label="Save Booking" onClick={() => showToast("Booking saved locally.")} />
      </div>
    </>
  );
}

function SecondaryButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="rounded border px-6 py-3 text-sm font-medium transition-colors hover:bg-gray-50"
      style={{ borderColor: MB_COLORS.border, color: INK }}
    >
      {label}
    </button>
  );
}

function PrimaryButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="rounded px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
      style={{ backgroundColor: GOLD }}
    >
      {label}
    </button>
  );
}

function StartOver({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="mt-6 inline-flex items-center gap-2 text-sm transition-opacity hover:opacity-70"
      style={{ color: GOLD }}
    >
      <span aria-hidden>↺</span> Start Over
    </button>
  );
}

function Toast({ toast }: { toast: string | null }) {
  if (!toast) return null;
  return (
    <div
      className="mt-4 rounded border px-4 py-2 text-sm"
      style={{ backgroundColor: `${GOLD}20`, borderColor: GOLD, color: INK }}
    >
      {toast}
    </div>
  );
}
