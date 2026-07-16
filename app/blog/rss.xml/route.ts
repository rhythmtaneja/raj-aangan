// RSS 2.0 feed for the blog at /blog/rss.xml.
import { client } from "@/sanity/client";
import { isSanityConfigured } from "@/sanity/env";

export const revalidate = 3600; // rebuild the feed hourly

type RssItem = {
  title: string;
  slug: string;
  excerpt?: string;
  publishedAt?: string;
};

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET(request: Request) {
  const origin = new URL(request.url).origin;

  let items: RssItem[] = [];
  if (isSanityConfigured) {
    try {
      items = await client.fetch<RssItem[]>(
        `*[_type=="blogPost" && defined(slug.current)]|order(publishedAt desc)[0...50]{
          title, "slug": slug.current, excerpt, publishedAt
        }`,
        {},
        { next: { revalidate, tags: ["blogPost"] } },
      );
    } catch {
      items = [];
    }
  }

  const feedItems = items
    .map((item) => {
      const link = `${origin}/blog/${item.slug}`;
      const pubDate = item.publishedAt
        ? new Date(item.publishedAt).toUTCString()
        : new Date().toUTCString();
      return `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
      <pubDate>${pubDate}</pubDate>
      ${item.excerpt ? `<description>${escapeXml(item.excerpt)}</description>` : ""}
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Raj Aangan — Blog</title>
    <link>${origin}/blog</link>
    <description>Weddings, events, cuisine, and venues from Raj Aangan Events and Caterers.</description>
    <language>en</language>
    <atom:link href="${origin}/blog/rss.xml" rel="self" type="application/rss+xml" />
${feedItems}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
