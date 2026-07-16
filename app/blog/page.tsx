import Image from "next/image";
import BlogHero from "@/components/sections/blog/BlogHero";
import BlogGrid from "@/components/sections/blog/BlogGrid";
import FooterSection from "@/components/sections/FooterSection";
import { getAllBlogPosts } from "@/lib/blog/queries";

// ═══════════════════════════════════════════════════════════════════════════
// Posts now come from Sanity (falls back to placeholder posts when Sanity
// isn't connected). Layout is unchanged — fixed backdrop + hero + grid.
// ═══════════════════════════════════════════════════════════════════════════

const PAGE_BG_IMAGE = "/images/blog-hero.jpg";
const PAGE_BG_OVERLAY_OPACITY = 0.5; // 0 = photo untouched, 1 = pure black

export default async function BlogPage() {
  const posts = await getAllBlogPosts();

  return (
    <main className="relative">
      {/* FIXED BACKDROP — pinned behind all content while scrolling */}
      <div aria-hidden className="fixed inset-0 z-0 pointer-events-none">
        <Image
          src={PAGE_BG_IMAGE}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div
          className="absolute inset-0"
          style={{ backgroundColor: `rgba(0, 0, 0, ${PAGE_BG_OVERLAY_OPACITY})` }}
        />
      </div>

      {/* CONTENT — sits above the fixed backdrop */}
      <div className="relative z-10">
        <BlogHero />
        <BlogGrid posts={posts} />
        <FooterSection />
      </div>
    </main>
  );
}
