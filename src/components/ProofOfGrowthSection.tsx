'use client';

import React from 'react';
import Link from 'next/link';
import { ExternalLink, Globe } from 'lucide-react';
import { FadeIn } from './FadeIn';
import DottedWorldMap, { type City } from './partners/DottedWorldMap';

// Countries/regions connected to the Montenegro hub on the dotted map.
const HOME_HUBS: City[] = [
  { name: 'United States', lat: 39.5, lng: -98.35 },
  { name: 'Benelux', lat: 50.8, lng: 4.9 },
  { name: 'Jordan', lat: 31.2, lng: 36.5, label: 'left-down' },
];

export default function ProofOfGrowthSection() {
  return (
    <section className="w-full max-w-[1450px] mx-auto px-4 sm:px-8 lg:px-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Copy Column */}
        <div className="space-y-6 text-left lg:col-span-5">
          <div className="space-y-3">
            <FadeIn animation="fadeIn" delay={0.1}>
              <span className="text-xs font-semibold uppercase tracking-widest text-purple-300 bg-purple-500/10 border border-purple-500/20 px-3.5 py-1.5 rounded-full inline-flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
                Proof of Growth & Beyond Borders
              </span>
            </FadeIn>
            <FadeIn animation="fadeIn" delay={0.2}>
              <h2
                className="text-3xl sm:text-4xl lg:text-[44px] leading-[118%] font-medium tracking-tight"
                style={{
                  background: 'linear-gradient(90deg, #FFFFFF 0%, #FFFFFF 30%, #F3E8FF 45%, #D8B4FE 60%, #C084FC 75%, #A855F7 88%, #7E22CE 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Connecting Founders Across Key Global Hubs
              </h2>
            </FadeIn>
          </div>

          <FadeIn animation="fadeIn" delay={0.3}>
            <p className="text-slate-300 text-sm sm:text-base font-normal leading-relaxed">
              Startups that turned potential into investment, revenue, clients and international market presence across Montenegro, the Western Balkans, US, Jordan and Benelux.
            </p>
          </FadeIn>


          <div className="pt-2">
            <Link
              href="/portfolio"
              className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs uppercase tracking-wider border border-white/20 transition-all flex items-center gap-2 w-fit group hover:border-purple-400/40 shadow-lg"
            >
              <span>Explore Full Portfolio</span>
              <ExternalLink className="w-4 h-4 text-purple-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Right: live dotted network map */}
        <FadeIn animation="fadeIn" delay={0.4} duration={1.4} className="relative w-full aspect-[2/1] lg:col-span-7">
          <DottedWorldMap cities={HOME_HUBS} fit="contain" dotColor="rgba(178, 120, 255, 0.85)" parallax={false} className="absolute inset-0" />
        </FadeIn>
      </div>
    </section>
  );
}
