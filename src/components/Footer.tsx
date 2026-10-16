import { getCachedNow } from "@/lib/date";
import { siteConfig } from "@/content/site";

export async function Footer() {
  const year = (await getCachedNow()).getFullYear();

  return (
    <footer className="border-t-4 border-gold bg-ink py-12">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 sm:px-8">
        <div className="flex flex-col gap-6 border-b border-gold/20 pb-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-serif text-lg font-semibold text-gold-soft">{siteConfig.name}</p>
            <p className="mt-1 max-w-sm text-sm text-white/60">{siteConfig.tagline}</p>
          </div>

          <nav aria-label="Footer" className="flex flex-wrap items-center gap-1">
            {siteConfig.nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-full px-3 py-1 text-sm text-white/70 transition-all duration-300 hover:bg-gold/15 hover:text-gold-soft"
              >
                {item.label}
              </a>
            ))}
            <a
              href="/privacy"
              className="rounded-full px-3 py-1 text-sm text-white/70 transition-all duration-300 hover:bg-gold/15 hover:text-gold-soft"
            >
              Privacy Policy
            </a>
          </nav>
        </div>

        <p className="text-xs leading-relaxed text-white/45">{siteConfig.keywords.join(" · ")}</p>

        <p className="text-xs text-white/45">
          © {year} {siteConfig.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
