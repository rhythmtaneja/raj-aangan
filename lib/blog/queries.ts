// ══════════════════════════════════════════════════════════════════
// PATH IN REPO: lib/blog/queries.ts
// ══════════════════════════════════════════════════════════════════
// Server-only blog fetchers. Same graceful-fallback contract as the menu
// queries: when Sanity isn't configured (or a fetch fails), the grid shows
// the original hardcoded placeholder posts so the page never breaks.
// ═══════════════════════════════════════════════════════════════════════════

import "server-only";
import { client } from "@/sanity/client";
import { imageUrl } from "@/sanity/image";
import { isSanityConfigured } from "@/sanity/env";
import type { BlogPostCard, BlogPostFull } from "./types";

const REVALIDATE = 30;
const PLACEHOLDER = "/images/mb-placeholder.jpg";

async function sanityFetch<T>(query: string, params: Record<string, unknown> = {}): Promise<T> {
  return client.fetch<T>(query, params, { next: { revalidate: REVALIDATE, tags: ["blogPost"] } });
}

/** ISO datetime → "DD.MM.YYYY" to match the existing card design. */
function formatDate(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}.${mm}.${d.getFullYear()}`;
}

// Original placeholder posts — used only when Sanity isn't connected.
const FALLBACK_CARDS: BlogPostCard[] = [
  { slug: "#", title: "How to Plan a Luxury Wedding in Jaipur: Complete Guide", date: "06.03.2026", image: "/images/blog/blog-1.jpg", href: "#" },
  { slug: "#", title: "Why Jaipur is India's Favorite Destination Wedding City", date: "06.03.2026", image: "/images/blog/blog-2.jpg", href: "#" },
  { slug: "#", title: "Wedding Venues in Jaipur Every Couple Should Consider", date: "06.03.2026", image: "/images/blog/blog-3.jpg", href: "#" },
  { slug: "#", title: "The Ultimate Luxury Wedding Checklist", date: "06.03.2026", image: "/images/blog/blog-4.jpg", href: "#" },
  { slug: "#", title: "Wedding Trends for 2026: Decor, Fashion & Experiences", date: "06.03.2026", image: "/images/blog/blog-5.jpg", href: "#" },
];

const CARD_PROJECTION = `{
  "slug": slug.current,
  title,
  publishedAt,
  excerpt,
  category,
  isFeatured,
  coverImage
}`;

type RawCard = {
  slug: string;
  title: string;
  publishedAt?: string;
  excerpt?: string;
  category?: string;
  isFeatured?: boolean;
  coverImage?: unknown;
};

function mapCard(r: RawCard): BlogPostCard {
  return {
    slug: r.slug,
    title: r.title,
    date: formatDate(r.publishedAt),
    image: imageUrl(r.coverImage, PLACEHOLDER, 1200),
    href: `/blog/${r.slug}`,
    excerpt: r.excerpt || undefined,
    category: r.category || undefined,
    isFeatured: r.isFeatured || undefined,
  };
}

export async function getAllBlogPosts(): Promise<BlogPostCard[]> {
  if (!isSanityConfigured) return FALLBACK_CARDS;
  try {
    const rows = await sanityFetch<RawCard[]>(
      `*[_type=="blogPost" && defined(slug.current)]|order(publishedAt desc)${CARD_PROJECTION}`,
    );
    if (!rows.length) return FALLBACK_CARDS;
    return rows.map(mapCard);
  } catch {
    return FALLBACK_CARDS;
  }
}

/** All slugs — for generateStaticParams. Empty when Sanity isn't configured. */
export async function getBlogSlugs(): Promise<string[]> {
  if (!isSanityConfigured) return [];
  try {
    return await sanityFetch<string[]>(
      `*[_type=="blogPost" && defined(slug.current)].slug.current`,
    );
  } catch {
    return [];
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPostFull | null> {
  if (!isSanityConfigured) return null;
  try {
    const r = await sanityFetch<{
      slug: string;
      title: string;
      coverImage?: unknown;
      excerpt?: string;
      publishedAt?: string;
      author?: { name: string; avatar?: unknown; shortBio?: string };
      category?: string;
      tags?: string[];
      body?: BlogPostFull["body"];
      seoTitle?: string;
      seoDescription?: string;
      seoImage?: unknown;
    } | null>(
      `*[_type=="blogPost" && slug.current==$slug][0]{
        "slug": slug.current,
        title,
        coverImage,
        excerpt,
        publishedAt,
        author->{ name, avatar, shortBio },
        category,
        tags,
        body,
        seoTitle,
        seoDescription,
        seoImage
      }`,
      { slug },
    );
    if (!r) return null;
    return {
      slug: r.slug,
      title: r.title,
      coverImage: imageUrl(r.coverImage, PLACEHOLDER, 2000),
      excerpt: r.excerpt || undefined,
      publishedAt: r.publishedAt ?? "",
      displayDate: formatDate(r.publishedAt),
      author: r.author
        ? {
            name: r.author.name,
            avatar: r.author.avatar ? imageUrl(r.author.avatar, PLACEHOLDER, 128) : undefined,
            shortBio: r.author.shortBio || undefined,
          }
        : undefined,
      category: r.category || undefined,
      tags: r.tags && r.tags.length ? r.tags : undefined,
      body: r.body ?? [],
      seoTitle: r.seoTitle || undefined,
      seoDescription: r.seoDescription || undefined,
      seoImage: r.seoImage
        ? imageUrl(r.seoImage, PLACEHOLDER, 1200)
        : imageUrl(r.coverImage, PLACEHOLDER, 1200),
    };
  } catch {
    return null;
  }
}
