import { impactSlides as defaultImpact, platformClosing as defaultClosing, platformHero as defaultPlatformHero, platformTransition as defaultTransition, missionVision as defaultMissionVision, operationalTeam as defaultOps, founders as defaultFounders } from '@/lib/platformContent';
import { programsCopy as defaultProgramsCopy } from '@/lib/programsContent';
import { contact as defaultContact, legal as defaultLegal } from '@/lib/homeContent';

const API_VERSION = '2025-02-19';
const PROJECT = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'inise1vg';
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

async function query<T>(queryText: string, fallback: T): Promise<T> {
  try {
    const params = new URLSearchParams({ query: queryText });
    const response = await fetch(`https://${PROJECT}.api.sanity.io/v${API_VERSION}/data/query/${DATASET}?${params}`, { cache: 'force-cache' });
    if (!response.ok) throw new Error(`Sanity query failed (${response.status})`);
    const payload = await response.json() as { result?: T };
    return payload.result ?? fallback;
  } catch (error) {
    console.warn('Unable to load page content from Sanity; using approved local content.', error);
    return fallback;
  }
}

export type HomeCard = { title: string; body: string; cta: string; href: string; image: string; position?: string };
export type HomeJourneyStage = {title: string; body: string; color?: string};
export type HomePageContent = {
  heroLine1: string; heroLine2: string; positioning: string; exploreTitle: string; cards: HomeCard[];
  journey: {eyebrow: string; title: string; lead: string; stages: HomeJourneyStage[]};
  presence: {title: string; lead: string};
  proof: {eyebrow: string; title: string; sentence: string; linkLabel: string};
  finalCta: {eyebrow: string; title: string; body: string; primaryCta: string; secondaryCta: string};
  contact: typeof defaultContact; legal: typeof defaultLegal;
};
export const defaultHomePage: HomePageContent = {
  heroLine1: 'Your Gateway to', heroLine2: 'Global Markets',
  positioning: 'A startup launch platform and venture studio connecting founders with the right support, strategic partners, capital and international markets.',
  exploreTitle: 'Explore Digital Den',
  cards: [
    { title: 'Venture Building', body: 'Hands-on support that helps founders validate, structure and build stronger ventures ready for growth.', cta: 'See How We Build', href: '/platform', image: '/images/platform/building.jpg', position: '30% center' },
    { title: 'Programs', body: 'Startup readiness, acceleration and internationalization programs designed to move founders from early stage to global opportunity.', cta: 'Find Your Program', href: '/programs', image: '/images/firstimg.png', position: 'center' },
    { title: 'Services', body: 'A matchmaking space connecting startup solutions with industry challenges, partners, investors and pilot opportunities.', cta: 'Discover Services', href: '/services', image: '/images/opportunities/featured-poster.jpg', position: '38% center' },
    { title: 'Global Network', body: 'Access strategic partners, mentors and market connections across Montenegro, the Western Balkans, Benelux, the United States, Jordan and beyond.', cta: 'Connect Globally', href: '/partners', image: '/images/platform/global.jpg', position: '64% center' },
  ],
  journey: {eyebrow: 'Startup Journey', title: 'From Idea to Global', lead: 'From first idea to global opportunity, we support founders through every stage of startup growth.', stages: [
    {title: 'Idea', body: 'Validation of innovation concepts with global potential.', color: '#a855f7'}, {title: 'Build', body: 'Hands-on architecture, design, strategy and development support.', color: '#8b7cf6'},
    {title: 'Validate', body: 'Program testing, mentorship and real-market scenarios.', color: '#6c9bf8'}, {title: 'Scale', body: 'Operational support and access to growth opportunities.', color: '#4cb4f5'},
    {title: 'Global', body: 'Access to international markets, strategic partners and soft-landing opportunities.', color: '#22d3ee'},
  ]},
  presence: {title: 'Global Presence', lead: 'Connecting founders with international partners, markets and opportunities across key global hubs.'},
  proof: {eyebrow: 'Portfolio Highlights', title: 'Proof of Growth', sentence: 'Startups that turned potential into investment, revenue, clients and international market presence.', linkLabel: 'Explore Full Portfolio'},
  finalCta: {eyebrow: 'Work with Digital Den', title: 'Ready to Go Beyond Borders?', body: 'Whether you are building a startup with global ambitions or looking to connect with high-potential ventures, Digital Den creates the connections and opportunities to move forward.', primaryCta: 'Apply as Startup', secondaryCta: 'Partner with Us'},
  contact: defaultContact, legal: defaultLegal,
};

