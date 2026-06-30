"use client";

import { useRef } from "react";
import CircleButton from "@/components/anim/CircleButton";

// ═══════════════════════════════════════════════════════════════════════════
// ─── TUNE THESE KNOBS ──────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════

const VIDEO_SRC  = "/videos/about-video.mp4"; // drop your file in /public/videos/
const POSTER_SRC = "/images/about-video-poster.jpg";

const SECTION_BG    = "#000000";
const SECTION_PAD_Y = "py-20"; // change to py-32 etc. for more breathing room

// Max video width — keep readable on huge displays.
const VIDEO_MAX_W = "max-w-7xl";

// ═══════════════════════════════════════════════════════════════════════════

export default function VideoSection() {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Click anywhere on the play button or the video plays / pauses.
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
      <div className={`relative w-full ${VIDEO_MAX_W} aspect-video overflow-hidden`}>
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          src={VIDEO_SRC}
          poster={POSTER_SRC}
          playsInline
          preload="metadata"
        />

        {/* Centered play overlay — white CircleButton (inverse of dark sections) */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div onClick={togglePlay}>
            <CircleButton
              href="#"
              circleColor="#ffffff"
              arrowColor="#191919"
              circleSize={78}
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
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}
