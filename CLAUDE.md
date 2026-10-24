# CLAUDE.md — durable notes for working on this project

Read `README.md` first for stack/structure/env vars. This file is for rules that aren't obvious from the code.

## Hard constraints (do not change without the owner's explicit approval)

- **Pricing is fixed:** $100/hour, $10,000/week, $30,000/month, project-based = custom quotation (updated 2026-10-17, owner-approved). Lives in `src/content/site.ts` (`siteConfig.pricing` and `serviceTypeOptions`) and is echoed in the JSON-LD `priceRange` in `layout.tsx` — change in both places together, never hardcode prices elsewhere.
- **No fabricated content.** No testimonials, client names, credentials, or stats. The hero now shows Aminul's real photo (`public/images/aminul-islam.jpg`, supplied by the owner) — don't swap in a stock photo or illustration.
- **Header/Footer theme:** Header uses a `primary → secondary` deep-purple gradient; Footer uses the darker `bg-ink` panel (`--color-ink` in `globals.css`). Both get a **solid, full-opacity, 4px gold trim border** (`border-b-4 border-gold` / `border-t-4 border-gold` — not `/NN` opacity, and not thinner; the owner explicitly asked for this to always be clearly visible) and gold-accented text (`--color-gold` / `--color-gold-soft`). Nav links in both use a **soft gold pill-background fade-in on hover** (`rounded-full ... hover:bg-gold/15 hover:text-gold-soft`, no underline — an underline-slide effect was tried first and the owner asked for it to be replaced with this). The header's "Book a Consultation" CTA is `rounded-md` (not a pill) and hovers to `--color-ember` (`#f26d3e`, an exact hex the owner specified) with white text — reuse `bg-ember`/`hover:bg-ember` for any other header button rather than inventing a new hover color.
- **No database.** Contact submissions are emailed, not persisted. This was a deliberate scope decision (see README "Known trade-offs"), not an oversight. The `/admin` content panel (added 2026-10-24, see "Admin Panel (Decap CMS)" below) doesn't change this — it's git-backed, not a database: edits there are commits to this repo, not rows in a table.

## Next.js 16 specifics that bit us once — don't reintroduce these bugs

- **Cache Components is enabled** (`next.config.ts`: `cacheComponents: true`). This means:
  - `export const runtime = "nodejs"` on route handlers is now **forbidden** (Node.js runtime is implied everywhere). Don't add it back.
  - `new Date()` (or `Math.random()`, etc.) called directly inside a Server Component that's part of the static shell **fails the build**, not just a lint warning. Use the cached helper in `src/lib/date.ts` (`getCachedNow()`) instead of calling `new Date()` directly in any Server Component.
  - A `GET` Route Handler using non-deterministic data (like `sitemap.ts`) just becomes dynamic (`ƒ`) silently — that's fine and expected, not a bug.
