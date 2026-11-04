import type { Metadata } from 'next';
import ProgramsPage from '@/components/programs/ProgramsPage';
import { getProgramsPageCopy } from '@/lib/sitePagesSanity';
import { getProgramsContent } from '@/lib/programsSanity';

export const metadata: Metadata = {
  title: 'Startup Programs | Digital Den',
  description: 'From readiness and acceleration to international market access, Digital Den programs help founders strengthen their businesses, connect with the right expertise and build pathways to new markets.',
};

export default async function Page() {
  const [{ programs, projects }, copy] = await Promise.all([getProgramsContent(), getProgramsPageCopy()]);
  return <ProgramsPage programs={programs} projects={projects} copy={copy} />;
}
