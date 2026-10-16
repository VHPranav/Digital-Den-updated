import type { Metadata } from 'next';
import ServicesPage from '@/components/services/ServicesPage';

export const metadata: Metadata = {
  title: 'Services | Digital Den',
  description: 'Digital Den services for startups and partners.',
};

export default function Page() {
  return <ServicesPage />;
}
