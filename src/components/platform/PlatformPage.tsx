'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ArrowLink, BgVideo, BlurWords, Pill, Reveal } from '@/components/site/editorial';
import PageShell from '@/components/site/PageShell';
import { MinimalFooter } from '@/components/Footer';
import { useScrollProgress } from '@/components/events/motion';
import { defaultPlatformPage, type PlatformPageContent } from '@/lib/sitePagesSanity';
import type { ImpactSlide, TeamMember } from '@/lib/platformContent';

// Platform page (final order, Oct 2026): video hero → "One platform" transition → impact scroll →
// Mission & Vision → Team → Budva CTA → minimal footer. All copy/images live in
// src/lib/platformContent.ts.

const BG = 'bg-[#0b0b0c]';

/* ─── Impact scroll: one full-screen visual per metric, stacked on scroll ─── */

function ImpactPanel({ slide, index, total }: { slide: ImpactSlide; index: number; total: number }) {
  const [ref, progress] = useScrollProgress<HTMLDivElement>({ start: 1, end: 0.2 });
  return (
    <section data-impact-panel className="sticky top-0 h-[100svh] min-h-[480px] overflow-hidden">
      <div className="absolute inset-0">
        <Image src={slide.image} alt="" fill sizes="100vw" className="object-cover" style={{ objectPosition: slide.position ?? 'center' }} />
      </div>
      {/* Same dark fade on every slide so the metric stays readable and the images feel consistent */}
      <div className="absolute inset-0 bg-black/55" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/35" />
      <div ref={ref} data-impact-content data-noreveal className="absolute inset-x-0 top-1/2 mx-auto max-w-[1480px] -translate-y-1/2 px-6 lg:px-10">
        <div className="relative h-px w-full bg-white/20">
          <span className="absolute inset-y-0 left-0 bg-white" style={{ width: `${Math.max(12, progress * 100)}%`, transition: 'width 120ms linear' }} />
        </div>
        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="flex items-start gap-2 text-white/85 lg:col-span-1">
            <Pill>{String(index + 1).padStart(2, '0')}</Pill>
            <span className="text-xs">/</span>
            <Pill>{String(total).padStart(2, '0')}</Pill>
          </div>
          <div className="lg:col-span-11">
            <h3 className="text-[clamp(4.5rem,15vw,13rem)] font-medium leading-[0.88] tracking-[-0.06em]">{slide.metric}</h3>
            <p className="mt-4 text-white/90 text-[clamp(1.25rem,2.2vw,2rem)] font-medium tracking-[-0.02em]">{slide.label}</p>
            {slide.support && <p className="mt-3 uppercase text-white/65 text-[13px] tracking-[0.22em]">{slide.support}</p>}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Team ─── */

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
      <path d="M20.4 20.5h-3.6v-5.6c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9v5.7H9.3V9h3.4v1.6h.1c.5-.9 1.6-1.8 3.4-1.8 3.6 0 4.3 2.4 4.3 5.5v6.2zM5.3 7.4a2.1 2.1 0 1 1 0-4.2 2.1 2.1 0 0 1 0 4.2zM7.1 20.5H3.6V9h3.5v11.5zM22.2 0H1.8C.8 0 0 .8 0 1.7v20.6c0 .9.8 1.7 1.8 1.7h20.4c1 0 1.8-.8 1.8-1.7V1.7C24 .8 23.2 0 22.2 0z" />
    </svg>
  );
}

const REFERENCE_PORTRAITS = [
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=85',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=85',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=85',
  'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=800&q=85',
];

