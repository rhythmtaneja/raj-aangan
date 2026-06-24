import NumeralMarker from "@/components/ui/NumeralMarker";

const serif = { fontFamily: "var(--font-cormorant-garamond)" } as const;
const SERVICES = ["Weddings", "Events", "Catering"];

export default function ServicesSection() {
  return (
    <section className="flex min-h-screen w-full flex-col items-center justify-center gap-16 bg-white px-12 py-24">
      <NumeralMarker numeral="II" />

      <div className="flex w-full max-w-375 items-center justify-between gap-8">
        {SERVICES.map((s) => (
          <span key={s} style={serif} className="font-semibold text-[#8a8a8a] text-[clamp(2.5rem,4.7vw,90px)]">
            {s}
          </span>
        ))}
      </div>

      <a href="#" className="rounded-full border border-[#191919] px-10 py-3 font-medium text-[#191919] text-[clamp(1rem,1.04vw,20px)] transition-colors duration-300 hover:bg-[#191919] hover:text-white">
        Explore
      </a>
    </section>
  );
}
