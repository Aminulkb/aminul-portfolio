import Link from "next/link";
import { ArrowRight, Briefcase, GraduationCap, HeartHandshake, UserSearch } from "lucide-react";
import { Container } from "./ui/Container";
import { SectionHeading } from "./ui/SectionHeading";
import { siteConfig } from "@/content/site";

const icons = { UserSearch, GraduationCap, HeartHandshake, Briefcase };

export function Services() {
  return (
    <section id="services" className="scroll-mt-24 bg-surface py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Services"
          title="How I Can Help Your Organization"
          description="Four focused service areas, each adaptable to your organization's size, sector, and timeline."
        />
        <div className="grid gap-6 sm:grid-cols-2">
          {siteConfig.services.map((service) => {
            const Icon = icons[service.icon as keyof typeof icons];
            return (
              <div key={service.id} className="flex flex-col gap-4 rounded-2xl border border-border bg-background p-7">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon size={20} />
                </span>
                <h3 className="font-serif text-xl font-semibold text-text">{service.title}</h3>
                <p className="flex-1 text-sm leading-relaxed text-text-secondary sm:text-base">
                  {service.description}
                </p>
                <Link
                  href={{ pathname: "/", query: { service: service.id }, hash: "contact" }}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-secondary"
                >
                  Discuss This Service <ArrowRight size={16} />
                </Link>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
