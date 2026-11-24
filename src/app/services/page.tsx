import type { Metadata } from 'next';
import ServicesPage from '@/components/services/ServicesPage';
import { getServicesPageContent } from '@/lib/sitePagesSanity';

export const metadata: Metadata = {
  title: 'Services | Digital Den',
  description: 'Tailored support for startup setup, growth and investment readiness, corporate innovation, and international market entry.',
};

export default async function Page() {
  const content = await getServicesPageContent();
  return <ServicesPage content={content} />;
}
