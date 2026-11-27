'use client';

import React, { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
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
    title: 'Who we partner with',
    body: 'Digital Den works with institutions, investors, accelerators, innovation hubs, corporations, universities, faculties and ecosystem organizations that share our goal of creating stronger opportunities for startups, founders and the wider innovation ecosystem.',
    tags: ['Institutions', 'Investors', 'Accelerators', 'Innovation hubs', 'Corporations', 'Ecosystem organizations', 'Universities & academia'],
  },
  {
    title: 'How we work together',
    body: 'From startup programs and market access to events, sector initiatives, international projects and strategic collaborations, we build partnerships around shared goals and practical opportunities for impact.',
    tags: ['Programs', 'Market Access', 'Events', 'Projects', 'Strategic Initiatives'],
  },
];

// The approved “Universities & academia” category appears as two terms in the statement.
const academicTerms = ['universities', 'faculties'];
const partnerPhrases = bridges[0].tags.flatMap((tag) =>
  tag.includes(' & ') ? academicTerms : [tag.toLowerCase()],
);
const podgoricaTime = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Europe/Podgorica',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
});

function getStatementParts(body: string) {
  const pattern = new RegExp(`(\\b(?:${partnerPhrases.join('|')})\\b)`, 'gi');

  // Preserve the original whitespace and keep each category phrase on one reveal beat.
  return body.split(pattern).flatMap((part, index) =>
    index % 2
      ? [{ text: part, category: true }]
      : (part.match(/\s+|\S+/g) ?? []).map((text) => ({ text, category: false })),
  );
}

function PartnershipStory() {
  const [partners, collaboration] = bridges;
  const root = useRef<HTMLElement>(null);
  const statement = useRef<HTMLParagraphElement>(null);
  const pathway = useRef<HTMLElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLOListElement>(null);
  const [time, setTime] = useState('');

  useEffect(() => {
    function updateTime() {
      setTime(podgoricaTime.format(new Date()));
    }
    updateTime();
    const interval = window.setInterval(updateTime, 30_000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    let disposed = false;
    const context = gsap.context(() => {
      const media = gsap.matchMedia();
      media.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
        const scene = pathway.current;
        const windowEl = viewport.current;
        const row = track.current;
        const paragraph = statement.current;
        if (!scene || !windowEl || !row || !paragraph) return;

        scene.classList.add('partners-kinetic__pathway--animated');
        const words = Array.from(paragraph.querySelectorAll<HTMLElement>('[data-reveal-word]'));
        const reveal = gsap.timeline({
          scrollTrigger: { trigger: paragraph, start: 'top 75%', end: 'bottom 45%', scrub: true },
        });
        words.forEach((word, index) => {
          reveal.fromTo(word, { color: 'rgba(255,255,255,.15)' }, {
            color: word.hasAttribute('data-category') ? '#d8b4fe' : '#fff',
            duration: 1,
            ease: 'none',
          }, index * 0.65);
        });

        const items = Array.from(row.children) as HTMLElement[];
        let centers: number[] = [];
        let midpoint = 0;
        let start = 0;
        let distance = 0;
        let active: HTMLElement | undefined;

        function measure() {
          centers = items.map((item) => item.offsetLeft + item.offsetWidth / 2);
          midpoint = windowEl!.clientWidth / 2;
          start = midpoint - centers[0];
          distance = centers[centers.length - 1] - centers[0];
        }

        function setActive(progress: number) {
          const center = midpoint - start + progress * distance;
          const index = centers.reduce((nearest, position, i) =>
            Math.abs(position - center) < Math.abs(centers[nearest] - center) ? i : nearest, 0);
          const next = items[index];
          if (next === active) return;
          active?.classList.remove('is-active');
          next.classList.add('is-active');
          active = next;
        }

        measure();
        setActive(0);
        const travel = gsap.timeline({
          defaults: { duration: 1, ease: 'none' },
          scrollTrigger: {
            trigger: scene,
            start: 'top top',
            end: () => `+=${distance}`,
            pin: true,
            scrub: true,
            invalidateOnRefresh: true,
            onRefreshInit: measure,
            onRefresh: (trigger) => setActive(trigger.progress),
            onUpdate: (trigger) => setActive(trigger.progress),
          },
        });
        travel.fromTo(row, { '--track-x': () => `${start}px` }, {
          '--track-x': () => `${start - distance}px`,
        }, 0);

        return () => {
          active?.classList.remove('is-active');
          scene.classList.remove('partners-kinetic__pathway--animated');
        };
      });
    }, root);

    void document.fonts.ready.then(() => {
      if (!disposed) ScrollTrigger.refresh();
    });

    return () => {
      disposed = true;
      context.revert();
    };
  }, []);

  return (
    <section ref={root} data-noreveal className="partners-kinetic" aria-labelledby="partnership-story-title">
      <header className="sr-only">
        <p>Partnerships</p>
        <h2 id="partnership-story-title">Built on shared goals</h2>
      </header>
      <article aria-labelledby="partnership-categories-title" className="partners-kinetic__statement">
        <Container>
          <div className="flex flex-wrap items-baseline gap-x-8 gap-y-3">
            <Label as="h2" id="partnership-categories-title" className="text-purple-300">{partners.title}</Label>
            <p className="min-h-[1.5em] text-[15px] text-white/55 tabular-nums">
              {time && `Right now, it's ${time} in Podgorica.`}
            </p>
          </div>
          <p ref={statement} className="partners-kinetic__copy font-medium text-[clamp(1.75rem,3.6vw,3.5rem)] leading-[1.15] tracking-[-0.03em]">
            {getStatementParts(partners.body).map(({ text, category }, index) =>
              /^\s+$/.test(text) ? text : (
                <span key={index} data-reveal-word data-category={category || undefined}>
                  {category ? text.split(' ').map((word, wordIndex) => (
                    <React.Fragment key={wordIndex}>{wordIndex > 0 && ' '}{word}</React.Fragment>
                  )) : text}
                </span>
              ),
            )}
          </p>
        </Container>
      </article>

      <article ref={pathway} aria-labelledby="partnership-collaboration-title" className="partners-kinetic__pathway">
        <Container>
          <h2 id="partnership-collaboration-title" className="dd-h2 font-medium">{collaboration.title}</h2>
          <p className="mt-6 max-w-md text-[17px] leading-[1.65] text-white/75">{collaboration.body}</p>
        </Container>
        <div ref={viewport} className="partners-kinetic__viewport">
          <ol ref={track} className="partners-kinetic__track" aria-label="Collaboration areas">
            {collaboration.tags.map((tag, index) => (
              <li key={tag} className="partners-kinetic__step">
                <span aria-hidden="true" className="partners-kinetic__index">{String(index + 1).padStart(2, '0')}</span>
                <span className="partners-kinetic__name">{tag}</span>
                {index < collaboration.tags.length - 1 && (
                  <span aria-hidden="true" className="partners-kinetic__separator">→</span>
                )}
              </li>
            ))}
          </ol>
        </div>
      </article>
    </section>
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
          <PartnershipStory />

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
