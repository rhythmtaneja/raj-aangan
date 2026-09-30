import Image from "next/image";
import BlogHero from "@/components/sections/blog/BlogHero";
import BlogGrid from "@/components/sections/blog/BlogGrid";
import FooterSection from "@/components/sections/FooterSection";
import { getAllBlogPosts } from "@/lib/blog/queries";

const PAGE_BG_IMAGE = "/images/blog-hero.jpg";
const PAGE_BG_OVERLAY_OPACITY = 0.5;

export default async function BlogPage() {
  const posts = await getAllBlogPosts();

  return (
    <main className="relative">
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
          style={{
            backgroundColor: `rgba(0, 0, 0, ${PAGE_BG_OVERLAY_OPACITY})`,
          }}
        />
      </div>

      <div className="relative z-10">
        <BlogHero />
        <BlogGrid posts={posts} />
        <FooterSection />
      </div>
    </main>
  );
}
