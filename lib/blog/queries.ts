import "server-only";
import { client } from "@/sanity/client";
import { imageUrl } from "@/sanity/image";
import { isSanityConfigured } from "@/sanity/env";
import { LOCAL_BLOG_POSTS, getLocalBlogPost } from "./posts";
import type { BlogPostCard, BlogPostFull } from "./types";

const REVALIDATE = 30;
const PLACEHOLDER = "/images/mb-placeholder.jpg";

async function sanityFetch<T>(
  query: string,
  params: Record<string, unknown> = {},
): Promise<T> {
  return client.fetch<T>(query, params, {
    next: { revalidate: REVALIDATE, tags: ["blogPost"] },
  });
}

function formatDate(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}.${mm}.${d.getFullYear()}`;
}

const FALLBACK_CARDS: BlogPostCard[] = LOCAL_BLOG_POSTS.map((post) => ({
  slug: post.slug,
  title: post.title,
  date: post.date,
  image: post.image,
  href: `/blog/${post.slug}`,
  excerpt: post.excerpt || undefined,
  category: post.category || undefined,
}));

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

export async function getBlogSlugs(): Promise<string[]> {
  const local = LOCAL_BLOG_POSTS.map((p) => p.slug);
  if (!isSanityConfigured) return local;
  try {
    const remote = await sanityFetch<string[]>(
      `*[_type=="blogPost" && defined(slug.current)].slug.current`,
    );
    return Array.from(new Set([...remote, ...local]));
  } catch {
    return local;
  }
}

function localPostToFull(slug: string): BlogPostFull | null {
  const post = getLocalBlogPost(slug);
  if (!post) return null;
  return {
    slug: post.slug,
    title: post.title,
    coverImage: post.image,
    excerpt: post.excerpt || undefined,
    publishedAt: "",
    displayDate: post.date,
    category: post.category || undefined,
    tags: post.tags && post.tags.length ? post.tags : undefined,
    body: [],
    localBody: post.body,
    seoTitle: post.title,
    seoDescription: post.excerpt || undefined,
    seoImage: post.image,
  };
}

export async function getBlogPostBySlug(
  slug: string,
): Promise<BlogPostFull | null> {
  if (!isSanityConfigured) return localPostToFull(slug);
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

    if (!r) return localPostToFull(slug);
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
            avatar: r.author.avatar
              ? imageUrl(r.author.avatar, PLACEHOLDER, 128)
              : undefined,
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
    return localPostToFull(slug);
  }
}
