import Image from "next/image";
import NumeralMarker from "@/components/ui/NumeralMarker";

const serif = { fontFamily: "var(--font-cormorant-garamond)" } as const;

export default function AboutSection() {
  return (
    <section className="flex min-h-screen w-full flex-col items-center bg-[#fdfbf5] px-6 py-24 text-center">
      {/* III ABOUT */}
      <div className="flex items-center gap-4">
        <NumeralMarker numeral="III" />
        <span style={serif} className="uppercase tracking-[0.25em] text-[#444444] text-[clamp(1rem,1.25vw,24px)]">About</span>
      </div>

      {/* OUR STORY */}
      <div className="mt-12">
        <p className="font-semibold uppercase tracking-[0.2em] text-[#444444] text-[clamp(0.8rem,0.94vw,18px)]">Our Story</p>
        <span className="mx-auto mt-2 block h-px w-16 bg-[#bf9a3f]" />
      </div>

      {/* Gold brand heading */}
      <h2 style={serif} className="mt-8 font-semibold text-[#bf9a3f] text-[clamp(2rem,3.4vw,66px)]">
        Raj Aangan Events and Caterers
      </h2>

      {/* Row 1: image + paragraph */}
      <div className="mt-16 grid w-full max-w-[1200px] grid-cols-1 items-center gap-12 md:grid-cols-2">
        <div className="relative aspect-square w-full">
          <Image src="/images/about-1.jpg" alt="Chef plating a luxury catering spread" fill className="object-cover" sizes="(max-width: 768px) 100vw, 600px" />
          <div className="pointer-events-none absolute inset-5 border border-white/80" />
        </div>
        <p style={serif} className="leading-relaxed text-[#2a2a2a] text-[clamp(1.1rem,1.45vw,28px)] md:px-6">
          What started as a passion for bringing people together has grown into one of Jaipur&rsquo;s trusted names in luxury events, destination weddings, and premium catering experiences. Inspired by Rajasthan&rsquo;s royal culture and timeless traditions, Raj Aangan blends heritage hospitality with modern event craftsmanship.
        </p>
      </div>

      {/* Row 2: image + stats */}
      <div className="mt-16 grid w-full max-w-[1200px] grid-cols-1 items-center gap-12 md:grid-cols-2">
        <div className="relative aspect-square w-full">
          <Image src="/images/about-2.jpg" alt="Dessert and food display" fill className="object-cover" sizes="(max-width: 768px) 100vw, 600px" />
          <div className="pointer-events-none absolute inset-5 border border-white/80" />
        </div>
        <div className="flex flex-col items-center gap-12">
          <Stat icon={<CalendarIcon />} value="200+" label="Events" />
          <Stat icon={<UsersIcon />} value="10,000+" label="Guests" />
          <Stat icon={<CalendarIcon />} value="15+" label="Years of Experience" />
        </div>
      </div>

      <a href="#" className="mt-16 rounded-full border border-[#191919] px-8 py-3 text-sm font-medium text-[#191919] transition-colors duration-300 hover:bg-[#191919] hover:text-white">
        See Details
      </a>
    </section>
  );
}

function Stat({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="flex flex-col items-center text-center">
      <span className="mb-3 text-[#444444]">{icon}</span>
      <p style={serif} className="text-[#3a3a3a] text-[clamp(1.4rem,2.08vw,40px)]">
        <span className="font-medium">{value} </span>
        {label}
      </p>
    </div>
  );
}

function CalendarIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
