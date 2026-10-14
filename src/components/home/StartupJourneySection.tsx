'use client';

import React, { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import SectionIntro from './SectionIntro';

// Startup Journey (agreed Master Brief section): Idea → Build → Validate → Scale → Global.
// A wave path draws on scroll and each stage lights up as the path reaches it.
const stages = [
  { title: 'Idea', body: 'Validation of innovation concepts with global potential.' },
  { title: 'Build', body: 'Hands-on architecture, design, strategy and development support.' },
  { title: 'Validate', body: 'Program testing, mentorship and real-market scenarios.' },
  { title: 'Scale', body: 'Operational support and access to growth opportunities.' },
  { title: 'Global', body: 'Access to international markets, strategic partners and soft-landing opportunities.' },
];

// Wave through the five stage points (x = 10%, 30% … 90% of the row), alternating high/low.
const VB_H = 140;
const POINT_Y = [100, 40, 100, 40, 100];
const WAVE = 'M 100 100 C 200 100, 200 40, 300 40 S 400 100, 500 100 S 600 40, 700 40 S 800 100, 900 100';

export default function StartupJourneySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const apply = (p: number) => {
      pathRef.current?.style.setProperty('stroke-dashoffset', String(1 - p));
      railRef.current?.style.setProperty('transform', `scaleY(${p})`);
      // Stage i is reached when the drawn path passes its point (i / 4 along the wave).
      const reached = stages.filter((_, i) => p >= (i / (stages.length - 1)) * 0.96).length;
      setActive((prev) => (prev === reached ? prev : reached));
    };

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      apply(1);
      return;
    }

    apply(0);
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top 65%',
        end: 'bottom 75%',
        scrub: 0.6,
        onUpdate: (self) => apply(self.progress),
      });
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="startup-journey" className="w-full max-w-[1450px] mx-auto px-4 sm:px-8 lg:px-12">
      <SectionIntro
        title="From Idea to Global"
        lead="From first idea to global opportunity, we support founders through every stage of startup growth."
      />

      {/* Desktop: wave path with stages beneath each point */}
      <div className="relative mt-14 hidden lg:block">
        <div className="relative h-[140px]">
          <svg viewBox={`0 0 1000 ${VB_H}`} preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
            <defs>
              <linearGradient id="journey-stroke" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#38bdf8" />
              </linearGradient>
            </defs>
            <path d={WAVE} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
            <path
              ref={pathRef}
              d={WAVE}
              fill="none"
              stroke="url(#journey-stroke)"
              strokeWidth={2.5}
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1}
              style={{ filter: 'drop-shadow(0 0 8px rgba(168,85,247,0.55))' }}
            />
          </svg>
          {stages.map((s, i) => (
            <span
              key={s.title}
              className={`absolute h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border transition-all duration-500 ${
                i < active
                  ? 'scale-110 border-purple-200 bg-purple-400 shadow-[0_0_18px_rgba(168,85,247,0.9)]'
                  : 'border-white/30 bg-den'
              }`}
              style={{ left: `${10 + i * 20}%`, top: `${(POINT_Y[i] / VB_H) * 100}%` }}
              aria-hidden="true"
            />
          ))}
        </div>

        <ol className="mt-6 grid grid-cols-5 gap-6">
          {stages.map((s, i) => (
            <li
              key={s.title}
              className={`text-center transition-all duration-700 ${i < active ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-30'}`}
            >
              <span className="text-xs tabular-nums text-purple-200/80">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="mt-1 font-['Plus_Jakarta_Sans',sans-serif] text-xl font-semibold tracking-tight text-white">{s.title}</h3>
              <p className="mx-auto mt-2 max-w-[220px] text-sm leading-[1.55] text-white/65">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>

      {/* Tablet/mobile: vertical rail that fills on scroll */}
      <div className="relative mt-10 pl-8 lg:hidden">
        <span className="absolute left-[7px] top-1 bottom-1 w-px bg-white/12" aria-hidden="true" />
        <div
          ref={railRef}
          className="absolute left-[6px] top-1 bottom-1 w-[3px] origin-top rounded-full bg-gradient-to-b from-purple-500 to-sky-400"
          style={{ transform: 'scaleY(0)' }}
          aria-hidden="true"
        />
        <ol className="space-y-8">
        {stages.map((s, i) => (
          <li key={s.title} className={`relative transition-opacity duration-700 ${i < active ? 'opacity-100' : 'opacity-35'}`}>
            <span
              className={`absolute -left-8 top-1.5 h-3.5 w-3.5 rounded-full border transition-all duration-500 ${
                i < active ? 'border-purple-200 bg-purple-400 shadow-[0_0_14px_rgba(168,85,247,0.9)]' : 'border-white/30 bg-den'
              }`}
              aria-hidden="true"
            />
            <span className="text-xs tabular-nums text-purple-200/80">{String(i + 1).padStart(2, '0')}</span>
            <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-lg font-semibold tracking-tight text-white">{s.title}</h3>
            <p className="mt-1 text-sm leading-[1.55] text-white/65">{s.body}</p>
          </li>
        ))}
        </ol>
      </div>
    </section>
  );
}
