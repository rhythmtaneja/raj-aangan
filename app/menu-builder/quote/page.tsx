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
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import BuilderLayout from "@/components/menu-builder/BuilderLayout";
import { useBooking } from "@/lib/menu-builder/context";
import { useCatalog } from "@/lib/menu-builder/catalog";
import { usePricingData } from "@/lib/menu-builder/catalog-hooks";
import { getSteps, stepIndexOf } from "@/lib/menu-builder/flow";
import {
  findDiscountCode,
  formatINR,
  getAddOnPricePerItem,
  getDiscountAmount,
  getGstAmount,
  getOutdoorLines,
  getOutdoorSubtotal,
  getSetMenuAddOnCount,
  getSetMenuAddOnPerHead,
  getVenueEventPerHead,
  getVenueLogisticsPerHead,
} from "@/lib/menu-builder/pricing";
import {
  MB_COLORS,
  STEPS_OUTDOOR,
  type BookingState,
  type DiscountCode as DiscountCodeType,
  type PricingSettings,
} from "@/lib/menu-builder/types";
import {
  whatsAppText,
  whatsAppUrl,
  type QuoteDoc,
  type QuoteLine,
  type QuoteSection,
} from "@/lib/menu-builder/quote-doc";

const serif = { fontFamily: "var(--font-cormorant-garamond)" } as const;

// ═══════════════════════════════════════════════════════════════════════════
// ─── TUNE THESE KNOBS ──────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════

const CARD_BG        = MB_COLORS.card;
const INK            = MB_COLORS.ink;
const INK_MUTED      = MB_COLORS.inkMuted;
const GOLD           = MB_COLORS.gold;
const CARD_PADDING   = "p-8 md:p-10";

// Every enquiry raised from the Review screen lands on this WhatsApp number.
// 10-digit local form is fine — whatsAppUrl() prefixes +91.
const WHATSAPP_NUMBER = "9829012815";

const DISCOUNT_PLACEHOLDER = "Enter discount code";
const START_OVER_CONFIRM   = "Start over? All your selections will be cleared.";

// ═══════════════════════════════════════════════════════════════════════════

export default function QuotePage() {
  const { state, hydrated } = useBooking();
  const router = useRouter();

  useEffect(() => {
    if (!hydrated) return;
    if (!state.cateringType) router.replace("/menu-builder/client");
  }, [hydrated, state.cateringType, router]);

  if (!hydrated || !state.cateringType) return null;

  return state.cateringType === "outdoor" ? <OutdoorQuote /> : <VenueEventQuote />;
}

// ─── Venue-event quote (set package + custom builder share this) ───────────

