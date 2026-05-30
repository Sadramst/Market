import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/ui";
import { blogPosts, getPostBySlug } from "@/lib/blog";

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Post Not Found" };

  return {
    title: `${post.title} | Appilico Beauty Blog`,
    description: post.description,
    alternates: {
      canonical: `https://beauty.appilico.com.au/blog/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://beauty.appilico.com.au/blog/${slug}`,
      type: "article",
      publishedTime: post.publishedAt,
    },
  };
}

function renderMarkdown(content: string) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let inTable = false;
  let tableHeaders: string[] = [];
  let tableRows: string[][] = [];

  function processInline(text: string): React.ReactNode[] {
    const parts: React.ReactNode[] = [];
    // Process bold, links, and inline code
    const regex = /\*\*(.+?)\*\*|\[(.+?)\]\((.+?)\)|`(.+?)`/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }
      if (match[1]) {
        // Bold
        parts.push(
          <strong key={match.index} className="font-semibold">
            {match[1]}
          </strong>
        );
      } else if (match[2] && match[3]) {
        // Link
        parts.push(
          <Link
            key={match.index}
            href={match[3]}
            className="underline underline-offset-2 transition-colors"
            style={{ color: "var(--brand-rose)" }}
          >
            {match[2]}
          </Link>
        );
      } else if (match[4]) {
        // Inline code
        parts.push(
          <code
            key={match.index}
            className="px-1.5 py-0.5 text-[13px] rounded"
            style={{
              background: "var(--bg-secondary)",
              fontFamily: "monospace",
            }}
          >
            {match[4]}
          </code>
        );
      }
      lastIndex = match.index + match[0].length;
    }
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }
    return parts.length > 0 ? parts : [text];
  }

  function flushTable() {
    if (tableHeaders.length > 0) {
      elements.push(
        <div key={`table-${elements.length}`} className="overflow-x-auto my-6">
          <table
            className="w-full text-[14px]"
            style={{
              borderCollapse: "collapse",
              fontFamily: "var(--font-body)",
            }}
          >
            <thead>
              <tr>
                {tableHeaders.map((h, i) => (
                  <th
                    key={i}
                    className="text-left px-4 py-2.5 font-semibold"
                    style={{
                      borderBottom: "2px solid var(--border)",
                      color: "var(--text-primary)",
                    }}
                  >
                    {h.trim()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableRows.map((row, ri) => (
                <tr key={ri}>
                  {row.map((cell, ci) => (
                    <td
                      key={ci}
                      className="px-4 py-2"
                      style={{
                        borderBottom: "1px solid var(--border)",
                        color: "var(--text-secondary)",
                      }}
                    >
                      {cell.trim()}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    tableHeaders = [];
    tableRows = [];
    inTable = false;
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Table detection
    if (line.startsWith("|") && line.endsWith("|")) {
      const cells = line
        .split("|")
        .filter((c) => c.trim() !== "");
      if (!inTable) {
        tableHeaders = cells;
        inTable = true;
        continue;
      }
      // Skip separator row
      if (cells.every((c) => /^[-:\s]+$/.test(c))) continue;
      tableRows.push(cells);
      continue;
    } else if (inTable) {
      flushTable();
    }

    // Headings
    if (line.startsWith("# ")) {
      elements.push(
        <h1
          key={i}
          className="mt-8 mb-4"
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--text-primary)",
            fontSize: "clamp(1.5rem, 3vw, 2rem)",
            fontWeight: 400,
          }}
        >
          {line.slice(2)}
        </h1>
      );
    } else if (line.startsWith("## ")) {
      elements.push(
        <h2
          key={i}
          className="mt-8 mb-3 text-[20px] font-semibold"
          style={{
            fontFamily: "var(--font-heading)",
            color: "var(--text-primary)",
          }}
        >
          {line.slice(3)}
        </h2>
      );
    } else if (line.startsWith("### ")) {
      elements.push(
        <h3
          key={i}
          className="mt-6 mb-2 text-[17px] font-semibold"
          style={{
            fontFamily: "var(--font-heading)",
            color: "var(--text-primary)",
          }}
        >
          {line.slice(4)}
        </h3>
      );
    } else if (line.startsWith("- ")) {
      elements.push(
        <li
          key={i}
          className="ml-5 text-[15px] font-light leading-relaxed"
          style={{
            fontFamily: "var(--font-body)",
            color: "var(--text-secondary)",
            listStyleType: "disc",
          }}
        >
          {processInline(line.slice(2))}
        </li>
      );
    } else if (/^\d+\.\s/.test(line)) {
      const text = line.replace(/^\d+\.\s/, "");
      elements.push(
        <li
          key={i}
          className="ml-5 text-[15px] font-light leading-relaxed"
          style={{
            fontFamily: "var(--font-body)",
            color: "var(--text-secondary)",
            listStyleType: "decimal",
          }}
        >
          {processInline(text)}
        </li>
      );
    } else if (line.trim() === "") {
      // Skip empty lines
    } else {
      elements.push(
        <p
          key={i}
          className="text-[15px] font-light leading-relaxed my-3"
          style={{
            fontFamily: "var(--font-body)",
            color: "var(--text-secondary)",
          }}
        >
          {processInline(line)}
        </p>
      );
    }
  }

  if (inTable) flushTable();

  return elements;
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const readTime = Math.max(1, Math.ceil(post.wordCount / 200));

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Blog", href: "/blog" },
          { label: post.title },
        ]}
      />

      {/* Post header */}
      <header className="mt-8 mb-10">
        <div className="flex items-center gap-3 mb-4">
          <span
            className="text-[11px] font-medium px-2.5 py-1"
            style={{
              background: "var(--brand-rose)",
              color: "white",
              borderRadius: "50px",
            }}
          >
            {post.category
              .replace("-", " ")
              .replace(/\b\w/g, (c) => c.toUpperCase())}
          </span>
          {post.suburb && (
            <Link
              href={`/${post.suburb}`}
              className="text-[11px] font-medium px-2.5 py-1"
              style={{
                background: "var(--bg-secondary)",
                color: "var(--text-secondary)",
                borderRadius: "50px",
                border: "1px solid var(--border)",
              }}
            >
              📍{" "}
              {post.suburb
                .replace("-", " ")
                .replace(/\b\w/g, (c) => c.toUpperCase())}
            </Link>
          )}
        </div>

        <h1
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--text-primary)",
            fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
            fontWeight: 400,
            lineHeight: 1.3,
          }}
        >
          {post.title}
        </h1>

        <div className="flex items-center gap-3 mt-4">
          <span
            className="text-[13px]"
            style={{
              color: "var(--text-muted)",
              fontFamily: "var(--font-body)",
            }}
          >
            {new Date(post.publishedAt).toLocaleDateString("en-AU", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
          <span className="text-[13px]" style={{ color: "var(--text-muted)" }}>
            ·
          </span>
          <span
            className="text-[13px]"
            style={{
              color: "var(--text-muted)",
              fontFamily: "var(--font-body)",
            }}
          >
            {readTime} min read
          </span>
        </div>
      </header>

      {/* Post content */}
      <div className="blog-content">{renderMarkdown(post.content)}</div>

      {/* Back to blog */}
      <div
        className="mt-12 pt-8"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <Link
          href="/blog"
          className="text-[14px] font-medium transition-colors"
          style={{ color: "var(--brand-rose)" }}
        >
          ← Back to all articles
        </Link>
      </div>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            description: post.description,
            datePublished: post.publishedAt,
            publisher: {
              "@type": "Organization",
              name: "Appilico Beauty",
              url: "https://beauty.appilico.com.au",
            },
            mainEntityOfPage: `https://beauty.appilico.com.au/blog/${post.slug}`,
          }),
        }}
      />
    </article>
  );
}
