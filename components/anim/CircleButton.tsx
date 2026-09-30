"use client";

import { useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { isPhoneViewport, prefersReducedMotion } from "./anim.config";

gsap.registerPlugin(useGSAP);

const skipHoverAnimation = () => prefersReducedMotion() || isPhoneViewport();

const DEFAULT_CIRCLE_SIZE = "8.75rem";

const DEFAULT_MAGNET = 0.4;

const DEFAULT_ARROW_MAGNET = 0.35;

const DUR_CIRCLE_OPEN = 0.55;
const DUR_CIRCLE_CLOSE = 0.3;
const DUR_BORDER_FADE_OUT = 0.25;
const DUR_BORDER_FADE_IN = 0.3;
const DUR_LABEL_FADE_OUT = 0.16;
const DUR_LABEL_FADE_IN = 0.3;
const DUR_ARROW_ENTER = 0.35;
const DUR_ARROW_EXIT = 0.16;
const DELAY_ARROW_AFTER_BALL = 0.14;
const DELAY_CIRCLE_CLOSE = 0.05;
const DELAY_BORDER_LABEL_ON_LEAVE = 0.26;

const EASE_CIRCLE_OPEN = "circ.out";
const EASE_CIRCLE_CLOSE = "power2.inOut";
const EASE_SOFT = "power2.out";

const DUR_MAGNET_BODY = 0.6;
const DUR_MAGNET_ARROW = 0.45;

type ArrowDirection = "right" | "down" | "left";

type CircleButtonProps = {
  children: ReactNode;
  href?: string;

  className?: string;

  pillClassName?: string;

  circleColor?: string;

  arrowColor?: string;

  circleSize?: number | string;

  magnet?: number;

  arrowMagnet?: number;

  arrowDirection?: ArrowDirection;

  asStatic?: boolean;

  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
};

function restingOffset(direction: ArrowDirection): { x: number; y: number } {
  if (direction === "down") return { x: 0, y: -6 };
  if (direction === "left") return { x: -6, y: 0 };
  return { x: 6, y: 0 };
}

export default function CircleButton({
  children,
  href = "#",
  className,
  pillClassName,
  circleColor = "#6c7c7b",
  arrowColor = "#ffffff",
  circleSize = DEFAULT_CIRCLE_SIZE,
  magnet = DEFAULT_MAGNET,
  arrowMagnet = DEFAULT_ARROW_MAGNET,
  arrowDirection = "right",
  asStatic = false,
  onClick,
}: CircleButtonProps) {
  const root = useRef<HTMLElement | null>(null);
  const wrap = useRef<HTMLSpanElement>(null);
  const arrowFollow = useRef<HTMLSpanElement>(null);
  const circle = useRef<HTMLSpanElement>(null);
  const arrow = useRef<HTMLSpanElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const pill = useRef<HTMLSpanElement>(null);
  const hit = useRef<HTMLSpanElement>(null);

  const originalBorderColor = useRef<string>("rgba(0,0,0,0)");

  const bodyXTo = useRef<((v: number) => void) | null>(null);
  const bodyYTo = useRef<((v: number) => void) | null>(null);
  const arrowFollowXTo = useRef<((v: number) => void) | null>(null);
  const arrowFollowYTo = useRef<((v: number) => void) | null>(null);

  const rest = restingOffset(arrowDirection);

  useGSAP(
    () => {
      if (root.current) {
        originalBorderColor.current =
          window.getComputedStyle(root.current).borderTopColor ||
          "rgba(0,0,0,0)";
      }

      gsap.set(circle.current, { scale: 0, transformOrigin: "center center" });
      gsap.set(arrow.current, { autoAlpha: 0, x: rest.x, y: rest.y });
      gsap.set(arrowFollow.current, { x: 0, y: 0 });

      if (prefersReducedMotion()) return;

      bodyXTo.current = gsap.quickTo(wrap.current, "x", {
        duration: DUR_MAGNET_BODY,
        ease: "power3",
      });
      bodyYTo.current = gsap.quickTo(wrap.current, "y", {
        duration: DUR_MAGNET_BODY,
        ease: "power3",
      });

      arrowFollowXTo.current = gsap.quickTo(arrowFollow.current, "x", {
        duration: DUR_MAGNET_ARROW,
        ease: "power3",
      });
      arrowFollowYTo.current = gsap.quickTo(arrowFollow.current, "y", {
        duration: DUR_MAGNET_ARROW,
        ease: "power3",
      });
    },
    { scope: root, dependencies: [arrowDirection] },
  );

  const killPending = () => {
    gsap.killTweensOf(root.current, "borderColor");
    gsap.killTweensOf(label.current, "autoAlpha,opacity,visibility");
    gsap.killTweensOf(circle.current, "scale");
    gsap.killTweensOf(arrow.current, "autoAlpha,opacity,visibility,x,y");
    gsap.killTweensOf(pill.current, "autoAlpha,opacity,visibility");
  };

  const enter = () => {
    if (skipHoverAnimation()) return;

    killPending();

    if (hit.current) hit.current.style.pointerEvents = "auto";

    gsap.to(root.current, {
      borderColor: "rgba(0,0,0,0)",
      duration: DUR_BORDER_FADE_OUT,
      ease: EASE_SOFT,
      overwrite: "auto",
    });

    if (pill.current) {
      gsap.to(pill.current, {
        autoAlpha: 0,
        duration: DUR_BORDER_FADE_OUT,
        ease: EASE_SOFT,
        overwrite: "auto",
      });
    }
    gsap.to(label.current, {
      autoAlpha: 0,
      duration: DUR_LABEL_FADE_OUT,
      ease: EASE_SOFT,
      overwrite: "auto",
    });

    gsap.to(circle.current, {
      scale: 1,
      duration: DUR_CIRCLE_OPEN,
      ease: EASE_CIRCLE_OPEN,
      force3D: true,
      overwrite: "auto",
    });
    gsap.to(arrow.current, {
      autoAlpha: 1,
      x: 0,
      y: 0,
      duration: DUR_ARROW_ENTER,
      ease: EASE_SOFT,
      delay: DELAY_ARROW_AFTER_BALL,
      overwrite: "auto",
    });
  };

  const leave = () => {
    if (prefersReducedMotion()) return;

    killPending();

    if (hit.current) hit.current.style.pointerEvents = "none";

    gsap.to(root.current, {
      borderColor: originalBorderColor.current,
      duration: DUR_BORDER_FADE_IN,
      ease: EASE_SOFT,
      delay: DELAY_BORDER_LABEL_ON_LEAVE,
      overwrite: "auto",
    });
    if (pill.current) {
      gsap.to(pill.current, {
        autoAlpha: 1,
        duration: DUR_BORDER_FADE_IN,
        ease: EASE_SOFT,
        delay: DELAY_BORDER_LABEL_ON_LEAVE,
        overwrite: "auto",
      });
    }
    gsap.to(label.current, {
      autoAlpha: 1,
      duration: DUR_LABEL_FADE_IN,
      ease: EASE_SOFT,
      delay: DELAY_BORDER_LABEL_ON_LEAVE,
      overwrite: "auto",
    });

    gsap.to(arrow.current, {
      autoAlpha: 0,
      x: rest.x,
      y: rest.y,
      duration: DUR_ARROW_EXIT,
      ease: EASE_SOFT,
      overwrite: "auto",
    });
    gsap.to(circle.current, {
      scale: 0,
      duration: DUR_CIRCLE_CLOSE,
      ease: EASE_CIRCLE_CLOSE,
      delay: DELAY_CIRCLE_CLOSE,
      force3D: true,
      overwrite: "auto",
    });

    bodyXTo.current?.(0);
    bodyYTo.current?.(0);
    arrowFollowXTo.current?.(0);
    arrowFollowYTo.current?.(0);
  };

  const move = (e: React.MouseEvent) => {
    if (!root.current || skipHoverAnimation()) return;
    const r = root.current.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);

    bodyXTo.current?.(dx * magnet);
    bodyYTo.current?.(dy * magnet);

    arrowFollowXTo.current?.(dx * arrowMagnet);
    arrowFollowYTo.current?.(dy * arrowMagnet);
  };

  const content = (
    <>
      {pillClassName ? (
        <span
          ref={pill}
          aria-hidden
          className={`pointer-events-none absolute inset-0 z-0 ${pillClassName}`}
        />
      ) : null}

      <span
        ref={wrap}
        aria-hidden
        className="pointer-events-none absolute inset-0 z-1 flex items-center justify-center"
      >
        <span
          ref={circle}
          className="absolute rounded-full"
          style={{
            width: circleSize,
            height: circleSize,
            background: circleColor,
            willChange: "transform",
          }}
        />

        <span
          ref={hit}
          aria-hidden
          className="absolute rounded-full"
          style={{
            width: circleSize,
            height: circleSize,
            pointerEvents: "none",
          }}
        />

        <span ref={arrowFollow} className="absolute inline-flex">
          <span
            ref={arrow}
            className="inline-flex"
            style={{ color: arrowColor }}
          >
            <svg
              className="w-[1.625rem] h-[1.625rem]"
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.6}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {arrowDirection === "down" ? (
                <path d="M6 9l6 6 6-6" />
              ) : arrowDirection === "left" ? (
                <path d="M15 6l-6 6 6 6" />
              ) : (
                <path d="M9 6l6 6-6 6" />
              )}
            </svg>
          </span>
        </span>
      </span>

      <span ref={label} className="relative z-10">
        {children}
      </span>
    </>
  );

  const rootClassName =
    "relative inline-flex items-center justify-center isolate " +
    (className ?? "");

  if (asStatic) {
    return (
      <span
        ref={root as React.RefObject<HTMLSpanElement>}
        onMouseEnter={enter}
        onMouseLeave={leave}
        onMouseMove={move}
        onClick={onClick}
        className={rootClassName}
      >
        {content}
      </span>
    );
  }

  return (
    <a
      href={href}
      ref={root as React.RefObject<HTMLAnchorElement>}
      onMouseEnter={enter}
      onMouseLeave={leave}
      onMouseMove={move}
      onClick={onClick}
      className={rootClassName}
    >
      {content}
    </a>
  );
}
