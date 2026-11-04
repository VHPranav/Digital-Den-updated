import type { Metadata } from 'next';
import PlatformPage from '@/components/platform/PlatformPage';
import { getPlatformPageContent } from '@/lib/sitePagesSanity';

export const metadata: Metadata = {
  title: 'Platform | Digital Den',
  description:
    'Digital Den brings together programs, expert support, strategic partnerships, access to capital and international market connections.',
};

export default async function Page() {
  const content = await getPlatformPageContent();
  return <PlatformPage content={content} />;
}
