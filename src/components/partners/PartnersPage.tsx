'use client';

import { useEffect, useRef, type CSSProperties } from 'react';
import PageShell from '@/components/site/PageShell';
import SplitWords from '@/components/site/SplitWords';
import { Container, Label, PrimaryButton, Section } from '@/components/site/ui';
import { gsap } from '@/lib/gsap';
import DottedWorldMap from './DottedWorldMap';
import Image from 'next/image';
import type { Partner } from '@/lib/partners';

const ecosystemIntro = [
  { text: 'From local institutions and companies to regional and international organizations, Digital Den has developed a' },
  { text: 'broad partner network', emphasis: true },
  { text: 'that supports our work across markets, programs and initiatives.' },
];

function EcosystemIntro() {
  const paragraph = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const element = paragraph.current;
    if (!element) return;

    const motion = gsap.matchMedia();
    motion.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from(element.querySelectorAll('[data-intro-word]'), {
        opacity: 0,
        y: 16,
        filter: 'blur(8px)',
        duration: 0.65,
        stagger: 0.04,
        ease: 'power2.out',
        clearProps: 'opacity,transform,filter',
        scrollTrigger: { trigger: element, start: 'top 88%', once: true },
      });
    });
    return () => motion.revert();
  }, []);

  return (
    <div data-noreveal className="grid min-h-[80svh] place-items-center bg-[#0b0b0c] px-6 py-[clamp(64px,10svh,112px)] text-center">
      <p ref={paragraph} className="max-w-[34ch] text-pretty text-[clamp(28px,3.2vw,44px)] leading-[1.3] text-[#c6c1cd]">
        {ecosystemIntro.map(({ text, emphasis }, index) => {
          const words = text.split(/(\s+)/).map((word, position) =>
            /^\s+$/.test(word) ? word : <span key={position} data-intro-word className="inline-block">{word}</span>,
          );
          return (
            <span key={text}>
              {index > 0 && ' '}
              {emphasis ? <strong className="font-semibold text-purple-200">{words}</strong> : words}
            </span>
          );
        })}
      </p>
    </div>
  );
}

const partnershipColumns = [
  {
    title: 'Who We Partner With',
    body: 'We work with organizations that share our goal of creating more opportunities for startups and founders.',
    tags: ['Institutions', 'Investors', 'Accelerators', 'Innovation Hubs', 'Corporates', 'Academic Institutions', 'Ecosystem Organizations'],
    accent: 'border-purple-300/20 text-purple-200',
  },
  {
    title: 'How We Work Together',
    body: 'We build partnerships around shared goals and practical opportunities for impact.',
    tags: ['Programs', 'Market Access', 'Events', 'Projects', 'Strategic Initiatives'],
    accent: 'border-teal-300/20 text-teal-200',
  },
];

function PartnershipStory() {
  return (
    <section aria-label="Partnerships" className="relative isolate overflow-hidden bg-[#0b0b0c] py-24 lg:py-36">
      <Container className="relative z-10 grid gap-12 text-center md:grid-cols-2 md:gap-0">
        <span aria-hidden="true" className="absolute inset-y-0 left-1/2 hidden w-px bg-gradient-to-b from-transparent via-white/20 to-transparent md:block" />
        {partnershipColumns.map(({ title, body, tags, accent }, index) => (
          <article key={title} className={index === 0 ? 'md:pr-10 lg:pr-16' : 'border-t border-white/10 pt-12 md:border-0 md:pt-0 md:pl-10 lg:pl-16'}>
            <h2 className="dd-h2 font-light">{title}</h2>
            <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-white/75">{body}</p>
            <ul role="list" className="mt-8 flex flex-wrap justify-center gap-2.5">
              {tags.map((tag) => (
                <li key={tag} className={`rounded-full border px-3 py-1.5 text-sm ${accent}`}>{tag}</li>
              ))}
            </ul>
          </article>
        ))}
      </Container>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/2 right-[94%] aspect-square w-[clamp(280px,44vw,680px)] -translate-y-1/2 rounded-full border-r border-purple-400/70 shadow-[12px_0_60px_rgba(168,85,247,0.35)]" />
        <div className="absolute top-1/2 left-[94%] aspect-square w-[clamp(280px,44vw,680px)] -translate-y-1/2 rounded-full border-l border-cyan-300/60 shadow-[-12px_0_60px_rgba(34,211,238,0.28)]" />
      </div>
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
          <div key={c} className={`drift-wall-col ${c > 4 ? 'max-md:hidden' : ''}`} style={{ '--drift-speed': `${46 + ((c * 37) % 5) * 9}s`, '--drift-offset': `${-c * 7}s` } as CSSProperties}>
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

            <div className="relative w-full px-6 pt-44 pb-20 md:px-10 xl:px-16 lg:pb-24">
              <h1 className="dd-h1 whitespace-nowrap font-medium" style={{ fontSize: 'clamp(1.5rem, 5vw, 5.25rem)' }}>
                <SplitWords>
                  Global <span className="gradient-text">Ecosystem</span>
                </SplitWords>
              </h1>
            </div>
          </section>

          <EcosystemIntro />

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

          <PartnershipStory />

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
