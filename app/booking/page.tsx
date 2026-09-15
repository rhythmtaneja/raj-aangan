// ══════════════════════════════════════════════════════════════════
// PATH IN REPO: app/booking/page.tsx
// ══════════════════════════════════════════════════════════════════
/**
 * /booking — where the header's "Booking" pill now goes, on phone AND desktop.
 *
 *   hero photograph
 *   → a CTA that drops to the guest's saved quotations (or, with none saved,
 *     into the Menu Builder)
 *   → Booking History: every quote the guest completed in the wizard, saved
 *     automatically when they reached the Quote step.
 *
 * With no history the page is deliberately just the hero and the footer — see
 * BookingHistorySection's header for why that is the literal requirement and
 * why it also happens to be the only SSR-safe shape.
 *
 * ⚠️ PAGE_BG must match HERO_BLEND_TO_COLOR in BookingHero.tsx (both are the
 * menu builder's navy, MB_COLORS.bg) or a colour seam appears under the hero.
 * Same coupling as app/gallery/page.tsx documents against GalleryHero.
 */

import type { Metadata } from "next";
import BookingClient from "@/components/sections/booking/BookingClient";
import FooterSection from "@/components/sections/FooterSection";
import { MB_COLORS } from "@/lib/menu-builder/types";

const PAGE_BG = MB_COLORS.bg;

export const metadata: Metadata = {
  title: "Your Bookings | Raj Aangan Events and Caterers",
  description:
    "Review the quotations you have built with Raj Aangan Events and Caterers, or start a new booking.",
};

export default function BookingPage() {
  return (
    <main style={{ backgroundColor: PAGE_BG }}>
      {/* Hero + history both read the same localStorage, so one client
          component owns that subscription. */}
      <BookingClient />
      <FooterSection />
    </main>
  );
}
