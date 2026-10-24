import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  // Blog posts are read from content/blog/*.md via fs at build/request time
  // (src/content/blog.ts). These files aren't imported with a static `import`
  // statement, so Vercel's build-time file tracer can't always discover them
  // on its own — list them explicitly so they're always bundled with any
  // function that needs them.
  outputFileTracingIncludes: {
    "/**": ["./content/**/*"],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async rewrites() {
    // Next.js's static file serving (public/) doesn't auto-resolve a folder
    // request to its index.html the way a plain static host would — without
    // this, /admin (and /admin/) 404 even though /admin/index.html serves
    // fine. This is what makes the Decap CMS link in README ("visit /admin")
    // actually work.
    return [
      { source: "/admin", destination: "/admin/index.html" },
      { source: "/admin/", destination: "/admin/index.html" },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
