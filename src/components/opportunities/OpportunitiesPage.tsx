'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import PageShell from '@/components/site/PageShell';
import SplitWords from '@/components/site/SplitWords';
import JoinForm from '@/components/site/JoinForm';
import { Container, Figure, Label, PrimaryButton, Section, SectionHeader, body, display, heading, lead } from '@/components/site/ui';
import { FadeIn } from '@/components/FadeIn';
import { BgVideo } from '@/components/site/editorial';

// Content sourced from the Stitch "Opportunities" screen.

const verticals = [
  {
    href: '/verticals/fintech',
    title: 'FinTech',
    body: 'Revolutionizing digital payments, regulatory technology, and decentralized finance solutions for the Balkan market.',
    image: '/images/verticals/fintech.jpg',
  },
  {
    href: '/verticals/hospitality',
    title: 'Hospitality Tech',
    body: 'Enhancing the Mediterranean tourism experience through smart booking, guest management, and sustainable travel tech.',
    image: '/images/verticals/hospitality.jpg',
  },
  {
    href: '/verticals/healthtech',
    title: 'HealthTech',
    body: 'Advancing telemedicine, health monitoring, and data-driven wellness platforms for modern regional care.',
    image: '/images/verticals/healthtech.jpg',
  },
];

const reasons = [
  { title: 'Industry Leaders', body: 'Direct access to C-suite executives at top regional firms.' },
  { title: 'Matchmaking', body: 'Algorithmic pairings based on shared strategic roadmaps.' },
  { title: 'Pilot Projects', body: 'Rapid testing grounds for new tech within partner ecosystems.' },
  { title: 'Strategic Partnerships', body: 'Long-term alignment for market expansion and co-creation.' },
  { title: 'Investor Visibility', body: "Curated presentations to the region's most active VCs." },
];

const testimonials = [
  {
    quote:
      "Digital Den didn't just give us a platform; they opened doors to the ministries and banks we had been trying to reach for months. The matchmaking is incredibly precise.",
    name: 'Marko J.',
    role: 'Founder, PayGrid Balkans',
  },
  {
    quote:
      'As institutional partners, we found the quality of startups vetted by Digital Den to be unparalleled. The HealthTech pilot we launched last autumn is now scaling nationally.',
    name: 'Elena R.',
    role: 'Director, Regional Health Board',
  },
];

