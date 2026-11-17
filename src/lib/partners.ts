// Partner Network content. Sanity `partner` documents replace this list at build time;
// these entries (logos and links taken from digitalden.me) are the fallback until the CMS is filled.
// Grouping is a first pass for Nina to review.
export type PartnerGroup = 'international' | 'regional' | 'local';
export type Partner = { name: string; href: string; logo: string; group: PartnerGroup; order: number };

export const partnerGroups: { id: PartnerGroup; title: string }[] = [
  { id: 'international', title: 'International' },
  { id: 'regional', title: 'Regional' },
  { id: 'local', title: 'Local' },
];

export const fallbackPartners: Partner[] = [
  { name: "UN1QUELY", href: "https://un1quely.com", logo: "/images/partners/logos/un1quely.jpg", group: 'local', order: 10 },
  { name: "Amplitudo", href: "https://amplitudo.me/", logo: "/images/partners/logos/amplitudo.png", group: 'local', order: 20 },
  { name: "Naučno-tehnološki park Crne Gore", href: "https://ntpark.me/o-nama/", logo: "/images/partners/logos/naucno-tehnoloski-park-crne-gore.png", group: 'local', order: 30 },
  { name: "EIT Community RIS Hub Montenegro", href: "https://eit-ris.eu/montenegro", logo: "/images/partners/logos/eit-community-ris-hub-montenegro.png", group: 'local', order: 40 },
  { name: "Univerzitet Donja Gorica", href: "https://www.udg.edu.me", logo: "/images/partners/logos/univerzitet-donja-gorica.jpg", group: 'local', order: 50 },
  { name: "Tehnopolis", href: "https://www.tehnopolis.me/online/mne/home/", logo: "/images/partners/logos/tehnopolis.png", group: 'local', order: 60 },
  { name: "PwC", href: "https://www.pwc.com/", logo: "/images/partners/logos/pwc.png", group: 'international', order: 70 },
  { name: "Impact Foundation", href: "https://www.impactfoundation.org/", logo: "/images/partners/logos/impact-foundation.png", group: 'international', order: 80 },
  { name: "Comeunity Business incubator", href: "https://cbi.mk/", logo: "/images/partners/logos/comeunity-business-incubator.png", group: 'regional', order: 90 },
  { name: "Greater Phoenix Economic Council", href: "https://www.gpec.org/", logo: "/images/partners/logos/greater-phoenix-economic-council.png", group: 'international', order: 100 },
  { name: "Mediatech Ventures", href: "https://mediatech.ventures", logo: "/images/partners/logos/mediatech-ventures.png", group: 'regional', order: 110 },
  { name: "Vigan Group", href: "https://vigangroup.com/", logo: "/images/partners/logos/vigan-group.png", group: 'regional', order: 120 },
  { name: "Arizona State University", href: "https://www.asu.edu/", logo: "/images/partners/logos/arizona-state-university.png", group: 'international', order: 130 },
  { name: "Maine Center for Entrepreneurs", href: "https://www.mced.biz", logo: "/images/partners/logos/maine-center-for-entrepreneurs.png", group: 'international', order: 140 },
  { name: "Denver Economic Development & Opportunity", href: "https://www.denvergov.org/Government/Agencies-Departments-Offices/Agencies-Departments-Offices-Directory/Economic-Development-Opportunity", logo: "/images/partners/logos/denver-economic-development-opportunity.png", group: 'international', order: 150 },
  { name: "University of Denver", href: "https://www.du.edu/", logo: "/images/partners/logos/university-of-denver.png", group: 'international', order: 160 },
  { name: "The University of Maine", href: "https://umaine.edu/", logo: "/images/partners/logos/the-university-of-maine.png", group: 'international', order: 170 },
  { name: "University of Colorado Boulder", href: "https://www.colorado.edu/", logo: "/images/partners/logos/university-of-colorado-boulder.png", group: 'international', order: 180 },
  { name: "Thunderbird School of Global Management", href: "https://thunderbird.asu.edu/", logo: "/images/partners/logos/thunderbird-school-of-global-management.png", group: 'international', order: 190 },
  { name: "Roux Institute", href: "https://roux.northeastern.edu/", logo: "/images/partners/logos/roux-institute.png", group: 'international', order: 200 },
  { name: "Maine Technology Institute", href: "https://www.mainetechnology.org/", logo: "/images/partners/logos/maine-technology-institute.png", group: 'international', order: 210 },
  { name: "Foundation 787", href: "https://fondacija787.ba", logo: "/images/partners/logos/foundation-787.png", group: 'regional', order: 220 },
  { name: "Founder Institute Serbia", href: "https://inkubator.biz/founder-institute-serbia-upoznajte-srpski-startap-ekosistem/", logo: "/images/partners/logos/founder-institute-serbia.png", group: 'regional', order: 230 },
  { name: "Western Balkans Startup Alliance", href: "https://wbstartupalliance.org", logo: "/images/partners/logos/western-balkans-startup-alliance.png", group: 'regional', order: 240 },
  { name: "EPIcentar", href: "", logo: "/images/partners/logos/epicentar.png", group: 'regional', order: 250 },
];

const API_VERSION = '2025-02-19';
const partnersQuery = `*[_type == "partner" && defined(name) && defined(logo)] | order(order asc) {
  name, "href": coalesce(href, ""), "logo": logo.asset->url, "group": coalesce(group, "international"), "order": coalesce(order, 999)
}`;

export async function getPartners(): Promise<Partner[]> {
  try {
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'inise1vg';
    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
    const params = new URLSearchParams({ query: partnersQuery });
    const res = await fetch(`https://${projectId}.api.sanity.io/v${API_VERSION}/data/query/${dataset}?${params}`, { cache: 'force-cache' });
    if (!res.ok) throw new Error(`Sanity query failed (${res.status})`);
    const { result } = (await res.json()) as { result?: Partner[] };
    return result?.length ? result : fallbackPartners;
  } catch {
    return fallbackPartners;
  }
}
