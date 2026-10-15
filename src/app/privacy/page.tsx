import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/content/site";
import { getCachedNow } from "@/lib/date";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${siteConfig.name} collects, uses, and protects information submitted through this website's contact form.`,
};

export default async function PrivacyPage() {
  const now = await getCachedNow();
  const updated = now.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  return (
    <>
      <Header />
      <main className="flex-1 bg-background py-20">
        <Container className="max-w-3xl">
          <h1 className="font-serif text-3xl font-semibold text-text sm:text-4xl">Privacy Policy</h1>
          <p className="mt-2 text-sm text-text-secondary">Last updated: {updated}</p>

          <div className="mt-8 flex flex-col gap-6 text-sm leading-relaxed text-text-secondary sm:text-base">
            <p>
              This Privacy Policy explains how information submitted through the contact form on this website
              ({siteConfig.url}) is collected, used, and protected.
            </p>

            <section>
              <h2 className="mb-2 font-serif text-lg font-semibold text-text">What We Collect</h2>
              <p>
                When you submit the contact form, we collect the information you provide: your full name, email
                address, organization (if given), selected service type, and your message.
              </p>
            </section>

            <section>
              <h2 className="mb-2 font-serif text-lg font-semibold text-text">How We Use It</h2>
              <p>
                Your submission is used solely to review and respond to your consulting inquiry. It is delivered by
                email to {siteConfig.name}, who reviews inquiries personally. We do not sell, rent, or share your
                information with third parties, and we do not use it for marketing without your separate consent.
              </p>
            </section>

            <section>
              <h2 className="mb-2 font-serif text-lg font-semibold text-text">Storage</h2>
              <p>
                Contact form submissions are not stored in a database on this website. Each submission is delivered
                directly by email and retained only within that email correspondence, subject to the normal
                retention practices of the email provider used.
              </p>
            </section>

            <section>
              <h2 className="mb-2 font-serif text-lg font-semibold text-text">Security</h2>
              <p>
                Submissions are transmitted over an encrypted (HTTPS) connection and validated on the server before
                processing. Reasonable technical safeguards, including rate limiting and spam filtering, protect the
                form against abuse.
              </p>
            </section>

            <section>
              <h2 className="mb-2 font-serif text-lg font-semibold text-text">Your Choices</h2>
              <p>
                You may request details of, or ask to have deleted, any inquiry you have previously sent by replying
                to the relevant email correspondence or using the contact form to make that request.
              </p>
            </section>

            <section>
              <h2 className="mb-2 font-serif text-lg font-semibold text-text">Contact</h2>
              <p>
                Questions about this policy can be sent using the{" "}
                <Link href="/#contact" className="font-medium text-primary underline hover:text-secondary">
                  contact form
                </Link>
                .
              </p>
            </section>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
