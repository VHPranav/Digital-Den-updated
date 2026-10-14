// Client-managed Home Page content (stand-in for a CMS).
// Per Digital Den's final Home Page notes (7 Oct 2026): only publish data
// Digital Den has supplied/approved. Empty values hide their section or field.

export type UpcomingOpportunity = {
  label: string; // e.g. "Upcoming Opportunity"
  title: string;
  description: string; // one short sentence
  date: string;
  location: string;
  cta: { label: 'Register Now' | 'Explore Opportunity'; href: string };
};

// Set to an object when DD supplies a current/upcoming opportunity.
// When it passes, set back to null and move it to the Events page as a past event.
export const upcomingOpportunity: UpcomingOpportunity | null = null;

export type ProofStartup = {
  name: string;
  logo: string; // path under /public
  achievement: string; // one concise verified statement
  metric?: string; // optional verified metric / market
  href?: string;
};

// 3–4 real startups, to be confirmed by Digital Den. Never add placeholders.
export const proofOfGrowth: ProofStartup[] = [];

// Footer contact details: only Digital Den-confirmed values. Empty = hidden.
export const contact = {
  address: '', // awaiting confirmed office address
  email: 'info@digitalden.me',
  phone: '', // awaiting confirmed phone number
  socials: {
    instagram: '', // awaiting verified profile URLs
    linkedin: '',
    facebook: '',
  },
};

// Footer legal links: set to the page/URL once Digital Den supplies the policies. Empty = hidden
// (no dead links; we don't write legal text ourselves).
export const legal = {
  privacy: '',
  terms: '',
};
