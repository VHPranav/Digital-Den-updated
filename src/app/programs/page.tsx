import type { Metadata } from 'next';
import ProgramsPage from '@/components/programs/ProgramsPage';

export const metadata: Metadata = {
  title: 'Startup Programs | Digital Den',
  description:
    "We bridge the gap between visionary founders and the world's most aggressive markets. Our programs are designed to accelerate readiness and forge institutional connections.",
};

export default function Page() {
  return <ProgramsPage />;
}
