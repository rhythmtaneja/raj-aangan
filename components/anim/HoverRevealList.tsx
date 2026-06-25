"use client";

/**
 * HoverRevealList.tsx (v4)
 * On hover: background washes to the item's accent, the hovered word brightens +
 * its letter-spacing opens, siblings dim, AND the image appears ANCHORED TO THE
 * HOVERED WORD (not centred) then follows the cursor.
 */

import { useRef, useState, type CSSProperties, type ReactNode } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { DUR, EASE, prefersReducedMotion } from "./anim.config";

gsap.registerPlugin(useGSAP);

export type HoverRevealItem = {
  label: string;
  image: string;
  href?: string;
  accent?: string;
};

type HoverRevealListProps = {
  items: HoverRevealItem[];
  layout?: "row" | "stack";
  className?: string;
  top?: ReactNode;
  bottom?: ReactNode;
  labelClassName?: string;
  labelStyle?: CSSProperties;
  activeLabelClassName?: string;
  dimmedLabelClassName?: string;
  imageWidth?: number;
  followStrength?: number;
};

export default function HoverRevealList({
  items,
  layout = "row",
  className,
  top,
  bottom,
  labelClassName,
  labelStyle,
  activeLabelClassName,
  dimmedLabelClassName,
  imageWidth = 640,
  followStrength = 0.05,
}: HoverRevealListProps) {
  const scope = useRef<HTMLDivElement>(null);
  const washRef = useRef<HTMLDivElement>(null);
  const imgRefs = useRef<(HTMLDivElement | null)[]>([]);
  const labelRefs = useRef<(HTMLElement | null)[]>([]);
  const activeRef = useRef<number | null>(null);
  const baseX = useRef(0);
  const [active, setActive] = useState<number | null>(null);

  const reduced = typeof window !== "undefined" && prefersReducedMotion();
  const fade = reduced ? 0 : DUR.hover;

  const handleEnter = (i: number) => {
    activeRef.current = i;
    setActive(i);

    // anchor the image horizontally to the hovered word
    const root = scope.current;
    const labelEl = labelRefs.current[i];
    let bx = 0;
    if (root && labelEl) {
      const r = root.getBoundingClientRect();
      const l = labelEl.getBoundingClientRect();
      bx = l.left + l.width / 2 - (r.left + r.width / 2);
    }
    baseX.current = bx;

    const wash = washRef.current;
    if (wash) {
      gsap.set(wash, { backgroundColor: items[i].accent ?? "#e7ded0" });
      gsap.to(wash, { autoAlpha: 1, duration: fade, ease: EASE.ease });
    }
    imgRefs.current.forEach((el, idx) => {
      if (!el) return;
      if (idx === i) gsap.to(el, { autoAlpha: 1, x: bx, y: 0, duration: fade, ease: EASE.ease });
      else gsap.to(el, { autoAlpha: 0, duration: fade, ease: EASE.ease });
    });
  };

  const handleLeave = () => {
    activeRef.current = null;
    setActive(null);
    if (washRef.current) gsap.to(washRef.current, { autoAlpha: 0, duration: fade, ease: EASE.ease });
    imgRefs.current.forEach((el) => el && gsap.to(el, { autoAlpha: 0, x: 0, y: 0, duration: fade, ease: EASE.ease }));
  };

  const handleMove = (e: React.MouseEvent) => {
    const i = activeRef.current;
    if (i == null || reduced) return;
    const el = imgRefs.current[i];
    const root = scope.current;
    if (!el || !root) return;
    const rect = root.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    gsap.to(el, { x: baseX.current + dx * followStrength, y: dy * followStrength, duration: 0.6, ease: "power3.out", overwrite: "auto" });
  };

  useGSAP(
    () => {
      if (washRef.current) gsap.set(washRef.current, { autoAlpha: 0 });
      imgRefs.current.forEach((el) => el && gsap.set(el, { autoAlpha: 0 }));
    },
    { scope }
  );

  const renderLabel = (item: HoverRevealItem, i: number) => {
    const isActive = active === i;
    const isDimmed = active !== null && active !== i;
    const cls = [labelClassName, isActive ? activeLabelClassName : "", isDimmed ? dimmedLabelClassName : ""].filter(Boolean).join(" ");

    const inner = (
      <span className={cls} style={{ transition: "color .3s ease, opacity .3s ease, letter-spacing .3s ease", ...labelStyle }}>
        {item.label}
      </span>
    );

    const handlers = {
      onMouseEnter: () => handleEnter(i),
      onMouseLeave: handleLeave,
      onFocus: () => handleEnter(i),
      onBlur: handleLeave,
    };

    const setRef = (el: HTMLElement | null) => {
      labelRefs.current[i] = el;
    };

    return item.href ? (
      <a key={item.label} ref={setRef} href={item.href} {...handlers} style={{ position: "relative", zIndex: 2, textDecoration: "none", color: "inherit" }}>
        {inner}
      </a>
    ) : (
      <button key={item.label} ref={setRef} type="button" {...handlers} style={{ position: "relative", zIndex: 2, background: "none", border: 0, padding: 0, cursor: "pointer", font: "inherit", color: "inherit" }}>
        {inner}
      </button>
    );
  };

  return (
    <div ref={scope} className={className} style={{ position: "relative", overflow: "hidden" }} onMouseMove={handleMove}>
      <div ref={washRef} aria-hidden style={{ position: "absolute", inset: 0, zIndex: 0 }} />

      {/* image-reveal layer (z1) — each image is centred then translated to its word */}
      <div aria-hidden style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none", zIndex: 1 }}>
        {items.map((item, i) => (
          <div
            key={item.label}
            ref={(el) => {
              imgRefs.current[i] = el;
            }}
            style={{ position: "absolute", width: "min(70vw, " + imageWidth + "px)", aspectRatio: "3 / 2", overflow: "hidden" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </div>
        ))}
      </div>

      {/* content (z2) — full width so the row spreads */}
      <div style={{ position: "relative", zIndex: 2, width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: "inherit" }}>
        {top}
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: layout === "row" ? "row" : "column",
            justifyContent: layout === "row" ? "space-between" : "flex-start",
            alignItems: layout === "row" ? "center" : "flex-start",
          }}
        >
          {items.map(renderLabel)}
        </div>
        {bottom}
      </div>
    </div>
  );
}
