import { getHomePageContent } from '@/lib/sitePagesSanity';
import HomePageClient from '@/components/home/HomePageClient';

export default async function Home() {
  const content = await getHomePageContent();
  return <HomePageClient content={content} />;
}