function VenueEventQuote() {
  const { state, dispatch } = useBooking();
  const { venues, occasions, presentation, getSetMenu, getCustomItem, pricing } = useCatalog();
  const pricingData = usePricingData();
  const router = useRouter();
  const { toast, showToast } = useToast();
  const discount = useDiscount(state, pricing, showToast);

  const customMenu = state.menuMode === "custom";
  const steps = getSteps(state);
  const venue = state.venueId ? venues.find((v) => v.id === state.venueId) : null;
  const occasion =
    state.occasions.length > 0
      ? state.occasions.map((id) => occasions.find((o) => o.id === id)?.label).filter(Boolean).join(", ")
      : "—";
  const setMenu = getSetMenu(state.selectedSetMenuId);

  // Per-head basis differs by menu mode; the breakdown shape is identical.
  const addOnCount = customMenu ? 0 : getSetMenuAddOnCount(state, pricingData);
  const addOnPerHead = customMenu ? 0 : getSetMenuAddOnPerHead(state, pricingData);
  const perHeadBase = getVenueEventPerHead(state, pricingData);
  const packageBase = perHeadBase - addOnPerHead;
  const venueLogistic = getVenueLogisticsPerHead(state, venues);
  const gross = (perHeadBase + venueLogistic) * state.guests * state.eventDays;
  const discountAmount = discount.applied
    ? getDiscountAmount(gross, discount.applied.percentOff)
    : 0;
  const subtotal = gross - discountAmount;
  const gst = getGstAmount(subtotal, pricing);
  const total = subtotal + gst;

  // Presentation summary — one block per chosen live counter.
  const counters = counterSummaries(state, presentation);

  const handleStartOver = () => startOver(dispatch, router);

  // The same content the screen shows, in the shape the WhatsApp / PDF /
  // Share actions consume.
  const doc: QuoteDoc = {
    title: pricing.quoteHeading,
    subtitle: pricing.quoteSubheading,
    sections: [
      {
        title: "Client & Event",
        lines: [
          { label: "Client", value: state.clientName || "—" },
          { label: "Contact", value: state.contactPhone || "—" },
          { label: "Occasion", value: occasion },
          { label: "Date", value: state.eventDate || "—" },
          { label: "Duration", value: `${state.eventDays} Day${state.eventDays > 1 ? "s" : ""}` },
          { label: "Guests", value: String(state.guests) },
          { label: "Meal Type", value: state.mealTypes.join(", ") || "—" },
          { label: "Dietary", value: state.dietaryPreferences.join(", ") || "—" },
        ],
      },
      {
        title: "Venue & Menu",
        lines: [
          { label: "Venue", value: venue?.name || state.customVenueAddress || "—" },
          { label: "Menu", value: customMenu ? "Custom menu" : setMenu?.name || "—" },
          { label: "Pricing", value: venue?.pricingNote || `${formatINR(perHeadBase)} / head` },
        ],
      },
      {
        title: "Selected Dishes",
        notes: selectedDishNames(state, setMenu, getCustomItem),
      },
      {
        title: "Presentation & Live Counters",
        notes:
          counters.length === 0
            ? ["No live counters selected"]
            : counters.flatMap((counter, i) => [
                `${i + 1}. ${counter.name}`,
                ...counter.lines.map((l) => `   ${l.label}: ${l.value}`),
              ]),
      },
      {
        title: "Estimate",
        lines: [
          { label: "Per head base", value: formatINR(packageBase) },
          ...(addOnCount > 0
            ? [{ label: `Add-ons / head (${addOnCount})`, value: formatINR(addOnPerHead) }]
            : []),
          { label: "Venue logistic / head", value: formatINR(venueLogistic) },
          {
            label: `x ${state.guests} guests x ${state.eventDays} day${state.eventDays > 1 ? "s" : ""}`,
            value: formatINR(gross),
          },
          ...(discount.applied
            ? [
                {
                  label: `Discount (${discount.applied.code} · ${discount.applied.percentOff}%)`,
                  value: `- ${formatINR(discountAmount)}`,
                },
              ]
            : []),
          { label: `GST (${pricing.gstPercent}%)`, value: formatINR(gst) },
        ],
      },
      { title: "Terms & Notes", notes: termLines(pricing) },
    ],
    totalLabel: "Estimated total",
    totalValue: formatINR(total),
    contact: contactLine(pricing),
  };

  return (
    <BuilderLayout steps={steps} currentStep={stepIndexOf(steps, "quote")} backHref="/menu-builder/presentation">
      <div className={CARD_PADDING} style={{ backgroundColor: CARD_BG }}>
        <QuoteHeader title={pricing.quoteHeading} subtitle={pricing.quoteSubheading} />

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
        <KV label="Menu"    value={customMenu ? "Custom menu" : setMenu?.name || "—"} />
        <KV label="Pricing" value={venue?.pricingNote || `${formatINR(perHeadBase)} / head`} />

        <SectionTitle>Presentation &amp; Live Counters</SectionTitle>
        {counters.length === 0 ? (
          <p style={{ color: INK_MUTED }} className="py-1 text-sm">
            No live counters selected
          </p>
        ) : (
          counters.map((counter, i) => (
            <div key={counter.name} className={i === 0 ? "" : "mt-5"}>
              <p style={{ ...serif, color: GOLD }} className="text-base font-semibold">
                {i + 1}. {counter.name}
              </p>
              {counter.lines.map((line) => (
                <KV key={line.label} label={line.label} value={line.value} />
              ))}
            </div>
          ))
        )}

        {pricing.showDiscountField && (
          <>
            <SectionTitle>Discount Code</SectionTitle>
            <DiscountCode
              code={discount.code}
              onChange={discount.setCode}
              onApply={discount.apply}
              applied={discount.applied}
            />
          </>
        )}

        <SectionTitle>Estimated Total</SectionTitle>
        <div className="space-y-1.5 text-sm">
          <KVRow label="Per head base" value={formatINR(packageBase)} />
          {addOnCount > 0 && (
            <KVRow
              label={`Add-ons / head (${addOnCount} × ${formatINR(getAddOnPricePerItem(state, pricingData))})`}
              value={formatINR(addOnPerHead)}
            />
          )}
          <KVRow label="Venue logistic / head" value={formatINR(venueLogistic)} />
          <KVRow
            label={`x ${state.guests} guest x ${state.eventDays} day${state.eventDays > 1 ? "s" : ""}`}
            value={formatINR(gross)}
          />
          {discount.applied && (
            <KVRow
              label={`Discount (${discount.applied.code} · ${discount.applied.percentOff}%)`}
              value={`- ${formatINR(discountAmount)}`}
            />
          )}
          <KVRow label={`GST (${pricing.gstPercent}%)`} value={formatINR(gst)} />
        </div>
        <EstimatedTotalRow value={formatINR(total)} />

        <QuoteTerms pricing={pricing} />
        <ActionRow doc={doc} showToast={showToast} />
        <StartOver onClick={handleStartOver} />
        <Toast toast={toast} />
      </div>
    </BuilderLayout>
  );
}

