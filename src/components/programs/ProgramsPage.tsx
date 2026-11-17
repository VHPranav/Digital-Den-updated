'use client';

import React, { useEffect, useState } from 'react';
import PageShell from '@/components/site/PageShell';
import SplitWords from '@/components/site/SplitWords';
import { ArrowLink, BgVideo, BlurWords, PAGE_BG, Reveal } from '@/components/site/editorial';
import { ScrubText } from '@/components/events/motion';
import ProgramExplorer, { ExternalAction } from './ProgramExplorer';
import ProjectsSection from './ProjectsSection';
import { useInView } from '@/hooks/use-in-view';
import { withoutTrailingPeriod, hasActiveCall, ordered, programsCopy as defaultProgramsCopy, type InternationalProject, type StartupProgram } from '@/lib/programsContent';
import type { ProgramsPageCopy } from '@/lib/sitePagesSanity';

// Counts 00 → target one visible step at a time once the section is on screen (Nina asked for the
// earlier "numbers dynamically increase to 03 and 04" effect). Reduced motion shows the final value.
function ReachCountUp({ value, delay = 0 }: { value: string; delay?: number }) {
  const [ref, inView] = useInView({ triggerOnce: true, rootMargin: '-80px' });
  const parts = value.match(/^([^\d.,-]*)(\d+)([^\d.,]*)$/);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView || !parts) return;
    const target = Number(parts[2]);
    if (!Number.isSafeInteger(target) || target === 0) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const step = Math.max(80, 600 / target); // whole count takes ~0.6s
    let timer = 0;
    const startTimer = window.setTimeout(() => {
      if (reduced) { setCount(target); return; }
      let n = 0;
      timer = window.setInterval(() => {
        n += 1;
        setCount(n);
        if (n >= target) window.clearInterval(timer);
      }, step);
    }, reduced ? 0 : 150 + delay * 1000);
    return () => { window.clearTimeout(startTimer); window.clearInterval(timer); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, value, delay]);

  const shown = parts ? parts[1] + String(count).padStart(parts[2].length, '0') + parts[3] : value;
  return (
    <span ref={ref}>
      <span className="sr-only">{value}</span>
      <span aria-hidden="true" key={shown} className="dd-count-tick inline-block">{shown}</span>
    </span>
  );
}

// Keep scheduled calls correct even when this page was exported before a call opened.
function useApplicationTime(programs: StartupProgram[]) {
  const [now, setNow] = useState(0);
  useEffect(() => {
    const update = () => setNow(Date.now());
    const frame = requestAnimationFrame(update);
    window.addEventListener('focus', update);
    document.addEventListener('visibilitychange', update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('focus', update);
      document.removeEventListener('visibilitychange', update);
    };
  }, []);
  useEffect(() => {
    if (!now) return;
    const next = programs.flatMap((p) => [p.application?.opensAt, p.application?.closesAt])
      .filter((date): date is string => Boolean(date)).map(Date.parse)
      .filter((date) => date > now).sort((a, b) => a - b)[0];
    if (next === undefined) return;
    const timer = window.setTimeout(() => setNow(Date.now()), Math.min(next - now + 1, 2_147_483_647));
    return () => window.clearTimeout(timer);
  }, [now]);
  return now;
}

