'use client';

import React from 'react';
import { FadeIn } from './FadeIn';
import { TextAnimate } from './TextAnimate';

interface BuiltForOperatorsSectionProps {
  onOpenAction?: () => void;
}

export default function BuiltForOperatorsSection({ }: BuiltForOperatorsSectionProps) {
  const features = [
    {
      title: 'Monetization & ROI.',
      description:
        'Direct connection to international angel syndicates, venture funds, and corporate pilot contracts with high conversion rates.',
    },
    {
      title: 'Operational simplicity.',
      description:
        'Streamlined legal structuring across the US, UK, and EU. Zero bureaucratic friction with standardized venture-ready workflows.',
    },
    {
      title: 'Premium differentiation.',
      description:
        'Western Balkan engineering talent combined with Tier-1 US & EU market soft-landing infrastructure and dedicated mentors.',
    },
    {
      title: 'Technology you can defend.',
      description:
        'Deep-tech IP protection, architecture validation, and institutional banking pilot programs tailored for scaleups.',
    },
  ];

  return (
    <section className="w-full max-w-[1250px] mx-auto px-4 sm:px-8 lg:px-12 py-16">
      {/* Header matching reference image */}
      <div className="text-center max-w-3xl mx-auto space-y-3 mb-16 sm:mb-20">
        <FadeIn animation="fadeIn" delay={0.1}>
          <h2
            className="font-['Inter',sans-serif] text-4xl sm:text-5xl lg:text-[56px] font-medium tracking-tight leading-[110%]"
            style={{
              background: 'linear-gradient(90deg, #FFFFFF 0%, #FFFFFF 30%, #F3E8FF 45%, #D8B4FE 60%, #C084FC 75%, #A855F7 88%, #7E22CE 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Built for operators
          </h2>
        </FadeIn>

        <FadeIn animation="fadeIn" delay={0.2}>
          <p className="text-slate-400 font-normal text-sm sm:text-base tracking-normal">
            ROI, simplicity, prestige, scalability.
          </p>
        </FadeIn>
      </div>

      {/* Clean 2x2 Feature Grid without background, icons, or badges */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-14 gap-y-10 lg:gap-x-20 lg:gap-y-14">
        {features.map((feat, idx) => (
          <FadeIn key={idx} animation="slideUp" delay={0.15 + idx * 0.08}>
            <div className="space-y-2">
              <p className="text-slate-400 text-md sm:text-md leading-relaxed font-normal">
                <strong className="text-white font-bold mr-1.5">
                  {feat.title}
                </strong>
                {feat.description}
              </p>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