// ─── Outdoor quote ─────────────────────────────────────────────────────────

function OutdoorQuote() {
  const { state, dispatch } = useBooking();
  const { getPackaging, pricing } = useCatalog();
  const pricingData = usePricingData();
  const router = useRouter();
  const { toast, showToast } = useToast();
  const discount = useDiscount(state, pricing, showToast);

  const packaging = getPackaging(state.packagingStyleId);
  const lineItems = getOutdoorLines(state, pricingData);

  const gross = getOutdoorSubtotal(state, pricingData);
  const discountAmount = discount.applied
    ? getDiscountAmount(gross, discount.applied.percentOff)
    : 0;
  const subtotal = gross - discountAmount;
  const gst = getGstAmount(subtotal, pricing);
  const total = subtotal + gst;

  const handleStartOver = () => startOver(dispatch, router);

  const doc: QuoteDoc = {
    title: "Review & Quote — Outdoor Order",
    subtitle: "Everything you've chosen for this bulk / delivery order.",
    sections: [
      {
        title: "Client & Delivery",
        lines: [
          { label: "Client", value: state.clientName || "—" },
          { label: "Contact", value: state.contactPhone || "—" },
          { label: "Delivery Date", value: state.eventDate || "—" },
          { label: "Address", value: state.deliveryAddress || "—" },
          { label: "Packaging", value: packaging?.label || "—" },
        ],
      },
      {
        title: "Order Items",
        notes:
          lineItems.length === 0
            ? ["No items selected yet."]
            : lineItems.map(({ label, unitPrice, qty, lineTotal }) =>
                unitPrice == null
                  ? `${qty} × ${label} — on request`
                  : `${qty} × ${label} — ${formatINR(lineTotal)}`,
              ),
      },
      {
        title: "Estimate",
        lines: [
          { label: "Subtotal", value: formatINR(gross) },
          ...(discount.applied
            ? [
                {
                  label: `Discount (${discount.applied.code} · ${discount.applied.percentOff}%)`,
                  value: `- ${formatINR(discountAmount)}`,
                },
              ]
            : []),
          { label: `GST (${pricing.gstPercent}%)`, value: formatINR(gst) },
        ],
      },
      { title: "Terms & Notes", notes: termLines(pricing) },
    ],
    totalLabel: "Estimated total",
    totalValue: formatINR(total),
    contact: contactLine(pricing),
  };

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
            {lineItems.map(({ item, variant, label, unitPrice, qty, lineTotal }) => (
              <li
                key={variant?.id ?? item.id}
                className="flex items-start justify-between gap-4 py-2 text-sm"
              >
                <div className="min-w-0">
                  <p style={{ color: INK }} className="font-medium">{label}</p>
                  <p style={{ color: INK_MUTED }} className="text-xs">
                    {unitPrice == null
                      ? `${qty} × on request`
                      : `${qty} × ${formatINR(unitPrice)} ${item.unit}`}
                  </p>
                  {variant && variant.contents.length > 0 && (
                    <p style={{ color: INK_MUTED }} className="mt-0.5 text-xs">
                      {variant.contents.join(", ")}
                    </p>
                  )}
                </div>
                <span style={{ color: GOLD }} className="shrink-0 font-medium">
                  {unitPrice == null ? "On request" : formatINR(lineTotal)}
                </span>
              </li>
            ))}
          </ul>
        )}

        {pricing.showDiscountField && (
          <>
            <SectionTitle>Discount Code</SectionTitle>
            <DiscountCode
              code={discount.code}
              onChange={discount.setCode}
              onApply={discount.apply}
              applied={discount.applied}
            />
          </>
        )}

        <SectionTitle>Estimated Total</SectionTitle>
        <div className="space-y-1.5 text-sm">
          <KVRow label="Subtotal" value={formatINR(gross)} />
          {discount.applied && (
            <KVRow
              label={`Discount (${discount.applied.code} · ${discount.applied.percentOff}%)`}
              value={`- ${formatINR(discountAmount)}`}
            />
          )}
          <KVRow label={`GST (${pricing.gstPercent}%)`} value={formatINR(gst)} />
        </div>
        <EstimatedTotalRow value={formatINR(total)} />

        <QuoteTerms pricing={pricing} />
        <ActionRow doc={doc} showToast={showToast} />
        <StartOver onClick={handleStartOver} />
        <Toast toast={toast} />
      </div>
    </BuilderLayout>
  );
}

