import Image from "next/image";

const SERVICES = [
  "Wedding Planning",
  "Luxury Catering",
  "Social & Corporate Events",
  "Decor & Styling",
  "Entertainment & Experience",
];

export default function FeaturedSection() {
  return (
    <section className="flex min-h-screen w-full items-center justify-center bg-[#ebe5db] px-6 py-24">
      <div className="relative aspect-16/10 w-full max-w-280">
        <Image
          src="/images/ballroom.jpg"
          alt="Banquet hall set for an event"
          fill
          className="object-cover"
          sizes="(max-width: 1120px) 100vw, 1120px"
        />

        {/* thin frame inset on the image */}
        <div className="pointer-events-none absolute inset-8 border border-white/80" />

        {/* layered service-list card */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <div className="pointer-events-none absolute -left-5 -top-5 h-full w-full border border-white" />
            <div className="relative border border-[#d6cfc2] bg-white px-16 py-12">
              <ul className="space-y-5 text-center uppercase tracking-[0.18em] text-[#3f3f3f] text-[clamp(0.8rem,1.04vw,18px)]">
                {SERVICES.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
