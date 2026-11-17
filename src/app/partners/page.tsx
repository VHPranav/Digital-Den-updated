import type { Metadata } from 'next';
import PartnersPage from '@/components/partners/PartnersPage';
import { getPartners } from '@/lib/partners';

export const metadata: Metadata = {
  title: 'Partners | Digital Den',
  description:
    'A borderless infrastructure that connects local innovation with global capital through regulatory, financial and technical partners.',
};

export default async function Page() {
  return <PartnersPage partners={await getPartners()} />;
}
