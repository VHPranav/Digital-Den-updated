// Programs page content contract shared by Sanity and the Programs UI. Array items use an
// explicit order field so editors can reorder them without changing layout code.
// Source: Digital Den's "Programs Page - updates needed" brief (October 2026).
// Only names are approved for the program modules; do not restore the old template claims.

export type ProgramStatus = 'open' | 'ongoing' | 'past';
export type ContentImage = { src: string; alt: string };
export type OrganizationLogo = ContentImage & { name: string; href?: string };
export type ApplicationCall = {
  href: string;
  active: boolean;
  opensAt?: string; // ISO timestamp with a timezone, when scheduled.
  closesAt?: string; // ISO timestamp with a timezone; the close is exclusive.
};

export type StartupProgram = {
  id: string;
  order: number;
  title: string;
  status: ProgramStatus | null; // null until DD confirms the current status.
  image: ContentImage;
  overview?: string;
  location?: string;
  format?: string;
  duration?: string;
  audience?: string;
  benefits: string[];
  partners: OrganizationLogo[];
  gallery: ContentImage[];
  application: ApplicationCall | null;
};

export type InternationalProject = {
  id: string;
  order: number;
  title: string;
  status?: 'ongoing' | 'past' | 'upcoming';
  period?: string;
  description?: string;
  image?: ContentImage;
  partners: OrganizationLogo[];
  funders: OrganizationLogo[];
  acknowledgement?: string;
  officialUrl?: string;
  // Keep the full project module unpublished until mandatory visibility assets are supplied.
  requiresFundingVisibility: boolean;
};

export const programsCopy = {
  hero: {
    line1: 'Startup',
    line2: 'Programs.',
    body: 'From readiness and acceleration to international market access, Digital Den programs help founders strengthen their businesses, connect with the right expertise and build pathways to new markets.',
    video: '/videos/programs-hero.mp4',
    poster: '/images/programs/hero-poster.jpg',
  },
  globalReach: {
    label: 'Global Reach',
    title: 'From Montenegro to global markets',
    video: '/videos/programs-band.mp4',
    poster: '/images/programs/band-poster.jpg',
    figures: [
      { value: '03', label: 'Continents', detail: 'North America · Europe · Asia' },
      { value: '04', label: 'Markets', detail: 'USA · EU · Middle East · Western Balkans' },
    ],
    body: 'Digital Den programs connect founders with international mentors, partners and market opportunities across the U.S., Europe, the Middle East and the Western Balkans.',
  },
  closing: {
    label: 'Your Next Opportunity',
    title: 'Find your next opportunity',
    body: 'Explore Digital Den programs designed to help startups build stronger foundations, access new markets and connect with the right support.',
  },
};

export const startupPrograms: StartupProgram[] = [
  // DUMMY CONTENT (layout preview only) — replace with Digital Den's approved copy in Sanity.
  {
    id: 'acceleration',
    order: 10,
    title: 'Startup Readiness Program',
    status: 'ongoing',
    image: { src: '/images/programs/readiness.jpg', alt: 'Startup Readiness Program' },
    overview:
      'A structured program that helps early-stage founders validate their idea, sharpen the business model and prepare for their first investors and international partners.',
    location: 'Podgorica, Montenegro',
    format: 'Hybrid · workshops and 1:1 mentoring',
    duration: '12 weeks',
    audience: 'Early-stage founders from Montenegro and the Western Balkans',
    benefits: [
      'Weekly workshops on validation, business model and go-to-market',
      'One-to-one mentoring with experienced founders and experts',
      'Investor-readiness and pitch preparation',
      'Introductions to Digital Den partners and international programs',
    ],
    partners: [],
    gallery: [],
    application: null,
  },
  { id: 'mtsb-europe', order: 20, title: 'MTSB Europe', status: null, image: { src: '/images/programs/europe.jpg', alt: 'MTSB Europe' }, benefits: [], partners: [], gallery: [], application: null },
  { id: 'mtsb-us', order: 30, title: 'MTSB US', status: null, image: { src: '/images/programs/us.jpg', alt: 'MTSB US' }, benefits: [], partners: [], gallery: [], application: null },
  { id: 'jordan', order: 40, title: 'Jordan Program', status: null, image: { src: '/images/programs/jordan.jpg', alt: 'Jordan Program' }, benefits: [], partners: [], gallery: [], application: null },
];

