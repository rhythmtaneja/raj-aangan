// ══════════════════════════════════════════════════════════════════
// PATH IN REPO: app/menu-builder/menu/page.tsx
// ══════════════════════════════════════════════════════════════════
// One Menu route, two behaviours — chosen by the selected venue's kind:
//   • Raj Aangan (set-menu flow) → <SetMenuStep>
//   • everything else (cuisine)   → <CuisineMenuStep>
// Keeps routing simple (a single /menu-builder/menu URL for both sub-flows).
// Redirects out if the wizard was deep-linked without the prerequisite state.
// ═══════════════════════════════════════════════════════════════════════════

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import CuisineMenuStep from "@/components/menu-builder/CuisineMenuStep";
import SetMenuStep from "@/components/menu-builder/SetMenuStep";
import { useBooking } from "@/lib/menu-builder/context";
import { useCatalog } from "@/lib/menu-builder/catalog";
import { isSetMenuFlow } from "@/lib/menu-builder/flow";

export default function MenuStepPage() {
  const { state, hydrated } = useBooking();
  const { venues } = useCatalog();
  const router = useRouter();

  // Route protection: need a catering type, and (for venue events) a venue.
  useEffect(() => {
    if (!hydrated) return;
    if (state.cateringType !== "venue-event") {
      router.replace("/menu-builder/client");
    } else if (!state.venueId && !state.customVenueAddress.trim()) {
      router.replace("/menu-builder/venue");
    }
  }, [hydrated, state.cateringType, state.venueId, state.customVenueAddress, router]);

  if (!hydrated || state.cateringType !== "venue-event") return null;

  return isSetMenuFlow(state, venues) ? <SetMenuStep /> : <CuisineMenuStep />;
}
