import { BookingProvider } from "@/lib/menu-builder/context";
import { CatalogProvider } from "@/lib/menu-builder/catalog";
import { getCatalog } from "@/lib/menu-builder/queries";

// Server component: fetches the catalog once (Sanity or fallback) and hands
// it to the client CatalogProvider. Shared across all wizard steps, so this
// runs once per wizard session, not per step.
export default async function MenuBuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const catalog = await getCatalog();
  return (
    <CatalogProvider catalog={catalog}>
      <BookingProvider>{children}</BookingProvider>
    </CatalogProvider>
  );
}
