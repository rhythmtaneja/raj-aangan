import type { PortableTextBlock } from "@portabletext/react";

export type LocalBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "quote"; text: string }
  | { type: "list"; items: string[] }
  | { type: "numbers"; items: string[] }
  | { type: "image"; src: string; alt?: string; caption?: string };

export type LocalBlogPost = {
  slug: string;
  title: string;

  date: string;

  image: string;

  excerpt?: string;

  category?: string;

  tags?: string[];

  body: LocalBlock[];
};

export type BlogPostCard = {
  slug: string;
  title: string;

  date: string;

  image: string;

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

  localBody?: LocalBlock[];
  seoTitle?: string;
  seoDescription?: string;
  seoImage?: string;
};