// ─── Shared behaviour ──────────────────────────────────────────────────────

/**
 * Discount-code box state. Codes, their rules and the rejection message all
 * come from Sanity (Pricing & Quote Settings → Discounts).
 */
function useDiscount(
  state: BookingState,
  pricing: PricingSettings,
  showToast: (msg: string) => void,
) {
  const [code, setCode] = useState("");
  const [applied, setApplied] = useState<DiscountCodeType | null>(null);

  const apply = () => {
    const match = findDiscountCode(code, state, pricing);
    if (match) {
      setApplied(match);
      showToast(`${match.code} applied — ${match.percentOff}% off.`);
    } else {
      setApplied(null);
      showToast(pricing.invalidCodeMessage);
    }
  };

  return { code, setCode, applied, apply };
}

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

/**
 * One entry per selected live counter, in the order the guest picked them,
 * with that counter's own cutlery / style / stall / design names resolved.
 */
function counterSummaries(
  state: BookingState,
  presentation: ReturnType<typeof useCatalog>["presentation"],
): { name: string; lines: QuoteLine[] }[] {
  const { liveCounters, counterConfigs } = state.presentationChoices;
  const nameOf = (list: { id: string; name: string }[], id: string | null) =>
    (id ? list.find((x) => x.id === id)?.name : null) ?? "—";

  return liveCounters.map((counterId) => {
    const config = counterConfigs[counterId];
    const designs = (config?.designs ?? [])
      .map((id) => presentation.liveCounters.find((d) => d.id === id)?.name)
      .filter(Boolean)
      .join(", ");
    return {
      name: presentation.liveCounterTiles.find((t) => t.id === counterId)?.name ?? counterId,
      lines: [
        { label: "Cutlery", value: nameOf(presentation.cutlery, config?.cutlery ?? null) },
        {
          label: "Presentation Style",
          value: nameOf(presentation.presentationStyles, config?.presentationStyle ?? null),
        },
        { label: "Stall Theme", value: nameOf(presentation.stallThemes, config?.stallTheme ?? null) },
        { label: "Counter Design", value: designs || "—" },
      ],
    };
  });
}

