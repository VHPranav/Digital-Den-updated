export type ServiceChapter = {
  id: string;
  title: string;
  description: string;
  image: { src: string; alt: string };
  keyServices: string[];
  extendedServices: string[];
  addOns: string[];
  bestFor: string[];
};

export const serviceChapters: ServiceChapter[] = [
  {
    id: 'startup-setup',
    title: 'Startup Setup & Launch',
    image: { src: '/images/services/launch-documentary.webp', alt: 'Two founders sorting prototype materials at a studio workbench' },
    description: 'For founders and early-stage teams turning an idea into an operational startup. We help structure the business, set up the essentials and connect founders with the right guidance, mentors and ecosystem.',
    keyServices: ['Startup Consulting', 'Business Structuring', 'Company Setup', 'Founder Guidance', 'Mentor Matching'],
    extendedServices: ['Basic Legal Onboarding', 'Account Setup', 'Startup Readiness Sessions', 'Community & Network Access'],
    addOns: ['Pitch Deck Review', 'Founder Advisory Sessions'],
    bestFor: ['First-time founders', 'Early-stage tech teams', 'Digital nomads', 'Startups entering Montenegro / the Western Balkans'],
  },
  {
    id: 'growth-investment',
    title: 'Growth & Investment Readiness',
    image: { src: '/images/services/growth-documentary.webp', alt: 'A startup team rehearsing an investor presentation' },
    description: 'For startups with an MVP, early users or market validation that are ready to strengthen traction, fundraising readiness and commercial growth.',
    keyServices: ['Strategic Consulting', 'Fundraising Readiness', 'Investor Materials', 'GTM Support', 'Business Development Support'],
    extendedServices: ['Startup Mentoring', 'EU Funding Guidance', 'Grant Preparation Support'],
    addOns: ['Mock Pitching', 'Investor Introductions', 'CFO / Advisory Support', 'KPI & Growth Planning'],
    bestFor: ['Pre-seed and seed startups', 'Teams preparing for fundraising', 'Startups pursuing grants or investment'],
  },
  {
    id: 'corporate-innovation',
    title: 'Corporate Innovation & Matchmaking',
    image: { src: '/images/services/innovation-documentary.webp', alt: 'An engineer demonstrating a prototype to two collaborators' },
    description: 'For startups, companies and institutions looking to identify opportunities, test solutions and build meaningful innovation partnerships.',
    keyServices: ['Corporate Matchmaking', 'Innovation Scouting', 'Startup–Corporate Partnerships', 'Pilot Facilitation', 'PoC Coordination'],
    extendedServices: ['Sandbox / Test Environments', 'Innovation Partnerships', 'Ecosystem Introductions'],
    addOns: [],
    bestFor: ['B2B startups', 'Corporations seeking innovation', 'Institutions', 'Development programs'],
  },
  {
    id: 'market-entry',
    title: 'Market Entry & International Expansion',
    image: { src: '/images/services/expansion-documentary.webp', alt: 'Founders and an adviser studying a map overlooking the Adriatic' },
    description: 'For startups, scaleups and international companies looking to enter new markets, build local connections and navigate international expansion.',
    keyServices: ['Global Soft Landing', 'Market Entry Strategy', 'Strategic Introductions', 'Investor Access', 'Cross-border Partnerships'],
    extendedServices: ['Regional Expansion Support', 'Scaling Support', 'Operational Guidance'],
    addOns: [],
    bestFor: ['Internationally ready startups', 'Scaleups', 'Foreign companies entering Montenegro or the region'],
  },
];

export const defaultServicesContent = {
  hero: {
    title: 'Support built around what comes next',
    body: 'From launching and growing a startup to finding the right partners or entering new markets, Digital Den provides tailored services for founders, companies and institutions.',
  },
  chapters: serviceChapters,
  glance: [
    { label: 'Who we work with', text: 'Startups · Scaleups · Corporates · Institutions · Academic & Innovation Leaders' },
    { label: 'Where we work', text: 'Montenegro · Western Balkans · Europe · USA · Middle East' },
    { label: 'Our focus', text: 'Startups · Innovation · Connections · Global Growth' },
    { label: 'Our approach', text: 'Local understanding. Global capabilities.' },
  ],
  closing: {
    title: 'Not sure where to start?',
    body: "Tell us what you're building, growing or trying to solve. We'll help identify the right combination of expertise, connections and support.",
  },
};

export type ServicesPageContent = typeof defaultServicesContent;
