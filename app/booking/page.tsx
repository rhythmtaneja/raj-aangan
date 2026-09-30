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
      <BookingClient />
      <FooterSection />
    </main>
  );
}
