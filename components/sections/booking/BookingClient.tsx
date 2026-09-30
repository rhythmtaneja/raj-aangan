"use client";

import { useBookingHistory } from "@/lib/menu-builder/booking-history";
import BookingHero from "./BookingHero";
import BookingHistorySection from "./BookingHistorySection";

export default function BookingClient({ heroImage }: { heroImage?: string }) {
  const { history, hydrated, remove } = useBookingHistory();

  return (
    <>
      <BookingHero
        hasHistory={history.length > 0}
        hydrated={hydrated}
        bgImage={heroImage}
      />

      <BookingHistorySection history={history} onRemove={remove} />
    </>
  );
}
