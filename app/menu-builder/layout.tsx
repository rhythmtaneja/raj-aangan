import { BookingProvider } from "@/lib/menu-builder/context";
import { CatalogProvider } from "@/lib/menu-builder/catalog";
import { getCatalog } from "@/lib/menu-builder/queries";

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
