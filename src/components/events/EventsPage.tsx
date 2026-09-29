'use client';

import React, { useEffect, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import PageShell from '@/components/site/PageShell';
import { useInView } from '@/hooks/use-in-view';
import FlutedShader from './FlutedShader';
import { CharReveal, ClipImage, IntroLoader, ScrollMarquee, ScrubText, useScrollProgress } from './motion';

// Content sourced from the Stitch "Events" screen; layout and motion modelled
// on an editorial portfolio (shader hero, scrubbed copy, oversized lists).

const upcoming = [
  {
    short: 'FinTech Loop',
    date: '02 Nov 2024',
    title: 'FinTech Innovation Loop: Series A Dynamics',
    body: 'A high-stakes session covering capital efficiency and market penetration for late-stage seed startups.',
    location: 'The Vault, London / Hybrid',
    cta: 'Register for Event',
    glyph: 'sun',
  },
  {
    short: 'Web3 Rails',
    date: '15 Nov 2024',
    title: 'Web3 Infrastructure: The New Rails',
    body: 'Exploring modular execution layers and the future of decentralized computing architecture.',
    location: 'Virtual Workspace',
    cta: 'Join Waitlist',
    glyph: 'spark',
  },
  {
    short: 'Founders Mixer',
    date: '28 Nov 2024',
    title: 'Founders Mixer: Q4 Portfolio Social',
    body: 'An informal evening for portfolio founders and limited partners to synchronize and network.',
    location: 'Rooftop Den, Singapore',
    cta: 'Request Invite',
    glyph: 'asterisk',
  },
] as const;

const past = [
  { tag: 'Summit 2024', date: 'Oct 12, 2024', title: 'Digital Den Global Summit: Scaling Beyond Zero', image: '/images/events/summit.jpg', cta: 'View Full Recap', aspect: 'aspect-[16/10] lg:aspect-[21/9]' },
  { tag: 'Tech Loop', date: 'Sept 24, 2024', title: 'AI Governance Workshop', image: '/images/events/ai-governance.jpg', cta: 'Access Materials', aspect: 'aspect-[16/10]' },
  { tag: 'Tech Loop', date: 'Aug 15, 2024', title: 'The Data-Driven Founder: Metrics that Matter', image: '/images/events/data-founder.jpg', cta: 'Watch Recording', aspect: 'aspect-[16/10]' },
  { tag: 'Mixer', date: 'July 02, 2024', title: 'Summer Networking Loop: VC Connect', image: '/images/events/networking.jpg', cta: 'Gallery', aspect: 'aspect-[16/10] lg:aspect-[21/9]' },
];

const stats = [
  { value: 3, unit: 'Upcoming', caption: 'Events on the calendar this season' },
  { value: 4, unit: 'Recaps', caption: 'Summits, loops and mixers to relive' },
  { value: 3, unit: 'Formats', caption: 'Tech loops, summits and founder mixers' },
  { value: 3, unit: 'Venues', caption: 'London, Singapore and virtual' },
];

/* ─── Inline glyphs (violet, like the reference's accent icons) ─── */
function Glyph({ name, className = 'h-[0.8em] w-[0.8em]' }: { name: string; className?: string }) {
  const common = { className, viewBox: '0 0 24 24', 'aria-hidden': true } as const;
  switch (name) {
    case 'ring':
      return (
        <svg {...common}>
          <rect x="4" y="4" width="16" height="16" rx="5" transform="rotate(45 12 12)" fill="none" stroke="#c084fc" strokeWidth="3.5" />
        </svg>
      );
    case 'clover':
      return (
        <svg {...common} fill="#a855f7">
          <circle cx="12" cy="6" r="4.2" />
          <circle cx="6" cy="12" r="4.2" />
          <circle cx="18" cy="12" r="4.2" />
          <circle cx="12" cy="18" r="4.2" />
        </svg>
      );
    case 'sun':
      return (
        <svg {...common} stroke="#c084fc" strokeWidth="2" strokeLinecap="round">
          {Array.from({ length: 16 }).map((_, i) => {
            const a = (i / 16) * Math.PI * 2;
            const r = (n: number) => Math.round(n * 1000) / 1000;
            return <line key={i} x1={r(12 + Math.cos(a) * 5)} y1={r(12 + Math.sin(a) * 5)} x2={r(12 + Math.cos(a) * 11)} y2={r(12 + Math.sin(a) * 11)} />;
          })}
        </svg>
      );
    case 'spark':
      return (
        <svg {...common} fill="#c084fc">
          <path d="M12 0c.8 6.4 4.8 10.6 12 12-7.2 1.4-11.2 5.6-12 12-.8-6.4-4.8-10.6-12-12C7.2 10.6 11.2 6.4 12 0z" />
        </svg>
      );
    default:
      return (
        <svg {...common} fill="#a855f7">
          {[0, 45, 90, 135].map((r) => (
            <rect key={r} x="10" y="1" width="4" height="22" rx="2" transform={`rotate(${r} 12 12)`} />
          ))}
        </svg>
      );
  }
}

function Counter({ to }: { to: number }) {
  const [ref, inView] = useInView({ triggerOnce: true, rootMargin: '-60px' });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let f = 0;
    const s = performance.now();
    const tick = (n: number) => {
      const t = Math.min((n - s) / 1400, 1);
      setV(Math.round(to * (1 - Math.pow(1 - t, 3))));
      if (t < 1) f = requestAnimationFrame(tick);
    };
    f = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(f);
  }, [inView, to]);
  return <span ref={ref}>{String(v).padStart(2, '0')}</span>;
}

