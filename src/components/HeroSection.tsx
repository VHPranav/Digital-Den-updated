'use client';

import React, { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface HeroSectionProps {
  scrollProgress?: number;
  onOpenAction?: (mode?: 'startup' | 'partner') => void;
}

export default function HeroSection({ onOpenAction }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const copyRef = useRef<HTMLParagraphElement>(null);
  const line1Ref = useRef<HTMLHeadingElement>(null);
  const line2Ref = useRef<HTMLHeadingElement>(null);
  const button1Ref = useRef<HTMLDivElement>(null);
  const button2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
          end: 'top 25%',
          toggleActions: 'play none none reverse',
        },
      });

      // 1. Ambient Cosmic Portal Glow
      if (glowRef.current) {
        tl.fromTo(
          glowRef.current,
          { opacity: 0, scale: 0.6 },
          { opacity: 0.85, scale: 1.1, duration: 1.4, ease: 'power2.out' },
          0
        );
      }

      // 2. Headline 3D Perspective Reveal
      const headlineLines = [line1Ref.current, line2Ref.current].filter(Boolean);
      if (headlineLines.length > 0) {
        tl.fromTo(
          headlineLines,
          {
            opacity: 0,
            y: 70,
            rotateX: 30,
            transformOrigin: '50% 100%',
            filter: 'blur(16px)',
          },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            filter: 'blur(0px)',
            duration: 1.1,
            stagger: 0.15,
            ease: 'power3.out',
          },
          0.25
        );
      }

      // 3. Eyebrow + supporting copy
      const textEls = [eyebrowRef.current, copyRef.current].filter(Boolean);
      if (textEls.length > 0) {
        tl.fromTo(
          textEls,
          { opacity: 0, y: 20, filter: 'blur(8px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.9, stagger: 0.2, ease: 'power3.out' },
          0.15
        );
      }

      // 4. CTA Buttons Elastic Stagger
      const buttons = [button1Ref.current, button2Ref.current].filter(Boolean);
      if (buttons.length > 0) {
        tl.fromTo(
          buttons,
          { opacity: 0, y: 40, scale: 0.9, filter: 'blur(8px)' },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: 'blur(0px)',
            duration: 0.85,
            stagger: 0.12,
            ease: 'back.out(1.4)',
          },
          0.5
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    // Tall track: the content below is pinned (sticky) in the viewport while the background frames
    // play through the ocean surface, then it releases and scrolls away with the page.
    <section ref={sectionRef} id="hero-gateway-section" className="relative h-[185vh] w-full pointer-events-none">
      <div className="sticky top-0 flex h-screen w-full flex-col justify-center items-center px-4 sm:px-8 lg:px-16 max-w-6xl mx-auto pointer-events-auto text-center overflow-visible">
      {/* Top Black Gradient Overlay (Disabled for now) */}
      {/* <div
        className="pointer-events-none absolute -top-32 sm:-top-44 left-1/2 -translate-x-1/2 w-screen h-[400px] sm:h-[550px] z-0"
        style={{
          background: 'linear-gradient(176.5deg, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.85) 25%, rgba(0, 0, 0, 0.4) 60%, transparent 100%)',
        }}
        aria-hidden="true"
      /> */}

      {/* Radiant Background Aura / Transition Flare */}
      <div
        ref={glowRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] rounded-full pointer-events-none opacity-0"
        style={{
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.18) 0%, rgba(56, 189, 248, 0.12) 40%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      <div className="w-full max-w-5xl flex flex-col items-center justify-center space-y-6 text-center mx-auto relative z-10" style={{ perspective: '1000px' }}>
        {/* Eyebrow label */}
        <p
          ref={eyebrowRef}
          className="inline-flex items-center rounded-full border border-white/15 bg-black/40 px-4 py-1.5 backdrop-blur-md font-['Plus_Jakarta_Sans',sans-serif] font-semibold text-xs sm:text-sm uppercase tracking-[0.22em] text-purple-100 shadow-[0_4px_24px_rgba(0,0,0,0.45)]"
        >
          Venturing Beyond Borders
        </p>

        {/* Main Headline (approved copy, two lines on desktop) */}
        <div className="w-full flex flex-col items-center justify-center text-center mx-auto" style={{ perspective: '1000px' }}>
          <h1
            ref={line1Ref}
            className="font-['Plus_Jakarta_Sans',sans-serif] font-medium text-[36px] sm:text-[56px] md:text-[70px] lg:text-[86px] leading-[105%] text-center text-white tracking-tight drop-shadow-2xl max-w-[1050px] mx-auto block w-full"
          >
            Your Gateway to
          </h1>
          <h1
            ref={line2Ref}
            className="font-['Plus_Jakarta_Sans',sans-serif] font-medium text-[36px] sm:text-[56px] md:text-[70px] lg:text-[86px] leading-[105%] text-center text-white tracking-tight drop-shadow-2xl max-w-[1050px] mx-auto block w-full bg-clip-text bg-gradient-to-r from-white via-[#f0f4ff] to-white/80"
          >
            Global Markets
          </h1>
        </div>

        {/* Supporting copy (final approved text; body/subheadline scale) */}
        <p
          ref={copyRef}
          className="font-['Plus_Jakarta_Sans',sans-serif] font-normal text-[15px] sm:text-[17px] leading-[1.6] text-white/75 max-w-2xl mx-auto"
        >
          Digital Den is a startup launch platform and venture studio connecting founders from Montenegro and the Western Balkans with programs, strategic partners, capital and international markets.
        </p>

        {/* Bottom Controls Row (Centered) */}
        <div className="pt-2 flex flex-col items-center justify-center gap-6 w-full max-w-2xl mx-auto text-center">
          {/* Centered Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 mx-auto w-full">
            {/* Button 1: Apply as Startup */}
            <div ref={button1Ref}>
              <button
                onClick={() => onOpenAction?.('startup')}
                className="h-[50px] px-6 rounded-[12px] bg-gradient-to-b from-white/[0.08] to-white/[0.15] bg-white/10 border border-white/20 shadow-[inset_0_12px_40px_-10px_rgba(255,255,255,0.25),0_10px_25px_rgba(0,0,0,0.5)] backdrop-blur-[15px] text-white font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[15px] leading-[22px] hover:bg-white/25 hover:border-white/50 hover:scale-105 active:scale-98 transition-all duration-300 cursor-pointer flex items-center justify-center"
              >
                Apply as Startup
              </button>
            </div>

            {/* Button 2: Partner with Us */}
            <div ref={button2Ref}>
              <button
                onClick={() => onOpenAction?.('partner')}
                className="h-[50px] px-6 rounded-[12px] border border-white/25 backdrop-blur-[2px] text-[#E5E2E1] font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[15px] leading-[22px] hover:bg-white/15 hover:border-white/60 hover:text-white hover:scale-105 active:scale-98 transition-all duration-300 cursor-pointer flex items-center justify-center"
              >
                Partner with Us
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}


