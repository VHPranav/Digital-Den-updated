'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import PageShell from '@/components/site/PageShell';
import SplitWords from '@/components/site/SplitWords';
import { Container, Figure, Label, PrimaryButton, Section, SectionHeader, body, display, heading, lead } from '@/components/site/ui';
import { FadeIn } from '@/components/FadeIn';

// Draft project list assembled from activities referenced elsewhere on the
// site; replace with the confirmed project roster when available.

type Status = 'Active' | 'Upcoming' | 'Scaling';

const projects: {
  title: string;
  sector: string;
  location: string;
  year: string;
  status: Status;
  image: string;
  body: string;
}[] = [
  {
    title: 'FinTech Innovation Loop',
    sector: 'FinTech',
    location: 'Montenegro',
    year: '2026',
    status: 'Upcoming',
    image: '/images/verticals/fintech.jpg',
    body: 'Matchmaking between traditional banking institutions and high-growth fintech startups across the Western Balkans.',
  },
  {
    title: 'Regional HealthTech Pilot',
    sector: 'HealthTech',
    location: 'Montenegro',
    year: '2025',
    status: 'Scaling',
    image: '/images/verticals/healthtech.jpg',
    body: 'A pilot run with institutional health partners, now moving from a single site towards national rollout.',
  },
  {
    title: 'Smart Hospitality',
    sector: 'Hospitality Tech',
    location: 'Mediterranean',
    year: '2026',
    status: 'Active',
    image: '/images/verticals/hospitality.jpg',
    body: 'Testing booking, guest management and sustainable travel tools with regional hospitality operators.',
  },
  {
    title: 'US Market Bridge',
    sector: 'Cross-border',
    location: 'United States',
    year: '2026',
    status: 'Active',
    image: '/images/partners/us.jpg',
    body: 'Structured access to US venture networks, incorporation and Series A readiness for international founders.',
  },
  {
    title: 'European Gateway',
    sector: 'Cross-border',
    location: 'European Union',
    year: '2026',
    status: 'Active',
    image: '/images/partners/europe.jpg',
    body: 'Support for multi-market scaling inside the EU: regulation, R&D incentives and partner introductions.',
  },
  {
    title: 'MENA Innovation Track',
    sector: 'Regional',
    location: 'Jordan',
    year: '2026',
    status: 'Active',
    image: '/images/programs/jordan.jpg',
    body: 'Regional innovation work with local talent and global mentors across the MENA network.',
  },
];

const filters = ['All', 'Active', 'Upcoming', 'Scaling'] as const;
type Filter = (typeof filters)[number];

const steps = [
  { title: 'Scope', body: 'We define the problem with the partner institution and agree on what a successful outcome looks like.' },
  { title: 'Match', body: 'Startups from our network are shortlisted and paired with the partner team that owns the problem.' },
  { title: 'Pilot', body: 'A time-boxed pilot runs in a live environment, with clear milestones and shared reporting.' },
  { title: 'Scale', body: 'Successful pilots move into commercial agreements and wider rollout across the region.' },
];

