import type { Metadata } from 'next';
import PortfolioPage from '@/components/portfolio/PortfolioPage';
import { getPortfolioStartups } from '@/lib/portfolio';

export const metadata: Metadata = {
  title: 'Startup Portfolio | Digital Den',
  description: 'Meet the startups that make up the Digital Den portfolio.',
};

export default async function Page() {
  return <PortfolioPage startups={await getPortfolioStartups()} />;
}
