'use client';

import React from 'react';
import { FadeIn } from '../FadeIn';
import SectionIntro from './SectionIntro';
import DottedWorldMap, { type City } from '../partners/DottedWorldMap';

// Approved countries/regions only (Montenegro is the map hub). No cities, no UK/France/Germany.
const REGIONS: City[] = [
  { name: 'Western Balkans', lat: 44.6, lng: 18.2, label: 'left-up' },
  { name: 'United States', lat: 39.5, lng: -98.35 },
  { name: 'Benelux', lat: 50.8, lng: 4.9, label: 'left-up' },
  { name: 'Jordan', lat: 31.2, lng: 36.5, label: 'left-down' },
];

export default function BeyondBordersSection() {
  return (
    <section id="beyond-borders" className="w-full max-w-[1450px] mx-auto px-4 sm:px-8 lg:px-12">
      <SectionIntro
        eyebrow="Global Presence"
        align="center"
        title="Beyond Borders"
        lead="Connecting founders with international partners, markets and opportunities across key global hubs."
      />
      <FadeIn animation="fadeIn" delay={0.3} duration={1.4} className="relative mt-10 w-full aspect-[2/1]">
        <DottedWorldMap cities={REGIONS} fit="contain" dotColor="rgba(178, 120, 255, 0.85)" parallax={false} className="absolute inset-0" />
      </FadeIn>
    </section>
  );
}
