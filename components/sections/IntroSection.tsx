import NumeralMarker from "@/components/ui/NumeralMarker";
import Reveal from "@/components/anim/Reveal";

const serif = { fontFamily: "var(--font-cormorant-garamond)" } as const;

export default function IntroSection() {
  return (
    <section className="relative flex min-h-screen w-full flex-col items-center justify-center bg-white px-6 py-32 text-center">
      {/* numeral animates its own glyph (slides + fades) */}
      <div className="mb-28">
        <NumeralMarker numeral="I" />
      </div>

      {/* text zooms toward you (scaleFrom) + rises, replaying on scroll-in */}
      <Reveal stagger staggerEach={0.12} y={16} scaleFrom={0.7} className="flex flex-col items-center">
        <h2 style={serif} className="max-w-[1600px] font-semibold leading-[1.05] text-[#191919] text-[clamp(2rem,3.9vw,75px)]">
          A Royal Destination where celebrations come alive.
        </h2>

        <div style={serif} className="mt-6 font-semibold leading-[1.15] text-[#8a8a8a]">
          <p className="text-[clamp(1.5rem,3.39vw,65px)]">Luxury Weddings &middot; Refined Catering &middot;</p>
          <p className="text-[clamp(1.25rem,2.86vw,55px)]">Memories Forever</p>
        </div>

        <a href="#" style={serif} className="mt-28 flex h-32 w-32.75 items-center justify-center rounded-full border border-[#737272] text-[#191919] text-[clamp(1rem,1.25vw,24px)] transition-colors duration-300 hover:bg-[#191919] hover:text-white">
          View
        </a>
      </Reveal>
    </section>
  );
}
