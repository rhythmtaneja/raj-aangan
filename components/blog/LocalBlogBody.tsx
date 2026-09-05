// ══════════════════════════════════════════════════════════════════
// PATH IN REPO: components/blog/LocalBlogBody.tsx
// ══════════════════════════════════════════════════════════════════
// Renders a post written by hand in lib/blog/posts.ts. The typography here is
// deliberately IDENTICAL to PortableTextRenderer (same clamp sizes, same
// max-w-2xl measure, same gold) so a hand-written post and a Studio post are
// indistinguishable on the page. Change one, change the other.
// ═══════════════════════════════════════════════════════════════════════════

import { Fragment } from "react";
import Image from "next/image";
import type { LocalBlock } from "@/lib/blog/types";

const serif = { fontFamily: "var(--font-cormorant-garamond)" } as const;

const INK       = "#221d18";
const INK_MUTED = "#6b6255";
const GOLD      = "#b08d57";

// One shared measure keeps every block optically centred on the same column.
const MEASURE   = "mx-auto max-w-2xl";
const BODY_SIZE = "text-[clamp(1rem,1.15vw,1.0625rem)]";

/**
 * The two bits of inline formatting the hand-written format supports:
 *   **bold**   → <strong>
 *   a newline  → a line break (kept via whitespace-pre-line on the wrapper,
 *                so a paragraph typed across several lines reads that way)
 * Anything else is plain text, on purpose — this is a hand-authoring format,
 * not a markdown engine.
 */
function inline(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") && part.length > 4 ? (
      <strong key={i} className="font-semibold">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}

export default function LocalBlogBody({ blocks }: { blocks: LocalBlock[] }) {
  return (
    <>
      {blocks.map((block, i) => (
        <Block key={i} block={block} />
      ))}
    </>
  );
}

function Block({ block }: { block: LocalBlock }) {
  switch (block.type) {
    case "p":
      // An empty paragraph is a placeholder in posts.ts — render nothing.
      if (!block.text.trim()) return null;
      return (
        <p
          style={{ color: INK }}
          className={`${MEASURE} mb-6 whitespace-pre-line ${BODY_SIZE} leading-[1.85]`}
        >
          {inline(block.text)}
        </p>
      );

    case "h2":
      return (
        <h2
          style={{ ...serif, color: INK }}
          className={`${MEASURE} mt-14 mb-5 text-[clamp(1.75rem,3vw,2.6875rem)] font-semibold leading-[1.2]`}
        >
          {inline(block.text)}
        </h2>
      );

    case "h3":
      return (
        <h3
          style={{ ...serif, color: INK }}
          className={`${MEASURE} mt-10 mb-4 text-[clamp(1.4rem,2.2vw,2rem)] font-semibold leading-[1.25]`}
        >
          {inline(block.text)}
        </h3>
      );

    case "quote":
      return (
        <blockquote
          style={{ ...serif, color: INK, borderColor: GOLD }}
          className={`${MEASURE} my-10 border-l-2 pl-6 text-[clamp(1.3rem,2vw,1.8125rem)] italic leading-[1.5]`}
        >
          {inline(block.text)}
        </blockquote>
      );

    case "list":
      return (
        <ul
          style={{ color: INK }}
          className={`${MEASURE} mb-6 list-disc space-y-2 pl-6 ${BODY_SIZE} leading-[1.8]`}
        >
          {block.items.map((item, i) => (
            <li key={i}>{inline(item)}</li>
          ))}
        </ul>
      );

    case "numbers":
      return (
        <ol
          style={{ color: INK }}
          className={`${MEASURE} mb-6 list-decimal space-y-2 pl-6 ${BODY_SIZE} leading-[1.8]`}
        >
          {block.items.map((item, i) => (
            <li key={i}>{inline(item)}</li>
          ))}
        </ol>
      );

    case "image":
      return (
        <figure className="mx-auto my-10 max-w-3xl">
          {/* Framed the same way as every other photo on the site. */}
          <div className="relative aspect-[3/2] w-full overflow-hidden">
            <Image
              src={block.src}
              alt={block.alt ?? block.caption ?? ""}
              fill
              sizes="(max-width: 768px) 92vw, 768px"
              className="object-cover"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute z-10"
              style={{ inset: "0.75rem", border: "1px solid rgba(255,255,255,0.55)" }}
            />
          </div>
          {block.caption && (
            <figcaption style={{ color: INK_MUTED }} className="mt-3 text-center text-sm italic">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );
  }
}
