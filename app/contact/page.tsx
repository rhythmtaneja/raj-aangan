import ContactHero from "@/components/sections/contact/ContactHero";
import AddressSection from "@/components/sections/contact/AddressSection";
import ContactAccordion from "@/components/sections/contact/ContactAccordion";
import ContactForm from "@/components/sections/contact/ContactForm";
import FooterSection from "@/components/sections/FooterSection";
import { getSiteImages } from "@/lib/site-images/queries";

const PAGE_BG = "#0a1e26";

export default async function ContactPage() {
  const siteImages = await getSiteImages();
  return (
    <main style={{ backgroundColor: PAGE_BG }}>
      <ContactHero bgImage={siteImages.contactHeroImage ?? undefined} />
      <AddressSection />
      <ContactAccordion />
      <ContactForm />
      <FooterSection />
    </main>
  );
}
