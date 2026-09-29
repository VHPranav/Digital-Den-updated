import type { Metadata } from 'next';
import PlatformPage from '@/components/platform/PlatformPage';

export const metadata: Metadata = {
  title: 'The Den Model | Digital Den',
  description:
    "We don't just invest; we co-build. Our studio architecture is designed to de-risk innovation through shared infrastructure and concentrated expertise.",
};

export default function Page() {
  return <PlatformPage />;
}
