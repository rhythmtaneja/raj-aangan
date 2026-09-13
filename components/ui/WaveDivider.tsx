// ══════════════════════════════════════════════════════════════════
// PATH IN REPO: components/ui/WaveDivider.tsx
// ══════════════════════════════════════════════════════════════════

/**
 * WaveDivider — the animated wave where the footer's dark panel gives way to
 * its lighter closing panel.
 *
 * ---------------------------------------------------------------------------
 * REBUILT AGAINST THE REFERENCE (Sep 2026) — measured live on resortkaskady.com
 *
 * The previous version drew three sine paths on a `gsap.ticker` inside an
 * IN-FLOW band whose own background was the closing-panel colour. That is what
 * produced the two complaints:
 *
 *   • A STRAIGHT LINE. An in-flow band has a flat top edge by construction.
 *     The dark panel stopped dead at the band's top, the band's background
 *     (the lighter colour) started there, and the sine paths were drawn INSIDE
 *     that strip. So you saw: dark → hard horizontal seam → wavy shapes. The
 *     wave never actually divided the two panels; it was decoration sitting
 *     below the real, flat seam.
 *
 *   • THE CRESTS DIDN'T LINE UP with anything, because the band was only
 *     3.5–6.25rem tall while the amplitudes (14/22/28 in a 100-unit viewBox)
 *     wanted far more room. The waves were squashed into a letterbox.
 *
 * THE REFERENCE DOES THE OPPOSITE, and the inversion is the whole fix:
 *
 *   The wave is NOT a band between the panels. It is the closing panel's own
 *   top edge, cut into a wave shape, floated UP over the dark panel. The
 *   markup is absolutely positioned at `top: -14vh` inside the closing panel,
 *   is 15vh tall, and has NO background of its own — the dark panel shows
 *   through everywhere the wave isn't. Only the last 1vh sits inside the
 *   closing panel, which is what welds the two together with no seam.
 *
 *   Measured on the reference (dark #194141 → closing #296161):
 *     <svg class="waves" viewBox="0 24 150 28" preserveAspectRatio="none">
 *       <defs><path id="gentle-wave" d="M-160 44c30 0 …"/></defs>
 *       <g class="parallax">
 *         <use href="#gentle-wave" x="48" y="0" fill="rgba(0,0,0,.3)"/>
 *         <use href="#gentle-wave" x="48" y="3" fill="rgba(0,0,0,.23)"/>
 *         <use href="#gentle-wave" x="48" y="5" fill="rgba(0,0,0,.12)"/>
 *         <use href="#gentle-wave" x="48" y="7" fill="#296161"/>
 *       </g>
 *     </svg>
 *   …with `.parallax > use` animated by a CSS keyframe that translates each
 *   layer -90px → 85px on its own duration (7/10/13/20s). Those are the exact
 *   numbers reproduced below.
 *
 * ---------------------------------------------------------------------------
 * WHY THE GEOMETRY LOOKS THE WAY IT DOES
 *
 * The path draws four identical cubic humps of ±18 units, each 88 wide,
 * starting at x=-160 and ending at x=192 — 352 units of wave for a viewBox
 * that only shows x∈[0,150]. Two things follow, and both matter:
 *
 *   1. The amplitude (36 peak-to-trough) is LARGER than the viewBox height
 *      (28). You are looking at a slice through a wave much bigger than the
 *      window, which is what makes it read as one long, lazy swell across the
 *      whole screen rather than a row of ripples. Our old version had the
 *      amplitudes smaller than the box, hence "ripples in a letterbox".
 *
 *   2. The 200 units of overhang on either side are the runway for the
 *      animation. Layers translate ±90 units and must never expose an end.
 *
 * The travel (-90 → 85 = 175 units) is one wave period short of nothing:
 * the period is 2×88 = 176. So each loop lands ~1 unit from where it started
 * and the restart is invisible. Don't "tidy" these numbers.
 *
 * After the curve, `v44 h-352 z` closes the path 44 units DOWN — far below the
 * viewBox floor — so every layer fills solid all the way to the bottom edge.
 * That solid fill, on the last layer, IS the closing panel's colour.
 *
 * ---------------------------------------------------------------------------
 * WHY CSS AND NOT GSAP
 *
 * Four `transform` animations on `<use>` elements are composited on the GPU
 * and cost nothing per frame. The old ticker rebuilt three 70-segment path
 * strings in JS every frame, forever, for a strictly worse-looking result —
 * and needed a ScrollTrigger purely to switch itself off when off-screen.
 * None of that machinery is needed now. Reduced-motion is a media query in
 * globals.css next to the keyframes.
 * ---------------------------------------------------------------------------
 *
 * USAGE — the parent MUST be `position: relative` and must not clip overflow:
 *
 *   <div className="relative" style={{ background: LIGHT }}>
 *     <WaveDivider bottomColor={LIGHT} />
 *     …closing panel content…
 *   </div>
 *
 * `bottomColor` must equal that panel's background, or a hairline of the wrong
 * colour appears where the wave meets it.
 */