function Ruler({ progress }: { progress: number }) {
  return (
    <div className="pointer-events-none absolute right-6 lg:right-10 top-0 bottom-0 hidden md:flex flex-col justify-between py-2" aria-hidden="true">
      {Array.from({ length: 28 }).map((_, i) => (
        <span key={i} className={`h-px bg-white/25 ${i % 7 === 0 ? 'w-3' : 'w-1.5'}`} />
      ))}
      <span
        className="absolute -left-2.5 h-0 w-0 border-y-[4px] border-r-[6px] border-y-transparent border-r-white transition-[top] duration-150"
        style={{ top: `${progress * 100}%` }}
      />
    </div>
  );
}

const italic = 'italic font-light tracking-[-0.035em]';

export default function EventsPage() {
  const [ready, setReady] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);
  const [subscribed, setSubscribed] = useState(false);
  const [scrubRef, scrubProgress] = useScrollProgress<HTMLDivElement>({ start: 0.85, end: 0.45 });

  return (
    <PageShell>
      {(openAction) => (
        <div className="bg-[#0b0b0c]">
          <IntroLoader onDone={() => setReady(true)} />

          {/* ─── HERO: fluted-glass shader + staggered mixed type ─── */}
          <section className="relative h-[100svh] min-h-[680px] overflow-hidden">
            <div className="absolute inset-0">
              <FlutedShader />
            </div>
            <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-[#0b0b0c] via-[#0b0b0c]/70 to-transparent" />

            {/* Centred block sized by its longest line: roman lines hug the left
                edge, italic lines hug the right, captions sit under the edges. */}
            <div className="relative z-10 flex h-full justify-center px-6">
              <div className="flex h-full w-fit max-w-full flex-col">
                <div className="flex flex-1 items-center">
                  <h1 className="flex w-fit flex-col text-[clamp(2.9rem,6.2vw,9.25rem)] font-medium leading-[0.98] tracking-[-0.045em]">
                    <span className="self-start">
                      <CharReveal text="Architecting" play={ready} delay={0.1} />
                    </span>
                    <span className={`self-end pl-[0.8em] md:pl-[2.9em] ${italic}`}>
                      <CharReveal text="the future," play={ready} delay={0.35} />
                    </span>
                    <span className="self-start">
                      <CharReveal text="one event" play={ready} delay={0.6} />
                    </span>
                    <span className="relative self-end pl-[0.8em] md:pl-[2.9em]">
                      <span className={italic}>
                        <CharReveal text="at a time." play={ready} delay={0.8} />
                      </span>
                      <button
                        type="button"
                        onClick={openAction}
                        className="absolute left-full top-1/2 ml-5 hidden -translate-y-1/2 whitespace-nowrap rounded-full border border-white/60 px-7 py-3 text-base font-normal not-italic tracking-normal transition-all duration-500 hover:bg-white hover:text-black md:block"
                        style={{ opacity: ready ? 1 : 0, transition: 'opacity .8s ease 1.3s, background-color .4s, color .4s' }}
                      >
                        Register
                      </button>
                    </span>
                    <button
                      type="button"
                      onClick={openAction}
                      className="mt-8 self-start rounded-full border border-white/60 px-7 py-3 text-base font-normal tracking-normal md:hidden"
                      style={{ opacity: ready ? 1 : 0, transition: 'opacity .8s ease 1.3s' }}
                    >
                      Register
                    </button>
                  </h1>
                </div>

                <div
                  className="grid w-full grid-cols-2 gap-10 pb-10 text-[13px] leading-relaxed text-white/60"
                  style={{ opacity: ready ? 1 : 0, transition: 'opacity 1s ease 1.5s' }}
                >
                  <p className="max-w-[15rem]">Access exclusive venture workshops and networking mixers</p>
                  <p className="max-w-[15rem] justify-self-end">Deep-dive technical loops within the Digital Den ecosystem</p>
                </div>
              </div>
            </div>
          </section>

          {/* ─── SCRUBBED MANIFESTO ─── */}
          <section className="relative mx-auto max-w-[1240px] px-6 pt-40 pb-44 lg:px-10">
            <div ref={scrubRef} className="relative pr-0 md:pr-16">
              <ScrubText
                className="text-[clamp(1.6rem,3.2vw,2.75rem)] font-normal leading-[1.32] tracking-[-0.02em]"
                parts={[
                  'Access exclusive venture',
                  { underline: 'workshops,' },
                  'networking mixers',
                  { glyph: <Glyph name="ring" /> },
                  'and deep-dive technical loops within the Digital Den ecosystem. From FinTech',
                  { underline: 'innovation loops' },
                  { glyph: <Glyph name="clover" /> },
                  'and Web3 infrastructure sessions to founder mixers',
                  { glyph: <Glyph name="sun" /> },
                  '— every event is architected to put founders, partners and investors in the same',
                  { underline: 'room.' },
                ]}
              />
              <Ruler progress={scrubProgress} />
            </div>
          </section>

          {/* ─── RELIVE REEL ─── */}
          <section className="relative h-[100svh] min-h-[560px] overflow-hidden">
            <div className="absolute inset-0">
              <ClipImage src="/images/events/reel-poster.jpg" video="/videos/events-summit.mp4" alt="Digital Den Global Summit" className="h-full w-full [&_video]:grayscale" />
            </div>
            <div className="absolute inset-0 bg-black/45" />
            <div className="absolute inset-0 flex flex-col justify-center gap-2">
              <ScrollMarquee distance={35} className="text-[clamp(4rem,13vw,13rem)] leading-[0.95] tracking-[-0.05em]">
                {Array.from({ length: 3 }).map((_, i) => (
                  <span key={i} className="inline-flex items-center">
                    Relive the <span className={`${italic} ml-[0.25em]`}>Summit</span>
                    <span className="mx-[0.35em] inline-block h-[0.55em] w-[0.55em] rounded-full bg-white align-middle" />
                  </span>
                ))}
              </ScrollMarquee>
            </div>
            <p className="absolute bottom-10 left-6 lg:left-10 text-xs uppercase tracking-[0.3em] text-white/70">Oct 12, 2024 · Scaling Beyond Zero</p>
          </section>

          {/* ─── STATS ─── */}
          <section className="mx-auto max-w-[1240px] px-6 py-32 lg:px-10">
            <div className="grid grid-cols-2 lg:grid-cols-4">
              {stats.map((s, i) => (
                <div key={s.unit} className={`border-l border-white/15 px-5 py-6 lg:px-6 ${i === 3 ? 'border-r' : i === 1 ? 'border-r lg:border-r-0' : ''}`}>
                  <div className="flex items-start gap-2">
                    <span className="text-[clamp(3.5rem,7vw,6rem)] font-normal leading-none tracking-[-0.05em] tabular-nums">
                      <Counter to={s.value} />
                    </span>
                    <span className="pt-2 text-xs text-white/70">{s.unit}</span>
                  </div>
                  <p className="mt-8 max-w-[12rem] text-[13px] leading-relaxed text-white/50">{s.caption}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ─── UPCOMING: OVERSIZED LIST ─── */}
          <section className="py-28">
            <div className="mx-auto mb-16 grid max-w-[1240px] grid-cols-1 gap-6 px-6 text-[13px] lg:grid-cols-3 lg:px-10">
              <p className="text-white">Upcoming Events</p>
              <p className="max-w-sm text-white/55">Venture workshops, deep-dive loops and founder mixers on the Digital Den calendar.</p>
              <button type="button" onClick={openAction} className="justify-self-start lg:justify-self-end underline underline-offset-4 decoration-white/40 hover:decoration-white">
                Register interest
              </button>
            </div>

            <ul onMouseLeave={() => setHovered(null)}>
              {upcoming.map((e, i) => {
                const active = hovered === i;
                const dim = hovered !== null && !active;
                return (
                  <li key={e.title} onMouseEnter={() => setHovered(i)}>
                    <button
                      type="button"
                      onClick={openAction}
                      className="group block w-full px-6 py-3 text-left lg:px-16"
                      aria-label={`${e.title}, ${e.date}, ${e.location}. ${e.cta}`}
                    >
                      <div className="grid grid-cols-[1fr_auto] items-center gap-4 lg:grid-cols-[10rem_1fr_12rem]">
                        <span className={`hidden text-[13px] transition-colors duration-500 lg:block ${dim ? 'text-white/25' : 'text-white/60'}`}>{e.date}</span>
                        <span
                          className={`flex items-center justify-start gap-[0.2em] text-[clamp(2.4rem,6.6vw,6.25rem)] font-normal uppercase leading-[1.02] tracking-[-0.035em] transition-colors duration-500 lg:justify-center ${dim ? 'text-white/20' : active ? 'text-white' : 'text-white/55'
                            }`}
                        >
                          <Glyph name={e.glyph} className="h-[0.62em] w-[0.62em] shrink-0" />
                          {e.short}
                        </span>
                        <span className={`text-right text-[13px] transition-colors duration-500 ${dim ? 'text-white/25' : 'text-white/60'}`}>{e.location}</span>
                      </div>
                      <div className={`grid transition-all duration-700 ${active ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                        <div className="overflow-hidden">
                          <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 pb-6 pt-4 text-center">
                            <p className="text-lg text-white/85">{e.title}</p>
                            <p className="text-[14px] leading-relaxed text-white/50">{e.body}</p>
                            <span className="inline-flex items-center gap-2 text-sm text-purple-200">
                              {e.cta} <ArrowUpRight className="h-4 w-4" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>

          {/* ─── PAST EVENTS: PROJECT-STYLE LIST ─── */}
          <section className="mx-auto max-w-[1240px] px-6 pb-24 pt-16 lg:px-10">
            <div className="mb-20 grid grid-cols-1 gap-6 text-[13px] lg:grid-cols-3">
              <p className="text-white">Past Events</p>
              <p className="max-w-sm text-white/55">Relive the highlights and access workshop recordings.</p>
            </div>

            {past.map((e) => (
              <article key={e.title} className="border-t border-white/10 pb-24 pt-10">
                <span className="inline-block rounded-full border border-white/20 px-3 py-1 text-[11px] text-white/80">{e.tag}</span>
                <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
                  <h3 className="max-w-3xl text-[clamp(1.75rem,3vw,2.5rem)] font-normal leading-[1.1] tracking-[-0.03em]">{e.title}</h3>
                  <div className="flex items-center gap-6 text-[13px]">
                    <span className="text-white/40">{e.date}</span>
                    <button type="button" onClick={openAction} className="underline underline-offset-4 decoration-white/40 hover:decoration-white">
                      {e.cta}
                    </button>
                  </div>
                </div>
                <ClipImage src={e.image} alt={e.title} sizes="(max-width: 1240px) 100vw, 1240px" className={`mt-10 w-full ${e.aspect}`} />
              </article>
            ))}
          </section>

          {/* ─── KINETIC TYPE ─── */}
          <section className="overflow-hidden py-20">
            <ScrollMarquee distance={25} className="text-[clamp(4rem,11vw,11rem)] font-normal leading-[1] tracking-[-0.05em]">
              {Array.from({ length: 3 }).map((_, i) => (
                <span key={i} className="inline-flex items-center pr-[0.4em]">
                  Get notified
                  <Glyph name="sun" className="mx-[0.3em] h-[0.7em] w-[0.7em]" />
                </span>
              ))}
            </ScrollMarquee>
            <ScrollMarquee direction={-1} distance={25} className={`text-[clamp(4rem,11vw,11rem)] leading-[1.05] ${italic}`}>
              {Array.from({ length: 3 }).map((_, i) => (
                <span key={i} className="inline-flex items-center pr-[0.4em]">
                  pure signal
                  <Glyph name="spark" className="mx-[0.3em] h-[0.45em] w-[0.45em]" />
                </span>
              ))}
            </ScrollMarquee>
          </section>

          {/* ─── NEWSLETTER ─── */}
          <section className="mx-auto max-w-[1240px] px-6 pb-40 pt-24 lg:px-10">
            <h2 className={`text-[clamp(3.5rem,10vw,9.5rem)] leading-[0.95] ${italic}`}>Never miss a beat.</h2>
            <div className="mt-16 grid grid-cols-1 items-end gap-10 lg:grid-cols-2">
              <p className="max-w-sm text-[13px] leading-relaxed text-white/55">
                Get notified about the next high-stakes loop, summit, or founder mixer. No spam, just pure signal.
              </p>
              {subscribed ? (
                <p className="justify-self-start text-lg lg:justify-self-end">You&apos;re on the list.</p>
              ) : (
                <form
                  onSubmit={(ev) => {
                    ev.preventDefault();
                    setSubscribed(true);
                  }}
                  className="flex w-full max-w-lg items-center gap-3 justify-self-start rounded-full border border-white/25 p-1.5 pl-6 transition-colors focus-within:border-white lg:justify-self-end"
                >
                  <input
                    type="email"
                    required
                    placeholder="Your email"
                    aria-label="Email address"
                    className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-white/35"
                  />
                  <button type="submit" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm text-black transition-colors hover:bg-purple-100">
                    Subscribe <ArrowUpRight className="h-4 w-4" />
                  </button>
                </form>
              )}
            </div>
          </section>

        </div>
      )}
    </PageShell>
  );
}