export default function ProjectsPage() {
  const [filter, setFilter] = useState<Filter>('All');
  const [active, setActive] = useState(0);
  const visible = projects.filter((p) => filter === 'All' || p.status === filter);
  const preview = visible[Math.min(active, visible.length - 1)] ?? projects[0];

  return (
    <PageShell>
      {(openAction) => (
        <>
          {/* ─── HERO ─── */}
          <Container className="pt-44 lg:pt-56 pb-24 lg:pb-32">
            <FadeIn animation="fadeIn">
              <Label>Project Activities</Label>
            </FadeIn>
            <h1 className={`mt-10 max-w-5xl text-[3.5rem] sm:text-7xl lg:text-[8rem] ${display}`}>
                <SplitWords>
                  Work in the <span className="gradient-text">field</span>
                </SplitWords>
              </h1>
            <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
              <FadeIn animation="slideUp" delay={0.25} className="lg:col-span-5">
                <p className={lead}>
                  The projects Digital Den runs with institutions, corporates and founders: pilots, market bridges and
                  sector initiatives that move ideas into real operations.
                </p>
              </FadeIn>
              <FadeIn animation="slideUp" delay={0.35} className="lg:col-span-5 lg:col-start-8">
                <dl className="grid grid-cols-3 border-t border-white/[0.12] pt-6">
                  {[
                    [String(projects.length).padStart(2, '0'), 'Projects'],
                    ['04', 'Sectors'],
                    ['05', 'Regions'],
                  ].map(([v, k]) => (
                    <div key={k}>
                      <dd className="text-4xl font-semibold tracking-[-0.03em]">{v}</dd>
                      <dt className="mt-2 text-xs uppercase tracking-[0.22em] text-white/40">{k}</dt>
                    </div>
                  ))}
                </dl>
              </FadeIn>
            </div>
          </Container>

          {/* ─── PROJECT INDEX ─── */}
          <Section>
            <Container>
              <div className="flex flex-col gap-10 sm:flex-row sm:items-end sm:justify-between">
                <Label index="01">Project Index</Label>
                <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter projects by status">
                  {filters.map((f) => (
                    <button
                      key={f}
                      type="button"
                      role="tab"
                      aria-selected={filter === f}
                      onClick={() => {
                        setFilter(f);
                        setActive(0);
                      }}
                      className={`rounded-full border px-4 py-1.5 text-xs uppercase tracking-[0.18em] transition-colors ${
                        filter === f ? 'border-white bg-white text-black' : 'border-white/15 text-white/60 hover:border-white/40 hover:text-white'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
                <ol className="lg:col-span-7">
                  {visible.map((p, i) => (
                    <li key={p.title}>
                      <button
                        type="button"
                        onMouseEnter={() => setActive(i)}
                        onFocus={() => setActive(i)}
                        onClick={() => setActive(i)}
                        className="group grid w-full grid-cols-[2.5rem_1fr] gap-6 border-t border-white/[0.12] py-8 text-left"
                      >
                        <span className="pt-2 text-sm tabular-nums text-white/30">{String(i + 1).padStart(2, '0')}</span>
                        <span>
                          <span className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                            <span
                              className={`text-2xl sm:text-3xl font-semibold tracking-[-0.025em] transition-colors ${
                                preview.title === p.title ? 'text-white' : 'text-white/45 group-hover:text-white/80'
                              }`}
                            >
                              {p.title}
                            </span>
                            <span className="text-xs uppercase tracking-[0.2em] text-white/40">
                              {p.location} · {p.year}
                            </span>
                          </span>
                          <span className="mt-3 flex items-center gap-3 text-xs uppercase tracking-[0.2em]">
                            <span className="text-purple-300/80">{p.sector}</span>
                            <span className="h-px w-6 bg-white/20" />
                            <span className="text-white/50">{p.status}</span>
                          </span>
                          {/* On small screens the detail sits inline; desktop uses the sticky preview. */}
                          <span className={`mt-4 block lg:hidden ${body}`}>{p.body}</span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ol>

                <div className="hidden lg:col-span-4 lg:col-start-9 lg:block">
                  <div className="sticky top-32">
                    <div data-img-reveal className="relative aspect-[4/5] w-full overflow-hidden">
                      {projects.map((p) => (
                        <Image
                          key={p.title}
                          src={p.image}
                          alt={p.title}
                          fill
                          sizes="400px"
                          className={`object-cover transition-opacity duration-700 ${preview.title === p.title ? 'opacity-100' : 'opacity-0'}`}
                        />
                      ))}
                    </div>
                    <p className={`mt-6 ${body}`}>{preview.body}</p>
                  </div>
                </div>
              </div>
            </Container>
          </Section>

          {/* ─── HOW PROJECTS RUN ─── */}
          <Section>
            <Container>
              <SectionHeader
                index="02"
                label="Method"
                title="How a project runs"
                intro="Every project follows the same four stages, from first conversation to commercial rollout."
              />
              <div className="mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-16">
                {steps.map(({ title, body: text }, i) => (
                  <FadeIn key={title} animation="slideUp" delay={i * 0.08}>
                    <div className="border-t border-white/[0.12] pt-8">
                      <span className="text-sm tabular-nums text-white/30">{String(i + 1).padStart(2, '0')}</span>
                      <h3 className="mt-6 text-2xl font-semibold tracking-[-0.025em]">{title}</h3>
                      <p className={`mt-4 ${body}`}>{text}</p>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </Container>
          </Section>

          {/* ─── CTA ─── */}
          <Section>
            <Container className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-end">
              <div className="lg:col-span-7">
                <Label index="03">Collaborate</Label>
                <h2 className={`mt-8 ${heading}`}>
                  <SplitWords>
                    Have a project for the <span className="gradient-text">network?</span>
                  </SplitWords>
                </h2>
              </div>
              <div className="lg:col-span-4 lg:col-start-9">
                <p className={lead}>Institutions and corporates can bring a challenge; we&apos;ll scope it and find the right founders.</p>
                <div className="mt-10">
                  <PrimaryButton onClick={openAction}>Propose a Project</PrimaryButton>
                </div>
              </div>
            </Container>
            <Container className="mt-24">
              <FadeIn animation="fadeIn" duration={1.4}>
                <Figure src="/images/platform/global.jpg" alt="Digital Den project network" sizes="(max-width: 1240px) 100vw, 1240px" className="aspect-[21/9]" />
              </FadeIn>
            </Container>
          </Section>
        </>
      )}
    </PageShell>
  );
}
