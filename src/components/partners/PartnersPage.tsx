'use client';

import React from 'react';
import PageShell from '@/components/site/PageShell';
import SplitWords from '@/components/site/SplitWords';
import { Container, Label, PrimaryButton, Section } from '@/components/site/ui';
import { FadeIn } from '@/components/FadeIn';
import DottedWorldMap from './DottedWorldMap';
import Image from 'next/image';
import type { Partner } from '@/lib/partners';

// Content sourced from the Stitch "Partners" screen.

// Nina's approved partnership copy and categories.
const bridges = [
  {
    image: '/images/events/networking.jpg',
    alt: 'People connecting at a networking event',
    title: 'Who we partner with',
    body: 'Digital Den works with institutions, investors, accelerators, innovation hubs, corporations, universities, faculties and ecosystem organizations that share our goal of creating stronger opportunities for startups, founders and the wider innovation ecosystem.',
    tags: ['Institutions', 'Investors', 'Accelerators', 'Innovation hubs', 'Corporations', 'Ecosystem organizations', 'Universities & academia'],
  },
  {
    image: '/images/programs/readiness.jpg',
    alt: 'A collaborative workshop around a shared table',
    title: 'How we work together',
    body: 'From startup programs and market access to events, sector initiatives, international projects and strategic collaborations, we build partnerships around shared goals and practical opportunities for impact.',
    tags: ['Programs', 'Market Access', 'Events', 'Projects', 'Strategic Initiatives'],
  },
];

function PartnershipStory() {
  return (
    <div className="grid gap-14 lg:grid-cols-12 lg:gap-12 xl:gap-20">
      <div className="lg:col-span-4">
        <div className="lg:sticky lg:top-32">
          <FadeIn animation="slideUp">
            <p className="mb-6 text-[12px] uppercase tracking-[0.2em] text-purple-200">Partnerships</p>
            <h2 className="dd-h2 max-w-md font-medium"><SplitWords>Built on shared goals</SplitWords></h2>
          </FadeIn>
        </div>
      </div>
      <div className="space-y-16 lg:col-span-8 lg:space-y-20">
        {bridges.map((chapter) => (
          <article key={chapter.title} aria-label={chapter.title} className="border-t border-white/15 pt-8 lg:border-l lg:border-t-0 lg:border-purple-300/20 lg:pl-8 lg:pt-0 xl:pl-12">
            <FadeIn animation="slideUp" className="grid gap-8 md:grid-cols-2 xl:gap-12">
              <div>
                <h3 className="dd-h3 max-w-xs font-medium text-white">{chapter.title}</h3>
                <ul className="mt-7 flex flex-wrap gap-2" aria-label={`${chapter.title} categories`}>
                  {chapter.tags.map((tag) => (
                    <li key={tag} className="rounded-full border border-purple-300/25 bg-purple-300/[0.04] px-3 py-2 text-[12px] leading-snug text-purple-100">
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="relative aspect-[8/5] overflow-hidden rounded-sm">
                  <Image src={chapter.image} alt={chapter.alt} fill sizes="(min-width:1280px) 320px, (min-width:768px) 40vw, 100vw" className="object-cover" />
                </div>
                <p className="mt-5 text-[16px] leading-[1.75] text-white/80">{chapter.body}</p>
              </div>
            </FadeIn>
          </article>
        ))}
      </div>
    </div>
  );
}

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
                  <h1 className="dd-h1 whitespace-nowrap font-medium" style={{ fontSize: 'clamp(1.5rem, 5vw, 5.25rem)' }}>
                    <SplitWords>
                      Global <span className="gradient-text">Ecosystem</span>
                    </SplitWords>
                  </h1>
                </div>
                <FadeIn animation="slideUp" delay={0.3} className="lg:max-w-sm">
                  <p className="text-[17px] leading-[1.65] text-white/75">
                    From local institutions and companies to regional and international organizations, Digital Den has
                    developed a broad partner network that supports our work across markets, programs and initiatives.
                  </p>
                </FadeIn>
              </div>
            </div>
          </section>

          {/* ─── PARTNERSHIPS ─── */}
          <Section>
            <Container>
              <PartnershipStory />
            </Container>
          </Section>

          {/* ─── PARTNER NETWORK: full-viewport drift wall with the title centred on top ─── */}
          <section aria-labelledby="partner-network-title" className="relative h-[100svh] min-h-[600px] w-full overflow-hidden">
            <PartnerDriftWall partners={partners} />
            {/* Progressive fade into the page from every edge; clicks pass through to the logos. */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[27%] bg-gradient-to-b from-[#0b0b0c] via-[#0b0b0c]/45 to-transparent" />
            <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-[27%] bg-gradient-to-t from-[#0b0b0c] via-[#0b0b0c]/45 to-transparent" />
            <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 w-[19%] bg-gradient-to-r from-[#0b0b0c] via-[#0b0b0c]/35 to-transparent" />
            <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 w-[19%] bg-gradient-to-l from-[#0b0b0c] via-[#0b0b0c]/35 to-transparent" />
            <div className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center">
              <Label index="02" className="justify-center text-[12px] text-white/65">The Network</Label>
              <h2 id="partner-network-title" data-plain className="dd-h1 mt-6 font-medium text-white [filter:drop-shadow(0_4px_24px_rgba(0,0,0,.85))]"><SplitWords>Partner network</SplitWords></h2>
            </div>
          </section>

          {/* ─── CTA ─── */}
          <Section bordered={false}>
            <Container className="text-center">
              <h2 className="dd-h2 font-medium">
                <SplitWords>
                  Become a <span className="gradient-text">Partner</span>
                </SplitWords>
              </h2>
              <div className="mt-12 flex justify-center">
                <PrimaryButton onClick={openAction}>Join Now</PrimaryButton>
              </div>
            </Container>
          </Section>
        </>
      )}
    </PageShell>
  );
}
