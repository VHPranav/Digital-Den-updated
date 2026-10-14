'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Calendar, MapPin } from 'lucide-react';
import { FadeIn } from '../FadeIn';
import { headingGradient } from './SectionIntro';
import { upcomingOpportunity } from '@/lib/homeContent';

// Upcoming Opportunity (CMS-managed via src/lib/homeContent.ts). Sits right after the
// video-frame section and renders only while there is a current/upcoming opportunity.
export default function UpcomingOpportunitySection() {
  const o = upcomingOpportunity;
  if (!o) return null;

  return (
    <section id="upcoming-opportunity" className="w-full max-w-[1450px] mx-auto px-4 sm:px-8 lg:px-12">
      <div
        className="relative overflow-hidden rounded-[32px] px-6 py-14 sm:px-12 sm:py-16 text-center"
        style={{
          background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.04) 0%, rgba(15, 10, 25, 0.85) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 30px 70px -20px rgba(0, 0, 0, 0.85), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
        }}
      >
        <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center space-y-4">
          <FadeIn animation="fadeIn" delay={0.05}>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 backdrop-blur-md">
              <span className="h-2 w-2 animate-ping rounded-full bg-purple-400" />
              <span className="font-['Plus_Jakarta_Sans',sans-serif] text-xs font-semibold uppercase tracking-widest text-purple-300">
                {o.label}
              </span>
            </div>
          </FadeIn>
          <FadeIn animation="fadeIn" delay={0.15}>
            <h2 className="text-3xl font-medium leading-[110%] tracking-tight sm:text-4xl lg:text-[48px]" style={headingGradient}>
              {o.title}
            </h2>
          </FadeIn>
          <FadeIn animation="fadeIn" delay={0.25}>
            <p className="max-w-2xl text-[15px] leading-relaxed text-white/75 sm:text-base">{o.description}</p>
          </FadeIn>
          <FadeIn animation="fadeIn" delay={0.3}>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-white/80">
              <span className="inline-flex items-center gap-2">
                <Calendar className="h-4 w-4 text-purple-300" />
                {o.date}
              </span>
              <span className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4 text-cyan-300" />
                {o.location}
              </span>
            </div>
          </FadeIn>
          <FadeIn animation="slideUp" delay={0.4} className="pt-2">
            <Link
              href={o.cta.href}
              className="group flex items-center gap-2.5 rounded-full border border-purple-400/40 bg-gradient-to-r from-purple-600 to-indigo-600 px-7 py-3.5 font-['Plus_Jakarta_Sans',sans-serif] text-xs font-bold uppercase tracking-wider text-white shadow-2xl transition-all hover:scale-105 hover:from-purple-500 hover:to-indigo-500 sm:text-sm"
            >
              <span>{o.cta.label}</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
