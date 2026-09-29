import type { Metadata } from 'next';
import OpportunitiesPage from '@/components/opportunities/OpportunitiesPage';

export const metadata: Metadata = {
  title: 'Opportunities | Digital Den',
  description:
    'Matchmaking events, priority verticals and strategic partnerships connecting startups with institutions across the Western Balkans.',
};

export default function Page() {
  return <OpportunitiesPage />;
}
