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
    title: 'From Montenegro to global markets.',
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
    title: 'Find your next opportunity.',
    body: 'Explore Digital Den programs designed to help startups build stronger foundations, access new markets and connect with the right support.',
  },
};

export const startupPrograms: StartupProgram[] = [
  { id: 'acceleration', order: 10, title: 'Startup Readiness Program', status: null, image: { src: '/images/programs/readiness.jpg', alt: 'Startup Readiness Program' }, benefits: [], partners: [], gallery: [], application: null },
  { id: 'mtsb-europe', order: 20, title: 'MTSB Europe', status: null, image: { src: '/images/programs/europe.jpg', alt: 'MTSB Europe' }, benefits: [], partners: [], gallery: [], application: null },
  { id: 'mtsb-us', order: 30, title: 'MTSB US', status: null, image: { src: '/images/programs/us.jpg', alt: 'MTSB US' }, benefits: [], partners: [], gallery: [], application: null },
  { id: 'jordan', order: 40, title: 'Jordan Program', status: null, image: { src: '/images/programs/jordan.jpg', alt: 'Jordan Program' }, benefits: [], partners: [], gallery: [], application: null },
];

export const internationalProjects: InternationalProject[] = [
  {
    id: 'visegrad',
    order: 10,
    title: 'Visegrad Project',
    status: 'ongoing', // The brief confirms that the project has officially started.
    partners: [],
    funders: [],
    requiresFundingVisibility: true,
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
