const serif = { fontFamily: "var(--font-cormorant-garamond)" } as const;

export default function NumeralMarker({ numeral, light = false }: { numeral: string; light?: boolean }) {
  return (
    <div className={`inline-flex h-24 min-w-16 items-center justify-center border px-4 ${light ? "border-white" : "border-[#737272]"}`}>
      <span style={serif} className={`font-semibold leading-none text-[clamp(2rem,3.65vw,70px)] ${light ? "text-white" : "text-[#444444]"}`}>
        {numeral}
      </span>
    </div>
  );
}
