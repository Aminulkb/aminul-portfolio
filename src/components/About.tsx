import { Container } from "./ui/Container";
import { SectionHeading } from "./ui/SectionHeading";
import { siteConfig } from "@/content/site";

export function About() {
  return (
    <section id="about" className="scroll-mt-24 bg-surface py-20 sm:py-28">
      <Container>
        <SectionHeading eyebrow="About" title="A Partner in Organizational Growth" />
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div className="flex flex-col gap-5 text-base leading-relaxed text-text-secondary sm:text-lg">
            {siteConfig.bio.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <p>
              Based in {siteConfig.location}, {siteConfig.name} works with NGOs and mission-driven organizations
              worldwide, bringing a practical, people-first approach to every engagement.
            </p>
          </div>
          <div className="flex flex-col gap-4 rounded-2xl border border-border bg-background p-6">
            <p className="text-sm font-semibold uppercase tracking-wider text-secondary">At a Glance</p>
            <ul className="flex flex-col gap-3 text-sm text-text">
              <li>15+ years of NGO-sector HR experience</li>
              <li>
                {siteConfig.location} — {siteConfig.availability}
              </li>
              <li>Recruitment, training, engagement &amp; motivation</li>
              <li>Hourly, weekly, monthly &amp; project-based consulting</li>
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
