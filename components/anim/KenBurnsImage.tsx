"use client";

import { useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { EASE, DUR, MOVE, prefersReducedMotion } from "./anim.config";

gsap.registerPlugin(useGSAP);

type KenBurnsProps = {
  src?: string;
  alt?: string;
  children?: ReactNode;

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

      gsap.set(el, {
        scale: 1,
        x: MOVE.heroDrift,
        transformOrigin: "center center",
      });

      const tl = gsap.timeline();
      tl.to(
        el,
        { scale: 1.3, duration: DUR.heroZoom, ease: EASE.inOutCirc },
        0,
      );
      tl.to(
        el,
        { x: -MOVE.heroDrift, duration: DUR.heroDrift, ease: EASE.inOutCubic },
        0,
      );

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
    { scope: ref },
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
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      )}
    </div>
  );
}
