// ══════════════════════════════════════════════════════════════════
// PATH IN REPO: components/sections/AboutSection.tsx
// ══════════════════════════════════════════════════════════════════

// Hover-zoom recipe (same as GalleryGridSection):
//   • `group` on the overflow-hidden container
//   • `transition-transform duration-[1200ms] ease-out group-hover:scale-105`
//     on the <Image>
//   • `z-10` on the inner outline frame so it stays put while the image
//     scales beneath it
// Row 1's Parallax wrapper untouched — parallax translates the container,
// hover scales the image element, different DOM nodes, no conflict.
// ══════════════════════════════════════════════════════════════════

import Image from "next/image";
import NumeralMarker from "@/components/ui/NumeralMarker";
import Reveal from "@/components/anim/Reveal";
import Parallax from "@/components/anim/Parallax";
import CountUp from "@/components/anim/CountUp";

const serif = { fontFamily: "var(--font-cormorant-garamond)" } as const;

// ═══════════════════════════════════════════════════════════════════════════
// ─── TUNE THESE KNOBS ──────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════

// Hover zoom recipe (shared with GalleryGridSection). Change here to affect
// every About photo consistently.
const HOVER_TRANSITION = "transition-transform duration-[1200ms] ease-out";
const HOVER_SCALE = "group-hover:scale-105";

// ═══════════════════════════════════════════════════════════════════════════

// ── ADD ABOUT IMAGES HERE ───────────────────────────────────────────────────
const ABOUT_IMAGES = [
  "/images/about-2.jpg",
  "/images/about-3.jpg",
  // "/images/about-4.jpg",
];

export default function AboutSection() {
  return (
    <section className="flex w-full flex-col items-center bg-[#fdfbf5] px-6 py-24 text-center">
      {/* III ABOUT + OUR STORY + gold heading */}
      <Reveal stagger staggerEach={0.12} className="flex flex-col items-center">
        <div className="flex items-center gap-4">
          <NumeralMarker numeral="III" />
          <span style={serif} className="uppercase tracking-[0.25em] text-[#444444] text-[clamp(1rem,1.25vw,24px)]">About</span>
        </div>
        <div className="mt-12">
          <p className="font-semibold uppercase tracking-[0.2em] text-[#444444] text-[clamp(0.8rem,0.94vw,18px)]">Our Story</p>
          <span className="mx-auto mt-2 block h-px w-16 bg-[#bf9a3f]" />
        </div>
        <h2 style={serif} className="mt-8 font-semibold text-[#bf9a3f] text-[clamp(2rem,3.4vw,66px)]">
          Raj Aangan Events and Caterers
        </h2>
      </Reveal>

      {/* Row 1: image (parallax + hover zoom) + paragraph */}
      <div className="mt-16 grid w-full max-w-300 grid-cols-1 items-center gap-12 md:grid-cols-2">
        <div className="group relative aspect-square w-full overflow-hidden">
          <Parallax distance={30} className="absolute -inset-y-12 inset-x-0">
            <div className="relative h-full w-full">
              <Image
                src="/images/about-1.jpg"
                alt="Chef plating a luxury catering spread"
                fill
                className={`object-cover ${HOVER_TRANSITION} ${HOVER_SCALE}`}
                sizes="(max-width: 768px) 100vw, 600px"
              />
            </div>
          </Parallax>
          <div className="pointer-events-none absolute z-10 inset-5 border border-white/80" />
        </div>
        <Reveal>
          <p style={serif} className="leading-relaxed text-[#2a2a2a] text-[clamp(1.1rem,1.45vw,28px)] md:px-6">
            What started as a passion for bringing people together has grown into one of Jaipur&rsquo;s trusted names in luxury events, destination weddings, and premium catering experiences. Inspired by Rajasthan&rsquo;s royal culture and timeless traditions, Raj Aangan blends heritage hospitality with modern event craftsmanship.
          </p>
        </Reveal>
      </div>

      {/* Row 2: SCROLLING image stack (left, each with hover zoom) + STICKY stats (right) */}
      <div className="mt-16 grid w-full max-w-300 grid-cols-1 gap-12 md:grid-cols-2 md:items-start">
        <div className="flex flex-col gap-12">
          {ABOUT_IMAGES.map((src, i) => (
            <div key={src} className="group relative aspect-square w-full overflow-hidden">
              <Image
                src={src}
                alt={`Raj Aangan catering ${i + 1}`}
                fill
                className={`object-cover ${HOVER_TRANSITION} ${HOVER_SCALE}`}
                sizes="(max-width: 768px) 100vw, 600px"
              />
              <div className="pointer-events-none absolute z-10 inset-5 border border-white/80" />
            </div>
          ))}
        </div>

        {/* Sticky: stays pinned while the images on the left scroll past */}
        <div className="md:sticky md:top-28 md:self-start">
          <Reveal stagger staggerEach={0.15} className="flex flex-col items-center gap-12 py-8">
            <Stat icon={<CalendarIcon />} end={200} suffix="+" label="Events" />
            <Stat icon={<UsersIcon />} end={10000} suffix="+" label="Guests" />
            <Stat icon={<CalendarIcon />} end={15} suffix="+" label="Years of Experience" />
          </Reveal>
        </div>
      </div>

      <Reveal>
        <a href="#" className="mt-16 inline-block rounded-full border border-[#191919] px-8 py-3 text-sm font-medium text-[#191919] transition-colors duration-300 hover:bg-[#191919] hover:text-white">
          See Details
        </a>
      </Reveal>
    </section>
  );
}

function Stat({ icon, end, suffix, label }: { icon: React.ReactNode; end: number; suffix?: string; label: string }) {
  return (
    <div className="flex flex-col items-center text-center">
      <span className="mb-3 text-[#444444]">{icon}</span>
      <p style={serif} className="text-[#3a3a3a] text-[clamp(1.4rem,2.08vw,40px)]">
        <span className="font-medium">
          <CountUp end={end} suffix={suffix} />{" "}
        </span>
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
