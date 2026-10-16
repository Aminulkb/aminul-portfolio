import { getCachedNow } from "@/lib/date";
import { siteConfig } from "@/content/site";

export async function Footer() {
  const year = (await getCachedNow()).getFullYear();

  return (
    <footer className="border-t-2 border-gold/60 bg-ink py-12">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 sm:px-8">
        <div className="flex flex-col gap-6 border-b border-gold/20 pb-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-serif text-lg font-semibold text-gold-soft">{siteConfig.name}</p>
            <p className="mt-1 max-w-sm text-sm text-white/60">{siteConfig.tagline}</p>
          </div>

          <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2">
            {siteConfig.nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="group relative py-0.5 text-sm text-white/70 transition-colors hover:text-gold-soft"
              >
                {item.label}
                <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-gold transition-transform duration-300 ease-out group-hover:scale-x-100" />
              </a>
            ))}
            <a
              href="/privacy"
              className="group relative py-0.5 text-sm text-white/70 transition-colors hover:text-gold-soft"
            >
              Privacy Policy
              <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-gold transition-transform duration-300 ease-out group-hover:scale-x-100" />
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