export async function getHomePageContent() {
  const record = await query<Partial<HomePageContent>>(`*[_type == "homePage" && _id == "homePage"][0]{heroLine1,heroLine2,positioning,exploreTitle,"cards":cards[]{title,body,cta,href,"image":image.asset->url,position},journey,presence,proof,finalCta}`, defaultHomePage);
  return {...defaultHomePage, ...record,
    cards: record.cards?.length ? record.cards.map((card, i) => ({...defaultHomePage.cards[i % defaultHomePage.cards.length], ...card, image: card.image || defaultHomePage.cards[i % defaultHomePage.cards.length].image})) : defaultHomePage.cards,
    journey: {...defaultHomePage.journey, ...record.journey, stages: record.journey?.stages?.length ? record.journey.stages.map((stage, i) => ({...defaultHomePage.journey.stages[i % defaultHomePage.journey.stages.length], ...stage})) : defaultHomePage.journey.stages},
    presence: {...defaultHomePage.presence, ...record.presence}, proof: {...defaultHomePage.proof, ...record.proof}, finalCta: {...defaultHomePage.finalCta, ...record.finalCta},
  };
}

export const defaultPlatformPage = {
  hero: defaultPlatformHero, transition: defaultTransition, impact: defaultImpact, missionVision: defaultMissionVision,
  teamTitleOperational: 'Operational Team', teamTitleFounders: 'Founders', operationalTeam: defaultOps, founders: defaultFounders,
  closing: defaultClosing,
};
export type PlatformPageContent = typeof defaultPlatformPage;
export async function getPlatformPageContent() {
  const record = await query<Partial<PlatformPageContent>>(`*[_type == "platformPage" && _id == "platformPage"][0]{"hero":{video,"poster":poster.asset->url,headline,body,primaryCta,"secondaryCta":{"label":secondaryCtaLabel,"href":secondaryCtaHref}},"transition":{"line1":line1,"line2Before":line2Before,"line2Accent":line2Accent,"scrollLabel":scrollLabel},"impact":impact[]{metric,label,support,"image":image.asset->url,position},"missionVision":{mission,vision},teamTitleOperational,teamTitleFounders,operationalTeam[]{name,role,"photo":photo.asset->url,linkedin},founders[]{name,role,"photo":photo.asset->url,linkedin},"closing":{"video":closingVideo,"poster":closingPoster.asset->url,"title":closingTitle,"body":closingBody,"primaryCta":closingPrimaryCta,"secondaryCta":closingSecondaryCta}}`, defaultPlatformPage);
  return {
    ...defaultPlatformPage, ...record,
    hero: {...defaultPlatformPage.hero, ...record.hero, poster: record.hero?.poster || defaultPlatformPage.hero.poster, secondaryCta: {...defaultPlatformPage.hero.secondaryCta, ...record.hero?.secondaryCta}},
    transition: {...defaultPlatformPage.transition, ...record.transition},
    impact: record.impact?.length ? record.impact.map((item, i) => ({...defaultPlatformPage.impact[i % defaultPlatformPage.impact.length], ...item, image: item.image || defaultPlatformPage.impact[i % defaultPlatformPage.impact.length].image})) : defaultPlatformPage.impact,
    missionVision: {mission: {...defaultPlatformPage.missionVision.mission, ...record.missionVision?.mission}, vision: {...defaultPlatformPage.missionVision.vision, ...record.missionVision?.vision}},
    operationalTeam: record.operationalTeam?.length ? record.operationalTeam : defaultPlatformPage.operationalTeam,
    founders: record.founders?.length ? record.founders : defaultPlatformPage.founders,
    closing: {...defaultPlatformPage.closing, ...record.closing, poster: record.closing?.poster || defaultPlatformPage.closing.poster},
  };
}

export type ProgramsPageCopy = typeof defaultProgramsCopy;
export async function getProgramsPageCopy() {
  const record = await query<Partial<ProgramsPageCopy>>(`*[_type == "programsPage" && _id == "programsPage"][0]{"hero":{"line1":heroLine1,"line2":heroLine2,"body":heroBody,"video":heroVideo,"poster":heroPoster.asset->url},"globalReach":{"label":reachLabel,"title":reachTitle,"video":reachVideo,"poster":reachPoster.asset->url,figures,"body":reachBody},"closing":{"label":closingLabel,"title":closingTitle,"body":closingBody}}`, defaultProgramsCopy);
  return {...defaultProgramsCopy, ...record, hero: {...defaultProgramsCopy.hero, ...record.hero, poster: record.hero?.poster || defaultProgramsCopy.hero.poster}, globalReach: {...defaultProgramsCopy.globalReach, ...record.globalReach, poster: record.globalReach?.poster || defaultProgramsCopy.globalReach.poster, figures: record.globalReach?.figures?.length ? record.globalReach.figures : defaultProgramsCopy.globalReach.figures}, closing: {...defaultProgramsCopy.closing, ...record.closing}};
}
