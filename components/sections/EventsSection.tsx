import Image from "next/image";
import NumeralMarker from "@/components/ui/NumeralMarker";

const serif = { fontFamily: "var(--font-cormorant-garamond)" } as const;

const EVENTS = ["Conference", "Event", "Catering"];
const LOREM = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt";

export default function EventsSection() {
  return (
    <section className="w-full bg-[#f1ece3] pb-24">
      {/* Banner with V EVENTS */}
      <div className="relative aspect-16/7 w-full">
        <Image src="/images/events-banner.jpg" alt="Elegant event ballroom" fill className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 flex items-center justify-center gap-4">
          <NumeralMarker numeral="V" light />
          <span style={serif} className="uppercase tracking-[0.25em] text-white text-[clamp(1.25rem,1.66vw,32px)] [text-shadow:0_1px_8px_rgba(0,0,0,0.5)]">
            Events
          </span>
        </div>
      </div>

      {/* Cards */}
      <div className="mx-auto -mt-16 grid w-full max-w-325 grid-cols-1 gap-10 px-6 md:grid-cols-3">
        {EVENTS.map((title) => (
          <div key={title} className="relative p-3">
            <div className="pointer-events-none absolute inset-0 border border-[#9a9a9a]" />
            <div className="relative flex flex-col items-center border border-[#d8d2c8] bg-white px-8 py-12 text-center">
              <h3 style={serif} className="text-[#2a2a2a] text-[clamp(1.75rem,2.6vw,50px)]">{title}</h3>
              <p className="mt-5 leading-relaxed text-[#555555] text-[clamp(0.9rem,1.04vw,18px)]">{LOREM}</p>
              <a href="#" className="mt-8 rounded-full border border-[#191919] px-7 py-2.5 text-sm font-medium text-[#191919] transition-colors duration-300 hover:bg-[#191919] hover:text-white">
                More
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