function TeamGroup({ title, people, centered = false }: { title: string; people: TeamMember[]; centered?: boolean }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  if (!people.length) return null;
  return (
    <div className="dd-team-group">
      <Reveal><h2 className="text-center text-[clamp(2.25rem,4.5vw,4.5rem)] font-medium leading-none tracking-[-0.045em]">{title}</h2></Reveal>
      <div className={centered ? 'dd-team-cards dd-team-cards-centered' : 'dd-team-cards'} onMouseLeave={() => setActiveIndex(null)}>
        {people.map((person, i) => (
          <article key={`${person.name}-${i}`} className={`dd-team-card ${activeIndex === i ? 'is-active' : ''}`} onMouseEnter={() => setActiveIndex(i)} onFocus={() => setActiveIndex(i)} onBlur={() => setActiveIndex(null)} tabIndex={0} aria-label={`${person.name}, ${person.role}`}>
            <Image src={person.photo || REFERENCE_PORTRAITS[i % REFERENCE_PORTRAITS.length]} alt={person.photo ? person.name : 'Temporary reference portrait'} fill sizes="(max-width: 640px) 80vw, (max-width: 1024px) 45vw, 25vw" className="dd-team-portrait" />
            <div className="dd-team-shade" />
            <div className="dd-team-info">
              <div className="dd-team-grid" aria-hidden="true" />
              <div className="relative z-10">
                <h3 className="text-[clamp(1.2rem,1.8vw,1.8rem)] font-medium tracking-[-0.035em]">{person.name}</h3>
                <p className="mt-2 text-white/65 text-[14px] leading-[1.6]">{person.role}</p>
                <div className="dd-team-extra">
                  {!person.photo && <p className="uppercase text-white/45 text-[13px] leading-relaxed">Reference image</p>}
                  {person.linkedin && <a href={person.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${person.name} on LinkedIn`} className="ml-auto inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/30 hover:bg-white/15"><LinkedInIcon /></a>}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

/* ─── Page ─── */

export default function PlatformPage({ content = defaultPlatformPage }: { content?: PlatformPageContent }) {
  const { hero: platformHero, transition: platformTransition, impact: impactSlides, missionVision, operationalTeam, founders, closing: platformClosing } = content;
  const { mission, vision } = missionVision;
  return (
    <PageShell hideFooter>
      {(openAction) => (
        <div className={`${BG} text-[#f3f0ea]`}>
          {/* ─── 1. HERO VIDEO ─── */}
          <section className="relative h-[100svh] min-h-[600px] overflow-hidden">
            <div className="absolute inset-0 [&>video]:object-[35%_center]">
              <BgVideo src={platformHero.video} poster={platformHero.poster} />
            </div>
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 mx-auto max-w-[1480px] px-6 pb-16 lg:px-10 lg:pb-20">
              <h1 data-plain className="max-w-[11em] text-balance text-[clamp(2.4rem,6vw,5.75rem)] font-medium leading-[1] tracking-[-0.05em]">
                {platformHero.headline.trim().replace(/\.$/, '')}
              </h1>
              <p className="mt-6 max-w-2xl text-white/80 text-[clamp(0.95rem,1.15vw,1.1rem)] leading-[1.6]">{platformHero.body}</p>
              <div className="mt-8 flex flex-wrap gap-8">
                <ArrowLink onClick={openAction}>{platformHero.primaryCta}</ArrowLink>
                <ArrowLink href={platformHero.secondaryCta.href}>{platformHero.secondaryCta.label}</ArrowLink>
              </div>
            </div>
          </section>

          {/* ─── 2. TRANSITION STATEMENT ─── */}
          <section className={`${BG} relative z-10 flex min-h-[100svh] flex-col justify-center overflow-hidden px-6 lg:px-10`}>
            <div className="relative z-10 mx-auto w-full max-w-[1480px]">
              <Reveal>
                <p className="text-[clamp(2.4rem,5.2vw,5rem)] font-medium leading-[1.02] tracking-[-0.045em]">{platformTransition.line1}</p>
                <p className="mt-1 text-white/90 text-[clamp(1.9rem,4.4vw,4.2rem)] font-light leading-[1.05] tracking-[-0.04em]">
                  {platformTransition.line2Before} <span className="font-medium text-purple-400">{platformTransition.line2Accent}</span>
                </p>
              </Reveal>
            </div>

            {/* Purple → turquoise wave */}
            <svg className="pointer-events-none absolute inset-x-0 bottom-[18%] h-[26vh] w-full" viewBox="0 0 1440 260" preserveAspectRatio="none" aria-hidden="true">
              <defs>
                <linearGradient id="platform-wave" x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0%" stopColor="#a855f7" stopOpacity="0.1" />
                  <stop offset="25%" stopColor="#a855f7" />
                  <stop offset="65%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.15" />
                </linearGradient>
              </defs>
              <path d="M0 150 C 220 60, 420 70, 640 130 S 1040 215, 1220 140 S 1380 90, 1440 110" fill="none" stroke="url(#platform-wave)" strokeWidth="6" opacity="0.25" style={{ filter: 'blur(8px)' }} />
              <path d="M0 150 C 220 60, 420 70, 640 130 S 1040 215, 1220 140 S 1380 90, 1440 110" fill="none" stroke="url(#platform-wave)" strokeWidth="2" strokeLinecap="round" />
            </svg>

            <div className="absolute inset-x-0 bottom-10 flex flex-col items-center gap-3 text-[11px] uppercase tracking-[0.3em] text-white/55">
              <span className="relative h-10 w-px overflow-hidden bg-white/15">
                <span className="absolute inset-x-0 top-0 h-4 animate-bounce bg-gradient-to-b from-purple-300 to-transparent" />
              </span>
              {platformTransition.scrollLabel}
            </div>
          </section>

          {/* ─── 3. IMPACT SCROLL ─── */}
          <div className="relative">
            {impactSlides.map((s, i) => (
              <ImpactPanel key={s.metric} slide={s} index={i} total={impactSlides.length} />
            ))}
          </div>

          {/* ─── 4. MISSION & VISION (static two columns) ─── */}
          <section className={`${BG} relative z-10 overflow-hidden py-28 lg:py-40`}>
            <div className="relative mx-auto grid max-w-[1320px] grid-cols-1 gap-20 px-6 lg:grid-cols-2 lg:gap-0 lg:px-10">
              <span aria-hidden="true" className="absolute bottom-0 left-1/2 top-0 hidden w-px bg-gradient-to-b from-transparent via-white/20 to-transparent lg:block" />

              {[
                { data: mission, accent: 'text-purple-400' },
                { data: vision, accent: 'text-violet-400' },
              ].map(({ data, accent }, i) => (
                <div key={data.label} className={i === 0 ? 'lg:pr-20' : 'lg:pl-20'}>
                  <Reveal delay={i * 0.1}>
                    <p className="uppercase text-white/55 text-[13px] tracking-[0.3em]">{data.label}</p>
                    <h2 className="mt-6 text-[clamp(2.75rem,5vw,4.75rem)] font-light leading-[1] tracking-[-0.04em]">
                      {data.titleLine1}
                      <br />
                      <span className={accent}>{data.titleLine2}</span>
                    </h2>
                    <p className="mt-8 max-w-[34rem] text-white/80 text-[16px] leading-[1.65]">{data.body}</p>
                  </Reveal>
                </div>
              ))}
            </div>

            {/* Curves: purple glow under Mission, turquoise under Vision */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-[34%]">
              <div className="absolute -left-[12%] top-[35%] aspect-square w-[62%] rounded-full border-t border-purple-400/70 shadow-[0_-12px_60px_rgba(168,85,247,0.35)]" />
              <div className="absolute -right-[12%] top-[40%] aspect-square w-[62%] rounded-full border-t border-cyan-300/60 shadow-[0_-12px_60px_rgba(34,211,238,0.28)]" />
            </div>
          </section>

          {/* ─── 5. TEAM ─── */}
          <section className={`${BG} relative z-10 py-24 lg:py-32`}>
            <div className="mx-auto max-w-[1480px] space-y-24 px-6 lg:space-y-32 lg:px-10">
              <TeamGroup title={content.teamTitleOperational} people={operationalTeam} />
              <TeamGroup title={content.teamTitleFounders} people={founders} centered />
            </div>
          </section>

          {/* ─── 6. FINAL CTA VIDEO (Budva) ─── */}
          <div className="platform-ending">
          <section className="platform-ending-cta relative z-10 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden [&>video]:origin-left [&>video]:scale-[1.12] [&>video]:object-left">
              <BgVideo src={platformClosing.video} poster={platformClosing.poster} />
            </div>
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute inset-x-6 bottom-10 lg:bottom-14 lg:left-10 lg:right-auto lg:w-[44rem]">
              <Reveal>
                <h2 className="text-[clamp(2.25rem,3.8vw,3.75rem)] font-medium leading-[1.08] tracking-[-0.035em]">{platformClosing.title}</h2>
                <p className="mt-5 max-w-xl text-[clamp(1rem,1.3vw,1.2rem)] leading-[1.6] text-white/80">{platformClosing.body}</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={openAction}
                    className="h-[46px] rounded-[12px] bg-white px-6 text-[14px] font-semibold text-black transition-transform hover:scale-[1.03]"
                  >
                    {platformClosing.primaryCta}
                  </button>
                  <button
                    type="button"
                    onClick={openAction}
                    className="h-[46px] rounded-[12px] border border-white/40 px-6 text-[14px] font-semibold text-white backdrop-blur-sm transition-all hover:border-white hover:bg-white/10"
                  >
                    {platformClosing.secondaryCta}
                  </button>
                </div>
              </Reveal>
            </div>
          </section>
          <div data-footer className="relative z-20 shrink-0"><MinimalFooter /></div>
          </div>
        </div>
      )}
    </PageShell>
  );
}
