"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import SetMenuStep from "@/components/menu-builder/SetMenuStep";
import { useBooking } from "@/lib/menu-builder/context";

export default function MenuStepPage() {
  const { state, hydrated } = useBooking();
  const router = useRouter();

  useEffect(() => {
    if (!hydrated) return;
    if (state.cateringType !== "venue-event") {
      router.replace("/menu-builder/client");
    } else if (!state.venueId && !state.customVenueAddress.trim()) {
      router.replace("/menu-builder/venue");
    }
  }, [
    hydrated,
    state.cateringType,
    state.venueId,
    state.customVenueAddress,
    router,
  ]);

  if (!hydrated || state.cateringType !== "venue-event") return null;

  return <SetMenuStep />;
}
