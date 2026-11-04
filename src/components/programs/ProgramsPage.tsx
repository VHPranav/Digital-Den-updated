'use client';

import React, { useEffect, useState } from 'react';
import PageShell from '@/components/site/PageShell';
import SplitWords from '@/components/site/SplitWords';
import { ArrowLink, BgVideo, BlurWords, PAGE_BG, Reveal } from '@/components/site/editorial';
import { ScrubText } from '@/components/events/motion';
import ProgramExplorer, { ExternalAction } from './ProgramExplorer';
import ProjectsSection from './ProjectsSection';
import { hasActiveCall, ordered, programsCopy as defaultProgramsCopy, type InternationalProject, type StartupProgram } from '@/lib/programsContent';
import type { ProgramsPageCopy } from '@/lib/sitePagesSanity';

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
              <BgVideo src={hero.video} poster={hero.poster} />
              <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/25 to-black/75" />
            </div>
            <div className="relative -mt-[100svh]">
              <div className="flex min-h-[100svh] flex-col justify-end px-6 pb-16 pt-32 lg:px-10 lg:pb-20">
                <div className="flex flex-wrap items-end justify-between gap-12">
                  <div>
                    <h1 data-plain className="text-[clamp(3.5rem,11vw,11rem)] font-medium leading-[0.86] tracking-[-0.065em]">
                      <span className="block"><BlurWords text={hero.line1} delay={0.2} /></span>
                      <span className="block font-light italic"><BlurWords text={hero.line2} delay={0.55} /></span>
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
                  <ScrubText className="text-[clamp(1.5rem,2.4vw,2.4rem)] font-medium leading-[1.25] tracking-[-0.025em]" parts={[hero.body]} />
                  <div className="mt-10 flex flex-wrap gap-8">
                    <ArrowLink href="#programs">Explore Programs</ArrowLink>
                    {activeCall?.application && <ExternalAction href={activeCall.application.href}>Apply Now</ExternalAction>}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="programs" aria-labelledby="programs-title" className={`${PAGE_BG} relative z-10 scroll-mt-20 pb-28 pt-24 lg:pb-40 lg:pt-36`}>
            <div className="mx-auto mb-12 max-w-[1480px] px-6 lg:mb-16 lg:px-10">
              <Reveal>
                <h2 id="programs-title" className="max-w-4xl text-[clamp(3rem,6.5vw,6.5rem)] font-medium leading-[0.98] tracking-[-0.05em]"><SplitWords>Explore Programs.</SplitWords></h2>
              </Reveal>
            </div>
            <ProgramExplorer programs={programs} now={now} />
          </section>

          <section aria-labelledby="global-reach-title" className="relative z-10 flex min-h-[100svh] flex-col justify-between overflow-hidden px-6 py-16 lg:px-10 lg:py-20">
            <BgVideo src={globalReach.video} poster={globalReach.poster} />
            <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/40 to-black/85" />
            <div className="relative max-w-4xl">
              <Reveal><h2 id="global-reach-title" className="text-[clamp(3rem,6.4vw,6.5rem)] font-medium leading-[0.92] tracking-[-0.055em]">{globalReach.title}</h2></Reveal>
            </div>
            <div className="relative mt-24 grid gap-10 border-t border-white/25 pt-10 md:grid-cols-12">
              {globalReach.figures.map((figure, i) => (
                <Reveal key={figure.label} delay={i * 0.1} className="md:col-span-4">
                  <p className="text-[clamp(5.5rem,11vw,11rem)] font-medium leading-none tracking-[-0.06em] tabular-nums">{figure.value}</p>
                  <p className="mt-4 text-[17px] leading-[1.6]">{figure.label}</p>
                  <p className="mt-3 max-w-xs text-white/65 text-[14px]">{figure.detail}</p>
                </Reveal>
              ))}
              <Reveal delay={0.2} className="self-end md:col-span-4"><p className="max-w-md text-white/80 text-[13px]">{globalReach.body}</p></Reveal>
            </div>
          </section>

          <section id="projects" aria-labelledby="projects-title" className={`${PAGE_BG} relative z-10 scroll-mt-20 px-6 py-28 lg:px-10 lg:py-40`}>
            <div className="mx-auto max-w-[1480px]">
              <Reveal className="mb-14 flex flex-wrap items-end justify-between gap-8 lg:mb-20">
                <div>
                  <h2 id="projects-title" className="text-[clamp(3rem,6.4vw,6.5rem)] font-medium leading-[0.92] tracking-[-0.055em]"><SplitWords>Projects.</SplitWords></h2>
                </div>
              </Reveal>
              <ProjectsSection projects={projects} />
            </div>
          </section>

          <section className={`${PAGE_BG} relative z-10 px-6 pb-36 pt-20 text-center lg:px-10 lg:pb-52 lg:pt-28`}>
            <Reveal>
              <h2 className="mx-auto max-w-5xl text-[clamp(3rem,7.5vw,7.5rem)] font-medium leading-[0.92] tracking-[-0.06em]"><SplitWords>{closing.title}</SplitWords></h2>
              <p className="mx-auto mt-8 max-w-2xl text-white/65 text-[17px] leading-[1.6]">{closing.body}</p>
              <div className="mt-12 flex flex-wrap justify-center gap-8 lg:gap-10">
                <ArrowLink href="#programs">Explore Programs</ArrowLink>
                <ArrowLink onClick={openAction}>Apply as Startup</ArrowLink>
              </div>
            </Reveal>
          </section>
        </div>
      )}
    </PageShell>
  );
}
