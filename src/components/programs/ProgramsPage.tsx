'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { ArrowUpRight, Lock } from 'lucide-react';
import PageShell from '@/components/site/PageShell';
import SplitWords from '@/components/site/SplitWords';
import { ArrowLink, BgVideo, BlurWords, EASE, PAGE_BG, Pill, Reveal } from '@/components/site/editorial';
import { ScrubText } from '@/components/events/motion';
import { useInView } from '@/hooks/use-in-view';

// Content sourced from the Stitch "Programs" screen. Shares the pinned video
// hero with Platform, then diverges: a hover-driven program index with a
// sticky crossfading photo, a full-bleed video stats band and a closing CTA.

type Status = 'open' | 'ongoing' | 'closed';
type Filter = 'all' | 'open' | 'ongoing' | 'archive';

const programs: {
  id: string;
  status: Status;
  title: string;
  region: string;
  body: string;
  tags: string[];
  image: string;
}[] = [
  {
    id: 'acceleration',
    status: 'open',
    title: 'Startup Readiness Program',
    region: 'Hybrid',
    body: 'A rigorous 12-week intensive focused on product-market fit, capital strategy, and investor readiness for early-stage tech founders.',
    tags: ['Seed to Series A', 'Hybrid', 'Equity-free'],
    image: '/images/programs/readiness.jpg',
  },
  {
    id: 'mtsb-europe',
    status: 'ongoing',
    title: 'MTSB Europe',
    region: 'Berlin · Paris',
    body: "The Master's in Tech & Sustainable Business. A partnership program across Berlin and Paris focusing on circular economy solutions.",
    tags: ['Academic + Venture', 'EU Markets'],
    image: '/images/programs/europe.jpg',
  },
  {
    id: 'mtsb-us',
    status: 'closed',
    title: 'MTSB US',
    region: 'San Francisco',
    body: 'Silicon Valley immersion for European scale-ups. Focused on transatlantic growth and institutional fundraising in the US market.',
    tags: ['Series A+', 'San Francisco'],
    image: '/images/programs/us.jpg',
  },
  {
    id: 'jordan',
    status: 'open',
    title: 'Jordan Program',
    region: 'Amman · MENA',
    body: 'Fostering regional innovation through our MENA-focused accelerator. Empowering local talent with global mentorship.',
    tags: ['MENA Region', 'In-person'],
    image: '/images/programs/jordan.jpg',
  },
];

const statusMeta: Record<Status, { label: string; dot: string }> = {
  open: { label: 'Open', dot: 'bg-purple-300' },
  ongoing: { label: 'Ongoing', dot: 'bg-amber-200' },
  closed: { label: 'Closed', dot: 'bg-white/35' },
};

const matches = (f: Filter, s: Status) => f === 'all' || (f === 'archive' ? s === 'closed' : f === s);

function CountUp({ to, prefix = '', suffix = '' }: { to: number; prefix?: string; suffix?: string }) {
  const [ref, inView] = useInView({ triggerOnce: true, rootMargin: '-80px' });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let f = 0;
    const s = performance.now();
    const tick = (n: number) => {
      const t = Math.min((n - s) / 1800, 1);
      setV(Math.round(to * (1 - Math.pow(1 - t, 3))));
      if (t < 1) f = requestAnimationFrame(tick);
    };
    f = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(f);
  }, [inView, to]);
  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {v}
      {suffix}
    </span>
  );
}

