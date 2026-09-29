import type { Field } from '@/components/site/JoinForm';

// Content sourced from the Stitch FinTech / HealthTech / Hospitality Tech vertical screens.

export type Need = { org: string; meta: string; label: string; text: string; tags?: string[] };
export type Solution = { name: string; meta: string; badge?: string; label?: string; text: string; seeking?: string; tags?: string[] };

export type Vertical = {
  slug: string;
  name: string;
  eyebrow: string;
  title: string;
  titleAccent: string;
  intro: string;
  image: string;
  stats?: { label: string; value: string }[];
  highlights?: string[];
  needsTitle: string;
  needsSubtitle?: string;
  solutionsTitle: string;
  solutionsSubtitle?: string;
  needCta: string;
  solutionCta: string;
  needs: Need[];
  solutions: Solution[];
  form: { title: string; body: string; fields: Field[] };
};

export const verticals: Vertical[] = [
  {
    slug: 'fintech',
    name: 'FinTech',
    eyebrow: 'Vertical Focus',
    title: 'FinTech',
    titleAccent: 'Matchmaking',
    intro:
      'Revolutionizing digital payments and regulatory tech in the Western Balkans. We bridge the gap between institutional stability and disruptive innovation to build the future of regional finance.',
    image: '/images/verticals/fintech.jpg',
    stats: [
      { label: 'Market Cap', value: '$2.4B+' },
      { label: 'Active Pilots', value: '12' },
    ],
    needsTitle: 'Partner Needs',
    solutionsTitle: 'Startup Solutions',
    needCta: 'Express Interest',
    solutionCta: 'Express Interest',
    needs: [
      {
        org: 'Balkan Reserve Bank',
        meta: 'Financial Institution',
        label: 'Seeking',
        text: 'Modernizing cross-border payments between non-EU Western Balkan states to reduce latency and transaction fees by 60%.',
      },
      {
        org: 'ReguCore Systems',
        meta: 'Compliance Partner',
        label: 'Seeking',
        text: 'Seeking AI-driven KYC/AML solutions that can handle Cyrillic script and diverse regional identification formats.',
      },
      {
        org: 'Adriatic Insurance',
        meta: 'InsurTech',
        label: 'Seeking',
        text: 'Integration of dynamic parametric insurance for agricultural climate risks across the Dinaric Alps region.',
      },
    ],
    solutions: [
      {
        name: 'VaultStream',
        meta: 'Layer-2 Protocol',
        badge: 'Pilot Partner',
        text: 'Layer-2 blockchain protocol specifically designed for real-time gross settlement (RTGS) between regional central banks.',
        seeking: 'Beta-testing partner & Series A lead',
      },
      {
        name: 'LexiGuard AI',
        meta: 'LegalTech',
        badge: 'Investor',
        text: 'Automated legal-tech parser that monitors regional regulatory changes and updates banking compliance docs in real-time.',
        seeking: 'Strategic Angel Investment',
      },
      {
        name: 'PayPath Mobile',
        meta: 'Payments',
        badge: 'Acquisition',
        text: 'QR-based peer-to-peer payment gateway with zero fees for micro-merchants in emerging markets.',
        seeking: 'Banking integration license',
      },
    ],
    form: {
      title: 'Join the FinTech Network',
      body: "Position yourself at the center of the Western Balkan fintech revolution. Whether you're an institutional leader or a visionary founder, let's connect.",
      fields: [
        { type: 'text', name: 'name', label: 'Full Name' },
        { type: 'email', name: 'email', label: 'Work Email' },
        {
          type: 'select',
          name: 'role',
          label: 'I am joining as a',
          options: ['Founder / Startup', 'Institutional Partner', 'Individual Investor', 'Regulatory Expert'],
        },
        { type: 'textarea', name: 'vision', label: 'Vision Statement' },
      ],
    },
  },
  {
    slug: 'healthtech',
    name: 'HealthTech',
    eyebrow: 'HealthTech Vertical',
    title: 'The Future of',
    titleAccent: 'Clinical Intelligence & Care',
    intro:
      'Digital Den is bridging the gap between medical institutions and high-growth startups. We focus on scaling telemedicine, real-time health monitoring, and data-driven wellness platforms to redefine the patient experience.',
    image: '/images/verticals/healthtech.jpg',
    needsTitle: 'Industry Needs',
    solutionsTitle: 'Startup Solutions',
    needCta: 'Express Interest',
    solutionCta: 'Express Interest',
    needs: [
      {
        org: 'St. Jude Medical Center',
        meta: 'Enterprise Partner',
        label: 'Seeking',
        text: 'Remote Patient Monitoring for post-operative recovery tracking and cardiac telemetry.',
        tags: ['Wearables', 'Real-time Data'],
      },
      {
        org: 'Novis Health Clinics',
        meta: 'Clinical Network',
        label: 'Seeking',
        text: 'AI Diagnostics for early-stage oncology screening and radiologic analysis.',
        tags: ['AI/ML', 'Oncology'],
      },
      {
        org: 'Global Wellness Group',
        meta: 'Health Insurer',
        label: 'Seeking',
        text: 'Data-Driven Wellness platforms for preventative corporate health programs.',
        tags: ['Wellness', 'Data Analytics'],
      },
    ],
    solutions: [
      {
        name: 'Cura AI',
        meta: 'Series A',
        label: 'Generative Diagnostics',
        text: 'Reducing triage time by 40% through automated symptom mapping.',
        tags: ['Scalable', 'HIPAA Ready'],
      },
      {
        name: 'PulseMetrics',
        meta: 'Seed',
        label: 'Bio-Patch Pro',
        text: 'Non-invasive glucose and oxygen monitoring for continuous outpatient care.',
        tags: ['Hardware', 'FDA Track'],
      },
      {
        name: 'EtherHealth',
        meta: 'Pre-Seed',
        label: 'Decentralized EHR',
        text: 'Patient-owned health records secured by blockchain for seamless hospital switching.',
        tags: ['Web3', 'Interoperable'],
      },
    ],
    form: {
      title: 'Join the HealthTech Network',
      body: 'Access our curated pipeline of venture-backed startups and institutional partners. Be the first to pilot next-generation medical technology.',
      fields: [
        { type: 'text', name: 'organization', label: 'Organization Name' },
        { type: 'email', name: 'email', label: 'Email Address' },
        {
          type: 'select',
          name: 'role',
          label: 'Role',
          options: [
            'Institutional Partner (Hospital/Clinic)',
            'HealthTech Startup Founder',
            'Venture Capitalist',
            'Corporate M&A',
          ],
        },
      ],
    },
  },
  {
    slug: 'hospitality',
    name: 'Hospitality Tech',
    eyebrow: 'Vertical Focus',
    title: 'Hospitality',
    titleAccent: 'Architecture.',
    intro:
      'A dedicated matchmaking environment for the next generation of hospitality in the Mediterranean. We bridge the gap between luxury hotel groups and frontier tech startups focusing on smart booking, guest orchestration, and high-impact sustainable travel.',
    image: '/images/verticals/hospitality.jpg',
    highlights: ['Mediterranean Core', 'Sustainable Growth', 'Rapid Matchmaking'],
    needsTitle: 'Industry Needs',
    needsSubtitle: 'Seeking Innovation',
    solutionsTitle: 'Startup Solutions',
    solutionsSubtitle: 'Seeking Partners',
    needCta: 'Express Interest',
    solutionCta: 'Connect with Founders',
    needs: [
      {
        org: 'Aegis Luxury Group',
        meta: '24 Properties • Greece / Italy',
        label: 'Challenge',
        text: 'Seamless, contactless guest journeys from pre-arrival to checkout without losing the human-centric luxury feel.',
        tags: ['Guest Experience', 'IoT Integration'],
      },
      {
        org: 'Terra Nova Tourism Board',
        meta: 'Regional Government • Spain',
        label: 'Challenge',
        text: 'Data-driven management of peak-season tourist flows to minimize environmental impact on coastal ecosystems.',
        tags: ['Sustainability', 'Predictive AI'],
      },
      {
        org: 'Azure Coastal Resorts',
        meta: 'Boutique Portfolio • Croatia',
        label: 'Challenge',
        text: 'Hyper-personalized concierge services powered by localized AI agents for non-English speaking guests.',
        tags: ['Localization', 'LLM Agents'],
      },
    ],
    solutions: [
      {
        name: 'NomadKey',
        meta: 'Seed Stage • Athens, GR',
        text: 'Next-gen decentralized identity protocol for hotels, allowing instant, one-click check-ins across different brands.',
        seeking: 'Beta Partners (Hotels)',
      },
      {
        name: 'BlueHorizon Eco',
        meta: 'Series A • Marseille, FR',
        text: 'Closed-loop water recycling systems integrated with smart monitoring for large-scale resort properties.',
        seeking: 'VC Investment & Pilots',
      },
      {
        name: 'StaySmart AI',
        meta: 'Seed Stage • Nicosia, CY',
        text: 'Dynamic pricing engine specifically for Mediterranean seasonal variances using real-time flight and ferry data.',
        seeking: 'Data Partners',
      },
    ],
    form: {
      title: 'Join the Hospitality Tech Network',
      body: 'Be the first to hear about new venture opportunities, pilot programs, and exclusive ecosystem events.',
      fields: [
        { type: 'text', name: 'name', label: 'Full Name' },
        { type: 'text', name: 'organization', label: 'Organization' },
        { type: 'email', name: 'email', label: 'Work Email' },
        {
          type: 'select',
          name: 'interest',
          label: 'Primary Interest',
          options: ['Partnership & Pilots', 'Investment Opportunities', 'Technical Advisory', 'Other'],
        },
      ],
    },
  },
];

export function getVertical(slug: string) {
  return verticals.find((v) => v.slug === slug);
}
