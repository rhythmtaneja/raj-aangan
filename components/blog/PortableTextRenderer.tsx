"use client";

import Image from "next/image";
import Link from "next/link";
import {
  PortableText,
  type PortableTextBlock,
  type PortableTextComponents,
} from "@portabletext/react";
import { urlFor } from "@/sanity/image";

const serif = { fontFamily: "var(--font-cormorant-garamond)" } as const;

const INK = "#221d18";
const INK_MUTED = "#6b6255";
const GOLD = "#b08d57";

// Sanity asset refs encode dimensions, e.g. "image-abc123-2400x1600-jpg".
function refDimensions(ref?: string): { w: number; h: number } {
  const m = ref?.match(/-(\d+)x(\d+)-/);
  if (!m) return { w: 1600, h: 1000 };
  return { w: parseInt(m[1], 10), h: parseInt(m[2], 10) };
}

type ImageValue = {
  asset?: { _ref?: string };
  alt?: string;
  caption?: string;
};

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p
        style={{ color: INK }}
        className="mx-auto mb-6 max-w-2xl text-[clamp(1rem,1.15vw,1.25rem)] leading-[1.85]"
      >
        {children}
      </p>
    ),
    h2: ({ children }) => (
      <h2
        style={{ ...serif, color: INK }}
        className="mx-auto mt-14 mb-5 max-w-2xl text-[clamp(1.75rem,3vw,2.75rem)] font-semibold leading-[1.2]"
      >
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3
        style={{ ...serif, color: INK }}
        className="mx-auto mt-10 mb-4 max-w-2xl text-[clamp(1.4rem,2.2vw,2rem)] font-semibold leading-[1.25]"
      >
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote
        style={{ ...serif, color: INK, borderColor: GOLD }}
        className="mx-auto my-10 max-w-2xl border-l-2 pl-6 text-[clamp(1.3rem,2vw,1.9rem)] italic leading-[1.5]"
      >
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul
        style={{ color: INK }}
        className="mx-auto mb-6 max-w-2xl list-disc space-y-2 pl-6 text-[clamp(1rem,1.15vw,1.25rem)] leading-[1.8] marker:text-[color:var(--gold,#b08d57)]"
      >
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol
        style={{ color: INK }}
        className="mx-auto mb-6 max-w-2xl list-decimal space-y-2 pl-6 text-[clamp(1rem,1.15vw,1.25rem)] leading-[1.8]"
      >
        {children}
      </ol>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ children, value }) => {
      const href = (value?.href as string) ?? "#";
      const external = /^https?:\/\//.test(href);
      return (
        <Link
          href={href}
          style={{ color: GOLD }}
          className="underline decoration-1 underline-offset-4 transition-opacity hover:opacity-70"
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {children}
        </Link>
      );
    },
  },
  types: {
    image: ({ value }: { value: ImageValue }) => {
      const built = urlFor(value);
      if (!built) return null;
      const { w, h } = refDimensions(value.asset?._ref);
      return (
        <figure className="mx-auto my-10 max-w-3xl">
          <Image
            src={built.width(1600).quality(80).auto("format").url()}
            alt={value.alt ?? value.caption ?? ""}
            width={w}
            height={h}
            sizes="(max-width: 768px) 92vw, 768px"
            className="h-auto w-full rounded-sm"
          />
          {value.caption && (
            <figcaption
              style={{ color: INK_MUTED }}
              className="mt-3 text-center text-sm italic"
            >
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },
};

export default function PortableTextRenderer({ value }: { value: PortableTextBlock[] }) {
  return <PortableText value={value} components={components} />;
}
