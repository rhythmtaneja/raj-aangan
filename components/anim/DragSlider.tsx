"use client";

/**
 * DragSlider.tsx
 * ---------------------------------------------------------------------------
 * Horizontal drag-to-scroll row (the reference "Stay packages" slider). Hold
 * the mouse down and drag left/right to move through the cards. While hovering,
 * the cursor becomes a blurry circle with a drag arrow. An optional faint
 * `marqueeWord` runs behind the cards.
 *
 * Cards: give each direct child a fixed width and `shrink-0` so they line up in
 * a row (e.g. className="w-[min(80vw,420px)] shrink-0").
 * ---------------------------------------------------------------------------
 */

import { useRef, useState, type ReactNode } from "react";
import Marquee from "./Marquee";

type DragSliderProps = {
  children: ReactNode;
  /** Faint word looping behind the cards (e.g. "Cuisine"). */
  marqueeWord?: string;
  /** Colour/opacity of the running word. Change this to make it more visible. */
  marqueeClassName?: string;
  /** Gap between cards (CSS length). */
  gap?: string;
  className?: string;
};

export default function DragSlider({ children, marqueeWord, marqueeClassName = "text-white opacity-25", gap = "1.5rem", className }: DragSliderProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, startX: 0, startScroll: 0, moved: false });
  const [hovering, setHovering] = useState(false);
  const [grabbing, setGrabbing] = useState(false);

  const moveCursor = (x: number, y: number) => {
    if (cursorRef.current) cursorRef.current.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
  };

  const onDown = (e: React.MouseEvent) => {
    const el = scrollRef.current;
    if (!el) return;
    drag.current = { active: true, startX: e.clientX, startScroll: el.scrollLeft, moved: false };
    setGrabbing(true);
  };

  const onMove = (e: React.MouseEvent) => {
    moveCursor(e.clientX, e.clientY);
    if (!drag.current.active) return;
    const el = scrollRef.current;
    if (!el) return;
    const dx = e.clientX - drag.current.startX;
    if (Math.abs(dx) > 4) drag.current.moved = true;
    el.scrollLeft = drag.current.startScroll - dx;
  };

  const endDrag = () => {
    drag.current.active = false;
    setGrabbing(false);
  };

  // Prevent a drag from also triggering link clicks on the cards
  const onClickCapture = (e: React.MouseEvent) => {
    if (drag.current.moved) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <div
      className={className}
      style={{ position: "relative", overflow: "hidden" }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => {
        setHovering(false);
        endDrag();
      }}
      onMouseMove={onMove}
    >
      {/* Faint running word behind the cards */}
      {marqueeWord && (
        <div aria-hidden style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", pointerEvents: "none", zIndex: 0 }}>
          <Marquee speed={50} repeat={6} className={marqueeClassName}>
            <span style={{ fontFamily: "var(--font-cormorant-garamond)", fontSize: "clamp(120px,22vw,360px)", lineHeight: 1, fontWeight: 600 }}>
              {marqueeWord}
            </span>
          </Marquee>
        </div>
      )}

      {/* Scroll track */}
      <div
        ref={scrollRef}
        onMouseDown={onDown}
        onMouseUp={endDrag}
        onClickCapture={onClickCapture}
        className="[&::-webkit-scrollbar]:hidden"
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          gap,
          overflowX: "auto",
          scrollbarWidth: "none",
          cursor: "none",
          userSelect: "none",
          scrollSnapType: "x proximity",
        }}
      >
        {children}
      </div>

      {/* Custom blurry-circle cursor */}
      <div
        ref={cursorRef}
        aria-hidden
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          width: grabbing ? 96 : 84,
          height: grabbing ? 96 : 84,
          borderRadius: "9999px",
          border: "1px solid rgba(255,255,255,0.6)",
          background: "rgba(255,255,255,0.12)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          display: hovering ? "flex" : "none",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          pointerEvents: "none",
          zIndex: 50,
          transition: "width .2s ease, height .2s ease",
        }}
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 7l-4 5 4 5M16 7l4 5-4 5M4 12h16" />
        </svg>
      </div>
    </div>
  );
}
