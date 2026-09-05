import type { PortableTextBlock } from "@portabletext/react";

// ─── Hand-written post bodies (lib/blog/posts.ts) ──────────────────────────
// A deliberately small, easy-to-type block format for posts written straight
// in the repo rather than in Sanity Studio. LocalBlogBody renders these with
// exactly the same typography PortableTextRenderer gives Sanity posts, so a
// hand-written post and a Studio post look identical on the page.

export type LocalBlock =
  /** A paragraph of body copy. */
  | { type: "p"; text: string }
  /** A big section heading. */
  | { type: "h2"; text: string }
  /** A smaller sub-heading under an h2. */
  | { type: "h3"; text: string }
  /** A pulled-out quote in gold-ruled italics. */
  | { type: "quote"; text: string }
  /** A bulleted list. */
  | { type: "list"; items: string[] }
  /** A numbered list. */
  | { type: "numbers"; items: string[] }
  /** An in-article photo. `src` is a path under /public. */
  | { type: "image"; src: string; alt?: string; caption?: string };

/** A post written in lib/blog/posts.ts instead of Studio. */
export type LocalBlogPost = {
  /** URL segment — the post lives at /blog/<slug>. Keep it lowercase-hyphenated. */
  slug: string;
  title: string;
  /** Shown on the card and the post header, e.g. "06.03.2026". */
  date: string;
  /** Cover photo — the card thumbnail AND the post's hero backdrop. */
  image: string;
  /** One or two lines under the title in the hero. Optional. */
  excerpt?: string;
  /** Small label above the title, e.g. "Weddings". Optional. */
  category?: string;
  /** Pills at the foot of the post. Optional. */
  tags?: string[];
  /** The article itself. */
  body: LocalBlock[];
};

/** Card shape consumed by the blog grid (kept compatible with BlogGrid). */
export type BlogPostCard = {
  slug: string;
  title: string;
  /** Display date, e.g. "06.03.2026". */
  date: string;
  /** Cover image URL (resolved). */
  image: string;
  /** Link target, e.g. "/blog/my-post". */
  href: string;
  excerpt?: string;
  category?: string;
  isFeatured?: boolean;
};

export type BlogAuthor = {
  name: string;
  avatar?: string;
  shortBio?: string;
};

/** Full post shape for the individual post page. */
export type BlogPostFull = {
  slug: string;
  title: string;
  coverImage: string;
  excerpt?: string;
  publishedAt: string;
  displayDate: string;
  author?: BlogAuthor;
  category?: string;
  tags?: string[];
  /** Sanity body. Empty for a post written in lib/blog/posts.ts. */
  body: PortableTextBlock[];
  /** Set instead of `body` when the post comes from lib/blog/posts.ts. */
  localBody?: LocalBlock[];
  seoTitle?: string;
  seoDescription?: string;
  seoImage?: string;
};
