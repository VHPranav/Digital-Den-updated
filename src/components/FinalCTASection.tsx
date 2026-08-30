'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';
import { TextAnimate } from './TextAnimate';
import { FadeIn } from './FadeIn';

interface FinalCTASectionProps {
  onOpenAction?: () => void;
}

export default function FinalCTASection({ onOpenAction }: FinalCTASectionProps) {
  // Curated high-res stock images of real tech founders, demo days, networking summits & collaborative teams
  const column1 = [
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=600&q=80',
  ];

  const column2 = [
    'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80',
  ];

  const column3 = [
    'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80',
  ];

  return (
    <section className="w-full max-w-[1450px] mx-auto px-4 sm:px-8 lg:px-12 py-12">
      <div
        className="relative rounded-[36px] overflow-hidden p-8 sm:p-12 lg:p-16"
        style={{
          background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.04) 0%, rgba(15, 10, 25, 0.85) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 30px 70px -20px rgba(0, 0, 0, 0.85), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(25px)',
        }}
      >
        {/* Ambient Dark Purple Lighting Orbs */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-600/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center relative z-10">
          
          {/* ─── LEFT: 3-Column Cascading Photo Gallery with Top & Bottom Fade ─── */}
          <div className="lg:col-span-6 relative h-[380px] sm:h-[460px] overflow-hidden rounded-2xl [mask-image:linear-gradient(to_bottom,transparent_0%,black_14%,black_86%,transparent_100%)]">
            <div className="grid grid-cols-3 gap-3 sm:gap-4 h-full items-center">
              
              {/* Column 1 */}
              <div className="space-y-3 sm:space-y-4 -translate-y-4">
                {column1.map((src, i) => (
                  <div
                    key={i}
                    className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-white/15 shadow-lg group transition-transform duration-500 hover:scale-105"
                  >
                    <Image
                      src={src}
                      alt="Digital Den Founder Community"
                      fill
                      className="object-cover transition-all duration-500 filter grayscale-[25%] contrast-[105%] group-hover:grayscale-0"
                      sizes="(max-width: 768px) 33vw, 20vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-0 transition-opacity" />
                  </div>
                ))}
              </div>

              {/* Column 2 (Offset Upwards) */}
              <div className="space-y-3 sm:space-y-4 translate-y-3">
                {column2.map((src, i) => (
                  <div
                    key={i}
                    className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-white/15 shadow-lg group transition-transform duration-500 hover:scale-105"
                  >
                    <Image
                      src={src}
                      alt="Digital Den Acceleration Hub"
                      fill
                      className="object-cover transition-all duration-500 filter grayscale-[25%] contrast-[105%] group-hover:grayscale-0"
                      sizes="(max-width: 768px) 33vw, 20vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-0 transition-opacity" />
                  </div>
                ))}
              </div>

              {/* Column 3 */}
              <div className="space-y-3 sm:space-y-4 -translate-y-6">
                {column3.map((src, i) => (
                  <div
                    key={i}
                    className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-white/15 shadow-lg group transition-transform duration-500 hover:scale-105"
                  >
                    <Image
                      src={src}
                      alt="Digital Den Demo Day & Summits"
                      fill
                      className="object-cover transition-all duration-500 filter grayscale-[25%] contrast-[105%] group-hover:grayscale-0"
                      sizes="(max-width: 768px) 33vw, 20vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-0 transition-opacity" />
                  </div>
                ))}
              </div>

            </div>
          </div>

          {/* ─── RIGHT: Typography & Action Callout matching Reference Image ─── */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <FadeIn animation="fadeIn" delay={0.1}>
              <span className="text-xs font-semibold uppercase tracking-widest text-purple-300 font-mono">
                Work with Digital Den
              </span>
            </FadeIn>

            <FadeIn animation="fadeIn" delay={0.2}>
              <h2
                className="font-['Inter',sans-serif] text-3xl sm:text-4xl lg:text-[48px] font-medium tracking-tight leading-[115%]"
                style={{
                  background: 'linear-gradient(90deg, #FFFFFF 0%, #FFFFFF 30%, #F3E8FF 45%, #D8B4FE 60%, #C084FC 75%, #A855F7 88%, #7E22CE 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Ready to Expand
                <br />
                Beyond Borders?
              </h2>
            </FadeIn>

            <FadeIn animation="fadeIn" delay={0.4}>
              <p className="text-slate-300 text-sm sm:text-base lg:text-lg font-normal leading-relaxed max-w-xl">
                Join the Digital Den ecosystem to access structured programs, international capital, and direct corridors to high-growth global hubs.
              </p>
            </FadeIn>

            <FadeIn animation="slideUp" delay={0.5} className="pt-4 flex flex-wrap items-center gap-4">
              {/* Primary Dark Pill Button matching Reference Image */}
              <button
                onClick={onOpenAction}
                className="group px-8 py-4 rounded-full bg-white text-black hover:bg-slate-200 font-bold text-sm tracking-wide transition-all duration-300 hover:scale-105 shadow-xl flex items-center gap-3 cursor-pointer"
              >
                <span>Apply as Startup</span>
                <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Secondary Transparent Glass Button */}
              <button
                onClick={onOpenAction}
                className="px-7 py-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/20 text-white font-semibold text-sm tracking-wide transition-all duration-300 hover:border-white/40 cursor-pointer"
              >
                Partner with Us
              </button>
            </FadeIn>
          </div>

        </div>
      </div>
    </section>
  );
}