/** Dish names for the WhatsApp / PDF copy — set-menu picks or à-la-carte. */
function selectedDishNames(
  state: BookingState,
  setMenu: ReturnType<ReturnType<typeof useCatalog>["getSetMenu"]>,
  getCustomItem: ReturnType<typeof useCatalog>["getCustomItem"],
): string[] {
  if (state.menuMode === "custom") {
    const names = state.selectedDishes
      .map((d) => getCustomItem(d.dishId)?.name)
      .filter(Boolean) as string[];
    return names.length ? names : ["No dishes selected yet."];
  }
  if (!setMenu) return ["No menu selected yet."];

  const out: string[] = [];
  for (const section of setMenu.sections) {
    const picked = (state.setMenuSelections[section.id] ?? [])
      .map((id) => section.dishOptions.find((o) => o.id === id)?.name)
      .filter(Boolean) as string[];
    if (picked.length) out.push(`${section.label}: ${picked.join(", ")}`);
  }
  return out.length ? out : ["No dishes selected yet."];
}

/** Validity / deposit / custom terms, shared by the screen and the exports. */
function termLines(pricing: PricingSettings): string[] {
  const lines: string[] = [];
  if (pricing.quoteValidityDays > 0) {
    lines.push(
      `This estimate is valid for ${pricing.quoteValidityDays} day${
        pricing.quoteValidityDays === 1 ? "" : "s"
      }.`,
    );
  }
  if (pricing.depositPercent > 0) {
    lines.push(`A ${pricing.depositPercent}% deposit confirms the booking.`);
  }
  lines.push(...pricing.quoteTerms);
  return lines;
}

function contactLine(pricing: PricingSettings): string | undefined {
  const contact = [pricing.contactPhone, pricing.contactEmail].filter(Boolean).join(" · ");
  return contact ? `Questions? ${contact}` : undefined;
}

// ─── Shared UI ─────────────────────────────────────────────────────────────

function QuoteHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <>
      <h2 style={{ ...serif, color: INK }} className="text-[clamp(1.6rem,2.3vw,2.0625rem)] font-semibold">
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
      <h3 style={{ ...serif, color: INK }} className="text-[clamp(1.1rem,1.35vw,1.1875rem)] font-semibold">
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
      <span style={{ ...serif, color: INK }} className="text-[clamp(1.2rem,1.6vw,1.4375rem)] font-semibold">
        Estimated total
      </span>
      <span style={{ ...serif, color: GOLD }} className="text-[clamp(1.2rem,1.6vw,1.4375rem)] font-semibold">
        {value}
      </span>
    </div>
  );
}

