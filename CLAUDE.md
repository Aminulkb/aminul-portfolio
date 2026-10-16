# CLAUDE.md — durable notes for working on this project

Read `README.md` first for stack/structure/env vars. This file is for rules that aren't obvious from the code.

## Hard constraints (do not change without the owner's explicit approval)

- **Pricing is fixed:** $300/hour, $20,000/week, $100,000/month, project-based = custom quotation. Lives in `src/content/site.ts` (`siteConfig.pricing`) — change there only, never hardcode prices elsewhere.
- **No fabricated content.** No testimonials, client names, credentials, or stats. The hero now shows Aminul's real photo (`public/images/aminul-islam.jpg`, supplied by the owner) — don't swap in a stock photo or illustration.
- **Header/Footer theme:** Header uses a `primary → secondary` deep-purple gradient; Footer uses the darker `bg-ink` panel (`--color-ink` in `globals.css`). Both get a **solid, full-opacity, 4px gold trim border** (`border-b-4 border-gold` / `border-t-4 border-gold` — not `/NN` opacity, and not thinner; the owner explicitly asked for this to always be clearly visible) and gold-accented text (`--color-gold` / `--color-gold-soft`). Nav links in both use a **soft gold pill-background fade-in on hover** (`rounded-full ... hover:bg-gold/15 hover:text-gold-soft`, no underline — an underline-slide effect was tried first and the owner asked for it to be replaced with this). The header's "Book a Consultation" CTA is `rounded-md` (not a pill) and hovers to `--color-ember` (`#f26d3e`, an exact hex the owner specified) with white text — reuse `bg-ember`/`hover:bg-ember` for any other header button rather than inventing a new hover color.
- **No database.** Contact submissions are emailed, not persisted. This was a deliberate scope decision (see README "Known trade-offs"), not an oversight.

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

All visible copy — bio, services, pricing, expertise, approach steps, nav — lives in `src/content/site.ts`. Edit there; don't duplicate strings inside components.

## Blog

- File-based, no CMS or database (consistent with the project's "no database" scope decision): posts are plain objects in `src/content/blog.ts` (`blogPosts` array). Add a post by appending an object there — no new files or routes needed.
- `src/app/blog/page.tsx` (listing) and `src/app/blog/[slug]/page.tsx` (post, with `generateStaticParams` + `generateMetadata`) read from that array. `sitemap.ts` includes `/blog` and every post automatically.
- Keep posts as general professional/educational content — no fabricated client names, specific statistics, or claimed outcomes (same "No fabricated content" rule as the rest of the site).
- Post dates are plain `"YYYY-MM-DD"` strings formatted with `src/lib/blog-date.ts` (`formatBlogDate`), which deliberately avoids `new Date(...)` entirely to stay unambiguously safe under Cache Components — don't swap it for a `Date`-based formatter in a Server Component.
