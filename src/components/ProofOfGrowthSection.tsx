'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { FadeIn } from './FadeIn';
import { headingGradient } from './home/SectionIntro';
import { proofOfGrowth } from '@/lib/homeContent';

// Portfolio highlights — exactly the approved content: title, one sentence, "Explore Full
// Portfolio", plus 3–4 real startups once Digital Den confirms them (src/lib/homeContent.ts).
// Kinetic statement: the sentence is set large and lights up word by word as you scroll;
// the four outcomes (investment, revenue, clients, international market presence) light up
// in the brand gradient.
const SENTENCE = 'Startups that turned potential into investment, revenue, clients and international market presence.';
const OUTCOMES = new Set(['investment', 'revenue', 'clients', 'international', 'market', 'presence']);
const DIM = 0.14;

const outcomeGradient: React.CSSProperties = {
  backgroundImage: 'linear-gradient(90deg, #d8b4fe 0%, #a855f7 45%, #38bdf8 100%)',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
};

type Card = { name: string; logo?: string; image?: string; achievement: string; metric?: string; href?: string };

const tints = [
  'from-[#6d28d9] via-[#3b1a78] to-[#120a24]',
  'from-[#7c3aed] via-[#2a1458] to-[#0b0b0c]',
  'from-[#0ea5e9] via-[#3b1a78] to-[#120a24]',
  'from-[#a855f7] via-[#2a1458] to-[#0b0b0c]',
];

function StartupCard({ s, i }: { s: Card; i: number }) {
  const inner = (
    <>
      <div className="relative aspect-square w-full overflow-hidden rounded-[24px] border border-white/10">
        {s.image ? (
          <Image src={s.image} alt="" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.05]" />
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${tints[i % tints.length]}`} />
        )}
        {/* Brand wash so the logo reads on any photo */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#2a1458]/60 via-[#1a0d38]/55 to-black/70 mix-blend-multiply" />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 flex items-center justify-center p-8">
          {s.logo ? (
            <div className="relative h-14 w-full max-w-[220px] drop-shadow-[0_2px_18px_rgba(0,0,0,0.45)]">
              <Image src={s.logo} alt={`${s.name} logo`} fill className="object-contain" sizes="220px" />
            </div>
          ) : (
            <span className="text-2xl font-medium text-white/90">{s.name}</span>
          )}
        </div>
      </div>
      <h3 className="mt-5 font-['Plus_Jakarta_Sans',sans-serif] text-xl font-medium leading-snug tracking-tight text-white">{s.name}</h3>
      <p className="mt-2 text-[15px] leading-[1.5] text-white/70">{s.achievement}</p>
      {s.metric && <p className="mt-3 text-sm font-medium text-purple-200">{s.metric}</p>}
    </>
  );
  return (
    <FadeIn animation="slideUp" delay={0.15 + i * 0.12}>
      {s.href ? (
        <Link href={s.href} className="group block">{inner}</Link>
      ) : (
        <div className="group block">{inner}</div>
      )}
    </FadeIn>
  );
}

export default function ProofOfGrowthSection() {
  const startups = proofOfGrowth.slice(0, 4);
  const cards: Card[] =
    startups.length > 0
      ? startups
      : [
          { img: 'datamesh', n: 1 },
          { img: 'neuralnexus', n: 2 },
          { img: 'ecotrace', n: 3 },
        ].map(({ img, n }) => ({
          name: `Startup name ${n}`,
          image: `/images/portfolio/${img}.jpg`,
          logo: `/images/portfolio/logos/logo${n}.svg`,
          achievement: 'Approved result or achievement',
        }));
  const statementRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = statementRef.current;
    if (!el) return;
    const words = el.querySelectorAll<HTMLElement>('[data-word]');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      words.forEach((w) => (w.style.opacity = '1'));
      return;
    }
    const ctx = gsap.context(() => {
      gsap.fromTo(
        words,
        { opacity: DIM },
        {
          opacity: 1,
          ease: 'none',
          stagger: 0.12,
          scrollTrigger: { trigger: el, start: 'top 82%', end: 'bottom 48%', scrub: 0.6 },
        }
      );
    }, el);
    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, []);

  return (
    <section id="proof-of-growth" className="relative w-full max-w-[1450px] mx-auto px-4 sm:px-8 lg:px-12">
      {/* Soft ambient light (no box) */}
      <div className="pointer-events-none absolute -top-20 left-[-10%] h-[380px] w-[620px] rounded-full bg-purple-600/[0.10] blur-[130px]" />

      <div className="relative flex flex-wrap items-end justify-between gap-6">
        <FadeIn animation="fadeIn" delay={0.1}>
          <p className="mb-4 font-['Plus_Jakarta_Sans',sans-serif] text-[11px] sm:text-xs font-medium uppercase tracking-[0.2em] text-white/45">Portfolio Highlights</p>
          <h2 className="text-3xl font-medium leading-[110%] tracking-tight sm:text-4xl lg:text-[48px]" style={headingGradient}>
            Proof of Growth
          </h2>
        </FadeIn>
        <FadeIn animation="fadeIn" delay={0.2}>
          <Link href="/portfolio" className="group inline-flex items-center gap-3 pb-1 text-[15px] font-medium text-white">
            <span className="relative">
              Explore Full Portfolio
              <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-[0.35] bg-gradient-to-r from-purple-400 to-sky-400 transition-transform duration-500 group-hover:scale-x-100" />
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 transition-all duration-500 group-hover:rotate-45 group-hover:border-transparent group-hover:bg-white group-hover:text-black">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </Link>
        </FadeIn>
      </div>

      {/* Kinetic statement */}
      <p
        ref={statementRef}
        className="relative mt-8 sm:mt-10 max-w-[900px] font-['Plus_Jakarta_Sans',sans-serif] text-[clamp(1.25rem,2vw,1.75rem)] font-medium leading-[1.4] tracking-[-0.02em] text-white"
      >
        {SENTENCE.split(' ').map((word, i, arr) => {
          const isOutcome = OUTCOMES.has(word.replace(/[^a-z]/gi, '').toLowerCase());
          return (
            <React.Fragment key={i}>
              <span data-word className="inline-block" style={{ opacity: DIM, ...(isOutcome ? outcomeGradient : null) }}>
                {word}
              </span>
              {i < arr.length - 1 && ' '}
            </React.Fragment>
          );
        })}
      </p>

      {/* Selected startups (DD-approved data only): equal square image cards with the logo centred,
          name and result below. Until DD supplies the final startups, three layout placeholders show
          how they will appear. */}
      <div className={`mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 ${cards.length === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'}`}>
        {cards.map((c, i) => (
          <StartupCard key={c.name} s={c} i={i} />
        ))}
      </div>
    </section>
  );
}
