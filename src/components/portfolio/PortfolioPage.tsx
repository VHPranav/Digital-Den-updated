'use client';

import React, { useState } from 'react';
import PageShell from '@/components/site/PageShell';
import { Container, Figure, Label, PrimaryButton, Section, Tabs, TextLink, body, display, lead } from '@/components/site/ui';
import { FadeIn } from '@/components/FadeIn';

// Content sourced from the Stitch "Portfolio" screen.

type Category = 'all' | 'ai' | 'saas' | 'fintech' | 'blockchain';

const ventures: { name: string; sector: string; body: string; image: string; categories: Category[] }[] = [
  {
    name: 'DataMesh',
    sector: 'Data Infra',
    body: 'Next-generation decentralized data fabric for real-time enterprise intelligence. Scaling the future of trustless computation.',
    image: '/images/portfolio/datamesh.jpg',
    categories: ['saas', 'blockchain'],
  },
  {
    name: 'EcoTrace',
    sector: 'ClimateTech',
    body: 'Carbon accountability platform utilizing computer vision and satellite telemetry. Transforming ESG from reports to reality.',
    image: '/images/portfolio/ecotrace.jpg',
    categories: ['ai', 'saas'],
  },
  {
    name: 'PayDen',
    sector: 'FinTech',
    body: 'Global liquidity layer for borderless venture capital. Institutional-grade settlements at the speed of the digital economy.',
    image: '/images/portfolio/payden.jpg',
    categories: ['fintech', 'blockchain'],
  },
  {
    name: 'NeuralNexus',
    sector: 'AI / ML',
    body: 'Self-optimizing cognitive models for automated venture scouting. Predicting market shifts before they enter the zeitgeist.',
    image: '/images/portfolio/neuralnexus.jpg',
    categories: ['ai'],
  },
  {
    name: 'VoidOps',
    sector: 'DevTools',
    body: 'Zero-latency deployment platform for edge-native applications. Eliminate the cloud tax with hyper-efficient architecture.',
    image: '/images/portfolio/voidops.jpg',
    categories: ['saas'],
  },
  {
    name: 'SynthLegal',
    sector: 'LegalTech',
    body: 'Automated smart-contract verification and regulatory mapping for global startups. Legal expertise at the speed of code.',
    image: '/images/portfolio/synthlegal.jpg',
    categories: ['ai', 'blockchain'],
  },
];

const categoryLabels: { key: Category; label: string }[] = [
  { key: 'all', label: 'All Startups' },
  { key: 'ai', label: 'Artificial Intelligence' },
  { key: 'saas', label: 'SaaS' },
  { key: 'fintech', label: 'FinTech' },
  { key: 'blockchain', label: 'Blockchain' },
];

export default function PortfolioPage() {
  const [category, setCategory] = useState<Category>('all');
  const visible = ventures.filter((v) => category === 'all' || v.categories.includes(category));
  const tabs = categoryLabels.map((c) => ({
    ...c,
    count: ventures.filter((v) => c.key === 'all' || v.categories.includes(c.key)).length,
  }));

  return (
    <PageShell>
      {(openAction) => (
        <>
          {/* ─── HERO ─── */}
          <Container className="pt-44 lg:pt-56 pb-28 lg:pb-40">
            <FadeIn animation="fadeIn">
              <Label>The Den Portfolio</Label>
            </FadeIn>
            <FadeIn animation="blurInUp" duration={1.1}>
              <h1 className={`mt-10 text-[4rem] sm:text-8xl lg:text-[10rem] ${display}`}>
                Venture
                <br />
                <span className="gradient-text">Portfolio</span>
              </h1>
            </FadeIn>
            <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-10">
              <FadeIn animation="slideUp" delay={0.3} className="lg:col-span-5 lg:col-start-8">
                <p className={lead}>
                  Investing in the architects of the next digital era. Our portfolio represents the high-stakes
                  innovation built within the Den.
                </p>
              </FadeIn>
            </div>
          </Container>

          {/* ─── GALLERY ─── */}
          <Section>
            <Container>
              <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
                <Label index="01">Ventures</Label>
                <Tabs items={tabs} value={category} onChange={setCategory} />
              </div>

              <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-24">
                {visible.map(({ name, sector, body: text, image }, i) => (
                  <FadeIn
                    key={`${category}-${name}`}
                    animation="slideUp"
                    delay={(i % 2) * 0.12}
                    className={i % 2 === 1 ? 'md:mt-40' : ''}
                  >
                    <article className="group">
                      <Figure src={image} alt={name} sizes="(max-width: 768px) 100vw, 580px" className="aspect-[4/5]" />
                      <div className="mt-8 flex items-baseline justify-between gap-6 border-b border-white/[0.12] pb-6">
                        <h2 className="text-3xl sm:text-4xl font-semibold tracking-[-0.035em]">{name}</h2>
                        <span className="text-xs uppercase tracking-[0.22em] text-white/40">{sector}</span>
                      </div>
                      <p className={`mt-6 max-w-md ${body}`}>{text}</p>
                      <div className="mt-8">
                        <TextLink onClick={openAction}>View Venture</TextLink>
                      </div>
                    </article>
                  </FadeIn>
                ))}
              </div>
            </Container>
          </Section>

          {/* ─── CTA ─── */}
          <Section>
            <Container>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:items-end">
                <h2 className={`lg:col-span-8 text-5xl sm:text-7xl lg:text-[5.5rem] ${display}`}>
                  Build the next unicorn from the comfort of <span className="gradient-text">the Den.</span>
                </h2>
                <div className="lg:col-span-4">
                  <p className={lead}>
                    We are actively seeking visionary founders for our Fall cohort. Bring your thesis, and we&apos;ll
                    provide the capital, talent, and network.
                  </p>
                  <div className="mt-10 flex flex-wrap items-center gap-8">
                    <PrimaryButton onClick={openAction}>Submit Venture Proposal</PrimaryButton>
                    <TextLink href="/programs">Explore Programs</TextLink>
                  </div>
                </div>
              </div>
            </Container>
          </Section>
        </>
      )}
    </PageShell>
  );
}
