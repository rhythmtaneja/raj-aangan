import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/ui/SiteHeader";
import FooterSection from "@/components/sections/FooterSection";
import PortableTextRenderer from "@/components/blog/PortableTextRenderer";
import { getBlogPostBySlug, getBlogSlugs } from "@/lib/blog/queries";

const serif = { fontFamily: "var(--font-cormorant-garamond)" } as const;

// Prebuild all known posts; new ones render on-demand then cache (dynamicParams
// defaults to true). ISR keeps everything fresh via the "blogPost" cache tag.
export async function generateStaticParams() {
  const slugs = await getBlogSlugs();
  return slugs.map((slug) => ({ slug }));
}

type PageParams = { params: Promise<{ slug: string }> };

export async function generateMetadata(props: PageParams): Promise<Metadata> {
  const { slug } = await props.params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return { title: "Post not found" };

  const title = post.seoTitle || post.title;
  const description = post.seoDescription || post.excerpt || undefined;
  const images = post.seoImage ? [{ url: post.seoImage }] : undefined;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: post.publishedAt || undefined,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: post.seoImage ? [post.seoImage] : undefined,
    },
  };
}

export default async function BlogPostPage(props: PageParams) {
  const { slug } = await props.params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  return (
    <main className="relative bg-[#efe9df]">
      {/* ── Hero: cover image as a fixed backdrop, matching the blog index ── */}
      <div aria-hidden className="fixed inset-0 z-0 pointer-events-none">
        <Image src={post.coverImage} alt="" fill priority sizes="100vw" className="object-cover object-center" />
        <div className="absolute inset-0" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} />
      </div>

      <div className="relative z-10">
        <SiteHeader colorScheme="light" />

        {/* Hero content */}
        <header className="flex min-h-[70vh] flex-col items-center justify-center px-6 py-24 text-center text-white">
          <Link
            href="/blog"
            className="mb-8 text-xs uppercase tracking-[0.25em] text-white/80 transition-opacity hover:opacity-70"
          >
            ← Back to Blog
          </Link>
          <p className="mb-5 flex flex-wrap items-center justify-center gap-3 text-xs uppercase tracking-[0.2em] text-white/85">
            {post.category && <span>{post.category}</span>}
            {post.category && post.displayDate && <span aria-hidden>·</span>}
            {post.displayDate && <span>{post.displayDate}</span>}
          </p>
          <h1
            style={serif}
            className="max-w-4xl text-[clamp(2rem,5vw,4.5rem)] font-medium leading-[1.1]"
          >
            {post.title}
          </h1>
          {post.excerpt && (
            <p style={serif} className="mt-6 max-w-2xl text-[clamp(1.05rem,1.6vw,1.5rem)] text-white/90">
              {post.excerpt}
            </p>
          )}
          {post.author && (
            <div className="mt-8 flex items-center gap-3">
              {post.author.avatar && (
                <Image
                  src={post.author.avatar}
                  alt={post.author.name}
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-full object-cover"
                />
              )}
              <span className="text-sm tracking-wide text-white/90">By {post.author.name}</span>
            </div>
          )}
        </header>

        {/* ── Body card ── */}
        <article className="mx-auto -mb-px w-full max-w-4xl bg-[#f5efe6] px-6 py-16 md:px-16 md:py-24">
          <PortableTextRenderer value={post.body} />

          {post.tags && (
            <div className="mx-auto mt-14 flex max-w-2xl flex-wrap gap-2 border-t border-black/10 pt-8">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-[#b08d57]/40 px-4 py-1 text-xs uppercase tracking-wide text-[#8a7f6b]"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {post.author?.shortBio && (
            <div className="mx-auto mt-10 flex max-w-2xl items-start gap-4 border-t border-black/10 pt-8">
              {post.author.avatar && (
                <Image
                  src={post.author.avatar}
                  alt={post.author.name}
                  width={56}
                  height={56}
                  className="h-14 w-14 shrink-0 rounded-full object-cover"
                />
              )}
              <div>
                <p style={serif} className="text-lg font-semibold text-[#221d18]">
                  {post.author.name}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-[#6b6255]">{post.author.shortBio}</p>
              </div>
            </div>
          )}

          <div className="mx-auto mt-14 max-w-2xl text-center">
            <Link
              href="/blog"
              className="inline-block rounded-full border border-[#b08d57] px-8 py-3 text-sm uppercase tracking-wide text-[#221d18] transition-colors hover:bg-[#b08d57] hover:text-white"
            >
              ← All Posts
            </Link>
          </div>
        </article>

        <FooterSection />
      </div>
    </main>
  );
}
