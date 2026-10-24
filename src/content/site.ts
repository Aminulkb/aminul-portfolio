// Central source of truth for all site copy and structured data.
//
// Content the owner can edit themselves via the /admin panel (bio, expertise,
// services, pricing, approach steps, contact notice) lives in content/site.json
// and is imported below — editing that file (by hand or through the CMS)
// updates the live site on the next deploy. Structural/SEO fields (name,
// title, description, nav, url, keywords) stay here in code since they're
// tied to routing, metadata and JSON-LD and are riskier to edit freely.
import siteContent from "../../content/site.json";

export const siteConfig = {
  name: "Aminul Islam",
  tagline: "Empowering People, Elevating Organizations",
  title: "Aminul Islam | International HR Consultant",
  description:
    "Aminul Islam is a Bangladesh-based HR Consultant with 15+ years of NGO-sector experience in recruitment, workforce training, employee engagement, and team motivation. Available for global consulting.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.aminulislam-hr.com",
  location: "Bangladesh",
  availability: "Available for Global Consulting",
  bio: siteContent.bio,
  keywords: [
    "Bangladesh HR Consultant",
    "NGO HR Expert",
    "Recruitment and Talent Acquisition",
    "Workforce Training",
    "Employee Engagement",
    "Team Motivation",
    "Talent Development",
    "Human Resource Development",
  ],
  nav: [
    { label: "About", href: "#about" },
    { label: "Expertise", href: "#expertise" },
    { label: "Services", href: "#services" },
    { label: "Pricing", href: "#pricing" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "#contact" },
  ],
  hero: {
    primaryCta: { label: "Discuss Your HR Needs", href: "#contact" },
    secondaryCta: { label: "Explore My Services", href: "#services" },
  },
  expertise: siteContent.expertise,
  services: siteContent.services,
  pricing: siteContent.pricing,
  pricingNote: siteContent.pricingNote,
  approach: siteContent.approach,
  contactInboxNotice: siteContent.contactInboxNotice,
} as const;

// Derived from siteConfig.pricing so the contact form's dropdown text can
// never drift out of sync with the prices shown on the Pricing section —
// editing a price in content/site.json (by hand or via /admin) updates both
// automatically.
export const serviceTypeOptions = siteConfig.pricing.map((plan) => ({
  value: plan.service,
  label:
    plan.price === "Custom"
      ? `${plan.label} (Custom Quotation)`
      : `${plan.label} (${plan.price}${plan.unit.replace(/^\/\s*/, "/")})`,
}));
