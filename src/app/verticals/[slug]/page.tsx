import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import VerticalPage from '@/components/verticals/VerticalPage';
import { getVertical, verticals } from '@/components/verticals/data';

export const dynamicParams = false;

export function generateStaticParams() {
  return verticals.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<'/verticals/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const vertical = getVertical(slug);
  if (!vertical) return {};
  return {
    title: `${vertical.name} Vertical | Digital Den`,
    description: vertical.intro,
  };
}

export default async function Page({ params }: PageProps<'/verticals/[slug]'>) {
  const { slug } = await params;
  const vertical = getVertical(slug);
  if (!vertical) notFound();
  return <VerticalPage slug={vertical.slug} />;
}
