// ══════════════════════════════════════════════════════════════════
// PATH IN REPO: app/menu-builder/menu/page.tsx
// ══════════════════════════════════════════════════════════════════
// The venue-event Menu step — now the fixed set-menu picker for EVERY venue
// (Raj Aangan or partner). The from-scratch builder lives on separate routes
// (/cuisine → /custom-menu), reached via the CTA inside <SetMenuStep>.
// Redirects out if the wizard was deep-linked without prerequisite state.
// ═══════════════════════════════════════════════════════════════════════════

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import SetMenuStep from "@/components/menu-builder/SetMenuStep";
import { useBooking } from "@/lib/menu-builder/context";

export default function MenuStepPage() {
  const { state, hydrated } = useBooking();
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

  return <SetMenuStep />;
}
