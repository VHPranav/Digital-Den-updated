import type { Metadata } from 'next';
import EventsPage from '@/components/events/EventsPage';

export const metadata: Metadata = {
  title: 'Events | Digital Den',
  description:
    'Access exclusive venture workshops, networking mixers, and deep-dive technical loops within the Digital Den ecosystem.',
};

export default function Page() {
  return <EventsPage />;
}
