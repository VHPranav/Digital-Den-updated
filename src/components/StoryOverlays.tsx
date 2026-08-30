'use client';

import React from 'react';
import ProofOfGrowthSection from './ProofOfGrowthSection';
import BuiltForOperatorsSection from './BuiltForOperatorsSection';
import EcosystemBentoSection from './EcosystemBentoSection';
import FinalCTASection from './FinalCTASection';

interface StoryOverlaysProps {
  scrollProgress?: number;
  onOpenAction?: () => void;
}

export default function StoryOverlays({ onOpenAction }: StoryOverlaysProps) {
  return (
    <div className="relative z-20 bg-black text-white space-y-24 sm:space-y-36 pt-24 sm:pt-36 pb-16 sm:pb-24 w-full pointer-events-auto border-t border-white/5">
      {/* Section 1: Proof of Growth 50/50 Map Split */}
      <ProofOfGrowthSection />

      {/* Section 2: Built for Founders & Operators Architecture (Image 1) */}
      <BuiltForOperatorsSection onOpenAction={onOpenAction} />

      {/* Section 3: Global Ecosystem & Live Hub Directory Bento Grid (Image 2) */}
      <EcosystemBentoSection onOpenAction={onOpenAction} />

      {/* Section 4: Final CTA */}
      <FinalCTASection onOpenAction={onOpenAction} />
    </div>
  );
}
