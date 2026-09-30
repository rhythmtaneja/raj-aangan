"use client";

import Image from "next/image";
import Reveal from "@/components/anim/Reveal";
import Parallax from "@/components/anim/Parallax";
import SectionHeading, { type SectionProps } from "./SectionHeading";
import { ABOUT } from "@/lib/investor-content";
import {
  BODY,
  CREAM_WARM,
  HOVER_SCALE,
  HOVER_TRANSITION,
  PHOTO_FRAME_COLOR,
  PHOTO_FRAME_INSET,
  SECTION_PAD,
  TEXT_BODY,
  serif,
} from "./theme";

const PHOTO_LEFT = "/images/about-story-2.jpg";
const PHOTO_RIGHT = "/images/about-story-3.jpg";

export default function InvestorAbout({ numeral }: SectionProps) {
  return (
    <section
      id="about"
      className={`flex w-full flex-col items-center text-center ${SECTION_PAD}`}
      style={{ backgroundColor: CREAM_WARM }}
    >
      <SectionHeading
        numeral={numeral}
        label="About"
        eyebrow="Who We Are"
        title={ABOUT.title}
      />

      <div className="mt-12 w-full max-w-300 md:mt-16">
        <Reveal
          stagger
          staggerEach={0.12}
          className="mx-auto flex max-w-[46rem] flex-col gap-6"
        >
          {ABOUT.paragraphs.map((p) => (
            <p
              key={p.slice(0, 24)}
              style={{ ...serif, color: TEXT_BODY }}
              className={BODY}
            >
              {p}
            </p>
          ))}
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-8 md:mt-20 md:grid-cols-2 md:gap-12">
          <Photo
            src={PHOTO_LEFT}
            alt="Raj Aangan catering operation"
            parallax
          />
          <Photo src={PHOTO_RIGHT} alt="Raj Aangan event service" />
        </div>
      </div>
    </section>
  );
}

function Photo({
  src,
  alt,
  parallax,
}: {
  src: string;
  alt: string;
  parallax?: boolean;
}) {
  const img = (
    <Image
      src={src}
      alt={alt}
      fill
      className={`object-cover ${HOVER_TRANSITION} ${HOVER_SCALE}`}
      sizes="(max-width: 768px) 100vw, 600px"
    />
  );

  return (
    <Reveal>
      <div className="group relative aspect-[4/3] w-full overflow-hidden md:aspect-[4/5]">
        {parallax ? (
          <Parallax distance={30} className="absolute -inset-y-12 -inset-x-px">
            <div className="relative h-full w-full">{img}</div>
          </Parallax>
        ) : (
          img
        )}
        <div
          aria-hidden
          className="pointer-events-none absolute z-10"
          style={{
            inset: PHOTO_FRAME_INSET,
            border: `1px solid ${PHOTO_FRAME_COLOR}`,
          }}
        />
      </div>
    </Reveal>
  );
}
