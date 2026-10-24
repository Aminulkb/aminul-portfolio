import { Building2, Code2, GraduationCap, HeartHandshake, Target, UserSearch } from "lucide-react";
import { Container } from "./ui/Container";
import { SectionHeading } from "./ui/SectionHeading";
import { siteConfig } from "@/content/site";

const icons = { UserSearch, GraduationCap, HeartHandshake, Target, Building2, Code2 };

export function Expertise() {
  return (
    <section id="expertise" className="scroll-mt-24 bg-background py-20 sm:py-28">
      <Container>
        <SectionHeading eyebrow="Expertise" title="Core Areas of Expertise" align="center" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {siteConfig.expertise.map((item) => {
            const Icon = icons[item.icon as keyof typeof icons];
            return (
              <div
                key={item.title}
                className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-surface p-6 text-center transition-shadow hover:shadow-md"
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon size={22} />
                </span>
                <p className="text-sm font-semibold text-text">{item.title}</p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
