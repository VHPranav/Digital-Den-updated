'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import StartupJourneyCarousel from '@/components/StartupJourneyCarousel';
import CanvasScrollSequence from '@/components/CanvasScrollSequence';
import Hero from '@/components/hero/Hero';
import CreativeTransitionSection from '@/components/hero/CreativeTransitionSection';
import HeroSection from '@/components/HeroSection';
import MissionStatementSection from '@/components/MissionStatementSection';
import VentureFeatureSection from '@/components/VentureFeatureSection';
import FourPillarsSection from '@/components/FourPillarsSection';
import StoryOverlays from '@/components/StoryOverlays';
import SkipIntroButton from '@/components/SkipIntroButton';
import ActionModal from '@/components/ActionModal';
import Footer from '@/components/Footer';
import SlantedSectionTransition from '@/components/SlantedSectionTransition';
import ViewportBlur from '@/components/ViewportBlur';

export default function Home() {
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);

  const handleOpenAction = () => {
    setIsActionModalOpen(true);
  };

  const handleCloseAction = () => {
    setIsActionModalOpen(false);
  };

  return (
    <main className="min-h-screen bg-black text-white font-sans selection:bg-purple-600 selection:text-white relative">
      {/* Floating Navigation Bar */}
      <Navbar onOpenAction={handleOpenAction} />

      {/* Floating Skip Intro Button (Skips the opening intro sections, landing
          centered on the "Venturing Beyond Borders" gateway content) */}
      <SkipIntroButton targetId="hero-gateway-section" />

      {/* ─── 1. 3D EMBLEM HERO (our own build — first thing shown) ─── */}
      <div className="relative z-20 w-full bg-black">
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

      {/* ─── 4. MAIN HOME PAGE SECTION (Slanted Transition & Hero Gateway) ─── */}
      <div id="main-content" className="scroll-mt-10">
        <SlantedSectionTransition slantSlopeVw={6}>
          <CanvasScrollSequence frameCount={600} containerHeight="h-[620vh]" onOpenAction={handleOpenAction}>
            {() => (
              <div className="relative z-10 w-full flex flex-col items-center justify-center space-y-28 sm:space-y-40 pt-4 pb-64 sm:pb-96 pointer-events-auto mx-auto">
                <HeroSection onOpenAction={handleOpenAction} />
                <MissionStatementSection />
                <VentureFeatureSection onOpenAction={handleOpenAction} />
                <FourPillarsSection />
              </div>
            )}
          </CanvasScrollSequence>
        </SlantedSectionTransition>
      </div>

      {/* ─── 5. SOLID BLACK BACKGROUND SECTIONS (Proof of Growth & Final CTA) ─── */}
      <StoryOverlays onOpenAction={handleOpenAction} />

      {/* Footer Section */}
      <div className="relative z-20 bg-black">
        <Footer />
      </div>

      {/* Onboarding / Lead Capture Modal */}
      <ActionModal isOpen={isActionModalOpen} onClose={handleCloseAction} />

      {/* Progressive Viewport Blur from Frames Section to Footer */}
      <ViewportBlur />
    </main>
  );
}