function ProgramIndex({ onApply }: { onApply: () => void }) {
  const [filter, setFilter] = useState<Filter>('all');
  const visible = programs.filter((p) => matches(filter, p.status));
  const [activeId, setActiveId] = useState(programs[0].id);
  const active = visible.find((p) => p.id === activeId) ?? visible[0];

  const tabs: { key: Filter; label: string }[] = [
    { key: 'all', label: 'All Programs' },
    { key: 'open', label: 'Open' },
    { key: 'ongoing', label: 'Ongoing' },
    { key: 'archive', label: 'Archive' },
  ];

  return (
    <div className="mx-auto max-w-[1480px] px-6 lg:px-10">
      <div className="flex flex-wrap gap-2">
        {tabs.map(({ key, label }) => {
          const on = filter === key;
          const count = programs.filter((p) => matches(key, p.status)).length;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[13px] transition-colors duration-300 ${
                on ? 'border-white bg-white text-black' : 'border-white/25 text-white/75 hover:border-white/60 hover:text-white'
              }`}
            >
              {label}
              <span className={`tabular-nums text-[11px] ${on ? 'text-black/50' : 'text-white/40'}`}>{String(count).padStart(2, '0')}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-12">
        {/* Sticky crossfading photo (desktop) */}
        <div className="hidden lg:col-span-5 lg:block">
          <div className="sticky top-28">
            <div className="relative aspect-[4/5] overflow-hidden">
              {programs.map((p) => (
                <Image
                  key={p.id}
                  src={p.image}
                  alt={p.title}
                  fill
                  sizes="40vw"
                  className={`object-cover transition-all duration-[900ms] ${active?.id === p.id ? 'scale-100 opacity-100' : 'scale-[1.06] opacity-0'} ${
                    p.status === 'closed' ? 'grayscale-[60%]' : ''
                  }`}
                  style={{ transitionTimingFunction: EASE }}
                />
              ))}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              {active && (
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6 text-[13px]">
                  <span className="flex items-center gap-2 text-white/85">
                    <span className={`h-1.5 w-1.5 rounded-full ${statusMeta[active.status].dot}`} />
                    {statusMeta[active.status].label}
                  </span>
                  <span className="text-white/70">{active.region}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Program list */}
        <ol className="border-b border-white/15 lg:col-span-7">
          {visible.map((p) => {
            const index = programs.findIndex((x) => x.id === p.id) + 1;
            const on = active?.id === p.id;
            const s = statusMeta[p.status];
            return (
              <li key={p.id} id={p.id} className="scroll-mt-28 border-t border-white/15">
                <button
                  type="button"
                  onMouseEnter={() => setActiveId(p.id)}
                  onFocus={() => setActiveId(p.id)}
                  onClick={() => setActiveId(p.id)}
                  aria-expanded={on}
                  className="group flex w-full items-start gap-5 py-8 text-left lg:py-10"
                >
                  <span className={`mt-3 transition-colors ${on ? 'text-white' : 'text-white/45'}`}>
                    <Pill>{String(index).padStart(2, '0')}</Pill>
                  </span>
                  <span className="flex-1">
                    <span
                      className={`block text-[clamp(2rem,3.6vw,3.5rem)] font-medium leading-[1] tracking-[-0.045em] transition-colors duration-500 ${
                        on ? 'text-white' : 'text-white/40 group-hover:text-white/70'
                      }`}
                    >
                      {p.title}
                    </span>
                    <span className="mt-3 flex items-center gap-2 text-[13px] text-white/55">
                      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
                      {s.label} · {p.region}
                    </span>
                  </span>
                  <ArrowUpRight
                    className={`mt-3 h-6 w-6 shrink-0 transition-all duration-500 ${on ? 'rotate-45 text-white' : 'text-white/30'}`}
                    strokeWidth={1.5}
                  />
                </button>

                <div className={`grid transition-all duration-700 ${on ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`} style={{ transitionTimingFunction: EASE }}>
                  <div className="overflow-hidden">
                    <div className="pb-10 pl-[3.25rem]">
                      <div className="relative mb-8 aspect-[4/3] overflow-hidden lg:hidden">
                        <Image src={p.image} alt={p.title} fill sizes="100vw" className="object-cover" />
                      </div>
                      <p className="max-w-xl text-[17px] leading-[1.6] text-white/75">{p.body}</p>
                      <p className="mt-5 text-[13px] text-white/45">{p.tags.join('  ·  ')}</p>
                      <div className="mt-8">
                        {p.status === 'open' && <ArrowLink onClick={onApply}>Apply Now</ArrowLink>}
                        {p.status === 'ongoing' && <ArrowLink onClick={onApply}>View Cohort</ArrowLink>}
                        {p.status === 'closed' && (
                          <span className="inline-flex items-center gap-2 text-[15px] text-white/40">
                            Applications Closed <Lock className="h-4 w-4" />
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

export default function ProgramsPage() {
  return (
    <PageShell>
      {(openAction) => (
        <div className={`${PAGE_BG} text-[#f3f0ea]`}>
          {/* ─── PINNED VIDEO HERO (shared pattern with Platform) ─── */}
          <section className="relative">
            <div className="sticky top-0 h-[100svh] overflow-hidden">
              <BgVideo src="/videos/programs-hero.mp4" poster="/images/programs/hero-poster.jpg" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/25 to-black/75" />
            </div>

            <div className="relative -mt-[100svh]">
              <div className="flex h-[100svh] flex-col justify-end px-6 pb-16 lg:px-10 lg:pb-20">
                <div className="flex flex-wrap items-end justify-between gap-10">
                  <div>
                    <p className="mb-8 flex items-center gap-2 text-[13px] text-white/80">
                      <Pill>02</Pill> Global Ecosystem
                    </p>
                    <h1 data-plain className="text-[clamp(3.5rem,11vw,11rem)] font-medium leading-[0.86] tracking-[-0.065em]">
                      <span className="block">
                        <BlurWords text="Startup" delay={0.2} />
                      </span>
                      <span className="block font-light italic">
                        <BlurWords text="Programs." delay={0.55} />
                      </span>
                    </h1>
                  </div>
                  <dl className="mb-3 grid grid-cols-3 gap-8 text-[13px] lg:gap-12">
                    {[
                      ['04', 'Programs'],
                      ['03', 'Continents'],
                      ['02', 'Open now'],
                    ].map(([n, l]) => (
                      <div key={l}>
                        <dt className="text-3xl font-medium tracking-[-0.04em] text-white">{n}</dt>
                        <dd className="mt-1 text-white/60">{l}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>

              <div className="flex min-h-[100svh] items-center px-6 pb-24 lg:px-10">
                <div className="w-full max-w-[46rem]">
                  <ScrubText
                    className="text-[clamp(1.5rem,2.4vw,2.4rem)] font-medium leading-[1.2] tracking-[-0.025em]"
                    parts={[
                      "We bridge the gap between visionary founders and the world's most aggressive markets. Our programs are designed to accelerate readiness and forge institutional connections.",
                    ]}
                  />
                  <div className="mt-10 flex flex-wrap gap-8">
                    <ArrowLink href="#programs">Explore Programs</ArrowLink>
                    <ArrowLink onClick={openAction}>Apply Now</ArrowLink>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ─── PROGRAM INDEX ─── */}
          <section id="programs" className={`${PAGE_BG} relative z-10 scroll-mt-10 pb-36 pt-32 lg:pt-44`}>
            <div className="mx-auto mb-16 grid max-w-[1480px] grid-cols-1 gap-10 px-6 lg:grid-cols-12 lg:px-10">
              <Reveal className="lg:col-span-7">
                <h2 className="text-[clamp(3rem,5.4vw,5.5rem)] font-medium leading-[0.95] tracking-[-0.05em]">
                  <SplitWords>
                    Four programs.
                    <br />
                    <span className="font-light italic text-purple-200/90">Three continents.</span>
                  </SplitWords>
                </h2>
              </Reveal>
              <Reveal delay={0.1} className="self-end lg:col-span-4 lg:col-start-9">
                <p className="text-[16px] leading-[1.55] text-white/70">
                  From a 12-week readiness intensive to academic partnerships in Berlin and Paris, Silicon Valley
                  immersion and a MENA accelerator in Amman. Hover a program to see it.
                </p>
              </Reveal>
            </div>
            <ProgramIndex onApply={openAction} />
          </section>

          {/* ─── FULL-BLEED VIDEO STATS BAND ─── */}
          <section className="relative z-10 flex min-h-[100svh] flex-col justify-between overflow-hidden px-6 py-16 lg:px-10 lg:py-20">
            <BgVideo src="/videos/programs-band.mp4" poster="/images/programs/band-poster.jpg" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-black/80" />

            <Reveal className="relative max-w-3xl">
              <p className="mb-8 flex items-center gap-2 text-[13px] text-white/80">
                <Pill>03</Pill> Alumni
              </p>
              <h2 className="text-[clamp(3rem,6.4vw,6.5rem)] font-medium leading-[0.92] tracking-[-0.055em]">
                <SplitWords>
                  Build with <span className="font-light italic">the Den.</span>
                </SplitWords>
              </h2>
            </Reveal>

            <div className="relative mt-24 grid grid-cols-1 gap-10 border-t border-white/30 pt-10 md:grid-cols-12">
              {[
                { to: 250, prefix: '$', suffix: 'M+', label: 'Raised by alumni in follow-on funding' },
                { to: 30, suffix: '+', label: 'Countries our alumni operate in' },
              ].map((s, i) => (
                <Reveal key={s.label} delay={i * 0.1} className="md:col-span-4">
                  <p className="text-[clamp(4rem,8vw,8rem)] font-medium leading-none tracking-[-0.06em]">
                    <CountUp to={s.to} prefix={s.prefix} suffix={s.suffix} />
                  </p>
                  <p className="mt-4 text-[14px] text-white/70">{s.label}</p>
                </Reveal>
              ))}
              <Reveal delay={0.2} className="self-end md:col-span-4">
                <p className="text-[16px] leading-[1.55] text-white/80">
                  Our alumni have collectively raised over $250M in follow-on funding and operate in 30+ countries. Join
                  the next generation of venture leaders.
                </p>
              </Reveal>
            </div>
          </section>

          {/* ─── CLOSING CTA ─── */}
          <section className={`${PAGE_BG} relative z-10 px-6 py-40 text-center lg:px-10 lg:py-52`}>
            <Reveal>
              <p className="mb-10 flex items-center justify-center gap-2 text-[13px] text-white/70">
                <Pill>04</Pill> Next cohort
              </p>
              <h2 className="mx-auto max-w-5xl text-[clamp(3rem,7.5vw,7.5rem)] font-medium leading-[0.92] tracking-[-0.06em]">
                <SplitWords>
                  Your next chapter starts <span className="font-light italic text-purple-200/90">in the Den.</span>
                </SplitWords>
              </h2>
              <div className="mt-14 flex flex-wrap justify-center gap-10">
                <ArrowLink onClick={openAction}>Apply Now</ArrowLink>
                <ArrowLink href="/platform">How the Den works</ArrowLink>
              </div>
            </Reveal>
          </section>
        </div>
      )}
    </PageShell>
  );
}
