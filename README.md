# Aminul Islam — HR Consultant Portfolio

International HR consultant portfolio and lead-generation site for Aminul Islam, built with Next.js (App Router), React, TypeScript, and Tailwind CSS. Includes a validated contact form with server-side PDF generation and email delivery.

## Stack

- Next.js 16 (App Router, Turbopack, Cache Components)
- React 19 + TypeScript (strict)
- Tailwind CSS v4 (design tokens in `src/app/globals.css`)
- Zod (server-side validation) · pdfkit (PDF generation) · Nodemailer (email delivery)
- Self-hosted variable fonts via `@fontsource-variable` (no Google Fonts network dependency at build time)

## Project structure

```
src/
  app/
    page.tsx              Homepage (assembles all sections)
    privacy/page.tsx       Privacy Policy page
    api/contact/route.ts   Contact form endpoint (validation, PDF, email)
    sitemap.ts, robots.ts, opengraph-image.tsx
    layout.tsx             Fonts, metadata, JSON-LD structured data
  components/               One file per homepage section + reusable ui/ primitives
  content/site.ts           All site copy, pricing, services — single source of truth
  lib/
    validation.ts           Shared Zod schema for the contact form
    rate-limit.ts           In-memory per-IP rate limiter
    pdf.ts                  Inquiry PDF generation (pdfkit)
    email.ts                Nodemailer send logic
    date.ts                 Cache-Components-safe "current date" helper
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

Without SMTP configured, the site still builds and runs — the contact form will accept and validate submissions but return a clear error instead of silently pretending to succeed (see `src/lib/email.ts`).

**Any SMTP provider works** — Gmail (with a 2FA App Password), Zoho Mail, SendGrid, Mailgun, Amazon SES, or your hosting provider's own mail server.

## Testing performed

- `npm run lint` — clean, no errors or warnings.
- `npx tsc --noEmit` — clean, no type errors.
- `npm run build` — production build succeeds; all routes prerender correctly (`/`, `/privacy` static with daily revalidation; `/api/contact` and `/sitemap.xml` dynamic by design).
- Manual `curl` testing against a production (`next start`) server confirmed:
  - Invalid submissions return `400` with field-level error messages.
  - Valid submissions attempt PDF generation + email send; without SMTP configured they correctly return a `502` with a generic, non-leaking error message (verified no stack traces/secrets are exposed).
  - The honeypot field silently returns `{"success":true}` without sending email.
  - The bot-speed guard rejects submissions completed less than 2 seconds after the form rendered.
- **Not verified** (requires real credentials): actual end-to-end email delivery to a real inbox. Configure `.env.local` and submit the live form to confirm delivery once SMTP is set up.

## Known trade-offs

- **Rate limiting** is in-memory (`src/lib/rate-limit.ts`), scoped to a single Node.js process. This is fine for a single-server deployment (e.g. `next start` on a VPS) but resets on restart and won't share state across multiple instances/regions. If you deploy to a multi-instance or serverless platform, swap it for a shared store (e.g. Upstash Redis).
- **No database.** Contact submissions are emailed directly and not persisted anywhere on the server, per the project's privacy-by-minimalism requirement. If you later need durable storage or retry-on-failure, that would mean adding a database or queue — a deliberate scope change, not something silently introduced here.
- **CSP:** Security headers (`next.config.ts`) include `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, and `Permissions-Policy`. A strict `Content-Security-Policy` with nonces was intentionally left out to avoid breaking Next.js's own inline streaming scripts without adding middleware complexity; this can be added later if needed.
- **Pre-existing dev-only vulnerability:** `npm audit` reports 5 high-severity issues, all inside `eslint-config-next`'s own dependency chain (a glob-matching library, dev-only, not shipped to production — confirmed via `npm audit --omit=dev` showing 0). Fixing it requires downgrading `eslint-config-next` to a version predating this Next.js release, which was not done here to avoid an unrelated breaking change.

## Still needed from the project owner

1. **SMTP credentials + inbox address** — fill in `.env.local` (see above) so the contact form can actually deliver email.
2. **Domain name** — set `NEXT_PUBLIC_SITE_URL` once a domain is chosen; it feeds the canonical URL, sitemap, Open Graph tags, and JSON-LD.
3. **Professional photograph (optional)** — the hero section currently shows an "AI" monogram placeholder instead of a photo, per the project's rule against implying a stock photo is the real person. Supply a photo to swap in.
4. **Hosting/deployment target** — see below.

## Deployment

This is a standard Next.js app. Any Node.js host works (a VPS with `next start`, Vercel, Railway, etc.). Steps:

1. Set the environment variables above on the host.
2. `npm install && npm run build && npm start` (or the platform's equivalent).
3. Point your domain at the deployment and confirm `NEXT_PUBLIC_SITE_URL` matches it.
4. Send a real test inquiry through the live contact form to confirm email delivery end-to-end.
