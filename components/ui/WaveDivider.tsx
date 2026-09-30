const WAVE_HEIGHT = "15vh";
const WAVE_OVERLAP = "-14vh";

const WAVE_MIN_HEIGHT = "5.5rem";

const WAVE_PATH =
  "M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z";

const VIEW_BOX = "0 24 150 28";

const LAYERS: { y: number; fill: string | null }[] = [
  { y: 0, fill: "rgba(0,0,0,0.30)" },
  { y: 3, fill: "rgba(0,0,0,0.23)" },
  { y: 5, fill: "rgba(0,0,0,0.12)" },
  { y: 7, fill: null },
];

type Props = {
  bottomColor: string;
};

export default function WaveDivider({ bottomColor }: Props) {
  return (
    <div
      aria-hidden

      className="pointer-events-none absolute inset-x-0 w-full"
      style={{
        top: WAVE_OVERLAP,
        height: `max(${WAVE_HEIGHT}, ${WAVE_MIN_HEIGHT})`,
      }}
    >
      <svg
        viewBox={VIEW_BOX}
        preserveAspectRatio="none"
        shapeRendering="auto"

        className="block h-full w-full"
      >
        <defs>
          <path id="ra-gentle-wave" d={WAVE_PATH} />
        </defs>

        <g className="wave-parallax">
          {LAYERS.map((layer, i) => (
            <use
              key={i}
              href="#ra-gentle-wave"
              x="48"
              y={layer.y}
              fill={layer.fill ?? bottomColor}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
