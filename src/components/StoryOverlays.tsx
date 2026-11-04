'use client';

import React from 'react';
import UpcomingOpportunitySection from './home/UpcomingOpportunitySection';
import StartupJourneySection from './home/StartupJourneySection';
import ProofOfGrowthSection from './ProofOfGrowthSection';
import BeyondBordersSection from './home/BeyondBordersSection';
import FinalCTASection from './FinalCTASection';
import SectionDivider from './home/SectionDivider';
import { upcomingOpportunity } from '@/lib/homeContent';
import type { HomePageContent } from '@/lib/sitePagesSanity';

interface StoryOverlaysProps {
  onOpenAction?: (mode?: 'startup' | 'partner') => void;
  content: HomePageContent;
}

// Home sections after the entry cards, in the approved order (Home Page notes, 7 Oct 2026).
// Do not add sections here without Digital Den's explicit approval.
// Sections are separated by a quiet hairline divider with generous (not excessive) spacing.
export default function StoryOverlays({ onOpenAction, content }: StoryOverlaysProps) {
  return (
    <div className="relative z-20 bg-den text-white pt-24 sm:pt-32 pb-20 sm:pb-28 w-full pointer-events-auto">
      {upcomingOpportunity && (
        <>
          <UpcomingOpportunitySection />
          <SectionDivider />
        </>
      )}
      <StartupJourneySection content={content.journey} />
      <SectionDivider />
      <ProofOfGrowthSection content={content.proof} />
      <SectionDivider />
      <BeyondBordersSection content={content.presence} />
      <div className="h-28 sm:h-36 lg:h-44" aria-hidden="true" />
      <FinalCTASection onOpenAction={onOpenAction} content={content.finalCta} />
    </div>
  );
}
