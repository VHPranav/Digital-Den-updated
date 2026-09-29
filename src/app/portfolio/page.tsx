import type { Metadata } from 'next';
import PortfolioPage from '@/components/portfolio/PortfolioPage';

export const metadata: Metadata = {
  title: 'Venture Portfolio | Digital Den',
  description:
    'Investing in the architects of the next digital era. Our portfolio represents the high-stakes innovation built within the Den.',
};

export default function Page() {
  return <PortfolioPage />;
}
