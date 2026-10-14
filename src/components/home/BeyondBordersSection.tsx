'use client';

import React from 'react';
import { FadeIn } from '../FadeIn';
import SectionIntro from './SectionIntro';
import RegionMap from './RegionMap';
import { REGIONS } from './regionMapData';

// Approved countries/regions only: Montenegro (hub), Western Balkans, United States, Benelux,
// Jordan — filled in purple on a recognisable world map. No cities, no UK/France/Germany.
export default function BeyondBordersSection() {
  return (
    <section id="beyond-borders" className="w-full max-w-[1450px] mx-auto px-4 sm:px-8 lg:px-12">
      <SectionIntro
        eyebrow="Global Presence"
        align="center"
        title="Beyond Borders"
        lead="Connecting founders with international partners, markets and opportunities across key global hubs."
      />
      <FadeIn animation="fadeIn" delay={0.3} duration={1.4} className="mt-10 w-full">
        <RegionMap className="block h-auto w-full" />
      </FadeIn>
      {/* Phones: map labels would collide, so list the approved regions below the map */}
      <ul className="mt-6 flex flex-wrap justify-center gap-2 md:hidden">
        {REGIONS.map((r) => (
          <li key={r.id} className="flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-3.5 py-1.5 text-[13px] text-white/80">
            <span className="h-2 w-2 rounded-full bg-purple-400" />
            {r.name}
          </li>
        ))}
      </ul>
    </section>
  );
}
