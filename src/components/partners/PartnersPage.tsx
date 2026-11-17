'use client';

import React from 'react';
import PageShell from '@/components/site/PageShell';
import SplitWords from '@/components/site/SplitWords';
import { Container, Figure, Label, PrimaryButton, Section, SectionHeader } from '@/components/site/ui';
import { FadeIn } from '@/components/FadeIn';
import DottedWorldMap from './DottedWorldMap';
import Image from 'next/image';
import type { Partner } from '@/lib/partners';

// Content sourced from the Stitch "Partners" screen.

// Nina's copy (12 Nov 2026): same two-card format, new purpose.
const bridges = [
  {
    title: 'Who we partner with',
    body: 'Digital Den works with institutions, investors, accelerators, innovation hubs, corporations, universities, faculties and ecosystem organizations that share our goal of creating stronger opportunities for startups, founders and the wider innovation ecosystem.',
    tags: ['Institutions', 'Investors', 'Accelerators', 'Innovation hubs', 'Corporations', 'Ecosystem organizations', 'Universities & academia'],
    image: '/images/partners/us.jpg',
  },
  {
    title: 'How we work together',
    body: 'From startup programs and market access to events, sector initiatives, international projects and strategic collaborations, we build partnerships around shared goals and practical opportunities for impact.',
    tags: ['Programs', 'Market Access', 'Events', 'Projects', 'Strategic Initiatives'],
    image: '/images/partners/europe.jpg',
  },
];

function LogoImg({ p, className = '' }: { p: Partner; className?: string }) {
  return <Image src={p.logo} alt={p.name} fill sizes="200px" draggable={false} className={`object-contain ${className}`} />;
}

// Drift wall: an endless, tilted perspective wall of logo tiles drifting upward at slightly
// different speeds per column. Hovering a tile lifts it toward the viewer and dims the rest.
function PartnerDriftWall({ partners }: { partners: Partner[] }) {
  const columns = 9;
  const cols = Array.from({ length: columns }, (_, c) => {
    // Rotate the list per column so neighbouring columns never line up the same logos.
    const shifted = partners.map((_, i) => partners[(i * columns + c * 7) % partners.length]);
    return shifted.slice(0, Math.max(8, Math.ceil(partners.length / 2)));
  });
  return (
    <div className="drift-wall" aria-label="Partner logos">
      <div className="drift-wall-plane">
        {cols.map((col, c) => (
          <div key={c} className={`drift-wall-col ${c > 4 ? 'max-md:hidden' : ''}`} style={{ '--drift-speed': `${46 + ((c * 37) % 5) * 9}s`, '--drift-offset': `${-c * 7}s` } as React.CSSProperties}>
            <div className="drift-wall-track">
              {[...col, ...col].map((p, i) => {
                const tile = <span className="drift-wall-logo"><LogoImg p={p} /></span>;
                return p.href
                  ? <a key={`${p.name}-${i}`} href={p.href} target="_blank" rel="noopener noreferrer" tabIndex={i < col.length ? 0 : -1} aria-hidden={i >= col.length || undefined} aria-label={`${p.name} (opens in a new tab)`} title={p.name} className="drift-wall-tile">{tile}</a>
                  : <span key={`${p.name}-${i}`} title={p.name} aria-hidden={i >= col.length || undefined} className="drift-wall-tile">{tile}</span>;
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PartnersPage({ partners }: { partners: Partner[] }) {
  return (
    <PageShell minimalFooter>
      {(openAction) => (
        <>
          {/* ─── HERO ─── */}
          <section className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden">
            <DottedWorldMap magnet className="absolute inset-0" />
            {/* Fade the map into the page and keep the copy legible. */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,#0b0b0c_100%)]" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-[#0b0b0c] via-[#0b0b0c]/80 to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#0b0b0c] to-transparent" />

            {/* Wider than the page container so the copy sits at both ends, in line with the navbar. */}
            <div className="relative w-full px-6 pt-44 pb-20 md:px-10 xl:px-16 lg:pb-24">
              <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <FadeIn animation="fadeIn">
                    <Label className="text-[12px] text-white/65">Strategic Alliances</Label>
                  </FadeIn>
                  <h1 className="dd-h1 mt-8 font-medium">
                      <SplitWords>
                        Global
                        <br />
                        <span className="gradient-text">Ecosystem</span>
                      </SplitWords>
                    </h1>
                </div>
                <FadeIn animation="slideUp" delay={0.3} className="lg:max-w-sm">
                  <p className="text-[17px] leading-[1.65] text-white/75">
                    We&apos;ve architected a borderless infrastructure that connects local innovation with global
                    capital. Our partners provide the regulatory, financial, and technical tailwinds required for
                    high-stakes venture scaling.
                  </p>
                </FadeIn>
              </div>
            </div>
          </section>

          {/* ─── MARKET BRIDGES ─── */}
          <Section>
            <Container>
              <SectionHeader index="01" label="Partnerships" title="Built on shared goals" />
              <div className="mt-24 grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-24">
                {bridges.map(({ title, body: text, tags, image }, i) => (
                  <FadeIn key={title} animation="slideUp" delay={i * 0.12} className={i === 1 ? 'lg:mt-40' : ''}>
                    <article className="group">
                      <Figure src={image} alt={title} sizes="(max-width: 1024px) 100vw, 580px" className="aspect-[4/5]" />
                      <h3 className="dd-h3 mt-8 border-b border-white/[0.12] pb-6 font-semibold">{title}</h3>
                      <p className="mt-6 max-w-lg text-[17px] leading-[1.65] text-white/75">{text}</p>
                      <ul className="mt-8 flex max-w-lg flex-wrap gap-2" aria-label={`${title} categories`}>
                        {tags.map((tag) => <li key={tag} className="rounded-full border border-purple-300/30 bg-purple-300/[0.06] px-4 py-1.5 text-[13px] text-purple-100">{tag}</li>)}
                      </ul>
                    </article>
                  </FadeIn>
                ))}
              </div>
            </Container>
          </Section>

          {/* ─── PARTNER NETWORK: full-viewport drift wall with the title centred on top ─── */}
          <section aria-labelledby="partner-network-title" className="relative h-[100svh] min-h-[600px] w-full overflow-hidden">
            <PartnerDriftWall partners={partners} />
            {/* Progressive fade into the page from every edge; clicks pass through to the logos. */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[38%] bg-gradient-to-b from-[#0b0b0c] via-[#0b0b0c]/70 to-transparent" />
            <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-[38%] bg-gradient-to-t from-[#0b0b0c] via-[#0b0b0c]/70 to-transparent" />
            <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 w-[28%] bg-gradient-to-r from-[#0b0b0c] via-[#0b0b0c]/60 to-transparent" />
            <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 w-[28%] bg-gradient-to-l from-[#0b0b0c] via-[#0b0b0c]/60 to-transparent" />
            <div className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center">
              <Label index="02" className="justify-center text-[12px] text-white/65">The Network</Label>
              <h2 id="partner-network-title" className="dd-h1 mt-6 font-medium [filter:drop-shadow(0_4px_24px_rgba(0,0,0,.85))]"><SplitWords>Partner network</SplitWords></h2>
            </div>
          </section>

          {/* ─── CTA ─── */}
          <Section bordered={false}>
            <Container className="text-center">
              <Label className="justify-center">Alliance</Label>
              <h2 className="dd-h2 mt-10 font-medium">
                <SplitWords>
                  Become a <span className="gradient-text">Partner</span>
                </SplitWords>
              </h2>
              <p className="mx-auto mt-8 max-w-xl text-[17px] leading-[1.65] text-white/75">
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
