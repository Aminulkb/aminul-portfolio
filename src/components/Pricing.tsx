import Link from "next/link";
import { CalendarDays, CalendarRange, Clock, FileText } from "lucide-react";
import { Container } from "./ui/Container";
import { SectionHeading } from "./ui/SectionHeading";
import { siteConfig } from "@/content/site";

const icons = { Clock, CalendarDays, CalendarRange, FileText };

export function Pricing() {
  return (
    <section id="pricing" className="scroll-mt-24 bg-background py-20 sm:py-28">
      <Container>
        <SectionHeading eyebrow="Pricing" title="Consulting Rates" align="center" description={siteConfig.pricingNote} />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {siteConfig.pricing.map((plan) => {
            const Icon = icons[plan.icon as keyof typeof icons];
            return (
              <div
                key={plan.id}
                className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-surface p-7 text-center"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon size={20} />
                </span>
                <p className="text-sm font-semibold uppercase tracking-wide text-text-secondary">{plan.label}</p>
                <p className="font-serif text-3xl font-semibold text-text">
                  {plan.price}
                  <span className="ml-1 text-sm font-medium text-text-secondary">{plan.unit}</span>
                </p>
                <Link
                  href={{ pathname: "/", query: { service: plan.service }, hash: "contact" }}
                  className="mt-2 w-full rounded-full border border-primary px-5 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
                >
                  Inquire Now
                </Link>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
