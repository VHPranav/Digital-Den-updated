// Digital Den portfolio startups. Sanity `portfolioStartup` documents replace this list at build
// time. This fallback was taken from digitalden.me/startups (logos and descriptions, shortened to one
// sentence; sectors are our first pass). Digital Den will review the final list, sectors and
// website links in the CMS. Fallback links are included where an official site can be identified.
export type PortfolioStartup = { name: string; logo: string; sector?: string; description?: string; website?: string; accent?: string; order: number };

export const fallbackStartups: PortfolioStartup[] = [
  { name: "Badger", logo: '/images/portfolio/logos/badger.png', sector: "Wearables", description: "A wearable screen, worn as a pinned badge, that displays images, gifs or social media handles.", website: 'https://thebadger.me/', accent: '#c2e655', order: 10 },
  { name: "Flourish", logo: '/images/portfolio/logos/flourish.png', sector: "EdTech", description: "A program for building social emotional intelligence: awareness of our own and others’ emotions.", website: 'https://flourishapp.me/', accent: '#e6c255', order: 20 },
  { name: "GoPlantMe", logo: '/images/portfolio/logos/goplantme.png', sector: "Sustainability", description: "A crowdfunding platform for planting trees to improve the environment in urban areas.", website: '', accent: '#e6e655', order: 30 },
  { name: "Final Find", logo: '/images/portfolio/logos/final-find.png', sector: "Travel & Tourism", description: "A location, communication and tracking app for the tourism industry.", website: '', accent: '#559ee6', order: 40 },
  { name: "Solar Data Collector", logo: '/images/portfolio/logos/solar-data-collector.png', sector: "Energy", description: "Forecasting, monitoring and optimisation of the output of photovoltaic systems.", website: '', accent: '#e6c255', order: 50 },
  { name: "Dr. Knight", logo: '/images/portfolio/logos/dr-knight.png', sector: "Consumer Products", description: "An eco-friendly laundry colour catcher made of hydrogel balls.", website: '', accent: '#55e6e6', order: 60 },
  { name: "3Hills", logo: '/images/portfolio/logos/3hills.png', sector: "Gaming", description: "A Montenegrin game development studio creating original games for global audiences.", website: 'https://3hills.io/', accent: '#559ee6', order: 70 },
  { name: "Away", logo: '/images/portfolio/logos/away.png', sector: "HR Tech", description: "A SaaS tool for HR teams with leave management and an employee burnout detector.", website: '', accent: '#5579e6', order: 80 },
  { name: "StartupX", logo: '/images/portfolio/logos/startupx.png', sector: "FinTech", description: "A SaaS tool that helps non-finance people build finance plans, cash flow forecasts and prepare to fundraise.", website: '', accent: '#7955e6', order: 90 },
  { name: "Happy Place", logo: '/images/portfolio/logos/happy-place.png', sector: "Wellbeing", description: "A mobile app that reduces stress with expert-guided and AI-generated EFT meditations.", website: 'https://happyplace.science/', accent: '#55e6e6', order: 100 },
  { name: "DigiGrow", logo: '/images/portfolio/logos/digigrow.png', sector: "AgriTech", description: "An all-in-one platform that helps farmers and businesses certify and sell organic products.", website: 'https://www.digigrow.me/', accent: '#9ee655', order: 110 },
  { name: "Solutaria", logo: '/images/portfolio/logos/solutaria.png', sector: "HealthTech", description: "The first Montenegrin speech therapy app for children.", website: 'https://solutaria.me/', accent: '#e69e55', order: 120 },
  { name: "Go4Adventure", logo: '/images/portfolio/logos/go4adventure.png', sector: "Hospitality", description: "Gamification and loyalty programs that help hotels fill capacity and engage guests.", website: '', accent: '#55c2e6', order: 130 },
  { name: "Foodyness", logo: '/images/portfolio/logos/foodyness.png', sector: "FoodTech", description: "Interactive games, weekly recipes and a loyalty program that encourage healthy eating in children.", website: '', accent: '#e65555', order: 140 },
  { name: "iPets", logo: '/images/portfolio/logos/ipets.png', sector: "Pet Care", description: "An all-in-one platform connecting pet owners with pet service providers and sellers.", website: 'https://ipets.love/', accent: '#e67955', order: 150 },
  { name: "Skenify", logo: '/images/portfolio/logos/skenify.png', sector: "Cybersecurity", description: "AI-powered cybersecurity compliance automation for European SMEs.", website: 'https://skenify.com/', accent: '#559ee6', order: 160 },
  { name: "Pejović Guitars", logo: '/images/portfolio/logos/pejovic-guitars.png', sector: "Craft & Music", description: "A family company from Cetinje crafting unique electric guitars, mostly from Montenegrin wood.", website: 'https://pejovicguitars.com/', accent: '#d8b4fe', order: 170 },
  { name: "Hashimotto", logo: '/images/portfolio/logos/hashimotto.png', sector: "HealthTech", description: "An AI-powered digital companion for people living with Hashimoto’s disease.", website: 'https://hashimotto.app/', accent: '#9e55e6', order: 180 },
  { name: "Crocodoh.co", logo: '/images/portfolio/logos/crocodoh-co.png', sector: "EdTech", description: "Conductive play dough and electronic modules that introduce preschoolers to robotics.", website: '', accent: '#c2e655', order: 190 },
  { name: "CorrectifAI", logo: '/images/portfolio/logos/correctifai.jpg', sector: "HealthTech", description: "An AI-powered smart posture corrector with personalised exercises and real-time feedback.", website: '', accent: '#55c2e6', order: 200 },
  { name: "DIA", logo: '/images/portfolio/logos/dia.png', sector: "HealthTech", description: "A digital platform for managing diabetes and metabolic health with personalised recommendations.", website: '', accent: '#5579e6', order: 210 },
  { name: "Orion3", logo: '/images/portfolio/logos/orion3.png', sector: "Security", description: "An access control system for residential and commercial properties and hotels.", website: 'https://orion3.pro/', accent: '#c2e655', order: 220 },
  { name: "Orderize", logo: '/images/portfolio/logos/orderize.png', sector: "Hospitality", description: "A platform that automates order handling and guest inquiries for hospitality businesses.", website: '', accent: '#c2e655', order: 230 },
  { name: "3DLoom", logo: '/images/portfolio/logos/3dloom.png', sector: "MedTech", description: "Patient-specific 3D-printed anatomical models for surgical planning.", website: 'https://3dloom.ing/', accent: '#559ee6', order: 240 },
  { name: "Pet Travel Advisor", logo: '/images/portfolio/logos/pet-travel-advisor.jpg', sector: "Travel & Tourism", description: "A digital platform that simplifies pet travel with a digital pet passport and AI recommendations.", website: 'https://pettraveladvisor.com/', accent: '#559ee6', order: 250 },
  { name: "SanyView", logo: '/images/portfolio/logos/sanyview.png', sector: "Hospitality", description: "A smart system for managing and reserving sunbeds in hotels, resorts and on beaches.", website: '', accent: '#e65555', order: 260 },
  { name: "WhereToPark", logo: '/images/portfolio/logos/wheretopark.png', sector: "Mobility", description: "A community-driven parking search that cuts CO2 emissions.", website: '', accent: '#559ee6', order: 270 },
  { name: "YachtHe", logo: '/images/portfolio/logos/yachthe.jpg', sector: "Marine", description: "A digital platform connecting boaters with verified local service providers.", website: 'https://yachthe.com/', accent: '#e69e55', order: 280 },
  { name: "Benefiti", logo: '/images/portfolio/logos/benefiti.png', sector: "HR Tech", description: "Personalised and flexible employee benefits for companies.", website: '', accent: '#5579e6', order: 290 },
];

const API_VERSION = '2025-02-19';
const query = `*[_type == "portfolioStartup" && visible != false && defined(name) && defined(logo)] | order(order asc) {
  name, sector, description, website, accent, "logo": logo.asset->url, "order": coalesce(order, 999)
}`;

export async function getPortfolioStartups(): Promise<PortfolioStartup[]> {
  try {
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'inise1vg';
    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
    const params = new URLSearchParams({ query });
    const res = await fetch(`https://${projectId}.api.sanity.io/v${API_VERSION}/data/query/${dataset}?${params}`, { cache: 'force-cache' });
    if (!res.ok) throw new Error(`Sanity query failed (${res.status})`);
    const { result } = (await res.json()) as { result?: PortfolioStartup[] };
    return result?.length ? result : fallbackStartups;
  } catch {
    return fallbackStartups;
  }
}