// ═══════════════════════════════════════════════════════════════════════════
// ─── TUNE THESE KNOBS ──────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════

// Band height, and how much of it floats ABOVE the closing panel.
// The difference (1vh) is deliberate overlap that hides the subpixel seam
// where the wave's solid fill meets the panel's flat top. Keep it non-zero.
// vh (not rem) on purpose: the reference scales the swell with the SCREEN,
// so it stays the same fraction of the view on a laptop and on a phone.
const WAVE_HEIGHT = "15vh";
const WAVE_OVERLAP = "-14vh";

// Floor for short/landscape phones, where 15vh collapses the swell to a
// scribble. Not in the reference — it assumes a tall viewport.
const WAVE_MIN_HEIGHT = "5.5rem";

// The reference's `gentle-wave`, verbatim. See the geometry note above before
// touching any number in it.
const WAVE_PATH =
  "M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z";

// viewBox window onto that path. y starts at 24 so the crests sit high in the
// band and the solid fill occupies the lower two-thirds.
const VIEW_BOX = "0 24 150 28";

// Four stacked copies of the one path, each nudged down by `y` and drifting at
// its own speed — that offset-plus-speed spread is the entire parallax.
// `fill: null` = the closing-panel colour, i.e. the opaque front layer.
// The three behind it are plain black at low alpha, so they shade whatever
// they pass over and work against any panel colour.
// Durations/delays are driven by `.wave-parallax > use:nth-child(n)` in
// globals.css — reorder these and you must reorder those too.
const LAYERS: { y: number; fill: string | null }[] = [
  { y: 0, fill: "rgba(0,0,0,0.30)" },
  { y: 3, fill: "rgba(0,0,0,0.23)" },
  { y: 5, fill: "rgba(0,0,0,0.12)" },
  { y: 7, fill: null },
];

// ═══════════════════════════════════════════════════════════════════════════

type Props = {
  /** Background of the panel BELOW. The front wave layer is filled with it. */
  bottomColor: string;
};

export default function WaveDivider({ bottomColor }: Props) {
  return (
    <div
      aria-hidden
      /*
        `pointer-events-none`: the band floats over the bottom of the dark
        panel, and the reference lets its own links sit under the wave. Ours
        would otherwise swallow clicks on whatever it covers.

        No background colour here — that absence is the fix. The dark panel
        above must show through everywhere the wave isn't.
      */
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
        /* `block`: an inline SVG sits on the text baseline, which would leave
           a few px of the panel below showing under the band. */
        className="block h-full w-full"
      >
        <defs>
          <path id="ra-gentle-wave" d={WAVE_PATH} />
        </defs>
        {/* The animation selector is `.wave-parallax > use` — these must stay
            DIRECT children of this group. */}
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
