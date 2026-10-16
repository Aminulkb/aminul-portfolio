import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { siteConfig } from "@/content/site";
import { getAllBlogPosts } from "@/content/blog";
import { formatBlogDate } from "@/lib/blog-date";

export const metadata: Metadata = {
  title: "Blog",
  description: `HR insights and practical advice from ${siteConfig.name} on recruitment, workforce training, and employee engagement for NGOs.`,
  alternates: { canonical: "/blog" },
};

export default function BlogIndexPage() {
  const posts = getAllBlogPosts();

  return (
    <>
      <Header />
      <main className="flex-1 bg-background py-20">
        <Container>
          <SectionHeading
            eyebrow="Blog"
            title="HR Insights for Mission-Driven Organizations"
            description="Practical, experience-based perspectives on recruitment, training, and team engagement in the NGO sector."
          />

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex flex-col gap-4 rounded-2xl border border-border bg-surface p-7 transition-colors hover:border-gold"
              >
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <h3 className="font-serif text-xl font-semibold text-text group-hover:text-primary">{post.title}</h3>

                <p className="flex-1 text-sm leading-relaxed text-text-secondary">{post.excerpt}</p>

                <div className="flex items-center justify-between text-xs text-text-secondary">
                  <span>
                    {formatBlogDate(post.date)} · {post.readTime}
                  </span>
                  <span className="inline-flex items-center gap-1 font-semibold text-primary">
                    Read <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
