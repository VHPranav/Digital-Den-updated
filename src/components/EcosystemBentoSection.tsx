'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { FadeIn } from './FadeIn';
import { Search, ArrowRight, TrendingUp } from 'lucide-react';

interface EcosystemBentoSectionProps {
  onOpenAction?: () => void;
}

export default function EcosystemBentoSection({ onOpenAction }: EcosystemBentoSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHub, setSelectedHub] = useState<number>(0);

  // Exact location directory list from the reference design
  const locations = [
    { name: 'DIGITAL DEN HQ Podgorica', location: 'Podgorica' },
    { name: 'MTSB USA Accelerator Austin', location: 'Austin, Texas' },
    { name: 'Digital Den EU Desk Vienna', location: 'Wien' },
    { name: 'Digital Den Innovation Lab Frankfurt', location: 'Frankfurt' },
    { name: 'Adriatic Seed Lab Sarajevo', location: 'Sarajevo' },
    { name: 'Balkan Tech Desk Belgrade', location: 'Belgrade' },
    { name: 'Digital Den Venture Lab London', location: 'London' },
    { name: 'Luxembourg Venture Showcase', location: 'Luxembourg' },
    { name: 'Munich Scaleup Center', location: 'München' },
    { name: 'Dublin Fintech Desk', location: 'Dublin' },
  ];

  const filteredLocations = locations.filter(
    (loc) =>
      loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-12">

      {/* ─── SECTION HEADER (Exact Typography & Multi-Color Text Gradient) ─── */}
      <div className="text-center max-w-4xl mx-auto space-y-4 mb-16">
        <FadeIn animation="fadeIn" delay={0.1}>
          <h2
            className="font-['Inter',sans-serif] font-medium text-3xl sm:text-4xl lg:text-[42px] leading-[125%] tracking-tight text-center max-w-3xl mx-auto"
            style={{
              background: 'linear-gradient(90deg, #FFFFFF 0%, #FFFFFF 30%, #F3E8FF 45%, #D8B4FE 60%, #C084FC 75%, #A855F7 88%, #7E22CE 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Live in real operations, not just a showroom.
            80–120 sessions per day across live sites.
            11 active installations.
          </h2>
        </FadeIn>

        <FadeIn animation="fadeIn" delay={0.2}>
          <p className="font-['Inter',sans-serif] font-medium text-sm sm:text-[16.7px] leading-[22px] text-white/50 text-center">
            Based on timestamped IoT session logs and varying by location.
          </p>
        </FadeIn>
      </div>

      {/* ─── ROW 1: Collaboration Hero Card + 6 Glass Metric Tiles Grid (Height ~450px) ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

        {/* Left Card (Width ~64% ratio / col-span-7) */}
        <FadeIn animation="slideUp" delay={0.15} className="lg:col-span-7 h-full">
          <div
            className="relative h-full min-h-[420px] sm:min-h-[450px] p-8 sm:p-12 rounded-[40px] overflow-hidden flex flex-col justify-between"
            style={{
              background: '#0D0814',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7)',
            }}
          >
            {/* Radial Gradient Blob (Pure Royal Violet & Amethyst Aura) */}
            <div
              className="absolute -top-[55%] -right-[15%] w-[480px] h-[480px] rounded-full pointer-events-none opacity-80"
              style={{
                background: 'radial-gradient(75.89% 77.17% at 77.86% 17.22%, rgba(168, 85, 247, 0.25) 0%, rgba(147, 51, 234, 0.55) 23.2%, rgba(192, 132, 252, 0.85) 61.6%, rgba(216, 180, 254, 0.95) 90.7%, #C084FC 100%)',
                filter: 'blur(35px)',
              }}
            />

            {/* Overlay Glass Blur */}
            <div className="absolute inset-0 bg-white/[0.01] backdrop-blur-[16.5px] pointer-events-none" />

            {/* Top Logo / Brand Title */}
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-8">
                <span className="font-['Inter',sans-serif] text-xl font-bold tracking-widest text-white">
                  DIGITAL DEN
                </span>
                <span className="text-[10px] text-white/50 tracking-wider">GROUP</span>
              </div>
            </div>

            {/* Bottom Content Split (Two Columns) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 relative z-10 pt-4">
              <div className="md:col-span-7 space-y-2">
                <p className="font-['Inter',sans-serif] text-xs sm:text-[14.4px] text-white/50">
                  Cooperation with Digital Den Group<sup className="text-[11px]">TM</sup>
                </p>
                <p className="font-['Inter',sans-serif] font-medium text-sm sm:text-[16.7px] leading-[22px] text-white/70">
                  The <strong className="text-white font-semibold">Global Acceleration Corridor</strong> was developed by Digital Den – in close cooperation with international technology, electronics and venture partners who contributed their expertise in research, cross-border capital, and software manufacturing.
                </p>
              </div>

              <div className="md:col-span-5 flex items-end">
                <p className="font-['Inter',sans-serif] text-xs sm:text-[14.3px] leading-[20px] text-white/50">
                  Digital Den Hubs serve as a high-velocity environment for testing programs and experience — while founders operate independently.
                </p>
              </div>
            </div>

          </div>
        </FadeIn>

        {/* Right 6 Metric Tiles Grid (Width ~36% ratio / col-span-5) */}
        <FadeIn animation="slideUp" delay={0.25} className="lg:col-span-5 h-full">
          <div
            className="relative h-full min-h-[450px] p-6 rounded-[40px] grid grid-cols-2 gap-4 items-center justify-center overflow-hidden"
            style={{
              background: 'radial-gradient(circle at 50% 50%, rgba(249, 115, 22, 0.18) 0%, rgba(13, 8, 20, 0.95) 75%)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            {/* Tile 1: Frankfurt */}
            <div
              className="relative h-[135px] sm:h-[145px] p-5 rounded-[32px] flex flex-col justify-between transition-transform duration-300 hover:scale-105"
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3), inset -0.5px -0.5px 0px rgba(255, 255, 255, 0.15), inset 1px 1px 0px -1px rgba(255, 255, 255, 0.2)',
              }}
            >
              <h3 className="font-['Inter',sans-serif] font-medium text-sm sm:text-[16px] text-white">Frankfurt</h3>
              <p className="font-['Inter',sans-serif] text-xs sm:text-[13px] text-white/70 leading-snug">The next launch is in 2026.</p>
            </div>

            {/* Tile 2: Salzburg / Podgorica */}
            <div
              className="relative h-[135px] sm:h-[145px] p-5 rounded-[32px] flex flex-col justify-between transition-transform duration-300 hover:scale-105"
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3), inset -0.5px -0.5px 0px rgba(255, 255, 255, 0.15), inset 1px 1px 0px -1px rgba(255, 255, 255, 0.2)',
              }}
            >
              <h3 className="font-['Inter',sans-serif] font-medium text-sm sm:text-[16px] text-white leading-tight">Podgorica HQ</h3>
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-['Inter',sans-serif] font-medium text-base text-white">6</span>
                  <span className="font-['Inter',sans-serif] text-[11px] text-white/50">Sessions</span>
                </div>
                <div className="flex items-center gap-1 text-[#6CC200] text-[11px] font-['Inter',sans-serif]">
                  <span>100%</span>
                  <span className="text-[10px]">↗</span>
                </div>
              </div>
            </div>

            {/* Tile 3: Munich */}
            <div
              className="relative h-[135px] sm:h-[145px] p-5 rounded-[32px] flex flex-col justify-between transition-transform duration-300 hover:scale-105"
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3), inset -0.5px -0.5px 0px rgba(255, 255, 255, 0.15), inset 1px 1px 0px -1px rgba(255, 255, 255, 0.2)',
              }}
            >
              <h3 className="font-['Inter',sans-serif] font-medium text-sm sm:text-[16px] text-white">Austin Desk</h3>
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-['Inter',sans-serif] font-medium text-base text-white">4</span>
                  <span className="font-['Inter',sans-serif] text-[11px] text-white/50">Sessions</span>
                </div>
                <div className="flex items-center gap-1 text-[#6CC200] text-[11px] font-['Inter',sans-serif]">
                  <span>4%</span>
                  <span className="text-[10px]">↗</span>
                </div>
              </div>
            </div>

            {/* Tile 4: Graz */}
            <div
              className="relative h-[135px] sm:h-[145px] p-5 rounded-[32px] flex flex-col justify-between transition-transform duration-300 hover:scale-105"
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3), inset -0.5px -0.5px 0px rgba(255, 255, 255, 0.15), inset 1px 1px 0px -1px rgba(255, 255, 255, 0.2)',
              }}
            >
              <h3 className="font-['Inter',sans-serif] font-medium text-sm sm:text-[16px] text-white leading-tight">Vienna Desk</h3>
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-['Inter',sans-serif] font-medium text-base text-white">12</span>
                  <span className="font-['Inter',sans-serif] text-[11px] text-white/50">Sessions</span>
                </div>
                <div className="flex items-center gap-1 text-[#6CC200] text-[11px] font-['Inter',sans-serif]">
                  <span>50%</span>
                  <span className="text-[10px]">↗</span>
                </div>
              </div>
            </div>

            {/* Tile 5: Linz */}
            <div
              className="relative h-[135px] sm:h-[145px] p-5 rounded-[32px] flex flex-col justify-between transition-transform duration-300 hover:scale-105"
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3), inset -0.5px -0.5px 0px rgba(255, 255, 255, 0.15), inset 1px 1px 0px -1px rgba(255, 255, 255, 0.2)',
              }}
            >
              <h3 className="font-['Inter',sans-serif] font-medium text-sm sm:text-[16px] text-white">Sarajevo Lab</h3>
              <p className="font-['Inter',sans-serif] text-xs text-white/60">Seed Incubation</p>
            </div>

            {/* Tile 6: Wien */}
            <div
              className="relative h-[135px] sm:h-[145px] p-5 rounded-[32px] flex flex-col justify-between transition-transform duration-300 hover:scale-105"
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3), inset -0.5px -0.5px 0px rgba(255, 255, 255, 0.15), inset 1px 1px 0px -1px rgba(255, 255, 255, 0.2)',
              }}
            >
              <h3 className="font-['Inter',sans-serif] font-medium text-sm sm:text-[16px] text-white">London Hub</h3>
              <p className="font-['Inter',sans-serif] text-xs text-white/60">Venture Showcase</p>
            </div>

          </div>
        </FadeIn>
      </div>

      {/* ─── ROW 2: Architectural Stock Image Showcase & Searchable Directory (Height ~592px) ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

        {/* Left Side: Real Architectural Stock Image (col-span-7) */}
        <FadeIn animation="slideUp" delay={0.3} className="lg:col-span-7 h-full">
          <div
            className="relative h-[380px] sm:h-[520px] lg:h-full min-h-[460px] rounded-[40px] overflow-hidden group"
            style={{
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8)',
            }}
          >
            {/* Real Stock Photo: Modern futuristic architectural workspace / tech showroom */}
            <Image
              src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80"
              alt="Digital Den Hub & Live Installation"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
            {/* Subtle Gradient Scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* In-Image Overlay Badge */}
            <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-black/60 border border-white/15 backdrop-blur-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-['Inter',sans-serif] tracking-widest text-[#FF8958] font-semibold block">
                  Podgorica Flagship Facility
                </span>
                <p className="text-white font-medium text-sm">Interactive Tech & Innovation Lab</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#6CC200]/20 border border-[#6CC200]/40 text-[#6CC200] text-xs font-mono">
                Active Node ↗
              </span>
            </div>
          </div>
        </FadeIn>

        {/* Right Side: Searchable Location Directory with Masked Top/Bottom Fade (col-span-5) */}
        <FadeIn animation="slideUp" delay={0.4} className="lg:col-span-5 h-full">
          <div
            className="h-full min-h-[460px] p-8 rounded-[40px] flex flex-col justify-between"
            style={{
              background: '#0D0814',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 20px 45px rgba(0, 0, 0, 0.7)',
            }}
          >
            <div className="space-y-4">
              <h3 className="font-['Inter',sans-serif] font-medium text-[16.7px] leading-[22px] text-white">
                Explore Digital Den at live locations
              </h3>

              {/* Scrollable Masked List with Top & Bottom Fade */}
              <div className="relative h-[320px] overflow-hidden [mask-image:linear-gradient(180deg,transparent_0%,black_15%,black_85%,transparent_100%)]">
                <div className="space-y-2 py-4 h-full overflow-y-auto pr-1">
                  {filteredLocations.map((loc, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedHub(idx)}
                      className={`h-[45.36px] px-3.5 rounded-[18px] transition-all duration-200 cursor-pointer flex items-center justify-between ${selectedHub === idx
                        ? 'bg-white/15 border border-white/30 text-white'
                        : 'bg-white/[0.06] hover:bg-white/10 text-white/80'
                        }`}
                    >
                      <span className="font-['Inter',sans-serif] text-xs sm:text-[14.3px] font-normal truncate max-w-[220px]">
                        {loc.name}
                      </span>
                      <span className="font-['Inter',sans-serif] text-[11.4px] text-white/50 flex-shrink-0 ml-2">
                        {loc.location}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Search Input Pill (Matching exact CSS rounded-1600px) */}
            <div className="relative mt-4">
              <Search className="w-4 h-4 text-white/50 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-[36px] pl-11 pr-4 rounded-[1600px] bg-white/[0.06] backdrop-blur-[5px] text-sm text-white placeholder:text-white/50 border border-white/10 focus:outline-none focus:border-white/30 transition-colors font-['Inter',sans-serif]"
              />
            </div>

          </div>
        </FadeIn>
      </div>

      {/* ─── ROW 3: Partner Logos Strip & Gradient Action Button (Height ~295px) ─── */}
      <FadeIn animation="fadeIn" delay={0.45}>
        <div
          className="p-8 sm:p-10 rounded-[40px] space-y-8"
          style={{
            background: '#0D0814',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.7)',
          }}
        >
          {/* Partner Brand Logos Row */}
          <div className="flex flex-wrap items-center justify-between gap-6 sm:gap-8 opacity-70 hover:opacity-100 transition-opacity">
            <span className="font-['Inter',sans-serif] font-bold text-sm tracking-widest text-white/80 uppercase">
              BIOGENA
            </span>
            <span className="font-['Inter',sans-serif] font-semibold text-sm tracking-widest text-white/80 uppercase">
              VAYA HEALTH
            </span>
            <span className="font-['Inter',sans-serif] font-semibold text-sm tracking-widest text-white/80 uppercase">
              PULSE HEALTH
            </span>
            <span className="font-['Inter',sans-serif] font-semibold text-sm tracking-widest text-white/80 uppercase">
              RED:UP
            </span>
            <span className="font-['Inter',sans-serif] font-semibold text-sm tracking-widest text-white/80 uppercase">
              WALDHOF
            </span>
            <span className="font-['Inter',sans-serif] font-semibold text-sm tracking-widest text-white/80 uppercase">
              LONGEVITY INVESTORS
            </span>
            <span className="font-['Inter',sans-serif] font-semibold text-sm tracking-widest text-white/80 uppercase">
              EUROPEAN UNION
            </span>
            <span className="font-['Inter',sans-serif] font-bold text-sm tracking-widest text-white/80 uppercase">
              FORBES
            </span>
          </div>

          {/* Bottom Action Strip with Multi-Color Gradient Pill */}
          <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
            <h3 className="font-['Inter',sans-serif] font-medium text-sm sm:text-[16.7px] leading-[22px] text-white/60 text-center md:text-left">
              Join our partnership network, let&apos;s discuss the opportunities
            </h3>

            {/* Glowing Gradient Button (Pure Violet & Amethyst Luxury) */}
            <button
              onClick={onOpenAction}
              className="group relative h-[56px] px-8 rounded-[1600px] flex items-center gap-3 transition-all duration-300 hover:scale-105 shadow-xl cursor-pointer flex-shrink-0"
              style={{
                background: 'linear-gradient(90deg, #FFFFFF 0%, #E9D5FF 25%, #C084FC 50%, #A855F7 75%, #7E22CE 100%)',
                boxShadow: '0 0 35px rgba(168, 85, 247, 0.45)',
              }}
            >
              <span className="font-['Inter',sans-serif] font-medium text-sm tracking-normal text-white">
                Book a partner call
              </span>
              <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

        </div>
      </FadeIn>

    </section>
  );
}
