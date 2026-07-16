import type { PortableTextBlock } from "@portabletext/react";

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
  body: PortableTextBlock[];
  seoTitle?: string;
  seoDescription?: string;
  seoImage?: string;
};
