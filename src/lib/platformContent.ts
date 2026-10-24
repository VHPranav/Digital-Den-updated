// Client-managed Platform page content (stand-in for a CMS): every copy block, metric, image and
// team member lives here so it can be edited without touching the layout. Source: "Platform Page -
// Digital Den website" (Oct 2026). Do not add content that Digital Den has not approved.

export const platformHero = {
  video: '/videos/platform-hero.mp4', // TODO: replace with the Podgorica / Millennium Bridge film once supplied
  poster: '/images/platform/hero-poster.jpg',
  headline: 'Connecting ideas, people and markets.',
  body: 'Digital Den brings together programs, expert support, strategic partnerships, access to capital and international market connections to create stronger pathways for innovation and growth.',
  primaryCta: 'Apply as Startup',
  secondaryCta: { label: 'Explore Services', href: '/services' },
};

export const platformTransition = {
  line1: 'One platform.',
  line2Before: 'Built to move innovation ecosystem',
  line2Accent: 'forward.',
  scrollLabel: 'Scroll to Explore',
};

export type ImpactSlide = { metric: string; label: string; support?: string; image: string; position?: string };

export const impactSlides: ImpactSlide[] = [
  { metric: '€6M+', label: 'Local investments', image: '/images/platform/impact-investments.jpg' },
  { metric: '150+', label: 'Supported startups', image: '/images/platform/impact-startups.jpg' },
  { metric: '4', label: 'Markets', support: 'USA · Europe · Middle East · Western Balkans', image: '/images/platform/impact-markets.jpg' },
  { metric: '15+', label: 'Implemented projects', image: '/images/platform/global.jpg' },
  { metric: '20+', label: 'Events organized', image: '/images/platform/impact-events.jpg' },
];

export const missionVision = {
  mission: {
    label: 'Mission',
    titleLine1: 'What',
    titleLine2: 'drives us',
    body: 'We help founders turn ambitious ideas into scalable companies through structured programs, expert support, strategic partnerships, access to capital and international market opportunities.',
  },
  vision: {
    label: 'Vision',
    titleLine1: 'Where',
    titleLine2: 'we’re going',
    body: 'To build a globally connected startup ecosystem where high-potential ideas from Montenegro and the Western Balkans can grow into sustainable companies with access to capital, markets and strategic partnerships worldwide.',
  },
};

export type TeamMember = { name: string; role: string; photo?: string; linkedin?: string };

// Digital Den will provide the final names, roles, approved photographs and LinkedIn profiles.
// Until then these are clearly marked layout placeholders (no photo → initials tile).
export const operationalTeam: TeamMember[] = [
  { name: 'Full name', role: 'Position / role' },
  { name: 'Full name', role: 'Position / role' },
  { name: 'Full name', role: 'Position / role' },
  { name: 'Full name', role: 'Position / role' },
];

export const founders: TeamMember[] = [
  { name: 'Full name', role: 'Founder' },
  { name: 'Full name', role: 'Founder' },
  { name: 'Full name', role: 'Founder' },
];

export const platformClosing = {
  video: '/videos/platform-close.mp4',
  poster: '/images/platform/close-poster.jpg',
  title: 'Ready for the next step?',
  body: 'Explore the right way to engage with Digital Den — whether you are building a startup, looking for partnerships or exploring opportunities within the startup ecosystem.',
  primaryCta: 'Apply as Startup',
  secondaryCta: 'Partner with Us',
};
