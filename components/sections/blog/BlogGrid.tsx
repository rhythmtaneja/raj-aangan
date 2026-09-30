"use client";

import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/anim/Reveal";

const serif = { fontFamily: "var(--font-cormorant-garamond)" } as const;

export type BlogPost = {
  title: string;

  date: string;

  image: string;

  href: string;
};

const GAP_BETWEEN_CARDS = "gap-16";

const CARD_MAX_WIDTH = "max-w-xl";

const CARD_BG = "#f5efe6";
const CARD_PADDING = "p-8 md:p-10";

const PHOTO_ASPECT = "aspect-[4/3]";
const PHOTO_FRAME_INSET = "0.75rem";
const PHOTO_FRAME_COLOR = "rgba(255, 255, 255, 0.55)";

const HOVER_SCALE = "group-hover:scale-105";
const HOVER_TRANSITION = "transition-transform duration-[800ms] ease-out";

const DATE_COLOR = "#8a7f6b";
const DATE_FONT_SIZE = "text-[clamp(0.75rem,0.9vw,0.8125rem)]";
const DATE_TRACKING = "0.15em";

const DIVIDER_WIDTH = "3rem";
const DIVIDER_COLOR = "rgba(25,25,25,0.25)";

const TITLE_COLOR = "#191919";
const TITLE_FONT_SIZE = "text-[clamp(1.1rem,1.4vw,1.25rem)]";

export default function BlogGrid({ posts }: { posts: BlogPost[] }) {
  return (
    <section id="posts" className="w-full px-6 py-24 md:px-16">
      <div
        className={`mx-auto flex ${CARD_MAX_WIDTH} flex-col ${GAP_BETWEEN_CARDS}`}
      >
        {posts.map((post, i) => (
          <Reveal key={i}>
            <BlogCard post={post} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={post.href}
      className="group block"
      style={{ backgroundColor: CARD_BG }}
    >
      <div className={CARD_PADDING}>
        <div className={`relative ${PHOTO_ASPECT} w-full overflow-hidden`}>
          <Image
            src={post.image}
            alt={post.title}
            fill
            className={`object-cover ${HOVER_TRANSITION} ${HOVER_SCALE}`}
            sizes="(max-width: 768px) 90vw, 576px"
          />

          <div
            aria-hidden
            className="pointer-events-none absolute z-10"
            style={{
              inset: PHOTO_FRAME_INSET,
              border: `1px solid ${PHOTO_FRAME_COLOR}`,
            }}
          />
        </div>

        <p
          style={{ color: DATE_COLOR, letterSpacing: DATE_TRACKING }}
          className={`mt-8 text-center font-medium ${DATE_FONT_SIZE}`}
        >
          {post.date}
        </p>

        <div
          aria-hidden
          className="mx-auto my-4 h-px"
          style={{ width: DIVIDER_WIDTH, backgroundColor: DIVIDER_COLOR }}
        />

        <h3
          style={{ ...serif, color: TITLE_COLOR }}
          className={`text-center font-medium leading-[1.3] ${TITLE_FONT_SIZE}`}
        >
          {post.title}
        </h3>
      </div>
    </Link>
  );
}
