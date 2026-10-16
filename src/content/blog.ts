// Blog content — file-based, no database or CMS (consistent with the rest of
// the site's "no database" scope decision). Add new posts by appending an
// object to this array; each needs a unique `slug`.
//
// Keep posts as general professional/educational HR content — no fabricated
// client names, specific statistics, or claimed outcomes. See CLAUDE.md
// "No fabricated content."

export type BlogContentBlock = { type: "heading"; text: string } | { type: "paragraph"; text: string };

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string; // YYYY-MM-DD, used for display and sitemap lastModified
  readTime: string;
  tags: string[];
  relatedService?: "hourly" | "weekly" | "monthly" | "project";
  content: BlogContentBlock[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "recruitment-mistakes-ngos-should-avoid",
    title: "5 Recruitment Mistakes NGOs Should Avoid",
    excerpt:
      "Common hiring pitfalls that quietly cost NGOs their best candidates — and practical ways to fix each one.",
    date: "2026-09-10",
    readTime: "5 min read",
    tags: ["Recruitment", "Talent Acquisition"],
    relatedService: "hourly",
    content: [
      {
        type: "paragraph",
        text: "NGOs often recruit under real constraints — tight budgets, urgent program timelines, and small HR teams wearing several hats. Under that pressure, a handful of avoidable mistakes tend to repeat themselves, and each one makes it a little harder to find and keep the right people. Here are five worth addressing early.",
      },
      {
        type: "heading",
        text: "1. Writing job descriptions around tasks, not outcomes",
      },
      {
        type: "paragraph",
        text: "A job description that lists duties ('coordinate field visits', 'prepare reports') tells a candidate what they'll do, but not why it matters or what success looks like. Framing the role around the outcomes it exists to deliver attracts candidates who understand the impact of the work, and gives both sides a clearer basis for evaluating fit later.",
      },
      {
        type: "heading",
        text: "2. Skipping a structured interview process",
      },
      {
        type: "paragraph",
        text: "Informal, conversational interviews feel efficient, but they make it easy to be swayed by rapport rather than evidence of capability. A short set of consistent, role-specific questions — asked of every candidate in the same order — produces comparisons that are actually comparable, and reduces the influence of unconscious bias.",
      },
      {
        type: "heading",
        text: "3. Overlooking cultural and mission fit",
      },
      {
        type: "paragraph",
        text: "Technical competence is necessary but not sufficient in mission-driven work. Someone who is excellent on paper but misaligned with the organization's values or working style tends to disengage quickly, and that turnover cost is rarely visible until it's already happened. A short, honest conversation about how the organization actually operates — not just what it stands for — surfaces misalignment before an offer is made.",
      },
      {
        type: "heading",
        text: "4. Treating recruitment as a one-time event",
      },
      {
        type: "paragraph",
        text: "Hiring doesn't end when an offer is accepted. Organizations that keep a lightweight, ongoing pipeline — even informally, through past applicants and referrals — fill urgent vacancies faster and with less compromise than those that start from zero every time a role opens.",
      },
      {
        type: "heading",
        text: "5. No clear onboarding plan",
      },
      {
        type: "paragraph",
        text: "A strong hire can still fail in a weak onboarding process. The first 30 to 90 days set the tone for how long someone stays and how quickly they become productive. A simple written plan — who they meet, what they learn, and what's expected of them in the first month — pays for itself many times over.",
      },
      {
        type: "paragraph",
        text: "None of these fixes require a large budget — they require a bit more structure around decisions that are already being made. That structure is usually the difference between recruitment that works by luck and recruitment that works by design.",
      },
    ],
  },
  {
    slug: "workforce-training-roi-for-ngos",
    title: "Why Workforce Training Is the Best ROI for Growing NGOs",
    excerpt:
      "Training is often the first line cut when budgets tighten — here's the case for treating it as an investment rather than an expense.",
    date: "2026-09-24",
    readTime: "4 min read",
    tags: ["Training & Development"],
    relatedService: "weekly",
    content: [
      {
        type: "paragraph",
        text: "When budgets tighten, training is frequently one of the first line items to go — it feels optional in a way that salaries and program delivery don't. But for NGOs relying on lean teams to do demanding, varied work, under-investment in training tends to show up later as turnover, inconsistent program quality, or burnout.",
      },
      {
        type: "heading",
        text: "Training keeps pace with growing responsibility",
      },
      {
        type: "paragraph",
        text: "In most NGOs, staff take on broader responsibility faster than in larger, more specialized organizations — a program officer may end up doing a share of finance, M&E, or partner management work within a year or two. Structured training closes the gap between what someone was hired to do and what they're actually being asked to do, rather than leaving them to learn entirely by trial and error.",
      },
      {
        type: "heading",
        text: "It's cheaper than replacing people",
      },
      {
        type: "paragraph",
        text: "Recruiting, onboarding, and bringing a new hire to full productivity is a slower and more expensive process than developing someone already familiar with the organization's mission and ways of working. Training is, in effect, a retention tool as much as a skills tool.",
      },
      {
        type: "heading",
        text: "It doesn't need to be expensive to be effective",
      },
      {
        type: "paragraph",
        text: "Effective training doesn't require elaborate programs. Short, focused sessions tied to real, current challenges — a difficult donor report, a recurring team conflict, a new tool the team has to adopt — tend to stick better than generic workshops, and can often be delivered internally or through a short external engagement.",
      },
      {
        type: "paragraph",
        text: "The organizations that treat training as a recurring practice, not a one-off event, consistently build steadier, more confident teams — which shows up directly in the quality and consistency of the work they deliver.",
      },
    ],
  },
  {
    slug: "building-genuine-employee-engagement",
    title: "Building Genuine Employee Engagement in Mission-Driven Teams",
    excerpt:
      "Passion for the mission isn't the same as engagement. A practical look at what actually keeps NGO teams motivated over the long run.",
    date: "2026-10-08",
    readTime: "5 min read",
    tags: ["Employee Engagement", "Team Motivation"],
    relatedService: "monthly",
    content: [
      {
        type: "paragraph",
        text: "It's a common assumption in the NGO sector that caring about the mission is enough to keep people engaged. In practice, mission alignment gets people in the door — it isn't what keeps them there, or keeps them doing their best work once the initial enthusiasm settles into routine.",
      },
      {
        type: "heading",
        text: "Engagement is built on clarity, not just purpose",
      },
      {
        type: "paragraph",
        text: "People stay engaged when they understand how their individual work connects to outcomes, and when they get regular, specific feedback on how they're doing. Vague encouragement ('great job, team') is pleasant but forgettable; feedback tied to something concrete someone actually did is what builds confidence and direction over time.",
      },
      {
        type: "heading",
        text: "Recognize effort, not only results",
      },
      {
        type: "paragraph",
        text: "Outcomes in development and humanitarian work are often slow-moving, dependent on external factors, or difficult to attribute to one person's effort. Teams that recognize good process — sound judgment under pressure, persistence through a difficult partner relationship, a well-handled crisis — stay motivated even in periods where the bigger outcomes aren't yet visible.",
      },
      {
        type: "heading",
        text: "Protect against mission-driven burnout",
      },
      {
        type: "paragraph",
        text: "Ironically, the people most committed to the mission are often the most at risk of overextending themselves, because the work can always expand to fill available time and then some. Engagement strategies that don't actively address workload and boundaries tend to produce short bursts of high output followed by exhaustion and attrition.",
      },
      {
        type: "heading",
        text: "Make space for input, not just information",
      },
      {
        type: "paragraph",
        text: "Regular updates keep people informed, but engagement grows when people also have a real channel to shape decisions that affect their work — even in small ways. Teams that are asked for input, and can see that input occasionally change something, invest more of themselves in the outcome.",
      },
      {
        type: "paragraph",
        text: "None of this requires a large engagement budget. It requires consistency — the same attention to how people are doing that an organization already gives to the programs it runs.",
      },
    ],
  },
];

export function getAllBlogPosts(): BlogPost[] {
  return [...blogPosts].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}
