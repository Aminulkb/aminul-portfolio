import { getCachedNow } from "@/lib/date";
import { siteConfig } from "@/content/site";

export async function Footer() {
  const year = (await getCachedNow()).getFullYear();

  return (
    <footer className="bg-ink py-12">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 sm:px-8">
        <div className="flex flex-col gap-6 border-b border-white/10 pb-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-serif text-lg font-semibold text-white">{siteConfig.name}</p>
            <p className="mt-1 max-w-sm text-sm text-white/60">{siteConfig.tagline}</p>
          </div>

          <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2">
            {siteConfig.nav.map((item) => (
              <a key={item.href} href={item.href} className="text-sm text-white/70 transition-colors hover:text-white">
                {item.label}
              </a>
            ))}
            <a href="/privacy" className="text-sm text-white/70 transition-colors hover:text-white">
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
