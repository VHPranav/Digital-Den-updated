'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { FadeIn } from './FadeIn';
import BorderGlow from './BorderGlow';

// Four entry points into the ecosystem (final approved copy). Not "pillars":
// the Platform page owns the three pillars. All four cards share one treatment
// (photo background + shade) for equal visual weight; cards 2 and 4 sit slightly
// lower on desktop. `position` = background crop focus.
const cards: { title: string; body: string; cta: string; href: string; image: string; position?: string }[] = [
  {
    title: 'Venture Building',
    body: 'Hands-on support that helps founders validate, structure and build stronger ventures ready for growth.',
    cta: 'See How We Build',
    href: '/platform',
    image: '/images/platform/building.jpg',
    position: '30% center',
  },
  {
    title: 'Programs',
    body: 'Startup readiness, acceleration and internationalization programs designed to move founders from early stage to global opportunity.',
    cta: 'Find Your Program',
    href: '/programs',
    image: '/images/firstimg.png',
  },
  {
    title: 'Opportunities',
    body: 'A matchmaking space connecting startup solutions with industry challenges, partners, investors and pilot opportunities.',
    cta: 'Discover Opportunities',
    href: '/opportunities',
    image: '/images/opportunities/featured-poster.jpg',
    position: '38% center',
  },
  {
    title: 'Global Network',
    body: 'Access strategic partners, mentors and market connections across Montenegro, the Western Balkans, Benelux, the United States, Jordan and beyond.',
    cta: 'Connect Globally',
    href: '/partners',
    image: '/images/platform/global.jpg',
    position: '64% center',
  },
];

export default function FourPillarsSection() {
  return (
    <section id="explore-digital-den" className="w-full max-w-[1450px] mx-auto px-4 sm:px-8 lg:px-12 space-y-6">
      <div className="mb-4 max-w-[440px]">
        <FadeIn animation="fadeIn" delay={0.1}>
          <h2
            className="font-medium text-3xl sm:text-4xl lg:text-[48px] leading-[105%] lg:mb-10 tracking-tight"
            style={{
              background: 'linear-gradient(90deg, #FFFFFF 0%, #FFFFFF 30%, #F3E8FF 45%, #D8B4FE 60%, #C084FC 75%, #A855F7 88%, #7E22CE 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Explore Digital Den
          </h2>
        </FadeIn>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
        {cards.map((card, i) => (
          <FadeIn
            key={card.href}
            animation="slideUp"
            delay={0.2 + i * 0.3}
            duration={1.2}
            className={i % 2 === 1 ? 'lg:translate-y-10' : undefined}
          >
            <BorderGlow
              borderRadius={24}
              backgroundColor="transparent"
              glowColor="270 80 80"
              colors={['#c084fc', '#f472b6', '#38bdf8']}
              glowRadius={35}
              className="h-full rounded-[24px]"
            >
              <Link
                href={card.href}
                className="group block relative h-[450px] sm:h-[463px] p-7 flex flex-col justify-between overflow-hidden shadow-2xl rounded-[24px] h-full w-full bg-cover"
                style={{ backgroundImage: `url('${card.image}')`, backgroundPosition: card.position ?? 'center' }}
              >
                <div className="flex items-center justify-end gap-2 text-white text-sm font-normal z-10">
                  <span className="opacity-90 group-hover:opacity-100 transition-opacity">{card.cta}</span>
                  <div className="w-8 h-8 rounded-full bg-white text-slate-950 flex items-center justify-center font-bold shadow-md group-hover:scale-105 transition-transform">
                    <ArrowUpRight className="w-4 h-4 text-slate-950" />
                  </div>
                </div>

                {/* Shade: dark at the bottom for the copy, light at the top for the CTA */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/35 z-0 rounded-[24px]" />

                <div className="space-y-2.5 z-10 relative">
                  <h3 className="font-['Plus_Jakarta_Sans',sans-serif] font-semibold text-2xl sm:text-3xl text-white tracking-tight leading-[109%]">
                    {card.title}
                  </h3>
                  <p className="font-normal text-sm sm:text-[15px] leading-[22px] text-white/90">{card.body}</p>
                </div>
              </Link>
            </BorderGlow>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
