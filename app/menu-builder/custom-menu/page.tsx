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
    } else if (state.selectedCuisineCategories.length === 0) {
      router.replace("/menu-builder/cuisine");
    }
  }, [
    hydrated,
    state.cateringType,
    state.venueId,
    state.customVenueAddress,
    state.selectedCuisineCategories.length,
    router,
  ]);

  if (!hydrated || state.cateringType !== "venue-event") return null;

  return <CustomMenuStep />;
}
