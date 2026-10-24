# Aminul Islam — HR Consultant Portfolio

International HR consultant portfolio and lead-generation site for Aminul Islam, built with Next.js (App Router), React, TypeScript, and Tailwind CSS. Includes a validated contact form with server-side PDF generation and email delivery.

## Stack

- Next.js 16 (App Router, Turbopack, Cache Components)
- React 19 + TypeScript (strict)
- Tailwind CSS v4 (design tokens in `src/app/globals.css`)
- Zod (server-side validation) · pdfkit (PDF generation) · Nodemailer (email delivery)
- Self-hosted variable fonts via `@fontsource-variable` (no Google Fonts network dependency at build time)
- [Decap CMS](https://decapcms.org/) at `/admin` — a git-backed content editor the owner can use directly (see "Admin Panel" below). No database: every edit is a commit to this repo.

## Project structure

```
content/
  site.json                Owner-editable copy: bio, expertise, services, pricing,
                            approach, contact notice. Edit by hand or via /admin.
  blog/*.md                 One Markdown file per blog post (frontmatter only,
                            no body). Add a post by adding a file, or via /admin.
public/
  admin/index.html, config.yml   Decap CMS — see "Admin Panel" below.
src/
  app/
    page.tsx              Homepage (assembles all sections)
    privacy/page.tsx       Privacy Policy page
    blog/page.tsx, blog/[slug]/page.tsx   Blog listing + post pages
    api/contact/route.ts   Contact form endpoint (validation, PDF, email)
    api/auth/route.ts, api/auth/callback/route.ts   GitHub OAuth login for /admin
    sitemap.ts, robots.ts, opengraph-image.tsx
    layout.tsx             Fonts, metadata, JSON-LD structured data
  components/               One file per homepage section + reusable ui/ primitives
  content/
    site.ts                Merges content/site.json with structural/SEO fields
                            (name, nav, url, keywords) that stay in code
    blog.ts                 Reads content/blog/*.md via gray-matter
  lib/
    validation.ts           Shared Zod schema for the contact form
    rate-limit.ts           In-memory per-IP rate limiter
    pdf.ts                  Inquiry PDF generation (pdfkit)
    email.ts                Nodemailer send logic
    date.ts                 Cache-Components-safe "current date" helper
    blog-date.ts             Cache-Components-safe blog date formatter
    github-oauth.ts          Shared constant for the /admin OAuth login
```

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Environment variables

Copy `.env.example` to `.env.local` and fill in real values:

| Variable | Required | Purpose |
|---|---|---|
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD` | Yes, for email | SMTP credentials used to send inquiry emails |
| `SMTP_FROM` | Recommended | Sender address shown on outgoing mail |
| `CONTACT_INBOX` | Yes, for email | Inbox that receives new inquiries |
| `NEXT_PUBLIC_SITE_URL` | Yes, before launch | Used for canonical URLs, sitemap, Open Graph, JSON-LD |
| `GITHUB_OAUTH_CLIENT_ID`, `GITHUB_OAUTH_CLIENT_SECRET` | Yes, for `/admin` login | From a GitHub OAuth App the owner creates — see "Admin Panel" below |

Without SMTP configured, the site still builds and runs — the contact form will accept and validate submissions but return a clear error instead of silently pretending to succeed (see `src/lib/email.ts`). Without the two `GITHUB_OAUTH_*` variables, the rest of the site is unaffected — only `/admin` login is disabled (it shows a plain-language error instead of a crash).

**Any SMTP provider works** — Gmail (with a 2FA App Password), Zoho Mail, SendGrid, Mailgun, Amazon SES, or your hosting provider's own mail server.

## Admin Panel

`/admin` is a self-service content editor ([Decap CMS](https://decapcms.org/)) for everything in `content/site.json` (bio, expertise, services, pricing, approach steps, contact notice) and all blog posts (`content/blog/*.md`) — add, edit, or delete without needing a developer. There is no database: every save there is a real git commit to this repo's `main` branch, which Vercel then deploys automatically, the same way a code push does.

**One-time setup (owner does this once, requires a GitHub account with access to this repo):**

1. On GitHub, go to **Settings → Developer settings → OAuth Apps → New OAuth App** (direct link: https://github.com/settings/applications/new).
2. Fill in:
   - **Application name:** anything, e.g. "Aminul Portfolio Admin"
   - **Homepage URL:** `https://aminul-portfolio-omega.vercel.app`
   - **Authorization callback URL:** `https://aminul-portfolio-omega.vercel.app/api/auth/callback`
3. Click **Register application**, then **Generate a new client secret**. Copy the **Client ID** and the **Client secret** (the secret is shown once — copy it immediately).
4. In the Vercel project's **Settings → Environment Variables**, add:
   - `GITHUB_OAUTH_CLIENT_ID` = the Client ID
   - `GITHUB_OAUTH_CLIENT_SECRET` = the Client secret (mark it **Sensitive**)
5. Redeploy (or wait for the next deploy) so the new variables take effect.
6. Visit `https://aminul-portfolio-omega.vercel.app/admin`, click **Login with GitHub**, and authorize the app.

**Security note:** GitHub OAuth Apps can't be limited to a single repository — logging in grants this app the same repo access your GitHub account already has (listed under your GitHub account's **Settings → Applications** afterwards, where access can be revoked at any time). Only the site owner should log in to `/admin`.

**What's safe to edit there, and what isn't:** pricing, services, expertise, bio, approach steps, and blog posts are all safe — edit freely. Icon and "Service Key" fields are locked to dropdowns so a typo there can't break the page layout. Anything not listed in `/admin` (navigation links, page titles/SEO text, the site's visual design) stays in code — ask for those changes here in chat, as before.

## Testing performed

- `npm run lint` — clean, no errors or warnings.
- `npx tsc --noEmit` — clean, no type errors.
- `npm run build` — production build succeeds; all routes prerender correctly (`/`, `/privacy` static with daily revalidation; `/api/contact` and `/sitemap.xml` dynamic by design).
- Manual `curl` testing against a production (`next start`) server confirmed:
  - Invalid submissions return `400` with field-level error messages.
  - Valid submissions attempt PDF generation + email send; without SMTP configured they correctly return a `502` with a generic, non-leaking error message (verified no stack traces/secrets are exposed).
  - The honeypot field silently returns `{"success":true}` without sending email.
  - The bot-speed guard rejects submissions completed less than 2 seconds after the form rendered.
- **Verified in production:** live Gmail SMTP configured on Vercel, a real test submission through the deployed form was delivered successfully to the configured inbox with its PDF attachment intact (2026-10-16).

## Known trade-offs

- **Rate limiting** is in-memory (`src/lib/rate-limit.ts`), scoped to a single Node.js process. This is fine for a single-server deployment (e.g. `next start` on a VPS) but resets on restart and won't share state across multiple instances/regions. If you deploy to a multi-instance or serverless platform, swap it for a shared store (e.g. Upstash Redis).
- **No database.** Contact submissions are emailed directly and not persisted anywhere on the server, per the project's privacy-by-minimalism requirement. If you later need durable storage or retry-on-failure, that would mean adding a database or queue — a deliberate scope change, not something silently introduced here.
- **CSP:** Security headers (`next.config.ts`) include `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, and `Permissions-Policy`. A strict `Content-Security-Policy` with nonces was intentionally left out to avoid breaking Next.js's own inline streaming scripts without adding middleware complexity; this can be added later if needed.
- **Pre-existing dev-only vulnerability:** `npm audit` reports 5 high-severity issues, all inside `eslint-config-next`'s own dependency chain (a glob-matching library, dev-only, not shipped to production — confirmed via `npm audit --omit=dev` showing 0). Fixing it requires downgrading `eslint-config-next` to a version predating this Next.js release, which was not done here to avoid an unrelated breaking change.

## Still needed from the project owner

1. **Custom domain name (optional)** — currently live at `https://aminul-portfolio-omega.vercel.app`. If a custom domain is added later in Vercel, update `NEXT_PUBLIC_SITE_URL` to match (and the OAuth App's URLs below, if one was already created).
2. **Admin Panel login** — create the GitHub OAuth App and add the two `GITHUB_OAUTH_*` environment variables on Vercel. See "Admin Panel" above for exact steps. Until this is done, the rest of the site is unaffected — only `/admin` login won't work yet.

## Deployment

This is a standard Next.js app. Any Node.js host works (a VPS with `next start`, Vercel, Railway, etc.). Steps:

1. Set the environment variables above on the host.
2. `npm install && npm run build && npm start` (or the platform's equivalent).
3. Point your domain at the deployment and confirm `NEXT_PUBLIC_SITE_URL` matches it.
4. Send a real test inquiry through the live contact form to confirm email delivery end-to-end.
