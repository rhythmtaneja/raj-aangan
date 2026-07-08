import { BookingProvider } from "@/lib/menu-builder/context";

export default function MenuBuilderLayout({ children }: { children: React.ReactNode }) {
  return <BookingProvider>{children}</BookingProvider>;
}
