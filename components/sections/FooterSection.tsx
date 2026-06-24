import Image from "next/image";

const serif = { fontFamily: "var(--font-cormorant-garamond)" } as const;

const EXPLORE = [
  { num: "I", label: "Weddings" },
  { num: "II", label: "Birthdays" },
  { num: "III", label: "Restaurant" },
  { num: "IV", label: "Hotel" },
  { num: "V", label: "Catering" },
  { num: "VI", label: "Info" },
];

export default function FooterSection() {
  return (
    <footer className="grid w-full grid-cols-1 md:grid-cols-[1.33fr_1fr]">
      {/* Left: explore grid (white) */}
      <div className="bg-white px-12 py-20 md:px-20">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2">
          <ul className="space-y-7">
            {EXPLORE.map(({ num, label }) => (
              <li key={label} className="flex items-baseline gap-5">
                <span style={serif} className="w-8 text-[#8a8a8a] text-[clamp(0.9rem,0.94vw,18px)]">{num}</span>
                <a href="#" style={serif} className="text-[#1a1a1a] transition-opacity hover:opacity-60 text-[clamp(1.6rem,1.97vw,38px)]">{label}</a>
              </li>
            ))}
          </ul>

          <div>
            <h3 style={serif} className="text-[#1a1a1a] text-[clamp(1.4rem,1.66vw,32px)]">More about events</h3>
            <ul className="mt-6 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <li key={i}>
                  <a href="#" style={serif} className="text-[#6a6a6a] transition-colors hover:text-[#1a1a1a] text-[clamp(1rem,1.04vw,20px)]">
                    More about events
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Right: brand + contact (dark navy) */}
      <div className="flex flex-col items-center justify-center gap-6 bg-[#0f2f3b] px-12 py-20 text-center text-white">
        <Image src="/images/logo.png" alt="Raj Aangan Events and Caterers" width={90} height={90} />

        <h3 style={serif} className="max-w-90 leading-tight text-[clamp(1.6rem,2.08vw,40px)]">
          Raj Aangan Events and Caterers
        </h3>

        <p style={serif} className="max-w-105 leading-relaxed text-white/80 text-[clamp(0.95rem,1.04vw,20px)]">
          Maharaja Kishan Singh Nahar, Patrakar Colony, Mansarovar, Jaipur, Rajasthan 302020
        </p>

        <p className="text-white/90 text-[clamp(0.95rem,1.04vw,20px)]">+91 98290 12815</p>

        <div className="mt-2 flex items-center gap-6">
          <a href="#" aria-label="Facebook" className="transition-opacity hover:opacity-70"><FacebookIcon /></a>
          <a href="#" aria-label="Instagram" className="transition-opacity hover:opacity-70"><InstagramIcon /></a>
          <a href="#" aria-label="YouTube" className="transition-opacity hover:opacity-70"><YoutubeIcon /></a>
        </div>
      </div>
    </footer>
  );
}

function FacebookIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.55-1.5h1.65V3.6c-.8-.1-1.6-.15-2.4-.15-2.4 0-4.05 1.45-4.05 4.15v2.3H7.5V13h2.75v8h3.25z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M22 8.2a2.6 2.6 0 0 0-1.8-1.85C18.6 6 12 6 12 6s-6.6 0-8.2.35A2.6 2.6 0 0 0 2 8.2 27 27 0 0 0 1.75 12 27 27 0 0 0 2 15.8a2.6 2.6 0 0 0 1.8 1.85C5.4 18 12 18 12 18s6.6 0 8.2-.35A2.6 2.6 0 0 0 22 15.8 27 27 0 0 0 22.25 12 27 27 0 0 0 22 8.2zM10 14.6V9.4l4.4 2.6-4.4 2.6z" />
    </svg>
  );
}
