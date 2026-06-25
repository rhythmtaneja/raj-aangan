import Image from "next/image";
import Reveal from "@/components/anim/Reveal";
import DragSlider from "@/components/anim/DragSlider";

const serif = { fontFamily: "var(--font-cormorant-garamond)" } as const;

// ── ADD CUISINES HERE ───────────────────────────────────────────────────────
// Just append objects to this list — the slider grows automatically and you
// drag (hold mouse + move) to scroll through them. Drop each image in
// /public/images/ and reference it by filename.
const CUISINES = [
  { name: "Rajasthani", img: "/images/cuisine-rajasthani.jpg", price: "from ₹3499 / person" },
  { name: "Punjabi", img: "/images/cuisine-punjabi.jpg", price: "from ₹3499 / person" },
  { name: "Dessert", img: "/images/cuisine-dessert.jpg", price: "from ₹3499 / person" },
  { name: "South Indian", img: "/images/cuisine-south-indian.jpg", price: "from ₹3499 / person" },
  { name: "Chinese", img: "/images/cuisine-chinese.jpg", price: "from ₹3499 / person" },
  { name: "Italian", img: "/images/cuisine-italian.jpg", price: "from ₹3499 / person" },
];

export default function CuisineSection() {
  return (
    <section className="flex min-h-screen w-full flex-col items-center bg-[#ebe5db] py-24">
      <Reveal>
        <h2 style={serif} className="mb-14 px-6 font-semibold uppercase tracking-[0.2em] text-[#6b4f3a] text-[clamp(1.5rem,2.08vw,40px)]">
          Our Cuisine
        </h2>
      </Reveal>

      {/* Drag-to-scroll slider. "Cuisine" runs behind the cards.
          Change the running-word colour here: marqueeClassName="text-white opacity-25" */}
      <DragSlider marqueeWord="Cuisine" marqueeClassName="text-white opacity-30" gap="1.5rem" className="w-full px-6 py-4">
        {CUISINES.map((c) => (
          <div key={c.name} className="group relative aspect-square w-[min(82vw,440px)] shrink-0 overflow-hidden">
            <Image
              src={c.img}
              alt={`${c.name} cuisine`}
              fill
              draggable={false}
              className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
              sizes="(max-width: 768px) 82vw, 440px"
            />
            <div className="absolute inset-0 bg-black/15" />
            <div className="pointer-events-none absolute inset-5 border border-white/70" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
              <h3 style={serif} className="font-semibold uppercase tracking-[0.15em] text-[clamp(1.5rem,2.6vw,50px)] [text-shadow:0_1px_8px_rgba(0,0,0,0.45)]">
                {c.name}
              </h3>
              <p style={serif} className="mt-3 text-[clamp(0.9rem,1.15vw,22px)] [text-shadow:0_1px_8px_rgba(0,0,0,0.45)]">
                {c.price}
              </p>
            </div>
          </div>
        ))}
      </DragSlider>

      <Reveal>
        <a href="#" className="mt-12 inline-block rounded-full border border-[#191919] px-10 py-3 font-medium text-[#191919] text-[clamp(1rem,1.04vw,20px)] transition-colors duration-300 hover:bg-[#191919] hover:text-white">
          Create Booking
        </a>
      </Reveal>
    </section>
  );
}
