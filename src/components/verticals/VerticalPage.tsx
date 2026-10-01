'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import PageShell from '@/components/site/PageShell';
import SplitWords from '@/components/site/SplitWords';
import JoinForm from '@/components/site/JoinForm';
import { Container, Figure, Label, PrimaryButton, Section, SectionHeader, TextLink, body, display, heading, lead } from '@/components/site/ui';
import { FadeIn } from '@/components/FadeIn';
import { getVertical, verticals } from './data';

export default function VerticalPage({ slug }: { slug: string }) {
  const v = getVertical(slug)!;
  const others = verticals.filter((o) => o.slug !== slug);

  return (
    <PageShell>
      {(openAction) => (
        <>
          {/* ─── HERO ─── */}
          <Container className="pt-44 lg:pt-56 pb-24 lg:pb-32">
            <FadeIn animation="fadeIn">
              <Label>{v.eyebrow}</Label>
            </FadeIn>
            <h1 className={`mt-10 max-w-6xl text-[3.25rem] sm:text-7xl lg:text-[7.5rem] ${display}`}>
                <SplitWords>
                  {v.title} <span className="gradient-text">{v.titleAccent}</span>
                </SplitWords>
              </h1>
            <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
              <FadeIn animation="slideUp" delay={0.25} className="lg:col-span-5">
                <p className={lead}>{v.intro}</p>
                <div className="mt-10">
                  <PrimaryButton href="#join">{v.form.title}</PrimaryButton>
                </div>
              </FadeIn>
              {(v.stats || v.highlights) && (
                <FadeIn animation="slideUp" delay={0.35} className="lg:col-span-5 lg:col-start-8">
                  <dl className="border-t border-white/[0.12]">
                    {v.stats?.map((stat) => (
                      <div key={stat.label} className="flex items-baseline justify-between gap-6 border-b border-white/[0.12] py-6">
                        <dt className="text-xs uppercase tracking-[0.22em] text-white/40">{stat.label}</dt>
                        <dd className="text-4xl font-semibold tracking-[-0.04em] tabular-nums">{stat.value}</dd>
                      </div>
                    ))}
                    {v.highlights?.map((h, i) => (
                      <div key={h} className="flex items-baseline justify-between gap-6 border-b border-white/[0.12] py-5">
                        <dt className="text-sm tabular-nums text-white/30">{String(i + 1).padStart(2, '0')}</dt>
                        <dd className="text-lg font-medium">{h}</dd>
                      </div>
                    ))}
                  </dl>
                </FadeIn>
              )}
            </div>
          </Container>

          <FadeIn animation="fadeIn" duration={1.4}>
            <Figure src={v.image} alt={`${v.name} vertical`} priority className="aspect-[16/10] sm:aspect-[21/9] w-full" />
          </FadeIn>

          {/* ─── MATCHMAKING ─── */}
          <Section bordered={false}>
            <Container>
              <SectionHeader
                index="01"
                label="Matchmaking Environment"
                title="Where needs meet solutions."
              />

              <div className="mt-24 grid grid-cols-1 lg:grid-cols-2 gap-x-20 gap-y-20">
                <div>
                  <div className="flex items-baseline justify-between border-b border-white pb-5">
                    <h3 className="text-xl font-semibold">{v.needsTitle}</h3>
                    {v.needsSubtitle && <span className="text-xs uppercase tracking-[0.22em] text-white/40">{v.needsSubtitle}</span>}
                  </div>
                  {v.needs.map((need) => (
                    <FadeIn key={need.org} animation="fadeIn">
                      <article className="border-b border-white/[0.12] py-10">
                        <p className="text-xs uppercase tracking-[0.2em] text-white/40">{need.meta}</p>
                        <h4 className="mt-3 text-2xl font-semibold tracking-[-0.025em]">{need.org}</h4>
                        <p className={`mt-4 ${body}`}>
                          <span className="text-white/75">{need.label}: </span>
                          {need.text}
                        </p>
                        {need.tags && (
                          <p className="mt-5 text-xs uppercase tracking-[0.2em] text-purple-300/70">{need.tags.join('  /  ')}</p>
                        )}
                        <div className="mt-7">
                          <TextLink onClick={openAction}>{v.needCta}</TextLink>
                        </div>
                      </article>
                    </FadeIn>
                  ))}
                </div>

                <div>
                  <div className="flex items-baseline justify-between border-b border-white pb-5">
                    <h3 className="text-xl font-semibold">{v.solutionsTitle}</h3>
                    {v.solutionsSubtitle && <span className="text-xs uppercase tracking-[0.22em] text-white/40">{v.solutionsSubtitle}</span>}
                  </div>
                  {v.solutions.map((sol) => (
                    <FadeIn key={sol.name} animation="fadeIn">
                      <article className="border-b border-white/[0.12] py-10">
                        <div className="flex items-baseline justify-between gap-4">
                          <p className="text-xs uppercase tracking-[0.2em] text-white/40">{sol.meta}</p>
                          {sol.badge && <p className="text-xs uppercase tracking-[0.2em] text-purple-300">{sol.badge}</p>}
                        </div>
                        <h4 className="mt-3 text-2xl font-semibold tracking-[-0.025em]">{sol.name}</h4>
                        <p className={`mt-4 ${body}`}>
                          {sol.label && <span className="text-white/75">Solution: {sol.label}. </span>}
                          {!sol.label && !sol.badge && <span className="text-white/75">Solution: </span>}
                          {sol.text}
                        </p>
                        {sol.seeking && (
                          <p className="mt-5 text-sm">
                            <span className="text-white/40">Seeking — </span>
                            <span className="text-white/80">{sol.seeking}</span>
                          </p>
                        )}
                        {sol.tags && (
                          <p className="mt-5 text-xs uppercase tracking-[0.2em] text-purple-300/70">{sol.tags.join('  /  ')}</p>
                        )}
                        <div className="mt-7">
                          <TextLink onClick={openAction}>{v.solutionCta}</TextLink>
                        </div>
                      </article>
                    </FadeIn>
                  ))}
                </div>
              </div>
            </Container>
          </Section>

          {/* ─── FORM ─── */}
          <Section id="join">
            <Container className="grid grid-cols-1 lg:grid-cols-12 gap-16">
              <div className="lg:col-span-4">
                <Label index="02">Apply</Label>
                <h2 className={`mt-8 ${heading}`}><SplitWords>{v.form.title}</SplitWords></h2>
                <p className={`mt-8 ${lead}`}>{v.form.body}</p>
              </div>
              <div className="lg:col-span-7 lg:col-start-6 lg:pt-4">
                <JoinForm fields={v.form.fields} />
              </div>
            </Container>
          </Section>

          {/* ─── OTHER VERTICALS ─── */}
          <Section>
            <Container>
              <Label index="03">Other Verticals</Label>
              <div className="mt-12 border-b border-white/[0.12]">
                {others.map((o) => (
                  <Link
                    key={o.slug}
                    href={`/verticals/${o.slug}`}
                    className="group flex items-center justify-between border-t border-white/[0.12] py-10"
                  >
                    <span className="text-4xl sm:text-6xl font-semibold tracking-[-0.04em] text-white/40 transition-colors duration-500 group-hover:text-white">
                      {o.name}
                    </span>
                    <ArrowUpRight className="h-8 w-8 text-white/30 transition-all duration-500 group-hover:text-purple-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
                  </Link>
                ))}
              </div>
            </Container>
          </Section>
        </>
      )}
    </PageShell>
  );
}
