'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { ArrowLink, BgVideo, BlurWords, Pill, Reveal } from '@/components/site/editorial';
import PageShell from '@/components/site/PageShell';
import SplitWords from '@/components/site/SplitWords';
import { ScrubText, useScrollProgress } from '@/components/events/motion';

// Content sourced from the Stitch "Platform / How It Works" screen; layout and
// motion modelled on an editorial studio site (pinned hero, portrait slider,
// stacked full-bleed panels).

const BG = 'bg-[#0b0b0c]';

const pillars = [
  {
    id: 'building',
    title: 'Venture',
    accent: 'Building',
    body: 'Our internal engineering and design teams act as your founding department, shipping MVP-level products in weeks, not months. We handle the heavy lifting of tech stack selection and UI/UX architecture.',
    meta: 'Full-Stack · UX Design · GTM Strategy',
    image: '/images/platform/building.jpg',
  },
  {
    id: 'expansion',
    title: 'Market',
    accent: 'Access',
    body: 'Instant connectivity to 500+ corporate partners and 50+ institutional LPs. We open doors that usually take years to knock on.',
    meta: '500+ partners · 50+ LPs',
    image: '/images/platform/access.jpg',
  },
  {
    id: 'capital',
    title: 'Capital',
    accent: '',
    body: 'Pre-seed funding up to $500k, followed by guaranteed participation in Series A rounds for top-performing studio graduates.',
    meta: 'Up to $500k pre-seed',
    image: '/images/platform/capital.jpg',
  },
  {
    id: 'expertise',
    title: 'Expertise',
    accent: '',
    body: "Access to our 'Residency' network: 40+ exited founders and technical specialists who provide weekly 1-on-1 surgical strikes on your most difficult bottlenecks.",
    meta: '40+ exited founders',
    image: '/images/platform/expertise.jpg',
  },
];

const stages = [
  { title: 'Idea', body: 'Deep research into underserved verticals and thesis-driven ideation.', image: '/images/platform/idea.jpg' },
  { title: 'Build', body: 'Our studio engineers build your core MVP while you focus on vision.', image: '/images/platform/build.jpg' },
  { title: 'Validate', body: 'Pilot programs with corporate partners for rapid iteration cycles.', image: '/images/platform/validate.jpg' },
  { title: 'Scale', body: 'Series A preparation and aggressive user acquisition strategies.', image: '/images/platform/scale.jpg' },
  { title: 'Global', body: 'International expansion via our multi-continent network nodes.', image: '/images/platform/global.jpg' },
];

/* ─── Sections ─── */

