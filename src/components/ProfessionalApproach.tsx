import { Container } from "./ui/Container";
import { SectionHeading } from "./ui/SectionHeading";
import { siteConfig } from "@/content/site";

export function ProfessionalApproach() {
  return (
    <section className="bg-surface py-20 sm:py-28">
      <Container>
        <SectionHeading eyebrow="Approach" title="A Practical, Four-Step Process" align="center" />
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {siteConfig.approach.map((step) => (
            <div key={step.step} className="flex flex-col gap-3">
              <span className="font-serif text-4xl font-semibold text-primary/30">{step.step}</span>
              <h3 className="text-lg font-semibold text-text">{step.title}</h3>
              <p className="text-sm leading-relaxed text-text-secondary">{step.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
