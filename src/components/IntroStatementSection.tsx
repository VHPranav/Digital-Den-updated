'use client';

import React from 'react';
import { ArrowDown } from 'lucide-react';
import { TextAnimate } from './TextAnimate';
import { FadeIn } from './FadeIn';

interface IntroStatementSectionProps {
  /** Element the "Enter Digital Den" CTA scrolls to (the Home Page). */
  targetId?: string;
}

export default function IntroStatementSection({ targetId = 'main-content' }: IntroStatementSectionProps) {
  const handleEnter = () => {
    document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="relative z-30 w-full min-h-screen bg-den flex items-center justify-center px-4 sm:px-8 lg:px-12 py-28 sm:py-36">
      <div className="w-full max-w-[1450px] mx-auto flex flex-col items-center text-center">
        {/* Main positioning statement */}
        <TextAnimate
          as="h2"
          animation="blurInUp"
          by="word"
          delay={0.1}
          className="font-['Plus_Jakarta_Sans',sans-serif] font-medium text-2xl sm:text-4xl lg:text-[44px] leading-[125%] tracking-tight text-white max-w-4xl mx-auto"
        >
          A startup launch platform and venture studio connecting founders with the right support, strategic partners, capital and international markets.
        </TextAnimate>

        {/* CTA */}
        <FadeIn animation="fadeIn" delay={0.6} duration={1} className="mt-12 sm:mt-16">
          <button
            onClick={handleEnter}
            className="group h-[54px] px-7 rounded-[14px] bg-gradient-to-b from-white/[0.08] to-white/[0.15] bg-white/10 border border-white/20 shadow-[inset_0_12px_40px_-10px_rgba(255,255,255,0.25),0_10px_25px_rgba(0,0,0,0.5)] backdrop-blur-[15px] text-white font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[16px] hover:bg-white/25 hover:border-white/50 hover:scale-105 active:scale-98 transition-all duration-300 cursor-pointer inline-flex items-center gap-3"
          >
            Enter Digital Den
            <ArrowDown className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
          </button>
        </FadeIn>
      </div>
    </section>
  );
}
