'use client';

import React from 'react';
import { TextAnimate } from './TextAnimate';
import { FadeIn } from './FadeIn';

export default function MissionStatementSection() {
  return (
    <section className="relative z-10 min-h-[75vh] sm:min-h-[85vh] flex items-center justify-center px-6 sm:px-12 lg:px-16 w-full pointer-events-auto">
      <div className="max-w-5xl mx-auto flex flex-col items-center justify-center text-center space-y-8">

        {/* Fullscreen Overlay Statement (Reference Image Style) */}
        <TextAnimate
          as="h2"
          animation="blurInUp"
          by="word"
          delay={0.2}
          className="font-['Plus_Jakarta_Sans',sans-serif] font-medium text-2xl sm:text-4xl md:text-5xl lg:text-[36px] leading-[125%] tracking-tight text-white drop-shadow-2xl text-center max-w-4xl mx-auto"
        >
          The startup launch platform connecting Western Balkan innovation to international capital and markets. We turn local brilliance into global impact.
        </TextAnimate>
      </div>
    </section>
  );
}
