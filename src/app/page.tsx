'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import StartupJourneyCarousel from '@/components/StartupJourneyCarousel';
import IntroStatementSection from '@/components/IntroStatementSection';
import CanvasScrollSequence from '@/components/CanvasScrollSequence';
import Hero from '@/components/hero/Hero';
import CreativeTransitionSection from '@/components/hero/CreativeTransitionSection';
import HeroSection from '@/components/HeroSection';
import FourPillarsSection from '@/components/FourPillarsSection';
import StoryOverlays from '@/components/StoryOverlays';
import SkipIntroButton from '@/components/SkipIntroButton';
import ActionModal, { type ActionMode } from '@/components/ActionModal';
import Footer from '@/components/Footer';
import SlantedSectionTransition from '@/components/SlantedSectionTransition';
import ViewportBlur from '@/components/ViewportBlur';
import FluidCursorRipple from '@/components/FluidCursorRipple';
import NewsletterPrompt from '@/components/home/NewsletterPrompt';

export default function Home() {
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [actionMode, setActionMode] = useState<ActionMode>('startup');

  // Called by the "Apply as Startup" / "Partner with Us" CTAs. Navbar passes its click event, so default to startup.
  const handleOpenAction = (mode?: unknown) => {
    setActionMode(mode === 'partner' ? 'partner' : 'startup');
    setIsActionModalOpen(true);
  };

  const handleCloseAction = () => {
    setIsActionModalOpen(false);
  };

  return (
    <main className="min-h-screen bg-den text-white font-sans selection:bg-purple-600 selection:text-white relative overflow-x-clip">
      {/* Cursor liquid ripple: home page only */}
      <FluidCursorRipple />

      {/* Floating Navigation Bar */}
      <Navbar onOpenAction={handleOpenAction} />

      {/* Floating Skip Intro Button (Skips the opening intro sections, landing
          centered on the "Venturing Beyond Borders" gateway content) */}
      <SkipIntroButton targetId="hero-gateway-section" />

      {/* ─── 1. 3D EMBLEM HERO (our own build — first thing shown) ─── */}
      <div className="relative z-20 w-full bg-den">
        <Hero />
      </div>

      {/* ─── 2. CREATIVE TRANSITION: camera dives beneath the emblem into a glitch-text/glass-refraction scene ─── */}
      <div className="relative z-[25] w-full bg-transparent">
        <CreativeTransitionSection />
      </div>

      {/* ─── 3. 3D SPINAL CORD HELICAL JOURNEY CAROUSEL ─── */}
      <div className="relative z-30 w-full">
        <StartupJourneyCarousel />
      </div>

      {/* ─── 3b. POSITIONING STATEMENT, SUPPORTING ELEMENTS & "ENTER DIGITAL DEN" CTA ─── */}
      <IntroStatementSection targetId="main-content" />

      {/* ─── 4. MAIN HOME PAGE SECTION (Slanted Transition & Hero Gateway) ─── */}
      <div id="main-content" className="scroll-mt-10">
        <SlantedSectionTransition slantSlopeVw={6}>
          {/* Video frames behind the Hero + entry cards only: shows frame 301 (the underwater "D"
              scene) until the Hero is centred, then plays to the last frame as the cards centre.
              Frames 1–300 are not used. */}
          <CanvasScrollSequence frameCount={600} startFrame={300} startAnchorId="hero-gateway-section" endAnchorId="explore-digital-den">
            {() => (
              <div className="relative z-10 w-full flex flex-col items-center justify-center space-y-28 sm:space-y-40 pt-4 pb-32 sm:pb-48 pointer-events-auto mx-auto">
                <HeroSection onOpenAction={handleOpenAction} />
                <FourPillarsSection />
              </div>
            )}
          </CanvasScrollSequence>
        </SlantedSectionTransition>
      </div>

      {/* ─── 5. SOLID BLACK SECTIONS: Upcoming Opportunity (when active), Startup Journey, Proof of Growth, Beyond Borders, Final CTA ─── */}
      <StoryOverlays onOpenAction={handleOpenAction} />

      {/* Footer Section */}
      <div className="relative z-20 bg-den">
        <Footer />
      </div>

      {/* Newsletter prompt: a few seconds after the intro ends / Skip Intro, once per session */}
      <NewsletterPrompt triggerId="hero-gateway-section" />

      {/* Onboarding / Lead Capture Modal */}
      <ActionModal isOpen={isActionModalOpen} mode={actionMode} onClose={handleCloseAction} />

      {/* Progressive Viewport Blur from Frames Section to Footer */}
      <ViewportBlur />
    </main>
  );
}