function PillarSlider() {
  const track = useRef<HTMLDivElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });

  const update = () => {
    const t = track.current;
    if (!t) return;
    setEdge({ start: t.scrollLeft < 8, end: t.scrollLeft + t.clientWidth > t.scrollWidth - 8 });
  };
  const go = (dir: 1 | -1) => {
    const t = track.current;
    const card = t?.querySelector<HTMLElement>('[data-card]');
    t?.scrollBy({ left: dir * ((card?.offsetWidth ?? 400) + 20), behavior: 'smooth' });
  };

  return (
    <>
      <div className="mx-auto flex max-w-[1480px] items-center justify-between px-6 lg:px-10">
        <span className="flex items-center gap-2 text-[13px] text-white/80">
          <Pill>04</Pill> Pillars
        </span>
        <div className="flex gap-2">
          {([-1, 1] as const).map((dir) => {
            const disabled = dir === -1 ? edge.start : edge.end;
            return (
              <button
                key={dir}
                type="button"
                onClick={() => go(dir)}
                disabled={disabled}
                aria-label={dir === -1 ? 'Previous pillar' : 'Next pillar'}
                className={`flex h-6 w-9 items-center justify-center rounded-full border transition-colors ${disabled ? 'border-white/25 text-white/25' : 'border-white text-white hover:bg-white hover:text-black'
                  }`}
              >
                {dir === -1 ? <ArrowLeft className="h-3.5 w-3.5" /> : <ArrowRight className="h-3.5 w-3.5" />}
              </button>
            );
          })}
        </div>
      </div>

      <div
        ref={track}
        onScroll={update}
        className="no-scrollbar mt-6 flex snap-x snap-mandatory scroll-pl-6 gap-5 overflow-x-auto px-6 lg:scroll-pl-[max(2.5rem,calc((100vw-1480px)/2+2.5rem))] lg:px-[max(2.5rem,calc((100vw-1480px)/2+2.5rem))]"
      >
        {pillars.map((p, i) => (
          <Reveal key={p.id} delay={i * 0.08} className="shrink-0 snap-start">
            <article
              id={p.id}
              data-card
              className="group relative aspect-[3/4] w-[78vw] scroll-mt-32 overflow-hidden sm:w-[46vw] lg:w-[calc((min(100vw,1480px)-5rem-3*1.25rem)/3.4)]"
            >
              <Image
                src={p.image}
                alt={`${p.title} ${p.accent}`}
                fill
                sizes="(max-width: 640px) 80vw, (max-width: 1024px) 46vw, 30vw"
                className="object-cover transition-transform duration-[1600ms] ease-out group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 lg:p-7">
                <h3 className="text-[1.65rem] leading-[1.05] tracking-[-0.02em]">
                  <span className="font-light italic">{p.title}</span>
                  {p.accent && (
                    <>
                      {' '}
                      <span className="font-medium">{p.accent}</span>
                    </>
                  )}
                </h3>
                <p className="mt-3 text-xs uppercase tracking-[0.18em] text-purple-200/80">{p.meta}</p>
                <div className="grid grid-rows-[0fr] opacity-0 transition-all duration-700 group-hover:grid-rows-[1fr] group-hover:opacity-100">
                  <p className="overflow-hidden pt-0 text-[14px] leading-[1.55] text-white/80 group-hover:pt-4">{p.body}</p>
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </>
  );
}

function StagePanel({ stage, index, total }: { stage: (typeof stages)[number]; index: number; total: number }) {
  const [ref, progress] = useScrollProgress<HTMLDivElement>({ start: 1, end: 0.2 });
  return (
    <section className="sticky top-0 h-[100svh] overflow-hidden">
      <Image src={stage.image} alt={stage.title} fill sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/25" />
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
          <div className="lg:col-span-6">
            <h3 className="text-[clamp(3.5rem,8vw,7.5rem)] font-medium leading-[0.9] tracking-[-0.055em]">{stage.title}</h3>
            <p className="mt-5 text-[14px] leading-snug text-white/75">
              Stage {String(index + 1).padStart(2, '0')}
              <br />
              12-month trajectory
            </p>
          </div>
          <p className="self-end text-[clamp(1.15rem,1.6vw,1.45rem)] leading-[1.35] tracking-[-0.01em] text-white/90 lg:col-span-5">
            {stage.body}
          </p>
        </div>
      </div>
    </section>
  );
}

export default function PlatformPage() {
  return (
    <PageShell>
      {(openAction) => (
        <div className={`${BG} text-[#f3f0ea]`}>
          {/* ─── PINNED HERO: headline screen, then intro scrolls over the same image ─── */}
          <section className="relative">
            <div className="sticky top-0 h-[100svh] overflow-hidden">
              <BgVideo src="/videos/platform-hero.mp4" poster="/images/platform/hero-poster.jpg" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/25 to-black/70" />
            </div>

            <div className="relative -mt-[100svh]">
              <div className="flex h-[100svh] flex-col justify-end px-6 pb-16 lg:px-10 lg:pb-20">
                <p className="mb-8 flex items-center gap-2 text-[13px] text-white/80">
                  <Pill>01</Pill> The Operating Model
                </p>
                <h1 data-plain className="text-[clamp(3.25rem,9.6vw,9.5rem)] font-medium leading-[0.9] tracking-[-0.06em]">
                  <span className="block">
                    <BlurWords text="We don’t just invest." delay={0.2} />
                  </span>
                  <span className="block">
                    <BlurWords text="We co-build." delay={0.75} />
                  </span>
                </h1>
                <div className="mt-10 flex items-center justify-end gap-3 text-[13px] text-white/70">
                  Scroll
                  <span className="relative h-7 w-4 rounded-full border border-white/70">
                    <span className="absolute left-1/2 top-1.5 h-1.5 w-1 -translate-x-1/2 animate-bounce rounded-full bg-white" />
                  </span>
                </div>
              </div>

              <div className="flex min-h-[100svh] items-center px-6 pb-24 lg:px-10">
                <div className="ml-auto w-full max-w-[44rem]">
                  <ScrubText
                    className="text-[clamp(1.5rem,2.3vw,2.25rem)] font-medium leading-[1.2] tracking-[-0.025em]"
                    parts={[
                      'Our studio architecture is designed to de-risk innovation through shared infrastructure and concentrated expertise. The Den Model turns an idea into a funded, scaled company inside a single, hyper-accelerated year.',
                    ]}
                  />
                  <div className="mt-10 flex flex-wrap gap-8">
                    <ArrowLink href="/programs">View Active Batch</ArrowLink>
                    <ArrowLink onClick={openAction}>Download Thesis</ArrowLink>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ─── FOUR PILLARS ─── */}
          <section className={`${BG} relative z-10 pb-36 pt-32 lg:pt-44`}>
            <div className="mx-auto grid max-w-[1480px] grid-cols-1 gap-10 px-6 lg:grid-cols-12 lg:px-10">
              <Reveal className="lg:col-span-6">
                <h2 className="text-[clamp(3rem,5.4vw,5.5rem)] font-medium leading-[0.95] tracking-[-0.05em]">
                  <SplitWords>
                    Four pillars.
                    <br />
                    One studio.
                  </SplitWords>
                </h2>
              </Reveal>
              <Reveal delay={0.1} className="lg:col-span-5 lg:col-start-8">
                <p className="text-[16px] leading-[1.55] text-white/75">
                  Every founder in the Den gets the same foundation: a founding engineering department, direct market
                  access, committed capital and a residency of operators who have done it before. Built to take a company
                  from idea to Series A without the usual gaps.
                </p>
                <div className="mt-6">
                  <ArrowLink onClick={openAction}>Apply to the Den</ArrowLink>
                </div>
              </Reveal>
            </div>
            <div className="mt-20">
              <PillarSlider />
            </div>
          </section>

          {/* ─── STATEMENT ─── */}
          <section className={`${BG} relative z-10 px-6 pb-40 pt-16 text-center lg:px-10`}>
            <Reveal>
              <p className="mx-auto max-w-6xl text-[clamp(2.25rem,4.2vw,4rem)] font-medium leading-[1.02] tracking-[-0.045em]">
                A hyper-accelerated 12-month trajectory
              </p>
              <p className="mx-auto mt-2 max-w-4xl text-[clamp(2rem,3.8vw,3.6rem)] font-light italic leading-[1.05] tracking-[-0.035em] text-purple-200/90">
                from inception to global market penetration.
              </p>
            </Reveal>
          </section>

          {/* ─── STACKED STAGE PANELS ─── */}
          <div className="relative">
            {stages.map((s, i) => (
              <StagePanel key={s.title} stage={s} index={i} total={stages.length} />
            ))}
          </div>

          {/* ─── MISSION & VISION ─── */}
          <section className={`${BG} relative z-10 py-36 lg:py-48`}>
            <div className="mx-auto grid max-w-[1480px] grid-cols-1 gap-16 px-6 lg:grid-cols-12 lg:px-10">
              <Reveal className="lg:col-span-5">
                <p className="flex items-center gap-2 text-[13px] text-white/80">
                  <Pill>02</Pill> Mission
                </p>
                <h2 className="mt-8 text-[clamp(2.5rem,4.4vw,4.5rem)] font-medium leading-[0.98] tracking-[-0.045em]">
                  <SplitWords>
                    Built in studios, <span className="font-light italic text-purple-200/90">not garages.</span>
                  </SplitWords>
                </h2>
              </Reveal>
              <Reveal delay={0.1} className="space-y-12 lg:col-span-6 lg:col-start-7 lg:pt-16">
                <p className="text-[clamp(1.25rem,1.8vw,1.6rem)] leading-[1.35] tracking-[-0.015em]">
                  “To engineer the most efficient path for transformative technologies to reach global scale.”
                </p>
                <div className="border-t border-white/15 pt-8">
                  <p className="flex items-center gap-2 text-[13px] text-white/80">
                    <Pill>03</Pill> Vision
                  </p>
                  <p className="mt-5 text-[16px] leading-[1.6] text-white/70">
                    We believe the next generation of decacorns will be built in studios, not garages. Our vision is to be
                    the primary architectural firm for the digital economy&apos;s most critical infrastructure.
                  </p>
                </div>
              </Reveal>
            </div>
          </section>

          {/* ─── CLOSING CARD OVER IMAGE ─── */}
          <section className="relative z-10 h-[88svh] min-h-[560px] overflow-hidden">
            <BgVideo src="/videos/platform-close.mp4" poster="/images/platform/close-poster.jpg" />
            <div className="absolute inset-0 bg-black/35" />
            <div className="absolute inset-x-6 top-10 lg:left-auto lg:right-10 lg:top-12 lg:w-[46rem]">
              <Reveal>
                <div className="bg-[#0b0b0c]/92 p-8 backdrop-blur-md lg:p-10">
                  <p className="text-[clamp(1.75rem,2.6vw,2.6rem)] font-medium leading-[1.08] tracking-[-0.035em]">
                    Investor or founder, the Den is open.{' '}
                    <button type="button" onClick={openAction} className="underline decoration-2 underline-offset-[6px] hover:text-purple-200">
                      Partner with us.
                    </button>
                  </p>
                  <p className="mt-6 max-w-lg text-[15px] leading-[1.6] text-white/65">
                    Whether you are an institutional investor looking for venture exposure or a founder ready to build
                    your next legacy, the Den is open.
                  </p>
                  <div className="mt-8 flex flex-wrap gap-8">
                    <ArrowLink onClick={openAction}>For Founders</ArrowLink>
                    <ArrowLink onClick={openAction}>For Investors</ArrowLink>
                  </div>
                </div>
              </Reveal>
            </div>
          </section>
        </div>
      )}
    </PageShell>
  );
}