function DiscountCode({
  code,
  onChange,
  onApply,
  applied,
}: {
  code: string;
  onChange: (value: string) => void;
  onApply: () => void;
  applied: DiscountCodeType | null;
}) {
  return (
    <div className="flex gap-3">
      <input
        type="text"
        value={code}
        onChange={(e) => onChange(e.target.value)}
        placeholder={DISCOUNT_PLACEHOLDER}
        className="flex-1 rounded border px-4 py-2.5 text-sm focus:outline-none"
        style={{ color: INK, borderColor: applied ? GOLD : "#d1d5db" }}
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

/**
 * Validity, deposit, terms and contact details — every line optional and
 * editable in Studio (Pricing & Quote Settings → Quote Page). Renders nothing
 * when the client hasn't filled any of them in.
 */
function QuoteTerms({ pricing }: { pricing: PricingSettings }) {
  const lines = termLines(pricing);
  const contact = contactLine(pricing);
  if (!lines.length && !contact) return null;

  return (
    <div className="mt-8">
      <SectionTitle>Terms &amp; Notes</SectionTitle>
      {lines.length > 0 && (
        <ul className="space-y-1.5">
          {lines.map((line, i) => (
            <li key={i} style={{ color: INK_MUTED }} className="flex gap-2 text-sm">
              <span style={{ color: GOLD }} aria-hidden>
                •
              </span>
              <span>{line}</span>
            </li>
          ))}
        </ul>
      )}
      {contact && (
        <p style={{ color: INK }} className="mt-3 text-sm">
          {contact}
        </p>
      )}
    </div>
  );
}

/**
 * The three export actions, all driven off the same QuoteDoc:
 *   • Generate PDF — prints <QuotePrintable> (the browser's "Save as PDF"
 *     destination is the PDF step; see the @media print block in globals.css).
 *   • Share — the Web Share sheet where the browser has it (mobile), else the
 *     quote text + link go to the clipboard.
 *   • WhatsApp — opens a wa.me chat with WHATSAPP_NUMBER, pre-filled with the
 *     whole enquiry.
 */
function ActionRow({ doc, showToast }: { doc: QuoteDoc; showToast: (msg: string) => void }) {
  const pageUrl = () => (typeof window === "undefined" ? "" : window.location.href);

  const generatePdf = () => {
    showToast("Opening your print dialog — choose \u201cSave as PDF\u201d.");
    // Let the toast paint before print() blocks the main thread.
    setTimeout(() => window.print(), 150);
  };

  const share = async () => {
    const text = whatsAppText(doc);
    const url = pageUrl();
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: doc.title, text, url });
        return;
      } catch {
        // Dismissed or unsupported payload — fall through to the clipboard.
      }
    }
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(text);
        showToast("Quote copied to clipboard.");
        return;
      } catch {
        // Clipboard blocked (insecure origin / permission) — tell the guest.
      }
    }
    showToast("Sharing isn\u2019t available in this browser.");
  };

  const sendWhatsApp = () => {
    // No page link: the quote lives in this guest's localStorage, so the URL
    // restores nothing on the other end.
    window.open(
      whatsAppUrl(WHATSAPP_NUMBER, whatsAppText(doc)),
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <>
      <div className="mt-8 flex flex-wrap gap-3 print:hidden">
        <SecondaryButton label="Generate PDF" onClick={generatePdf} />
        <SecondaryButton label="Share" onClick={share} />
        <SecondaryButton label="WhatsApp" onClick={sendWhatsApp} />
        <PrimaryButton label="Save Booking" onClick={() => showToast("Booking saved locally.")} />
      </div>
      <QuotePrintable doc={doc} />
    </>
  );
}

/**
 * Print-only rendering of the quote. Hidden on screen; globals.css' @media
 * print block hides everything else and reveals this, so "Generate PDF" needs
 * no PDF library.
 *
 * PORTALLED TO <body> ON PURPOSE. The print rule hides the rest of the app
 * with `display: none` (a `visibility: hidden` node still occupies its full
 * height, which pushed 2 blank pages onto the PDF), and `display: none` can
 * only be applied to body's own children without taking this node down too.
 */
function QuotePrintable({ doc }: { doc: QuoteDoc }) {
  // Portals need the DOM, so mount on the client only — the printable has no
  // job during SSR.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);
  if (!mounted) return null;

  return createPortal(
    <div id="quote-print" aria-hidden>
      <h1 style={{ ...serif, color: INK }} className="text-2xl font-semibold">
        {doc.title}
      </h1>
      {doc.subtitle && <p className="mt-1 text-sm">{doc.subtitle}</p>}

      {doc.sections.map((section: QuoteSection) => {
        const hasContent = (section.lines?.length ?? 0) + (section.notes?.length ?? 0) > 0;
        if (!hasContent) return null;
        return (
          <div key={section.title} className="mt-5">
            <h2
              style={{ ...serif, color: INK }}
              className="border-b pb-1 text-base font-semibold"
            >
              {section.title}
            </h2>
            {section.lines?.map((line) => (
              <div key={line.label} className="flex justify-between gap-4 py-0.5 text-sm">
                <span>{line.label}</span>
                <span className="text-right">{line.value}</span>
              </div>
            ))}
            {section.notes?.map((note, i) => (
              <p key={i} className="whitespace-pre-wrap py-0.5 text-sm">
                {note}
              </p>
            ))}
          </div>
        );
      })}

      <div className="mt-5 flex justify-between border-t pt-3 text-base font-semibold">
        <span style={serif}>{doc.totalLabel}</span>
        <span style={serif}>{doc.totalValue}</span>
      </div>
      {doc.contact && <p className="mt-3 text-sm">{doc.contact}</p>}
    </div>,
    document.body,
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
      className="mt-6 inline-flex items-center gap-2 text-sm transition-opacity hover:opacity-70 print:hidden"
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
