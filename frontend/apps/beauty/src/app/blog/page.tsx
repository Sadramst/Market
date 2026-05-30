import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui";
import { blogPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Perth Beauty Guide | Appilico Beauty Blog",
  description:
    "Expert guides to Perth's best beauty salons, services and treatments. Find top-rated nail salons, hair stylists, lash technicians and more across Perth suburbs.",
  alternates: { canonical: "https://beauty.appilico.com.au/blog" },
};

const CATEGORY_COLORS: Record<string, string> = {
  nails: "var(--brand-rose)",
  hair: "#C9A96E",
  lashes: "#9B7B84",
  brows: "#C8737A",
  "skin-care": "#7B9B84",
  massage: "#6B9B9B",
  makeup: "#A35560",
  body: "#C8737A",
  cosmetic: "#9B7B84",
  wellness: "#7B9B8C",
};

function estimateReadTime(wordCount: number): string {
  return `${Math.max(1, Math.ceil(wordCount / 200))} min read`;
}

export default function BlogIndexPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Blog" }]} />

      <div className="mb-12 mt-6">
        <p
          className="text-[12px] font-medium uppercase tracking-[0.15em] mb-2"
          style={{ fontFamily: "var(--font-body)", color: "var(--brand-rose)" }}
        >
          Beauty Guide
        </p>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--text-primary)",
            fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
            fontWeight: 400,
          }}
        >
          Perth Beauty Blog
        </h1>
        <p
          className="text-[15px] font-light mt-2 max-w-2xl"
          style={{
            fontFamily: "var(--font-body)",
            color: "var(--text-secondary)",
          }}
        >
          Expert guides to Perth&apos;s best beauty salons, services and
          treatments. Real recommendations from real data.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogPosts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group block overflow-hidden transition-all duration-300 hover:-translate-y-1"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "12px",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            {/* Cover gradient */}
            <div
              className="h-36 flex items-end p-5"
              style={{
                background: `linear-gradient(135deg, ${
                  CATEGORY_COLORS[post.category] || "var(--brand-rose)"
                }22, ${
                  CATEGORY_COLORS[post.category] || "var(--brand-rose)"
                }44)`,
              }}
            >
              <span
                className="text-[11px] font-medium px-2.5 py-1"
                style={{
                  background: "rgba(255,255,255,0.9)",
                  borderRadius: "50px",
                  color:
                    CATEGORY_COLORS[post.category] || "var(--brand-rose)",
                }}
              >
                {post.category.replace("-", " ").replace(/\b\w/g, (c) =>
                  c.toUpperCase()
                )}
              </span>
            </div>

            <div className="p-5">
              <h2
                className="text-[17px] font-semibold line-clamp-2 transition-colors group-hover:text-[var(--brand-rose)]"
                style={{
                  fontFamily: "var(--font-heading)",
                  color: "var(--text-primary)",
                }}
              >
                {post.title}
              </h2>
              <p
                className="text-[13px] font-light mt-2 line-clamp-2"
                style={{
                  fontFamily: "var(--font-body)",
                  color: "var(--text-secondary)",
                }}
              >
                {post.description}
              </p>
              <div className="flex items-center gap-3 mt-4">
                <span
                  className="text-[11px]"
                  style={{
                    color: "var(--text-muted)",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  {new Date(post.publishedAt).toLocaleDateString("en-AU", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
                <span
                  className="text-[11px]"
                  style={{ color: "var(--text-muted)" }}
                >
                  ·
                </span>
                <span
                  className="text-[11px]"
                  style={{
                    color: "var(--text-muted)",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  {estimateReadTime(post.wordCount)}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
