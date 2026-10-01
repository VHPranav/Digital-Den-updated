import type { Metadata } from 'next';
import ProjectsPage from '@/components/projects/ProjectsPage';

export const metadata: Metadata = {
  title: 'Projects | Digital Den',
  description:
    'Pilots, market bridges and sector initiatives Digital Den runs with institutions, corporates and founders.',
};

export default function Page() {
  return <ProjectsPage />;
}
