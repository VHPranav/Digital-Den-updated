'use client';

import React from 'react';
import { FadeIn } from '../FadeIn';

// Shared Home section heading: H2 (44–56px on large desktop) + short lead, optional eyebrow.
export const headingGradient: React.CSSProperties = {
  background: 'linear-gradient(90deg, #FFFFFF 0%, #FFFFFF 30%, #F3E8FF 45%, #D8B4FE 60%, #C084FC 75%, #A855F7 88%, #7E22CE 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
};

export default function SectionIntro({
  eyebrow,
  title,
  lead,
  align = 'left',
  className = '',
}: {
  eyebrow?: string;
  title: string;
  lead: string;
  align?: 'left' | 'center';
  className?: string;
}) {
  const centered = align === 'center';
  return (
    <div className={`space-y-4 ${centered ? 'mx-auto text-center' : ''} max-w-2xl ${className}`}>
      {eyebrow && (
        <FadeIn animation="fadeIn" delay={0.05}>
          <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[11px] sm:text-xs font-medium uppercase tracking-[0.2em] text-white/45">
            {eyebrow}
          </p>
        </FadeIn>
      )}
      <FadeIn animation="fadeIn" delay={0.15}>
        <h2 className="font-medium text-3xl sm:text-4xl lg:text-[48px] leading-[110%] tracking-tight" style={headingGradient}>
          {title}
        </h2>
      </FadeIn>
      <FadeIn animation="fadeIn" delay={0.25}>
        <p className="text-[15px] sm:text-base leading-relaxed text-white/70">{lead}</p>
      </FadeIn>
    </div>
  );
}
