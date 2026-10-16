'use client';

import React, { useEffect, useRef, useState } from 'react';
import SectionIntro from './SectionIntro';

// Startup Journey (agreed Master Brief section): Idea → Build → Validate → Scale → Global.
// A glowing rising line through all five stages that draws on scroll and ends fully drawn,
// lighting each stage as the line reaches it (per the client's reference).
const stages = [
  { title: 'Idea', body: 'Validation of innovation concepts with global potential.', color: '#a855f7' },
  { title: 'Build', body: 'Hands-on architecture, design, strategy and development support.', color: '#8b7cf6' },
  { title: 'Validate', body: 'Program testing, mentorship and real-market scenarios.', color: '#6c9bf8' },
  { title: 'Scale', body: 'Operational support and access to growth opportunities.', color: '#4cb4f5' },
  { title: 'Global', body: 'Access to international markets, strategic partners and soft-landing opportunities.', color: '#22d3ee' },
];

// Rising path through the five stage points (x = 10%, 30% … 90% of the row) with tails running
// past both ends. Each stage sits higher than the last (Idea lowest, Global highest); flat
// tangents at every point keep the curve monotonic so it never dips.
const VB_H = 160;
const POINT_Y = [135, 108, 80, 52, 24];
const WAVE = 'M 0 142 C 40 142, 60 135, 100 135 C 200 135, 200 108, 300 108 S 400 80, 500 80 S 600 52, 700 52 S 800 24, 900 24 S 960 14, 1000 12';

export default function StartupJourneySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const glowRef = useRef<SVGPathElement>(null);
  const railRef = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const apply = (p: number) => {
      pathRef.current?.style.setProperty('stroke-dashoffset', String(1 - p));
      glowRef.current?.style.setProperty('stroke-dashoffset', String(1 - p));
      railRef.current?.style.setProperty('transform', `scaleY(${p})`);
      // Stage i is reached once the drawn line passes its point (x = 10% … 90% of the path).
      const reached = stages.filter((_, i) => p >= 0.1 + i * 0.2 - 0.02).length;
      setActive((prev) => (prev === reached ? prev : reached));
    };

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      apply(1);
      return;
    }

    // Progress is read straight from the section's live position (no cached trigger offsets, so
    // layout shifts above can't leave it stuck): 0 when its top is at 80% of the viewport height,
    // 1 once its top reaches 25%. A light ease keeps the draw smooth.
    let target = 0;
    let current = 0;
    let raf = 0;
    const measure = () => {
      const vh = window.innerHeight;
      const top = section.getBoundingClientRect().top;
      target = Math.min(1, Math.max(0, (vh * 0.8 - top) / (vh * 0.55)));
    };
    const tick = () => {
      current += (target - current) * 0.15;
      if (Math.abs(target - current) < 0.002) current = target;
      apply(current);
      raf = requestAnimationFrame(tick);
    };
    apply(0);
    measure();
    window.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('resize', measure);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', measure);
      window.removeEventListener('resize', measure);
    };
  }, []);

  return (
    <section ref={sectionRef} id="startup-journey" className="w-full max-w-[1450px] mx-auto px-4 sm:px-8 lg:px-12">
      <SectionIntro
        eyebrow="Startup Journey"
        title="From Idea to Global"
        lead="From first idea to global opportunity, we support founders through every stage of startup growth."
      />

      {/* Desktop: fully drawn rising line with a dashed drop to each stage */}
      <div className="relative mt-14 hidden lg:block">
        <div className="relative h-[160px]">
          <svg viewBox={`0 0 1000 ${VB_H}`} preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
            <defs>
              <linearGradient id="journey-stroke" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="#a855f7" stopOpacity="0" />
                <stop offset="10%" stopColor="#a855f7" />
                <stop offset="50%" stopColor="#6c9bf8" />
                <stop offset="90%" stopColor="#22d3ee" />
                <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={WAVE} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
            <path
              ref={glowRef}
              d={WAVE}
              fill="none"
              stroke="url(#journey-stroke)"
              strokeWidth={5}
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1}
              opacity={0.25}
              style={{ filter: 'blur(6px)' }}
            />
            <path
              ref={pathRef}
              d={WAVE}
              fill="none"
              stroke="url(#journey-stroke)"
              strokeWidth={2}
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1}
            />
          </svg>
          {stages.map((s, i) => (
            <React.Fragment key={s.title}>
              {/* dashed drop from the node to its number */}
              <span
                className={`absolute w-px -translate-x-1/2 border-l border-dashed transition-opacity duration-700 ${i < active ? 'opacity-40' : 'opacity-0'}`}
                style={{ left: `${10 + i * 20}%`, top: `${(POINT_Y[i] / VB_H) * 100}%`, bottom: 0, borderColor: s.color }}
                aria-hidden="true"
              />
              <span
                className={`absolute flex h-5 w-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full transition-all duration-500 ${i < active ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}
                style={{
                  left: `${10 + i * 20}%`,
                  top: `${(POINT_Y[i] / VB_H) * 100}%`,
                  background: `${s.color}33`,
                  boxShadow: `0 0 22px ${s.color}`,
                }}
                aria-hidden="true"
              >
                <span className="h-2.5 w-2.5 rounded-full border-2 bg-white" style={{ borderColor: s.color }} />
              </span>
            </React.Fragment>
          ))}
        </div>

        <ol className="mt-6 grid grid-cols-5 gap-6">
          {stages.map((s, i) => (
            <li key={s.title} className={`text-center transition-all duration-700 ${i < active ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-30'}`}>
              <span className="text-xs tabular-nums" style={{ color: s.color }}>{String(i + 1).padStart(2, '0')}</span>
              <h3 className="mt-1 font-['Plus_Jakarta_Sans',sans-serif] text-xl font-semibold tracking-tight text-white">{s.title}</h3>
              <p className="mx-auto mt-2 max-w-[220px] text-sm leading-[1.55] text-white/65">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>

      {/* Tablet/mobile: vertical rail, fully filled */}
      <div className="relative mt-10 pl-8 lg:hidden">
        <span className="absolute left-[7px] top-1 bottom-1 w-px bg-white/10" aria-hidden="true" />
        <span
          ref={railRef}
          className="absolute left-[6px] top-1 bottom-1 w-[3px] origin-top rounded-full bg-gradient-to-b from-purple-500 to-cyan-400"
          style={{ transform: 'scaleY(0)' }}
          aria-hidden="true"
        />
        <ol className="space-y-8">
          {stages.map((s, i) => (
            <li key={s.title} className={`relative transition-opacity duration-700 ${i < active ? 'opacity-100' : 'opacity-35'}`}>
              <span
                className="absolute -left-8 top-1.5 h-3.5 w-3.5 rounded-full border-2 bg-white"
                style={{ borderColor: s.color, boxShadow: `0 0 14px ${s.color}` }}
                aria-hidden="true"
              />
              <span className="text-xs tabular-nums" style={{ color: s.color }}>{String(i + 1).padStart(2, '0')}</span>
              <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-lg font-semibold tracking-tight text-white">{s.title}</h3>
              <p className="mt-1 text-sm leading-[1.55] text-white/65">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
