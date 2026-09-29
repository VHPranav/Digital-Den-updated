'use client';

import React, { useEffect, useState } from 'react';
import PageShell from '@/components/site/PageShell';
import { Container, Figure, Label, PrimaryButton, Section, SectionHeader, Tabs, TextLink, body, display, lead } from '@/components/site/ui';
import { FadeIn } from '@/components/FadeIn';
import { useInView } from '@/hooks/use-in-view';

// Content sourced from the Stitch "Programs" screen.

type Status = 'open' | 'ongoing' | 'closed';
type Filter = 'all' | 'open' | 'ongoing' | 'archive';

const programs: { id: string; status: Status; title: string; body: string; tags: string[]; image: string }[] = [
  {
    id: 'acceleration',
    status: 'open',
    title: 'Startup Readiness Program',
    body: 'A rigorous 12-week intensive focused on product-market fit, capital strategy, and investor readiness for early-stage tech founders.',
    tags: ['Seed to Series A', 'Hybrid', 'Equity-free'],
    image: '/images/programs/readiness.jpg',
  },
  {
    id: 'mtsb-europe',
    status: 'ongoing',
    title: 'MTSB Europe',
    body: "The Master's in Tech & Sustainable Business. A partnership program across Berlin and Paris focusing on circular economy solutions.",
    tags: ['Academic + Venture', 'EU Markets'],
    image: '/images/programs/europe.jpg',
  },
  {
    id: 'mtsb-us',
    status: 'closed',
    title: 'MTSB US',
    body: 'Silicon Valley immersion for European scale-ups. Focused on transatlantic growth and institutional fundraising in the US market.',
    tags: ['Series A+', 'San Francisco'],
    image: '/images/programs/us.jpg',
  },
  {
    id: 'jordan',
    status: 'open',
    title: 'Jordan Program',
    body: 'Fostering regional innovation through our MENA-focused accelerator. Empowering local talent with global mentorship.',
    tags: ['MENA Region', 'In-person'],
    image: '/images/programs/jordan.jpg',
  },
];

const statusLabel: Record<Status, { text: string; dot: string }> = {
  open: { text: 'Open', dot: 'bg-purple-400' },
  ongoing: { text: 'Ongoing', dot: 'bg-amber-300' },
  closed: { text: 'Closed', dot: 'bg-white/30' },
};

function matches(filter: Filter, status: Status) {
  if (filter === 'all') return true;
  if (filter === 'archive') return status === 'closed';
  return filter === status;
}

function CountUp({ to, prefix = '', suffix = '' }: { to: number; prefix?: string; suffix?: string }) {
  const [ref, isInView] = useInView({ triggerOnce: true, rootMargin: '-80px' });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / 1800, 1);
      setValue(Math.round(to * (1 - Math.pow(1 - t, 3))));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [isInView, to]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {value}
      {suffix}
    </span>
  );
}

