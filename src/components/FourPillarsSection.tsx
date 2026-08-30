'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { TextAnimate } from './TextAnimate';
import { FadeIn } from './FadeIn';
import BorderGlow from './BorderGlow';

export default function FourPillarsSection() {
  return (
    <section className="w-full max-w-[1450px] mx-auto px-4 sm:px-8 lg:px-12 space-y-6">
      {/* Section Heading matching Figma specs */}
      <div className="mb-4 max-w-[440px]">
        <FadeIn animation="fadeIn" delay={0.1}>
          <h2
            className="font-['Inter',sans-serif] font-medium text-3xl sm:text-4xl lg:text-[42px] leading-[105%] lg:mb-10 tracking-tight"
            style={{
              background: 'linear-gradient(90deg, #FFFFFF 0%, #FFFFFF 30%, #F3E8FF 45%, #D8B4FE 60%, #C084FC 75%, #A855F7 88%, #7E22CE 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Four Pillars of Startup Acceleration
          </h2>
        </FadeIn>
      </div>

      {/* Horizontal 4-Column Card Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
        {/* CARD 1: Venture Building */}
        <FadeIn animation="slideUp" delay={0.2} duration={1.2}>
          <BorderGlow
            borderRadius={24}
            backgroundColor="rgba(2, 11, 24, 0.7)"
            glowColor="270 80 80"
            colors={['#c084fc', '#f472b6', '#38bdf8']}
            glowRadius={35}
            className="h-full rounded-[24px]"
          >
            <Link
              href="/platform"
              className="group block relative h-[450px] sm:h-[463px] bg-gradient-to-b from-white/[0.05] to-white/[0.1] bg-[#020b18]/70 backdrop-blur-[15px] p-7 flex flex-col justify-between overflow-hidden shadow-2xl rounded-[24px] h-full w-full"
            >
              <div className="flex items-center justify-end gap-2 text-white font-['Inter',sans-serif] text-sm font-normal">
                <span className="opacity-90 group-hover:opacity-100 transition-opacity">See how we build</span>
                <div className="w-8 h-8 rounded-full bg-white text-slate-950 flex items-center justify-center font-bold shadow-md group-hover:scale-105 transition-transform">
                  <ArrowUpRight className="w-4 h-4 text-slate-950" />
                </div>
              </div>

              <div className="space-y-2.5 z-10">
                <h3 className="font-['Plus_Jakarta_Sans',sans-serif] font-semibold text-2xl sm:text-3xl text-white tracking-tight leading-[109%]">
                  Venture Building
                </h3>
                <p className="font-['Inter',sans-serif] font-normal text-sm sm:text-[15px] leading-[22px] text-white/90">
                  We don&apos;t just invest; we co-build. Our platform provides the architectural support needed for startups to scale from prototype to exit.
                </p>
              </div>
            </Link>
          </BorderGlow>
        </FadeIn>

        {/* CARD 2: Programs */}
        <FadeIn animation="slideUp" delay={0.5} duration={1.2} className="lg:translate-y-10">
          <BorderGlow
            borderRadius={24}
            backgroundColor="transparent"
            glowColor="270 80 80"
            colors={['#c084fc', '#f472b6', '#38bdf8']}
            glowRadius={35}
            className="h-full rounded-[24px]"
          >
            <Link
              href="/programs"
              className="group block relative h-[450px] sm:h-[463px] p-7 flex flex-col justify-between overflow-hidden shadow-2xl bg-cover bg-center rounded-[24px] h-full w-full"
              style={{
                backgroundImage: `url('/images/firstimg.png')`,
              }}
            >
              <div className="flex items-center justify-end gap-2 text-white font-['Inter',sans-serif] text-sm font-normal z-10">
                <span className="opacity-90 group-hover:opacity-100 transition-opacity">Find your program</span>
                <div className="w-8 h-8 rounded-full bg-white text-slate-950 flex items-center justify-center font-bold shadow-md group-hover:scale-105 transition-transform">
                  <ArrowUpRight className="w-4 h-4 text-slate-950" />
                </div>
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-0 rounded-[24px]" />

              <div className="space-y-2.5 z-10 relative">
                <h3 className="font-['Plus_Jakarta_Sans',sans-serif] font-semibold text-2xl sm:text-3xl text-white tracking-tight leading-[109%]">
                  Programs
                </h3>
                <p className="font-['Inter',sans-serif] font-normal text-sm sm:text-[15px] leading-[22px] text-white/90">
                  Accelerating startups through tailored programs, designed to push founders beyond early-stage hurdles toward institutional capital.
                </p>
              </div>
            </Link>
          </BorderGlow>
        </FadeIn>

        {/* CARD 3: Opportunities */}
        <FadeIn animation="slideUp" delay={0.8} duration={1.2}>
          <BorderGlow
            borderRadius={24}
            backgroundColor="rgba(2, 11, 24, 0.7)"
            glowColor="270 80 80"
            colors={['#c084fc', '#f472b6', '#38bdf8']}
            glowRadius={35}
            className="h-full rounded-[24px]"
          >
            <Link
              href="/opportunities"
              className="group block relative h-[450px] sm:h-[463px] bg-gradient-to-b from-white/[0.05] to-white/[0.1] bg-[#020b18]/70 backdrop-blur-[15px] p-7 flex flex-col justify-between overflow-hidden shadow-2xl rounded-[24px] h-full w-full"
            >
              <div className="flex items-center justify-end gap-2 text-white font-['Inter',sans-serif] text-sm font-normal">
                <span className="opacity-90 group-hover:opacity-100 transition-opacity">Discover opportunities</span>
                <div className="w-8 h-8 rounded-full bg-white text-slate-950 flex items-center justify-center font-bold shadow-md group-hover:scale-105 transition-transform">
                  <ArrowUpRight className="w-4 h-4 text-slate-950" />
                </div>
              </div>

              <div className="space-y-2.5 z-10">
                <h3 className="font-['Plus_Jakarta_Sans',sans-serif] font-semibold text-2xl sm:text-3xl text-white tracking-tight leading-[109%]">
                  Opportunities
                </h3>
                <p className="font-['Inter',sans-serif] font-normal text-sm sm:text-[15px] leading-[22px] text-white/90">
                  Open calls for startups, grants, and specialized investment rounds.
                </p>
              </div>
            </Link>
          </BorderGlow>
        </FadeIn>

        {/* CARD 4: Global Network */}
        <FadeIn animation="slideUp" delay={1.1} duration={1.2} className="lg:translate-y-10">
          <BorderGlow
            borderRadius={24}
            backgroundColor="transparent"
            glowColor="270 80 80"
            colors={['#c084fc', '#f472b6', '#38bdf8']}
            glowRadius={35}
            className="h-full rounded-[24px]"
          >
            <Link
              href="/partners"
              className="group block relative h-[450px] sm:h-[463px] p-7 flex flex-col justify-between overflow-hidden shadow-2xl bg-cover bg-center rounded-[24px] h-full w-full"
              style={{
                backgroundImage: `url('/images/secondimg.png')`,
              }}
            >
              <div className="flex items-center justify-end gap-2 text-white font-['Inter',sans-serif] text-sm font-normal z-10">
                <span className="opacity-90 group-hover:opacity-100 transition-opacity">Connect Globally</span>
                <div className="w-8 h-8 rounded-full bg-white text-slate-950 flex items-center justify-center font-bold shadow-md group-hover:scale-105 transition-transform">
                  <ArrowUpRight className="w-4 h-4 text-slate-950" />
                </div>
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-0 rounded-[24px]" />

              <div className="space-y-2.5 z-10 relative">
                <h3 className="font-['Plus_Jakarta_Sans',sans-serif] font-semibold text-2xl sm:text-3xl text-white tracking-tight leading-[109%]">
                  Global <br /> Network
                </h3>
                <p className="font-['Inter',sans-serif] font-normal text-sm sm:text-[15px] leading-[22px] text-white/90">
                  Connect with our partners in USA, Europe, and beyond.
                </p>
              </div>
            </Link>
          </BorderGlow>
        </FadeIn>
      </div>
    </section>
  );
}
