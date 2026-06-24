const serif = { fontFamily: "var(--font-cormorant-garamond)" } as const;

export default function NumeralMarker({ numeral }: { numeral: string }) {
  return (
    <div className="inline-flex h-24 min-w-16 items-center justify-center border border-[#737272] px-4">
      <span style={serif} className="font-semibold leading-none text-[#444444] text-[clamp(2rem,3.65vw,70px)]">
        {numeral}
      </span>
    </div>
  );
}
