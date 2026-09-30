"use client";

import { useRef } from "react";
import CircleButton from "@/components/anim/CircleButton";

const VIDEO_SRC = "/videos/about-video.mp4";
const POSTER_SRC = "/images/about-video-poster.jpg";

const SECTION_BG = "#000000";
const SECTION_PAD_Y = "py-20";

const VIDEO_MAX_W = "max-w-7xl";

export default function VideoSection({ poster }: { poster?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = (e: React.MouseEvent) => {
    e.preventDefault();
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play();
    else v.pause();
  };

  return (
    <section
      className={`relative w-full ${SECTION_PAD_Y} flex flex-col items-center px-6`}
      style={{ backgroundColor: SECTION_BG }}
    >
      <div
        className={`relative w-full ${VIDEO_MAX_W} aspect-video overflow-hidden`}
      >
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          src={VIDEO_SRC}
          poster={poster ?? POSTER_SRC}
          playsInline
          preload="metadata"
        />

        <div className="absolute inset-0 flex items-center justify-center">
          <div onClick={togglePlay}>
            <CircleButton
              href="#"
              circleColor="#ffffff"
              arrowColor="#191919"
              circleSize="9.375rem"
              magnet={0.35}
              className="rounded-full border border-white px-10 py-4 text-white"
            >
              <PlayIcon />
            </CircleButton>
          </div>
        </div>
      </div>
    </section>
  );
}

function PlayIcon() {
  return (
    <svg
      className="w-[1.375rem] h-[1.375rem]"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}
