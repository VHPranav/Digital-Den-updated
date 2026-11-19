'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';
import PageShell from '@/components/site/PageShell';
import SplitWords from '@/components/site/SplitWords';
import { Container, Label, PrimaryButton, Section, SectionHeader } from '@/components/site/ui';
import { FadeIn } from '@/components/FadeIn';
import DottedWorldMap from './DottedWorldMap';
import Image from 'next/image';
import type { Partner } from '@/lib/partners';

// Content sourced from the Stitch "Partners" screen.

// Nina's approved partnership copy and categories.
const bridges = [
  {
    image: '/images/events/networking.jpg',
    alt: 'People connecting at a rooftop networking event',
    title: 'Who we partner with',
    body: 'Digital Den works with institutions, investors, accelerators, innovation hubs, corporations, universities, faculties and ecosystem organizations that share our goal of creating stronger opportunities for startups, founders and the wider innovation ecosystem.',
    tags: ['Institutions', 'Investors', 'Accelerators', 'Innovation hubs', 'Corporations', 'Ecosystem organizations', 'Universities & academia'],
  },
  {
    image: '/images/programs/readiness.jpg',
    alt: 'A workshop discussion around a shared table',
    title: 'How we work together',
    body: 'From startup programs and market access to events, sector initiatives, international projects and strategic collaborations, we build partnerships around shared goals and practical opportunities for impact.',
    tags: ['Programs', 'Market Access', 'Events', 'Projects', 'Strategic Initiatives'],
  },
];

function PartnershipStory() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const media = gsap.matchMedia();
    media.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
      const secondImage = root.querySelector('[data-story-image="1"]');
      const secondChapter = root.querySelector('[data-story-chapter="1"]');
      gsap.fromTo(secondImage, { opacity: 0 }, {
        opacity: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: secondChapter,
          start: 'top 85%',
          end: 'top 40%',
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });
    });
    return () => media.revert();
  }, []);

  return (
    <div ref={rootRef} className="mt-16 grid items-start gap-12 lg:mt-24 lg:grid-cols-2 lg:gap-20">
      <div className="sticky top-28 hidden h-[min(70svh,760px)] overflow-hidden rounded-sm lg:block motion-reduce:hidden">
        {bridges.map((chapter, index) => (
          <div key={chapter.title} data-story-image={index} className="absolute inset-0" style={{ opacity: index === 0 ? 1 : 0 }}>
            <Image src={chapter.image} alt={chapter.alt} fill sizes="50vw" className="object-cover" />
          </div>
        ))}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent" />
      </div>
      <div className="lg:motion-reduce:col-span-2">
        {bridges.map((chapter, index) => (
          <article key={chapter.title} data-story-chapter={index} className="flex flex-col justify-center pb-20 last:pb-0 lg:min-h-[85svh] lg:py-16">
            <div className="relative mb-10 aspect-[4/3] overflow-hidden lg:hidden motion-reduce:block">
              <Image src={chapter.image} alt={chapter.alt} fill sizes="(min-width:1024px) 80vw, 100vw" className="object-cover" />
            </div>
            <FadeIn animation="slideUp">
              <h3 className="dd-h2 max-w-md font-medium">{chapter.title}</h3>
              <p className="mt-7 max-w-xl text-[17px] leading-[1.75] text-white/75">{chapter.body}</p>
              <ul className="mt-9 flex flex-wrap gap-2.5" aria-label={`${chapter.title} categories`}>
                {chapter.tags.map((tag) => (
                  <li key={tag} className="rounded-full border border-purple-300/25 px-4 py-2 text-[13px] text-purple-100">
                    {tag}
                  </li>
                ))}
              </ul>
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
              <SectionHeader index="01" label="Partnerships" title="Built on shared goals" />
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