// DUMMY CONTENT (layout preview only) — real project details, logos, acknowledgements and links
// must come from Digital Den via Sanity. Delete the preview-only projects (dummy-*) before launch.
export const internationalProjects: InternationalProject[] = [
  {
    id: 'visegrad',
    order: 10,
    title: 'Visegrad Project',
    status: 'ongoing', // The brief confirms that the project has officially started.
    period: 'Jan 2026 – Dec 2027',
    description: 'A regional cooperation project connecting startup support organisations across the Visegrad countries and the Western Balkans to share programs, mentors and market access for founders.',
    image: { src: '/images/opportunities/featured-poster.jpg', alt: 'Visegrad Project' },
    partners: [
      { name: 'NorthHub', src: '/images/projects/logos/partner-north.svg', alt: 'NorthHub', href: 'https://example.com' },
      { name: 'Adria Labs', src: '/images/projects/logos/partner-adria.svg', alt: 'Adria Labs', href: 'https://example.com' },
    ],
    funders: [{ name: 'Visegrad Fund', src: '/images/projects/logos/funder-v4.svg', alt: 'Visegrad Fund', href: 'https://www.visegradfund.org/' }],
    acknowledgement: 'The project is co-financed by the Governments of Czechia, Hungary, Poland and Slovakia through Visegrad Grants from the International Visegrad Fund.',
    officialUrl: 'https://www.visegradfund.org/',
    requiresFundingVisibility: true,
  },
  {
    id: 'dummy-eu-bridge',
    order: 20,
    title: 'EU Startup Bridge',
    status: 'ongoing',
    period: 'Mar 2026 – Feb 2028',
    description: 'An EU co-funded initiative helping Western Balkan startups prepare for expansion into European markets through soft-landing programs, partner matchmaking and investor days.',
    image: { src: '/images/programs/europe.jpg', alt: 'EU Startup Bridge' },
    partners: [{ name: 'BridgeTech', src: '/images/projects/logos/partner-bridge.svg', alt: 'BridgeTech', href: 'https://example.com' }],
    funders: [{ name: 'Co-funded by the European Union', src: '/images/projects/logos/funder-eu.svg', alt: 'Co-funded by the European Union' }],
    acknowledgement: 'Funded by the European Union. Views and opinions expressed are those of the author(s) only and do not necessarily reflect those of the European Union.',
    officialUrl: 'https://example.com',
    requiresFundingVisibility: true,
  },
  {
    id: 'dummy-digital-health',
    order: 30,
    title: 'Digital Health Innovation Lab',
    status: 'upcoming',
    period: 'Starts Sep 2026',
    description: 'A pilot program pairing health-tech startups with regional clinics and institutions to test solutions in real settings and prepare them for wider rollout.',
    image: { src: '/images/verticals/healthtech.jpg', alt: 'Digital Health Innovation Lab' },
    partners: [{ name: 'NorthHub', src: '/images/projects/logos/partner-north.svg', alt: 'NorthHub', href: 'https://example.com' }],
    funders: [],
    officialUrl: 'https://example.com',
    requiresFundingVisibility: false,
  },
  {
    id: 'dummy-tourism-tech',
    order: 40,
    title: 'Smart Tourism Accelerator',
    status: 'past',
    period: '2024 – 2025',
    description: 'A completed accelerator that supported hospitality and travel-tech startups along the Adriatic coast with mentoring, pilots and investor introductions.',
    image: { src: '/images/verticals/hospitality.jpg', alt: 'Smart Tourism Accelerator' },
    partners: [{ name: 'Adria Labs', src: '/images/projects/logos/partner-adria.svg', alt: 'Adria Labs', href: 'https://example.com' }],
    funders: [],
    officialUrl: 'https://example.com',
    requiresFundingVisibility: false,
  },
];

export function withoutTrailingPeriod(text: string): string {
  return text.trimEnd().replace(/\.$/, '');
}

export function ordered<T extends { order: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => a.order - b.order);
}

export function isOfficialUrl(value?: string): value is string {
  if (!value) return false;
  try {
    return new URL(value).protocol === 'https:';
  } catch {
    return false;
  }
}

export function hasActiveCall(program: StartupProgram, now: number): boolean {
  const call = program.application;
  if (program.status !== 'open' || !call?.active || !isOfficialUrl(call.href)) return false;
  const start = call.opensAt ? Date.parse(call.opensAt) : -Infinity;
  const end = call.closesAt ? Date.parse(call.closesAt) : Infinity;
  return now >= start && now < end;
}

export function hasProjectVisibility(project: InternationalProject): boolean {
  const hasFunderLogos = project.funders.length > 0 && project.funders.every((funder) => Boolean(funder.src));
  return !project.requiresFundingVisibility || Boolean(project.acknowledgement?.trim() && hasFunderLogos);
}
