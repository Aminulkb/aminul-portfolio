import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/content/site";
import { getAllBlogPosts, getBlogPostBySlug } from "@/content/blog";
import { formatBlogDate } from "@/lib/blog-date";

export function generateStaticParams() {
  return getAllBlogPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url: `${siteConfig.url}/blog/${post.slug}`,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  return (
    <>
      <Header />
      <main className="flex-1 bg-background py-20">
        <Container className="max-w-3xl">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-secondary"
          >
            <ArrowLeft size={16} /> Back to Blog
          </Link>

          <div className="mt-6 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                {tag}
              </span>
            ))}
          </div>

          <h1 className="mt-4 font-serif text-3xl font-semibold leading-tight text-text sm:text-4xl">
            {post.title}
          </h1>

          <p className="mt-3 text-sm text-text-secondary">
            {formatBlogDate(post.date)} · {post.readTime} · {siteConfig.name}
          </p>

          <div className="mt-10 flex flex-col gap-6">
            {post.content.map((block, i) =>
              block.type === "heading" ? (
                <h2 key={i} className="font-serif text-xl font-semibold text-text sm:text-2xl">
                  {block.text}
                </h2>
              ) : (
                <p key={i} className="text-base leading-relaxed text-text-secondary sm:text-lg">
                  {block.text}
                </p>
              ),
            )}
          </div>

          <div className="mt-14 flex flex-col gap-3 rounded-2xl border border-border bg-surface p-7 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-serif text-lg font-semibold text-text">Have a similar challenge?</p>
              <p className="mt-1 text-sm text-text-secondary">
                Let&apos;s talk about what this would look like for your organization.
              </p>
            </div>
            <Link
              href={{
                pathname: "/",
                query: post.relatedService ? { service: post.relatedService } : undefined,
                hash: "contact",
              }}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-secondary"
            >
              Discuss Your HR Needs <ArrowRight size={16} />
            </Link>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
