"use client";

/**
 * KenBurnsImage.tsx
 * ---------------------------------------------------------------------------
 * The hero "breathing" background: a slow scale-up combined with a gentle
 * horizontal drift, started on mount. Matches the reference site's PAGE_FINISH
 * interaction exactly:
 *    scale 1 -> 1.3   over 3000ms  circ.inOut
 *    x     20 -> -20  over 2000ms  cubic.inOut
 *
 * Wrap this in an overflow-hidden container. Pass the <img> (or any node) as
 * children, or use the `src` convenience prop for a plain full-bleed image.
 * ---------------------------------------------------------------------------
 */

import { useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { EASE, DUR, MOVE, prefersReducedMotion } from "./anim.config";

gsap.registerPlugin(useGSAP);

type KenBurnsProps = {
  /** Convenience: plain background image. Ignored if children provided. */
  src?: string;
  alt?: string;
  children?: ReactNode;
  /** Loop the drift gently after the initial zoom (subtle, off by default). */
  loop?: boolean;
  className?: string;
};

export default function KenBurnsImage({
  src,
  alt = "",
  children,
  loop = false,
  className,
}: KenBurnsProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current?.firstElementChild as HTMLElement | null;
      if (!el) return;

      if (prefersReducedMotion()) {
        gsap.set(el, { scale: 1, x: 0 });
        return;
      }

      // Start slightly zoomed-out + offset, then settle. Using set+to so the
      // image is never left in a hidden/oversized stuck state under Strict Mode.
      gsap.set(el, { scale: 1, x: MOVE.heroDrift, transformOrigin: "center center" });

      const tl = gsap.timeline();
      tl.to(el, { scale: 1.3, duration: DUR.heroZoom, ease: EASE.inOutCirc }, 0);
      tl.to(el, { x: -MOVE.heroDrift, duration: DUR.heroDrift, ease: EASE.inOutCubic }, 0);

      if (loop) {
        tl.to(el, {
          x: MOVE.heroDrift,
          duration: DUR.heroZoom * 2,
          ease: EASE.inOutCubic,
          repeat: -1,
          yoyo: true,
        });
      }
    },
    { scope: ref }
  );

  return (
    <div
      ref={ref}
      className={className}
      style={{ overflow: "hidden", position: "absolute", inset: 0 }}
    >
      {children ?? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      )}
    </div>
  );
}
