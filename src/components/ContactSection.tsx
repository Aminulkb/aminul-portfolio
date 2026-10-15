import { Suspense } from "react";
import { Container } from "./ui/Container";
import { SectionHeading } from "./ui/SectionHeading";
import { ContactForm } from "./ContactForm";
import { siteConfig } from "@/content/site";

export function ContactSection() {
  return (
    <section id="contact" className="scroll-mt-24 bg-background py-20 sm:py-28">
      <Container className="max-w-3xl">
        <SectionHeading
          eyebrow="Contact"
          title="Start the Conversation"
          align="center"
          description={`Share a few details about your organization's needs, and I'll follow up personally. ${siteConfig.contactInboxNotice}`}
        />
        <div className="rounded-2xl border border-border bg-surface p-6 sm:p-10">
          <Suspense fallback={<div className="h-96 animate-pulse rounded-lg bg-background" />}>
            <ContactForm />
          </Suspense>
        </div>
      </Container>
    </section>
  );
}
