'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { ArrowLink, BgVideo, BlurWords, Pill, Reveal } from '@/components/site/editorial';
import PageShell from '@/components/site/PageShell';
import { useScrollProgress } from '@/components/events/motion';
import {
  founders,
  impactSlides,
  missionVision,
  operationalTeam,
  platformClosing,
  platformHero,
  platformTransition,
  type ImpactSlide,
  type TeamMember,
} from '@/lib/platformContent';

// Platform page (final order, Oct 2026): video hero → "One platform" transition → impact scroll →
// Mission & Vision → Team → Budva CTA → minimal footer. All copy/images live in
// src/lib/platformContent.ts.

const BG = 'bg-[#0b0b0c]';

/* ─── Impact scroll: one full-screen visual per metric, stacked on scroll ─── */

function ImpactPanel({ slide, index, total }: { slide: ImpactSlide; index: number; total: number }) {
  const [ref, progress] = useScrollProgress<HTMLDivElement>({ start: 1, end: 0.2 });
  return (
    <section className="sticky top-0 h-[100svh] overflow-hidden">
      <Image src={slide.image} alt="" fill sizes="100vw" className="object-cover" style={{ objectPosition: slide.position ?? 'center' }} />
      {/* Same dark fade on every slide so the metric stays readable and the images feel consistent */}
      <div className="absolute inset-0 bg-black/55" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/35" />
      <div ref={ref} className="absolute inset-x-0 bottom-0 mx-auto max-w-[1480px] px-6 pb-14 lg:px-10 lg:pb-20">
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
            <p className="mt-4 text-[clamp(1.25rem,2.2vw,2rem)] font-medium tracking-[-0.02em] text-white/90">{slide.label}</p>
            {slide.support && <p className="mt-3 text-[13px] uppercase tracking-[0.22em] text-white/65">{slide.support}</p>}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Hero headline: "Connecting" stays, the word after it blurs up in / out ─── */

const HERO_WORDS = ['ideas', 'people', 'markets'];

/** Letters blur up one after another (in) or blur up and away one after another (out). */
function Letters({ text, mode, baseDelay = 0, step = 0.05 }: { text: string; mode: 'in' | 'out'; baseDelay?: number; step?: number }) {
  return (
    <>
      {text.split('').map((ch, n) => (
        <span
          key={`${mode}-${n}`}
          className={`inline-block ${mode === 'in' ? 'dd-word-in' : 'dd-word-out'}`}
          style={{ animationDelay: `${baseDelay + n * step}s` }}
        >
          {ch}
        </span>
      ))}
    </>
  );
}

function RotatingHeadline() {
  const [i, setI] = useState(0);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const word = HERO_WORDS[i];
    const inTime = 0.8 + word.length * 0.05; // letters finish blurring in
    const outTime = 0.55 + word.length * 0.035; // letters finish blurring out
    const hold = setTimeout(() => setLeaving(true), (inTime + 1.8) * 1000);
    const swap = setTimeout(() => {
      setI((n) => (n + 1) % HERO_WORDS.length);
      setLeaving(false);
    }, (inTime + 1.8 + outTime) * 1000);
    return () => {
      clearTimeout(hold);
      clearTimeout(swap);
    };
  }, [i]);

  return (
    <h1 data-plain aria-label="Connecting ideas, people and markets" className="text-[clamp(2.4rem,6vw,5.75rem)] font-medium leading-[1] tracking-[-0.05em]">
      <span className="block" aria-hidden="true">
        <Letters text="Connecting" mode="in" baseDelay={0.2} step={0.045} />
      </span>
      <span className="block" aria-hidden="true">
        {/* Sized by the longest word so the line never jumps */}
        <span className="relative inline-block">
          <span className="invisible">markets</span>
          <span key={i} className="absolute left-0 top-0 whitespace-nowrap">
            <Letters text={HERO_WORDS[i]} mode={leaving ? 'out' : 'in'} baseDelay={i === 0 && !leaving ? 0.9 : 0} step={leaving ? 0.035 : 0.05} />
          </span>
        </span>
      </span>
    </h1>
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

function TeamGroup({ title, people }: { title: string; people: TeamMember[] }) {
  return (
    <div>
      <Reveal>
        <h3 className="text-[clamp(1.5rem,2.4vw,2.1rem)] font-medium tracking-[-0.03em] text-white">{title}</h3>
        <div className="mt-5 h-px w-full bg-gradient-to-r from-purple-400/50 via-white/10 to-transparent" />
      </Reveal>
      <ul className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
        {people.map((p, i) => (
          <li key={`${p.name}-${i}`}>
            <Reveal delay={(i % 4) * 0.08}>
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[20px] border border-white/10 bg-gradient-to-br from-[#2a1458] via-[#150b2b] to-[#0b0b0c]">
                {p.photo ? (
                  <Image src={p.photo} alt={p.name} fill sizes="(max-width: 768px) 46vw, 22vw" className="object-cover" />
                ) : (
                  <span className="absolute inset-0 flex items-center justify-center text-[11px] uppercase tracking-[0.22em] text-white/35">Photo</span>
                )}
              </div>
              <div className="mt-4 flex items-start justify-between gap-3">
                <div>
                  <p className="text-[16px] font-medium tracking-[-0.01em] text-white">{p.name}</p>
                  <p className="mt-1 text-[13px] leading-snug text-white/55">{p.role}</p>
                </div>
                {p.linkedin ? (
                  <a
                    href={p.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${p.name} on LinkedIn`}
                    className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/20 text-white/80 transition-colors hover:border-purple-300 hover:text-white"
                  >
                    <LinkedInIcon />
                  </a>
                ) : (
                  <span aria-hidden="true" className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 text-white/25">
                    <LinkedInIcon />
                  </span>
                )}
              </div>
            </Reveal>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ─── Page ─── */

export default function PlatformPage() {
  const { mission, vision } = missionVision;
  return (
    <PageShell minimalFooter>
      {(openAction) => (
        <div className={`${BG} text-[#f3f0ea]`}>
          {/* ─── 1. HERO VIDEO ─── */}
          <section className="relative h-[100svh] min-h-[600px] overflow-hidden">
            <BgVideo src={platformHero.video} poster={platformHero.poster} />
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/55" />
            <div className="absolute inset-x-0 bottom-0 mx-auto max-w-[1480px] px-6 pb-16 lg:px-10 lg:pb-20">
              <RotatingHeadline />
              <p className="mt-6 max-w-2xl text-[clamp(0.95rem,1.15vw,1.1rem)] leading-[1.6] text-white/80">{platformHero.body}</p>
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
                <p className="mt-1 text-[clamp(1.9rem,4.4vw,4.2rem)] font-light leading-[1.05] tracking-[-0.04em] text-white/90">
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
                    <p className="text-[13px] uppercase tracking-[0.3em] text-white/55">{data.label}</p>
                    <h2 className="mt-6 text-[clamp(2.75rem,5vw,4.75rem)] font-light leading-[1] tracking-[-0.04em]">
                      {data.titleLine1}
                      <br />
                      <span className={accent}>{data.titleLine2}</span>
                    </h2>
                    <p className="mt-8 max-w-[34rem] text-[16px] leading-[1.65] text-white/80">{data.body}</p>
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
              <TeamGroup title="Operational Team" people={operationalTeam} />
              <TeamGroup title="Founders" people={founders} />
            </div>
          </section>

          {/* ─── 6. FINAL CTA VIDEO (Budva) ─── */}
          <section className="relative z-10 h-[88svh] min-h-[560px] overflow-hidden">
            <BgVideo src={platformClosing.video} poster={platformClosing.poster} />
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute inset-x-6 bottom-10 lg:bottom-14 lg:left-10 lg:right-auto lg:w-[34rem]">
              <Reveal>
                <h2 className="text-[clamp(1.75rem,2.8vw,2.6rem)] font-medium leading-[1.08] tracking-[-0.035em]">{platformClosing.title}</h2>
                <p className="mt-4 max-w-md text-[14px] leading-[1.6] text-white/80">{platformClosing.body}</p>
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
        </div>
      )}
    </PageShell>
  );
}