export default function ProgramsPage({ programs: programItems, projects, copy = defaultProgramsCopy }: { programs: StartupProgram[]; projects: InternationalProject[]; copy?: ProgramsPageCopy }) {
  const programs = ordered(programItems);
  const now = useApplicationTime(programs);
  const activeCall = now ? programs.find((p) => hasActiveCall(p, now)) : undefined;
  const { hero, globalReach, closing } = copy;
  return (
    <PageShell minimalFooter>
      {(openAction) => (
        <div className={`${PAGE_BG} text-[#f3f0ea]`}>
          <section className="relative">
            <div className="sticky top-0 h-[100svh] overflow-hidden">
              <BgVideo src={hero.video} poster={hero.poster} cropMark />
              <div className="dd-media-shade absolute inset-0" />
            </div>
            <div className="relative -mt-[100svh]">
              <div className="flex min-h-[100svh] flex-col justify-end px-6 pb-16 pt-32 lg:px-10 lg:pb-20">
                <div className="flex flex-wrap items-end justify-between gap-12">
                  <div>
                    <h1 data-plain className="dd-h1 font-medium">
                      <span className="block"><BlurWords text={withoutTrailingPeriod(hero.line1)} delay={0.2} /></span>
                      <span className="block font-light italic"><BlurWords text={withoutTrailingPeriod(hero.line2)} delay={0.55} /></span>
                    </h1>
                  </div>
                  <nav aria-label="On this page" className="mb-3 flex gap-6 text-[13px] text-white/75">
                    <a href="#programs" className="border-b border-white/30 pb-2 hover:text-white">Startup Programs <span aria-hidden="true">↓</span></a>
                    <a href="#projects" className="border-b border-white/30 pb-2 hover:text-white">Projects <span aria-hidden="true">↓</span></a>
                  </nav>
                </div>
              </div>
              <div className="flex min-h-[100svh] items-center px-6 py-24 lg:px-10">
                <div className="w-full max-w-[46rem]">
                  <ScrubText className="text-[clamp(1.375rem,2.2vw,2.2rem)] font-medium leading-[1.25] tracking-[-0.025em]" parts={[hero.body]} />
                  <div className="mt-10 flex flex-wrap gap-8">
                    <ArrowLink href="#programs">Explore Programs</ArrowLink>
                    {activeCall?.application && <ExternalAction href={activeCall.application.href}>Apply Now</ExternalAction>}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="programs" aria-labelledby="programs-title" className={`${PAGE_BG} relative z-10 scroll-mt-20 dd-section`}>
            <div className="mx-auto max-w-[1480px] px-6 lg:px-10 dd-section-head">
              <Reveal>
                <h2 id="programs-title" className="dd-h2 max-w-4xl font-medium"><SplitWords>Explore Programs</SplitWords></h2>
              </Reveal>
            </div>
            <ProgramExplorer programs={programs} now={now} />
          </section>

          <section id="projects" aria-labelledby="projects-title" className={`${PAGE_BG} relative z-10 scroll-mt-20 px-6 lg:px-10 dd-section`}>
            <div className="mx-auto max-w-[1480px]">
              <Reveal className="dd-section-head flex flex-wrap items-end justify-between gap-8">
                <div>
                  <h2 id="projects-title" className="dd-h2 font-medium"><SplitWords>Projects</SplitWords></h2>
                </div>
              </Reveal>
              <Reveal delay={0.1}><ProjectsSection projects={projects} /></Reveal>
            </div>
          </section>

          <section aria-labelledby="global-reach-title" className="relative z-10 flex min-h-[100svh] flex-col justify-between overflow-hidden px-6 dd-section lg:px-10">
            <BgVideo src={globalReach.video} poster={globalReach.poster} cropMark />
            <div className="dd-media-shade absolute inset-0" />
            {/* Extra shade behind the metrics row so the supporting text reads clearly over the video */}
            <div className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
            <div className="relative max-w-4xl">
              <Reveal><h2 id="global-reach-title" className="dd-h2 font-medium"><SplitWords>{withoutTrailingPeriod(globalReach.title)}</SplitWords></h2></Reveal>
            </div>
            <div className="relative mt-24 grid gap-10 border-t border-white/25 pt-10 md:grid-cols-12">
              {globalReach.figures.map((figure, i) => (
                <Reveal key={figure.label} delay={i * 0.1} className="md:col-span-4">
                  <p className="text-[clamp(5.5rem,11vw,11rem)] font-medium leading-none tracking-[-0.06em] tabular-nums"><ReachCountUp value={figure.value} delay={i * 0.12} /></p>
                  <p className="mt-4 text-[20px] font-medium leading-[1.4] text-white">{figure.label}</p>
                  <p className="mt-2 max-w-xs text-[16px] leading-[1.6] text-white/85">{figure.detail}</p>
                </Reveal>
              ))}
              <Reveal delay={0.2} className="self-end md:col-span-4"><p className="max-w-md text-[17px] leading-[1.65] text-white/90">{globalReach.body}</p></Reveal>
            </div>
          </section>

          <section className={`${PAGE_BG} relative z-10 px-6 text-center lg:px-10 dd-section`}>
            <Reveal>
              <h2 className="dd-h2 mx-auto max-w-5xl font-medium"><SplitWords>{withoutTrailingPeriod(closing.title)}</SplitWords></h2>
              <p className="mx-auto mt-8 max-w-2xl text-[17px] leading-[1.65] text-white/75">{closing.body}</p>
              <div className="mt-12 flex flex-wrap justify-center gap-8 lg:gap-10">
                <ArrowLink onClick={openAction}>Apply Now</ArrowLink>
              </div>
            </Reveal>
          </section>
        </div>
      )}
    </PageShell>
  );
}
