'use client';

import React from 'react';
import PageShell from '@/components/site/PageShell';
import { Container, Figure, Label, PrimaryButton, Section, SectionHeader, body, display, lead } from '@/components/site/ui';
import { FadeIn } from '@/components/FadeIn';

// Content sourced from the Stitch "Partners" screen.

const bridges = [
  {
    title: 'US Market Bridge',
    body: 'Facilitating direct access to Silicon Valley and East Coast venture networks. Our US partners streamline Delaware incorporation, IP protection, and Series A readiness for international founders.',
    hubs: ['NY Network', 'SF Ecosystem'],
    image: '/images/partners/us.jpg',
  },
  {
    title: 'European Gateway',
    body: 'Navigating the complex landscape of EU regulations and multi-market scaling. Our European partners provide localized expertise in GDPR compliance, R&D tax credits, and pan-continental expansion.',
    hubs: ['Berlin Hub', 'London FinTech'],
    image: '/images/partners/europe.jpg',
  },
];

// International names are placeholders — swap in real partners when confirmed.
const tiers = [
  {
    index: '01',
    label: 'Global Reach',
    title: 'International Partners',
    partners: [
      { name: 'Partner to be announced', meta: 'International' },
      { name: 'Partner to be announced', meta: 'International' },
      { name: 'Partner to be announced', meta: 'International' },
      { name: 'Partner to be announced', meta: 'International' },
    ],
  },
  {
    index: '02',
    label: 'Continental Scale',
    title: 'Regional Catalysts',
    partners: [
      { name: 'NordicCap', meta: 'Europe' },
      { name: 'PacificV', meta: 'North America' },
      { name: 'ZenithHQ', meta: 'Asia Pacific' },
      { name: 'AtlasVent', meta: 'MENA' },
    ],
  },
  {
    index: '03',
    label: 'Domestic Roots',
    title: 'Local Foundations',
    partners: [
      { name: 'National Bank of Innovation', meta: 'Finance' },
      { name: 'Justice & Co Legal', meta: 'Legal' },
      { name: 'Urban Tech Districts', meta: 'Infrastructure' },
    ],
  },
];

export default function PartnersPage() {
  return (
    <PageShell>
      {(openAction) => (
        <>
          {/* ─── HERO ─── */}
          <Container className="pt-44 lg:pt-52 pb-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-6">
                <FadeIn animation="fadeIn">
                  <Label>Strategic Alliances</Label>
                </FadeIn>
                <FadeIn animation="blurInUp" duration={1.1}>
                  <h1 className={`mt-10 text-[4rem] sm:text-8xl lg:text-[8.5rem] ${display}`}>
                    Global
                    <br />
                    <span className="gradient-text">Ecosystem</span>
                  </h1>
                </FadeIn>
                <FadeIn animation="slideUp" delay={0.3}>
                  <p className={`mt-12 max-w-lg ${lead}`}>
                    We&apos;ve architected a borderless infrastructure that connects local innovation with global
                    capital. Our partners provide the regulatory, financial, and technical tailwinds required for
                    high-stakes venture scaling.
                  </p>
                </FadeIn>
              </div>
              <FadeIn animation="fadeIn" delay={0.2} duration={1.6} className="lg:col-span-6">
                <Figure
                  src="/images/partners/hero.jpg"
                  alt="Digital Den global partner network"
                  priority
                  sizes="(max-width: 1024px) 100vw, 620px"
                  className="aspect-square [mask-image:radial-gradient(circle_at_center,black_42%,transparent_70%)]"
                />
              </FadeIn>
            </div>
          </Container>

          {/* ─── MARKET BRIDGES ─── */}
          <Section>
            <Container>
              <SectionHeader index="01" label="Market Bridges" title="Two gateways. One network." />
              <div className="mt-24 grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-24">
                {bridges.map(({ title, body: text, hubs, image }, i) => (
                  <FadeIn key={title} animation="slideUp" delay={i * 0.12} className={i === 1 ? 'lg:mt-40' : ''}>
                    <article className="group">
                      <Figure src={image} alt={title} sizes="(max-width: 1024px) 100vw, 580px" className="aspect-[4/5]" />
                      <div className="mt-8 flex items-baseline justify-between gap-6 border-b border-white/[0.12] pb-6">
                        <h3 className="text-3xl sm:text-4xl font-semibold tracking-[-0.035em]">{title}</h3>
                        <span className="hidden sm:block text-xs uppercase tracking-[0.22em] text-white/40">{hubs.join(' · ')}</span>
                      </div>
                      <p className={`mt-6 max-w-lg ${body}`}>{text}</p>
                    </article>
                  </FadeIn>
                ))}
              </div>
            </Container>
          </Section>

          {/* ─── PARTNER TIERS ─── */}
          <Section>
            <Container>
              <SectionHeader index="02" label="The Network" title="Three layers of leverage." />
              <div className="mt-24 border-b border-white/[0.12]">
                {tiers.map(({ index, label, title, partners }) => (
                  <FadeIn key={index} animation="fadeIn">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 border-t border-white/[0.12] py-14">
                      <div className="lg:col-span-4">
                        <p className="text-xs uppercase tracking-[0.22em] text-white/40">
                          <span className="tabular-nums text-white/70">{index}</span> · {label}
                        </p>
                        <h3 className="mt-5 text-2xl sm:text-3xl font-semibold tracking-[-0.025em]">{title}</h3>
                      </div>
                      <ul className="lg:col-span-7 lg:col-start-6 grid grid-cols-1 sm:grid-cols-2 gap-x-12">
                        {partners.map((p, i) => (
                          <li
                            key={`${p.name}-${i}`}
                            className={`flex items-baseline justify-between gap-4 border-t border-white/[0.08] py-5 first:border-t-0 sm:[&:nth-child(2)]:border-t-0 ${
                              p.name === 'Partner to be announced' ? 'text-white/35' : ''
                            }`}
                          >
                            <span className="text-lg font-medium">{p.name}</span>
                            <span className="text-xs uppercase tracking-[0.18em] text-white/35">{p.meta}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </Container>
          </Section>

          {/* ─── CTA ─── */}
          <Section>
            <Container className="text-center">
              <Label className="justify-center">Alliance</Label>
              <h2 className={`mt-10 text-5xl sm:text-7xl lg:text-[6.5rem] ${display}`}>
                Become a <span className="gradient-text">Partner</span>
              </h2>
              <p className={`mx-auto mt-10 max-w-xl ${lead}`}>
                Join an elite network of institutions building the next generation of global technology giants.
              </p>
              <div className="mt-12 flex justify-center">
                <PrimaryButton onClick={openAction}>Apply for Alliance</PrimaryButton>
              </div>
            </Container>
          </Section>
        </>
      )}
    </PageShell>
  );
}
