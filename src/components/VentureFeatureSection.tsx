'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { TextAnimate } from './TextAnimate';
import { FadeIn } from './FadeIn';

interface VentureFeatureSectionProps {
  onOpenAction?: () => void;
}

export default function VentureFeatureSection({ onOpenAction }: VentureFeatureSectionProps) {
  return (
    <section className="relative z-10 min-h-[85vh] sm:min-h-screen flex flex-col justify-center items-center px-6 sm:px-12 lg:px-16 w-full pointer-events-auto py-16">
      <div className="max-w-5xl mx-auto flex flex-col items-center justify-center text-center space-y-10">
        
        {/* Main Central Feature Headline */}
        <TextAnimate
          as="h2"
          animation="blurInUp"
          by="word"
          delay={0.1}
          className="font-['Plus_Jakarta_Sans',sans-serif] font-medium text-xl sm:text-3xl md:text-4xl lg:text-[40px] leading-[130%] tracking-tight text-white drop-shadow-2xl text-center max-w-4xl mx-auto"
        >
          An integrated venture acceleration platform combining mentorship, institutional capital, and global market access — engineered for high-impact tech scaleups.
        </TextAnimate>

        {/* 3 Frosted Glass Overlay Cards matching user CSS specification */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 w-full max-w-5xl mx-auto pt-4">
          
          {/* Card 1 */}
          <FadeIn animation="slideUp" delay={0.2}>
            <div className="h-[125px] sm:h-[135px] p-5 rounded-[16px] bg-black/30 backdrop-blur-[10px] border border-white/10 flex items-center justify-start text-left shadow-xl hover:border-white/25 transition-all group">
              <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[14.4px] leading-[20px] text-[#f2ece2]/70 font-normal">
                Structured incubation & <span className="font-semibold text-white">seed capital acceleration</span> designed for repeatable startup growth
              </p>
            </div>
          </FadeIn>

          {/* Card 2 */}
          <FadeIn animation="slideUp" delay={0.3}>
            <div className="h-[125px] sm:h-[135px] p-5 rounded-[16px] bg-black/30 backdrop-blur-[10px] border border-white/10 flex items-center justify-start text-left shadow-xl hover:border-white/25 transition-all group">
              <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[14.4px] leading-[20px] text-[#f2ece2]/70 font-normal">
                Direct market expansion across <span className="font-semibold text-white">Montenegro, US, Benelux & Jordan</span> with expert advisory
              </p>
            </div>
          </FadeIn>

          {/* Card 3 */}
          <FadeIn animation="slideUp" delay={0.4}>
            <div className="h-[125px] sm:h-[135px] p-5 rounded-[16px] bg-black/30 backdrop-blur-[10px] border border-white/10 flex items-center justify-start text-left shadow-xl hover:border-white/25 transition-all group">
              <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[14.4px] leading-[20px] text-[#f2ece2]/70 font-normal">
                Institutional investor syndicate network, <span className="font-semibold text-white">FinTech innovation loops</span> and mentor access
              </p>
            </div>
          </FadeIn>

        </div>

        {/* Floating Centered CTA Button */}
        <FadeIn animation="slideUp" delay={0.5}>
          <div className="pt-2">
            <button
              onClick={onOpenAction}
              className="px-8 py-3.5 rounded-full bg-black/80 hover:bg-black text-white font-['Plus_Jakarta_Sans',sans-serif] font-semibold text-sm tracking-wide border border-white/20 backdrop-blur-md flex items-center gap-2 hover:border-purple-400/50 shadow-2xl hover:scale-105 transition-all cursor-pointer group"
            >
              <span>Book a partner call</span>
              <ArrowRight className="w-4 h-4 text-purple-300 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </FadeIn>

      </div>
    </section>
  );
}
