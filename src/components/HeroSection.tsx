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
  onOpenAction?: () => void;
}

export default function HeroSection({ onOpenAction }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
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

      // 2. Eyebrow Pill entrance
      if (eyebrowRef.current) {
        tl.fromTo(
          eyebrowRef.current,
          { opacity: 0, y: -30, scale: 0.88, filter: 'blur(10px)' },
          { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 0.9, ease: 'power3.out' },
          0.1
        );
      }

      // 3. Headline 3D Perspective Reveal
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
    <section
      ref={sectionRef}
      id="hero-gateway-section"
      className="relative z-10 min-h-screen flex flex-col justify-center items-center py-16 sm:py-24 px-4 sm:px-8 lg:px-16 max-w-6xl mx-auto w-full pointer-events-auto text-center overflow-visible"
    >
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
        {/* Eyebrow Pill */}
        <div
          ref={eyebrowRef}
          className="inline-flex items-center justify-center px-5 py-2 rounded-[16px] bg-white/10 border border-white/20 backdrop-blur-[12px] self-center mx-auto shadow-[0_0_25px_rgba(255,255,255,0.08)]"
        >
          <span className="font-['Plus_Jakarta_Sans',sans-serif] font-normal text-[15px] sm:text-[18px] leading-[107%] tracking-[-0.02em] text-white text-center">
            Venturing Beyond Borders
          </span>
        </div>

        {/* Main Headline (Responsive scaling up to 100px, Font Weight 500, Centered) */}
        <div className="w-full flex flex-col items-center justify-center text-center mx-auto" style={{ perspective: '1000px' }}>
          <h1
            ref={line1Ref}
            className="font-['Plus_Jakarta_Sans',sans-serif] font-medium text-[40px] sm:text-[64px] md:text-[80px] lg:text-[100px] leading-[105%] text-center text-white tracking-tight drop-shadow-2xl max-w-[1050px] mx-auto block w-full"
          >
            Your Gateway to
          </h1>
          <h1
            ref={line2Ref}
            className="font-['Plus_Jakarta_Sans',sans-serif] font-medium text-[40px] sm:text-[64px] md:text-[80px] lg:text-[100px] leading-[105%] text-center text-white tracking-tight drop-shadow-2xl max-w-[1050px] mx-auto block w-full bg-clip-text bg-gradient-to-r from-white via-[#f0f4ff] to-white/80"
          >
            Global Markets
          </h1>
        </div>

        {/* Bottom Controls Row (Centered) */}
        <div className="pt-4 flex flex-col items-center justify-center gap-6 w-full max-w-2xl mx-auto text-center">
          {/* Centered Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 mx-auto w-full">
            {/* Button 1: Apply as Startup */}
            <div ref={button1Ref}>
              <button
                onClick={onOpenAction}
                className="h-[50px] px-6 rounded-[12px] bg-gradient-to-b from-white/[0.08] to-white/[0.15] bg-white/10 border border-white/20 shadow-[inset_0_12px_40px_-10px_rgba(255,255,255,0.25),0_10px_25px_rgba(0,0,0,0.5)] backdrop-blur-[15px] text-white font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[15px] leading-[22px] hover:bg-white/25 hover:border-white/50 hover:scale-105 active:scale-98 transition-all duration-300 cursor-pointer flex items-center justify-center"
              >
                Apply as Startup
              </button>
            </div>

            {/* Button 2: Partner with Us */}
            <div ref={button2Ref}>
              <button
                onClick={onOpenAction}
                className="h-[50px] px-6 rounded-[12.8px] border border-white/25 backdrop-blur-[2px] text-[#E5E2E1] font-['Plus_Jakarta_Sans',sans-serif] font-semibold text-[18px] leading-[28px] hover:bg-white/15 hover:border-white/60 hover:text-white hover:scale-105 active:scale-98 transition-all duration-300 cursor-pointer flex items-center justify-center"
              >
                Partner with Us
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