export default function ProgramsPage() {
  const [filter, setFilter] = useState<Filter>('all');
  const visible = programs.filter((p) => matches(filter, p.status));
  const tabs: { key: Filter; label: string; count: number }[] = [
    { key: 'all', label: 'All Programs', count: programs.length },
    { key: 'open', label: 'Open', count: programs.filter((p) => matches('open', p.status)).length },
    { key: 'ongoing', label: 'Ongoing', count: programs.filter((p) => matches('ongoing', p.status)).length },
    { key: 'archive', label: 'Archive', count: programs.filter((p) => matches('archive', p.status)).length },
  ];

  return (
    <PageShell>
      {(openAction) => (
        <>
          {/* ─── FULL-BLEED HERO ─── */}
          <section className="relative h-[100svh] min-h-[640px] w-full overflow-hidden">
            <div className="absolute inset-0">
              <Figure src="/images/programs/hero.jpg" alt="Digital Den startup programs" priority className="h-full w-full" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/30" />
            <Container className="relative z-10 flex h-full flex-col justify-end pb-20 lg:pb-28">
              <FadeIn animation="fadeIn">
                <Label>Global Ecosystem</Label>
              </FadeIn>
              <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:items-end">
                <FadeIn animation="blurInUp" duration={1.1} className="lg:col-span-8">
                  <h1 className={`text-[3.75rem] sm:text-8xl lg:text-[9rem] ${display}`}>
                    Startup <span className="gradient-text">Programs</span>
                  </h1>
                </FadeIn>
                <FadeIn animation="slideUp" delay={0.3} className="lg:col-span-4">
                  <p className={`${lead} text-white/65`}>
                    We bridge the gap between visionary founders and the world&apos;s most aggressive markets. Our
                    programs are designed to accelerate readiness and forge institutional connections.
                  </p>
                </FadeIn>
              </div>
            </Container>
          </section>

          {/* ─── PROGRAM INDEX ─── */}
          <Section id="programs-list" bordered={false}>
            <Container>
              <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <Label index="01">Programs</Label>
                  <h2 className="mt-8 text-4xl sm:text-5xl font-semibold tracking-[-0.035em]">Choose your track.</h2>
                </div>
                <Tabs items={tabs} value={filter} onChange={setFilter} />
              </div>

              <div className="mt-20 border-b border-white/[0.12]">
                {visible.map(({ id, status, title, body: text, tags, image }) => {
                  const index = programs.findIndex((p) => p.id === id) + 1;
                  const s = statusLabel[status];
                  return (
                    <FadeIn key={`${filter}-${id}`} animation="fadeIn">
                      <article
                        id={id}
                        className="group scroll-mt-28 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 border-t border-white/[0.12] py-12 lg:py-16"
                      >
                        <span className="lg:col-span-1 text-sm tabular-nums text-white/30">{String(index).padStart(2, '0')}</span>
                        <div className="lg:col-span-6">
                          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.22em] text-white/45">
                            <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
                            {s.text}
                          </div>
                          <h3
                            className={`mt-5 text-3xl sm:text-[2.75rem] font-semibold leading-[1.05] tracking-[-0.035em] transition-colors ${
                              status === 'closed' ? 'text-white/45' : 'group-hover:text-purple-200'
                            }`}
                          >
                            {title}
                          </h3>
                          <p className={`mt-6 max-w-lg ${body}`}>{text}</p>
                          <p className="mt-6 text-xs uppercase tracking-[0.2em] text-white/35">{tags.join('  ·  ')}</p>
                          <div className="mt-10">
                            {status === 'open' && <PrimaryButton onClick={openAction}>Apply Now</PrimaryButton>}
                            {status === 'ongoing' && <TextLink onClick={openAction}>View Cohort</TextLink>}
                            {status === 'closed' && <span className="text-sm text-white/30">Applications Closed</span>}
                          </div>
                        </div>
                        <Figure
                          src={image}
                          alt={title}
                          dim={status === 'closed'}
                          sizes="(max-width: 1024px) 100vw, 480px"
                          className="lg:col-span-5 aspect-[4/3]"
                        />
                      </article>
                    </FadeIn>
                  );
                })}
              </div>
            </Container>
          </Section>

          {/* ─── BUILD WITH THE DEN ─── */}
          <Section>
            <Container>
              <SectionHeader
                index="02"
                label="Alumni"
                title={
                  <>
                    Build with <span className="gradient-text">the Den.</span>
                  </>
                }
                intro="Our alumni have collectively raised over $250M in follow-on funding and operate in 30+ countries. Join the next generation of venture leaders."
              />
            </Container>
            <FadeIn animation="fadeIn" duration={1.4} className="mt-24">
              <Figure src="/images/programs/banner.jpg" alt="Digital Den global alumni network" className="aspect-[16/9] sm:aspect-[21/8] w-full" />
            </FadeIn>
            <Container>
              <div className="grid grid-cols-1 sm:grid-cols-2 border-b border-white/[0.12]">
                {[
                  { to: 250, prefix: '$', suffix: 'M+', label: 'Follow-on funding raised by alumni' },
                  { to: 30, suffix: '+', label: 'Countries our alumni operate in' },
                ].map((stat, i) => (
                  <div key={stat.label} className={`py-14 ${i === 1 ? 'sm:border-l sm:pl-12 border-t sm:border-t-0' : ''} border-white/[0.12]`}>
                    <p className="text-6xl sm:text-8xl font-semibold tracking-[-0.05em]">
                      <CountUp to={stat.to} prefix={stat.prefix} suffix={stat.suffix} />
                    </p>
                    <p className="mt-5 text-sm text-white/45">{stat.label}</p>
                  </div>
                ))}
              </div>
              <div className="mt-16">
                <PrimaryButton onClick={openAction}>Apply to a Program</PrimaryButton>
              </div>
            </Container>
          </Section>
        </>
      )}
    </PageShell>
  );
}
