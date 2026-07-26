// ══════════════════════════════════════════════════════════════════
// PATH IN REPO: app/menu-builder/custom-menu/page.tsx
// ══════════════════════════════════════════════════════════════════
// Custom builder — step 2 of 2. The from-scratch dish picker (same design as
// the old cuisine-flow menu). Reached from /cuisine; continues to Presentation.
// A sub-screen of the Menu step in the progress bar.
// ═══════════════════════════════════════════════════════════════════════════

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import CustomMenuStep from "@/components/menu-builder/CustomMenuStep";
import { useBooking } from "@/lib/menu-builder/context";

export default function CustomMenuPage() {
  const { state, hydrated } = useBooking();
  const router = useRouter();

  useEffect(() => {
    if (!hydrated) return;
    if (state.cateringType !== "venue-event") {
      router.replace("/menu-builder/client");
    } else if (!state.venueId && !state.customVenueAddress.trim()) {
      router.replace("/menu-builder/venue");
    }
  }, [hydrated, state.cateringType, state.venueId, state.customVenueAddress, router]);

  if (!hydrated || state.cateringType !== "venue-event") return null;

  return <CustomMenuStep />;
}
