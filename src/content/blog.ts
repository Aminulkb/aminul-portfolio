// Blog content — file-based, no database or CMS backend (consistent with the
// rest of the site's "no database" scope decision). Each post is a Markdown
// file with YAML frontmatter in content/blog/<slug>.md; the filename is the
// slug. Add a post by adding a new .md file there (by hand, or through the
// /admin panel) — no new files or routes needed in src/.
//
// Keep posts as general professional/educational HR content — no fabricated
// client names, specific statistics, or claimed outcomes. See CLAUDE.md
// "No fabricated content."

import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export type BlogContentBlock = { type: "heading"; text: string } | { type: "paragraph"; text: string };

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string; // YYYY-MM-DD, used for display and sitemap lastModified
  readTime: string;
  tags: string[];
  relatedService?: "hourly" | "weekly" | "monthly" | "project";
  content: BlogContentBlock[];
};

function readAllPosts(): BlogPost[] {
  const files = readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"));

  return files.map((file) => {
    const slug = file.replace(/\.md$/, "");
    const raw = readFileSync(path.join(BLOG_DIR, file), "utf8");
    const { data } = matter(raw);

    return {
      slug,
      title: data.title,
      excerpt: data.excerpt,
      date: data.date,
      readTime: data.readTime,
      tags: data.tags ?? [],
      relatedService: data.relatedService,
      content: data.content ?? [],
    } satisfies BlogPost;
  });
}

export function getAllBlogPosts(): BlogPost[] {
  return readAllPosts().sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return readAllPosts().find((post) => post.slug === slug);
}
