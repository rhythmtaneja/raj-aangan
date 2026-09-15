// ══════════════════════════════════════════════════════════════════
// PATH IN REPO: components/sections/booking/BookingClient.tsx
// ══════════════════════════════════════════════════════════════════
/**
 * The client half of /booking.
 *
 * The hero's CTA and the history list are driven by the SAME localStorage
 * read, so the subscription is owned here and passed down rather than each
 * component calling `useBookingHistory()` for itself — two subscriptions can
 * land a frame apart, which is exactly long enough to show "Start Your
 * Booking" above a list of existing bookings.
 *
 * The page itself (app/booking/page.tsx) stays a server component so it can
 * keep fetching its hero photo from Sanity like every other page.
 */

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
      {/* Renders null while the list is empty — including the whole
          pre-hydration pass, which is what keeps SSR and the first client
          render identical. */}
      <BookingHistorySection history={history} onRemove={remove} />
    </>
  );
}
