'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ExternalLink, Globe, Sparkles } from 'lucide-react';
import { FadeIn } from './FadeIn';

export default function ProofOfGrowthSection() {
  const hubs = [
    { name: 'Podgorica', region: 'Montenegro', role: 'HQ & Western Balkans Hub' },
    { name: 'New York', region: 'United States', role: 'US Capital & Market Gateway' },
    { name: 'Brussels', region: 'Benelux', role: 'European Innovation Corridor' },
    { name: 'Amman', region: 'Jordan', role: 'MENA Expansion Network' },
  ];

  return (
    <section className="w-full max-w-[1450px] mx-auto px-4 sm:px-8 lg:px-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Left Copy Column */}
        <div className="space-y-6 text-left">
          <div className="space-y-3">
            <FadeIn animation="fadeIn" delay={0.1}>
              <span className="text-xs font-semibold uppercase tracking-widest text-purple-300 bg-purple-500/10 border border-purple-500/20 px-3.5 py-1.5 rounded-full inline-flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
                Proof of Growth & Beyond Borders
              </span>
            </FadeIn>
            <FadeIn animation="fadeIn" delay={0.2}>
              <h2
                className="font-['Inter',sans-serif] text-3xl sm:text-4xl lg:text-[44px] leading-[118%] font-medium tracking-tight"
                style={{
                  background: 'linear-gradient(90deg, #FFFFFF 0%, #FFFFFF 30%, #F3E8FF 45%, #D8B4FE 60%, #C084FC 75%, #A855F7 88%, #7E22CE 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Connecting Founders Across Key Global Hubs
              </h2>
            </FadeIn>
          </div>

          <FadeIn animation="fadeIn" delay={0.3}>
            <p className="text-slate-300 text-sm sm:text-base font-normal leading-relaxed">
              Startups that turned potential into investment, revenue, clients and international market presence across Montenegro, the Western Balkans, US, Jordan and Benelux.
            </p>
          </FadeIn>


          <div className="pt-2">
            <Link
              href="/portfolio"
              className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs uppercase tracking-wider border border-white/20 transition-all flex items-center gap-2 w-fit group hover:border-purple-400/40 shadow-lg"
            >
              <span>Explore Full Portfolio</span>
              <ExternalLink className="w-4 h-4 text-purple-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Right Dark Theme Network Map Column */}
        <FadeIn animation="slideUp" delay={0.4} className="relative w-full h-[400px] sm:h-[460px] overflow-hidden" as="div">
          <div
            className="w-full h-full rounded-[28px] relative overflow-hidden group"
            style={{
              background: 'linear-gradient(180deg, rgba(14, 10, 24, 0.9) 0%, rgba(5, 3, 10, 0.95) 100%)',
              border: '1.2px solid rgba(168, 85, 247, 0.25)',
              boxShadow: 'inset 0px 14px 46px -12px rgba(168, 85, 247, 0.2), 0 25px 60px -15px rgba(0,0,0,0.9)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
            }}
          >
            {/* Ambient Background Violet Glow */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full pointer-events-none opacity-40 group-hover:opacity-60 transition-opacity duration-700"
              style={{
                background: 'radial-gradient(circle, rgba(168, 85, 247, 0.25) 0%, rgba(124, 58, 237, 0.1) 50%, transparent 70%)',
                filter: 'blur(50px)',
              }}
            />

            {/* Dark Theme Network Map Illustration */}
            <Image
              src="/images/global-network-map.jpg"
              alt="Global Innovation Network Map - Podgorica, New York, Brussels, Amman"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center group-hover:scale-[1.03] transition-transform duration-700 ease-out"
              priority
            />

            {/* Subtle Glassmorphic Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />


          </div>
        </FadeIn>
      </div>
    </section>
  );
}