- **Fonts are self-hosted**, not loaded via `next/font/google`. This sandbox/environment can't reach `fonts.googleapis.com` at build time, and self-hosting (via `@fontsource-variable/inter` + `@fontsource-variable/playfair-display`, loaded with `next/font/local` in `layout.tsx`) is also strictly more robust for any future deployment target with restricted network access. Don't switch back to `next/font/google` without a real reason.
- **React hooks purity lint is strict** (`eslint-plugin-react-hooks` in `eslint-config-next@16`). Don't call `Date.now()`/`Math.random()` directly during render in a Client Component — capture it in `useEffect`. Don't `setState` inside a bare `useEffect` to sync from props/search-params — use a lazy `useState(() => ...)` initializer instead (see `ContactForm.tsx` for the pattern, and https://react.dev/learn/you-might-not-need-an-effect).

## Contact form / API

- Single source of truth for validation: `src/lib/validation.ts` (`contactFormSchema`). The client (`ContactForm.tsx`) does a lightweight duplicate check for instant UX feedback, but the server schema is what's authoritative.
- Honeypot field (`companyWebsite`) must **never** have its own validation error — it has to accept any value so the API can silently no-op bot submissions (`return { success: true }` without sending mail) instead of revealing the field exists via a 400 error. If you add new hidden anti-spam fields, follow the same pattern.
- `src/lib/rate-limit.ts` is in-memory — fine for single-instance deployment only. See README before deploying to serverless/multi-region.

## Commands

```bash
npm run dev          # local dev server
npm run lint          # eslint
npx tsc --noEmit       # typecheck
npm run build         # production build (also type-checks)
npm start              # run the production build locally, e.g. to smoke-test /api/contact with curl
```

## Content changes

Two layers now, split by who should be able to change them:

- **Owner-editable, via `/admin` or by hand:** bio, expertise, services, pricing, approach steps, contact notice → `content/site.json`. Blog posts → `content/blog/*.md`.
- **Code-only (nav, page title/description, keywords, hero CTA labels, site URL fallback):** stays hardcoded in `src/content/site.ts`, which imports and re-exports `content/site.json` alongside these. Edit there for anything not covered by `/admin`.

Don't duplicate strings inside components either way — always read from `siteConfig` (`src/content/site.ts`).

`serviceTypeOptions` (the contact form's dropdown) and the JSON-LD `priceRange` in `layout.tsx` are now both **derived from `siteConfig.pricing`** at build time — don't hardcode them separately again; editing a price in `content/site.json` (by hand or via `/admin`) already updates both automatically, which is why the old "change pricing in both places" hard-constraint note above is less of a trap than it used to be (`layout.tsx`'s `priceRange` is computed, not a literal string, as of 2026-10-24).

Icon fields (`expertise[].icon`, `services[].icon`, `pricing[].icon`) must stay exact `lucide-react` export names matching the `icons` map in the corresponding component (`Expertise.tsx`, `Services.tsx`, `Pricing.tsx`) — `/admin`'s config.yml restricts these to `select` dropdowns for this reason, so don't change those dropdown option lists without adding the matching icon import + map entry in the component, or an owner's valid-looking choice will fail to render.

## Blog

- File-based, no CMS backend/database (consistent with the project's "no database" scope decision): each post is a Markdown file with YAML frontmatter at `content/blog/<slug>.md` — the filename **is** the slug, there's no separate `slug` field in the frontmatter. The file's Markdown body is unused (left empty); all post data lives in frontmatter, including the `content` field (a list of `{type: heading|paragraph, text}` blocks — not Markdown prose) so the existing block-based renderer in `src/app/blog/[slug]/page.tsx` didn't need to change.
- `src/content/blog.ts` reads this directory at request/build time via `gray-matter` (`getAllBlogPosts`, `getBlogPostBySlug`) — no array to edit in code anymore. Add a post by adding a `.md` file (by hand, or via `/admin`'s "Blog Posts" collection) — no new files or routes needed.
- Because these reads use `fs`/`readdirSync` rather than a static `import`, `next.config.ts` has an explicit `outputFileTracingIncludes: { "/**": ["./content/**/*"] }` so Vercel's serverless function bundles always include `content/`. If `content/` is ever moved or renamed, update that path too, or ISR revalidation will fail to find the files in production even though local `npm run build`/`npm start` still works (local runs don't go through Vercel's file-tracing prune).
- `src/app/blog/page.tsx` (listing) and `src/app/blog/[slug]/page.tsx` (post, with `generateStaticParams` + `generateMetadata`) are unchanged. `sitemap.ts` includes `/blog` and every post automatically.
- Keep posts as general professional/educational content — no fabricated client names, specific statistics, or claimed outcomes (same "No fabricated content" rule as the rest of the site).
- Post dates are plain `"YYYY-MM-DD"` strings formatted with `src/lib/blog-date.ts` (`formatBlogDate`), which deliberately avoids `new Date(...)` entirely to stay unambiguously safe under Cache Components — don't swap it for a `Date`-based formatter in a Server Component. In `content/blog/*.md` frontmatter the date must stay **quoted** (`date: '2026-09-10'`) — unquoted, YAML auto-parses it into a JS `Date` object instead of a string, which breaks `formatBlogDate`'s string-splitting. Decap CMS's `date` field is configured as a plain `string` widget (not `datetime`) for this reason — don't change that widget type.

## Admin Panel (Decap CMS)

- `/admin` (`public/admin/index.html` + `config.yml`) is [Decap CMS](https://decapcms.org/), loaded from CDN (`unpkg.com/decap-cms@^3`) as a static page — not part of the Next.js app bundle, so it needs no build step or npm dependency of its own.
- **Backend: `github`**, `publish_mode: simple` — every save is a direct commit to `main` via the GitHub API (no draft/PR review step). This is intentional for a non-technical single-owner site; if that ever needs to change, `publish_mode: editorial_workflow` is the documented alternative.
- **Login:** GitHub OAuth, implemented by hand (not a third-party provider package) in `src/app/api/auth/route.ts` (step 1: redirect to GitHub's authorize endpoint, state stored in an `httpOnly` cookie) and `src/app/api/auth/callback/route.ts` (step 2: exchanges the code for a token server-side, then `postMessage`s it back to the CMS per the standard Decap/Netlify CMS popup handshake). Requires `GITHUB_OAUTH_CLIENT_ID` / `GITHUB_OAUTH_CLIENT_SECRET` env vars from a GitHub OAuth App the owner creates (see README "Admin Panel") — this app can't create that OAuth App itself since it requires signing in to the owner's own GitHub account.
- The `content/site.json` collection in `config.yml` is a `files:` collection (single file, many fields), not a `folder:` collection — keep its field list in sync with the shape of `content/site.json` / `siteConfig` by hand if either changes.
- `media_folder`/`public_folder` point at `public/images/blog` / `/images/blog` — blog post images uploaded through the CMS land there.