export default function OpportunitiesPage() {
  return (
    <PageShell>
      {(openAction) => (
        <>
          {/* ─── FEATURED OPPORTUNITY ─── */}
          <Container className="pt-44 lg:pt-56 pb-24 lg:pb-32">
            <div id="fintech" className="scroll-mt-32">
              <FadeIn animation="fadeIn">
                <Label>Featured Opportunity · Podgorica, Montenegro</Label>
              </FadeIn>
              <h1 className={`mt-10 max-w-5xl text-[3.25rem] sm:text-7xl lg:text-[7.5rem] ${display}`}>
                  <SplitWords>
                    FinTech Innovation Loop <span className="gradient-text">Montenegro</span>
                  </SplitWords>
                </h1>
              <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
                <FadeIn animation="slideUp" delay={0.25} className="lg:col-span-5">
                  <p className={lead}>
                    An exclusive matchmaking event bridging the gap between traditional banking institutions and
                    high-growth fintech startups in the Western Balkans. Secure your seat at the core of regional
                    finance evolution.
                  </p>
                </FadeIn>
                <FadeIn animation="slideUp" delay={0.35} className="lg:col-span-5 lg:col-start-8">
                  <dl className="border-t border-white/[0.12]">
                    {[
                      ['Date', '23 June 2026'],
                      ['Tracks', 'Payments, Web3, AML'],
                      ['Location', 'Podgorica, Montenegro'],
                    ].map(([k, v]) => (
                      <div key={k} className="flex items-baseline justify-between gap-6 border-b border-white/[0.12] py-5">
                        <dt className="text-xs uppercase tracking-[0.22em] text-white/40">{k}</dt>
                        <dd className="text-right font-medium">{v}</dd>
                      </div>
                    ))}
                  </dl>
                  <div className="mt-10">
                    <PrimaryButton onClick={openAction}>Express Interest</PrimaryButton>
                  </div>
                </FadeIn>
              </div>
            </div>
          </Container>

          <FadeIn animation="fadeIn" duration={1.4}>
            <div className="relative aspect-[16/10] w-full overflow-hidden sm:aspect-[21/9]">
              <BgVideo src="/videos/opportunities-featured.mp4" poster="/images/opportunities/featured-poster.jpg" />
            </div>
          </FadeIn>

          {/* ─── PRIORITY VERTICALS ─── */}
          <Section bordered={false}>
            <Container>
              <SectionHeader
                index="01"
                label="Focus Sectors"
                title="Priority Verticals"
                intro="Strategic sectors where we accelerate high-impact innovation."
              />
              <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-20">
                {verticals.map(({ href, title, body: text, image }, i) => (
                  <FadeIn key={title} animation="slideUp" delay={i * 0.1}>
                    <Link href={href} className="group block">
                      <Figure src={image} alt={title} sizes="(max-width: 768px) 100vw, 400px" className="aspect-[3/4]" />
                      <div className="mt-8 flex items-center justify-between border-b border-white/[0.12] pb-5">
                        <h3 className="text-2xl font-semibold tracking-[-0.025em] transition-colors group-hover:text-purple-200">{title}</h3>
                        <ArrowUpRight className="h-5 w-5 text-white/40 transition-all duration-300 group-hover:text-white group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </div>
                      <p className={`mt-5 ${body}`}>{text}</p>
                    </Link>
                  </FadeIn>
                ))}
              </div>
            </Container>
          </Section>

          {/* ─── WHY JOIN ─── */}
          <Section>
            <Container className="grid grid-cols-1 lg:grid-cols-12 gap-16">
              <div className="lg:col-span-5">
                <div className="lg:sticky lg:top-40">
                  <Label index="02">The Advantage</Label>
                  <h2 className={`mt-8 ${heading}`}><SplitWords>Why Join Digital Den?</SplitWords></h2>
                  <p className={`mt-8 max-w-md ${lead}`}>
                    We provide the architectural foundation for long-term strategic success through direct access and
                    visibility.
                  </p>
                </div>
              </div>
              <ol className="lg:col-span-6 lg:col-start-7">
                {reasons.map(({ title, body: text }, i) => (
                  <FadeIn key={title} as="li" animation="fadeIn" delay={i * 0.05}>
                    <div className="grid grid-cols-[3rem_1fr] gap-6 border-t border-white/[0.12] py-10">
                      <span className="pt-2 text-sm tabular-nums text-white/30">{String(i + 1).padStart(2, '0')}</span>
                      <div>
                        <h3 className="text-2xl sm:text-3xl font-semibold tracking-[-0.025em]">{title}</h3>
                        <p className={`mt-3 ${body}`}>{text}</p>
                      </div>
                    </div>
                  </FadeIn>
                ))}
              </ol>
            </Container>
          </Section>

          {/* ─── COMMUNITY PROOF ─── */}
          <Section>
            <Container>
              <Label index="03">Community Proof</Label>
              <div className="mt-20 space-y-28">
                {testimonials.map(({ quote, name, role }, i) => (
                  <FadeIn key={name} animation="blurInUp" duration={1}>
                    <figure className={`max-w-4xl ${i % 2 === 1 ? 'lg:ml-auto' : ''}`}>
                      <blockquote className="text-2xl sm:text-4xl font-medium leading-[1.3] tracking-[-0.025em] text-white/85">
                        &ldquo;{quote}&rdquo;
                      </blockquote>
                      <figcaption className="mt-10 flex items-center gap-4 text-sm">
                        <span className="h-px w-10 bg-purple-400/70" />
                        <span className="font-medium">{name}</span>
                        <span className="text-white/40">{role}</span>
                      </figcaption>
                    </figure>
                  </FadeIn>
                ))}
              </div>
            </Container>
          </Section>

          {/* ─── JOIN THE NETWORK ─── */}
          <Section id="join">
            <Container className="grid grid-cols-1 lg:grid-cols-12 gap-16">
              <div className="lg:col-span-4">
                <Label index="04">Apply</Label>
                <h2 className={`mt-8 ${heading}`}>
                  <SplitWords>
                    Join the <span className="gradient-text">Network</span>
                  </SplitWords>
                </h2>
                <p className={`mt-8 ${lead}`}>Complete the brief below to be considered for our next matchmaking cycle.</p>
              </div>
              <div className="lg:col-span-7 lg:col-start-6 lg:pt-4">
                <JoinForm
                  fields={[
                    { type: 'text', name: 'name', label: 'Full Name' },
                    { type: 'email', name: 'email', label: 'Email Address' },
                    {
                      type: 'select',
                      name: 'role',
                      label: 'Your Role',
                      options: ['Startup Founder', 'Corporate Executive', 'Angel/VC Investor', 'Institutional Partner'],
                    },
                    {
                      type: 'select',
                      name: 'vertical',
                      label: 'Vertical Interest',
                      options: ['FinTech', 'Hospitality Tech', 'HealthTech', 'GreenTech'],
                    },
                    { type: 'textarea', name: 'looking-for', label: 'What are you looking for?' },
                  ]}
                />
              </div>
            </Container>
          </Section>
        </>
      )}
    </PageShell>
  );
}
