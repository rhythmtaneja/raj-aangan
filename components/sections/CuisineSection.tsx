import Image from "next/image";

const serif = { fontFamily: "var(--font-cormorant-garamond)" } as const;
const CUISINES = [
  { name: "Rajasthani", img: "/images/cuisine-rajasthani.jpg" },
  { name: "Punjabi", img: "/images/cuisine-punjabi.jpg" },
  { name: "Dessert", img: "/images/cuisine-dessert.jpg" },
];

export default function CuisineSection() {
  return (
    <section className="flex min-h-screen w-full flex-col items-center bg-[#ebe5db] px-6 py-24">
      <h2 style={serif} className="mb-14 font-semibold uppercase tracking-[0.2em] text-[#6b4f3a] text-[clamp(1.5rem,2.08vw,40px)]">
        Our Cuisine
      </h2>

      <div className="grid w-full max-w-375 grid-cols-1 gap-6 md:grid-cols-3">
        {CUISINES.map((c) => (
          <div key={c.name} className="relative aspect-square overflow-hidden">
            <Image src={c.img} alt={`${c.name} cuisine`} fill className="object-cover" sizes="(max-width: 768px) 100vw, 500px" />
            <div className="absolute inset-0 bg-black/15" />
            <div className="pointer-events-none absolute inset-5 border border-white/70" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
              <h3 style={serif} className="font-semibold uppercase tracking-[0.15em] text-[clamp(1.5rem,2.6vw,50px)] [text-shadow:0_1px_8px_rgba(0,0,0,0.45)]">
                {c.name}
              </h3>
              <p style={serif} className="mt-3 text-[clamp(0.9rem,1.15vw,22px)] [text-shadow:0_1px_8px_rgba(0,0,0,0.45)]">
                from &#8377;3499 / person / 4 nights
              </p>
            </div>
          </div>
        ))}
      </div>

      <a href="#" className="mt-12 rounded-full border border-[#191919] px-10 py-3 font-medium text-[#191919] text-[clamp(1rem,1.04vw,20px)] transition-colors duration-300 hover:bg-[#191919] hover:text-white">
        Create Booking
      </a>
    </section>
  );
}
