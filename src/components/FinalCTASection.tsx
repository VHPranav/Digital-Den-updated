'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { FadeIn } from './FadeIn';
import { headingGradient } from './home/SectionIntro';
import type { HomePageContent } from '@/lib/sitePagesSanity';

interface FinalCTASectionProps {
  onOpenAction?: (mode?: 'startup' | 'partner') => void;
  content: HomePageContent['finalCta'];
}

// Closing action section (final approved copy). Strong, but not a second full-screen hero.
export default function FinalCTASection({ onOpenAction, content }: FinalCTASectionProps) {
  return (
    <section className="w-full max-w-[1450px] mx-auto px-4 sm:px-8 lg:px-12">
      <div
        className="relative overflow-hidden rounded-[32px] px-6 py-14 sm:px-12 sm:py-16 lg:py-20 text-center"
        style={{
          background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.04) 0%, rgba(15, 10, 25, 0.85) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 30px 70px -20px rgba(0, 0, 0, 0.85), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
        }}
      >
        <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-purple-600/20 blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-sky-500/10 blur-[100px]" />

        <div className="relative z-10 mx-auto max-w-2xl space-y-5">
          <FadeIn animation="fadeIn" delay={0.1}>
            <p className="font-['Plus_Jakarta_Sans',sans-serif] uppercase text-white/45 text-[11px] sm:text-xs font-medium tracking-[0.2em]">{content.eyebrow}</p>
          </FadeIn>
          <FadeIn animation="fadeIn" delay={0.2}>
            <h2 className="text-3xl font-medium leading-[110%] tracking-tight sm:text-4xl lg:text-[48px]" style={headingGradient}>
              {content.title}
            </h2>
          </FadeIn>
          <FadeIn animation="fadeIn" delay={0.3}>
            <p className="text-white/70 text-[15px] leading-relaxed sm:text-base">
              {content.body}
            </p>
          </FadeIn>
          <FadeIn animation="slideUp" delay={0.4} className="flex flex-wrap items-center justify-center gap-4 pt-3">
            <button
              onClick={() => onOpenAction?.('startup')}
              className="group flex cursor-pointer items-center gap-3 rounded-full bg-white px-8 py-4 text-sm font-bold tracking-wide text-black shadow-xl transition-all duration-300 hover:scale-105 hover:bg-slate-200"
            >
              <span>{content.primaryCta}</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
            <button
              onClick={() => onOpenAction?.('partner')}
              className="cursor-pointer rounded-full border border-white/20 bg-white/5 px-7 py-4 text-sm font-semibold tracking-wide text-white transition-all duration-300 hover:border-white/40 hover:bg-white/10"
            >
              {content.secondaryCta}
            </button>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
