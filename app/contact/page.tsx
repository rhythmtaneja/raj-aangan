import ContactHero from "@/components/sections/contact/ContactHero";
import AddressSection from "@/components/sections/contact/AddressSection";
import ContactAccordion from "@/components/sections/contact/ContactAccordion";
import ContactForm from "@/components/sections/contact/ContactForm";
import FooterSection from "@/components/sections/FooterSection";

// ═══════════════════════════════════════════════════════════════════════════
// Page background — shows through only where sections don't have their own
// bg. The AddressSection + ContactAccordion are cream, so the dark navy
// PAGE_BG shows before/after them. ContactHero fades DOWN into cream
// (not this dark navy) because AddressSection comes next — see the
// HERO_BLEND_TO_COLOR knob in ContactHero.tsx.
// ═══════════════════════════════════════════════════════════════════════════
const PAGE_BG = "#0a1e26";

export default function ContactPage() {
  return (
    <main style={{ backgroundColor: PAGE_BG }}>
      <ContactHero />
      <AddressSection />
      <ContactAccordion />
      <ContactForm />
      <FooterSection />
    </main>
  );
}
