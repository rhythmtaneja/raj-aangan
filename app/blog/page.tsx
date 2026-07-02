import Image from "next/image";
import BlogHero from "@/components/sections/blog/BlogHero";
import BlogGrid, { type BlogPost } from "@/components/sections/blog/BlogGrid";
import FooterSection from "@/components/sections/FooterSection";

// ═══════════════════════════════════════════════════════════════════════════
// BLOG POSTS — SINGLE SOURCE OF TRUTH
//
// To add a new post: append an entry to this array.
// To remove one: delete the entry. To reorder: rearrange.
// The grid re-renders automatically. Drop photos in /public/images/blog/.
// ═══════════════════════════════════════════════════════════════════════════

const BLOG_POSTS: BlogPost[] = [
  {
    title: "How to Plan a Luxury Wedding in Jaipur: Complete Guide",
    date:  "06.03.2026",
    image: "/images/blog/blog-1.jpg",
    href:  "#", // ← replace with real URL when the post exists
  },
  {
    title: "Why Jaipur is India's Favorite Destination Wedding City",
    date:  "06.03.2026",
    image: "/images/blog/blog-2.jpg",
    href:  "#",
  },
  {
    title: "Wedding Venues in Jaipur Every Couple Should Consider",
    date:  "06.03.2026",
    image: "/images/blog/blog-3.jpg",
    href:  "#",
  },
  {
    title: "The Ultimate Luxury Wedding Checklist",
    date:  "06.03.2026",
    image: "/images/blog/blog-4.jpg",
    href:  "#",
  },
  {
    title: "Wedding Trends for 2026: Decor, Fashion & Experiences",
    date:  "06.03.2026",
    image: "/images/blog/blog-5.jpg",
    href:  "#",
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// Constant page backdrop — the same image is behind every section on the
// blog page (hero + grid + around the cards). Change PAGE_BG_IMAGE to swap
// the whole page's backdrop.
// ═══════════════════════════════════════════════════════════════════════════

const PAGE_BG_IMAGE           = "/images/blog-hero.jpg";
const PAGE_BG_OVERLAY_OPACITY = 0.5; // 0 = photo untouched, 1 = pure black

// ═══════════════════════════════════════════════════════════════════════════

export default function BlogPage() {
  return (
    <main className="relative">
      {/*
        FIXED BACKDROP
        - position: fixed keeps it pinned to the viewport as the user scrolls
        - z-0 puts it behind all content
        - pointer-events-none so it never intercepts clicks
      */}
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
        <BlogGrid posts={BLOG_POSTS} />
        <FooterSection />
      </div>
    </main>
  );
}
