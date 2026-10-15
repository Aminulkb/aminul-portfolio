import { getCachedNow } from "@/lib/date";
import { siteConfig } from "@/content/site";

export async function Footer() {
  const year = (await getCachedNow()).getFullYear();

  return (
    <footer className="border-t border-border bg-surface py-12">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 sm:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-serif text-lg font-semibold text-primary">{siteConfig.name}</p>
            <p className="mt-1 max-w-sm text-sm text-text-secondary">{siteConfig.tagline}</p>
          </div>

          <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2">
            {siteConfig.nav.map((item) => (
              <a key={item.href} href={item.href} className="text-sm text-text-secondary hover:text-primary">
                {item.label}
              </a>
            ))}
            <a href="/privacy" className="text-sm text-text-secondary hover:text-primary">
              Privacy Policy
            </a>
          </nav>
        </div>

        <p className="text-xs leading-relaxed text-text-secondary">{siteConfig.keywords.join(" · ")}</p>

        <p className="text-xs text-text-secondary">
          © {year} {siteConfig.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
