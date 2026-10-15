import { ArrowRight } from "lucide-react";
import { Container } from "./ui/Container";
import { siteConfig } from "@/content/site";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background pt-16 pb-20 sm:pt-24 sm:pb-28">
      <Container className="flex flex-col items-center gap-10 text-center lg:flex-row lg:items-center lg:text-left">
        <div className="flex max-w-2xl flex-col items-center gap-6 lg:items-start">
          <span className="inline-flex items-center rounded-full border border-border bg-surface px-4 py-1.5 text-sm font-medium text-text-secondary">
            {siteConfig.location} · {siteConfig.availability}
          </span>

          <h1 className="font-serif text-4xl font-semibold leading-tight text-text sm:text-5xl lg:text-6xl">
            {siteConfig.name}
          </h1>

          <p className="text-xl font-medium text-primary sm:text-2xl">{siteConfig.tagline}</p>

          <p className="max-w-xl text-base text-text-secondary sm:text-lg">{siteConfig.bio[0]}</p>

          <div className="flex flex-col gap-4 sm:flex-row">
            <a
              href={siteConfig.hero.primaryCta.href}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-secondary"
            >
              {siteConfig.hero.primaryCta.label}
              <ArrowRight size={18} />
            </a>
            <a
              href={siteConfig.hero.secondaryCta.href}
              className="inline-flex items-center justify-center rounded-full border border-border bg-surface px-6 py-3.5 text-base font-semibold text-text transition-colors hover:border-primary hover:text-primary"
            >
              {siteConfig.hero.secondaryCta.label}
            </a>
          </div>
        </div>

        <div
          className="relative flex h-56 w-56 shrink-0 items-center justify-center rounded-full border border-border bg-surface shadow-sm sm:h-64 sm:w-64 lg:h-72 lg:w-72"
          aria-hidden="true"
        >
          <span className="font-serif text-6xl font-semibold text-primary">AI</span>
        </div>
      </Container>
    </section>
  );
}
