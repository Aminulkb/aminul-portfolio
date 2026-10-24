// Central source of truth for all site copy and structured data.
// Keep facts here consistent with the figures the project owner approved —
// do not invent credentials, testimonials, or pricing changes.

export const siteConfig = {
  name: "Aminul Islam",
  tagline: "Empowering People, Elevating Organizations",
  title: "Aminul Islam | International HR Consultant",
  description:
    "Aminul Islam is a Bangladesh-based HR Consultant with 15+ years of NGO-sector experience in recruitment, workforce training, employee engagement, and team motivation. Available for global consulting.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.aminulislam-hr.com",
  location: "Bangladesh",
  availability: "Available for Global Consulting",
  bio: [
    "A Strategic Human Resource Consultant with 15+ years of experience in the NGO sector, specializing in talent acquisition, people development, and organizational capacity building to drive performance, strengthen leadership, and achieve sustainable organizational growth.",
    "Expertise in recruitment strategies, skill-based workforce training, employee engagement, talent development, and purposeful team motivation.",
  ],
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
  expertise: [
    { title: "Recruitment & Talent Acquisition", icon: "UserSearch" },
    { title: "Workforce Training & Development", icon: "GraduationCap" },
    { title: "Employee Engagement", icon: "HeartHandshake" },
    { title: "Team Motivation", icon: "Target" },
    { title: "HR Consulting & Organizational Development", icon: "Building2" },
    { title: "Website Development", icon: "Code2" },
  ],
  services: [
    {
      id: "recruitment",
      icon: "UserSearch",
      title: "Strategic Recruitment & Talent Acquisition",
      description:
        "Recruitment solutions designed to identify suitable candidates based on organizational needs, role requirements, competencies, and cultural fit.",
    },
    {
      id: "training",
      icon: "GraduationCap",
      title: "Workforce Training & Development",
      description:
        "Practical training and orientation programs designed to improve employee competencies, confidence, motivation, and professional performance.",
    },
    {
      id: "engagement",
      icon: "HeartHandshake",
      title: "Employee Engagement & Team Motivation",
      description:
        "Strategies to strengthen workplace engagement, improve morale, support employee retention, and build productive teams.",
    },
    {
      id: "consulting",
      icon: "Briefcase",
      title: "Flexible HR Consulting",
      description:
        "Consulting engagements available on an hourly, weekly, monthly, or project basis — structured around your organization's needs.",
    },
  ],
  pricing: [
    { id: "hourly", icon: "Clock", label: "Hourly Consulting", price: "$100", unit: "/ hour", service: "hourly" },
    {
      id: "weekly",
      icon: "CalendarDays",
      label: "Weekly Consulting",
      price: "$10,000",
      unit: "/ week",
      service: "weekly",
    },
    {
      id: "monthly",
      icon: "CalendarRange",
      label: "Monthly Consulting",
      price: "$30,000",
      unit: "/ month",
      service: "monthly",
    },
    {
      id: "project",
      icon: "FileText",
      label: "Project-Based Consulting",
      price: "Custom",
      unit: "quotation",
      service: "project",
    },
  ],
  pricingNote:
    "Project-based consulting fees are determined by scope and deliverables, agreed in advance with each client.",
  approach: [
    {
      step: "01",
      title: "Understand Organizational Needs",
      description:
        "Listening closely to leadership and teams to map goals, culture, and constraints before recommending any action.",
    },
    {
      step: "02",
      title: "Identify Capability Gaps",
      description:
        "Assessing current HR practices, workforce skills, and structures to pinpoint where targeted intervention will have the most impact.",
    },
    {
      step: "03",
      title: "Design Practical HR Interventions",
      description:
        "Building recruitment, training, or engagement plans that are realistic for the organization's size, budget, and timeline.",
    },
    {
      step: "04",
      title: "Support Implementation & Evaluate Progress",
      description:
        "Working alongside teams through rollout, then reviewing outcomes and adjusting the approach as needed.",
    },
  ],
  contactInboxNotice: "Inquiries are reviewed personally and typically answered within 2 business days.",
} as const;

export const serviceTypeOptions = [
  { value: "hourly", label: "Hourly Consulting ($100/hour)" },
  { value: "weekly", label: "Weekly Consulting ($10,000/week)" },
  { value: "monthly", label: "Monthly Consulting ($30,000/month)" },
  { value: "project", label: "Project-Based Consulting (Custom Quotation)" },
] as const;
