'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="w-full bg-black pt-10 pb-16 sm:pb-18 md:pb-26 px-4 sm:px-8 lg:px-14 relative z-30 font-['Inter',sans-serif]">
      {/* ─── Main Footer Card (3-Color Purple Gradient + Glassmorphism) ─── */}
      <div
        className="max-w-[1720px] mx-auto rounded-[40px] p-8 sm:p-12 lg:p-16 relative overflow-hidden"
        style={{
          background:
            'linear-gradient(135deg, #090114 0%, #2e0854 48%, #6b21a8 100%)',
          border: '1px solid rgba(192, 132, 252, 0.25)',
          boxShadow:
            '0 25px 60px -15px rgba(46, 8, 84, 0.6), inset 0 1.5px 1px 0 rgba(255, 255, 255, 0.15), inset 0 -1.5px 1px 0 rgba(0, 0, 0, 0.5)',
        }}
      >
        {/* Subtle 3-Color Purple Ambient Light Blooms */}
        <div
          className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(147, 51, 234, 0.28) 0%, transparent 70%)',
            filter: 'blur(50px)',
          }}
        />
        <div
          className="absolute bottom-0 left-10 w-[450px] h-[450px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(88, 28, 135, 0.35) 0%, transparent 70%)',
            filter: 'blur(50px)',
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse, rgba(168, 85, 247, 0.12) 0%, transparent 75%)',
            filter: 'blur(60px)',
          }}
        />

        {/* ─── Grid Content ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 relative z-10">

          {/* Column 1: Brand Info, Socials & Community Stats */}
          <div className="lg:col-span-4 space-y-6">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <Image
                src="/logoden.svg"
                alt="Digital Den Logo"
                width={257}
                height={52}
                className="h-8 w-auto object-contain brightness-0 invert opacity-95 group-hover:opacity-100 transition-opacity"
              />
            </Link>

            <p className="text-[#FCF8F1] text-sm font-semibold italic text-purple-200">
              Your Gateway to Global Markets.
            </p>

            <p className="text-[#F2ECE2]/60 text-xs leading-relaxed max-w-sm">
              Connecting founders mainly from the Western Balkans with programs, strategic partners, capital and high-growth international markets.
            </p>

            {/* Social Icons Row */}
            <div className="flex items-center gap-3 pt-1">
              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 rounded-[10px] bg-white/10 hover:bg-purple-600/30 border border-white/10 flex items-center justify-center text-[#FCF8F1] hover:text-white transition-all hover:scale-105"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-10 h-10 rounded-[10px] bg-white/10 hover:bg-purple-600/30 border border-white/10 flex items-center justify-center text-[#FCF8F1] hover:text-white transition-all hover:scale-105"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>

              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-10 h-10 rounded-[10px] bg-white/10 hover:bg-purple-600/30 border border-white/10 flex items-center justify-center text-[#FCF8F1] hover:text-white transition-all hover:scale-105"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            </div>

            {/* Community Engagement Stats */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-[11.4px] leading-[14px] text-[#FCF8F1]">
                <div className="w-6 h-6 rounded-full border border-[#FCF8F1]/60 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-[#FCF8F1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <span>Combined across all platforms: 11k community</span>
              </div>

              <div className="flex items-center gap-3 text-[11.4px] leading-[14px] text-[#FCF8F1]">
                <div className="w-6 h-6 rounded-full border border-[#FCF8F1]/60 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-[#FCF8F1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <span>Daily: 50+ startup inquiries &amp; applications</span>
              </div>

              <div className="flex items-center gap-3 text-[11.3px] leading-[14px] text-[#FCF8F1]">
                <div className="w-6 h-6 rounded-full border border-[#FCF8F1]/60 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-[#FCF8F1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <span>Growth: 50 Balkan startups scaling globally</span>
              </div>
            </div>
          </div>

          {/* Column 2: Explore Links */}
          <div className="lg:col-span-3 space-y-4">
            <div className="text-xs font-bold text-[#FCF8F1] uppercase tracking-wider">
              Explore
            </div>
            <ul className="space-y-3 text-[13px] font-medium text-[#F2ECE2]/80">
              <li>
                <Link href="#platform" className="hover:text-purple-300 transition-colors">
                  Platform &amp; Venture Studio
                </Link>
              </li>
              <li>
                <Link href="#programs" className="hover:text-purple-300 transition-colors">
                  Incubation &amp; Acceleration Programs
                </Link>
              </li>
              <li>
                <Link href="#portfolio" className="hover:text-purple-300 transition-colors">
                  Portfolio &amp; Proof of Growth
                </Link>
              </li>
              <li>
                <Link href="#opportunities" className="hover:text-purple-300 transition-colors">
                  Opportunities &amp; Matchmaking
                </Link>
              </li>
              <li>
                <Link href="#partners" className="hover:text-purple-300 transition-colors">
                  Global Partners Network
                </Link>
              </li>
              <li>
                <Link href="#events" className="hover:text-purple-300 transition-colors">
                  Ecosystem Events &amp; Summits
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Connect Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="text-xs font-bold text-[#FCF8F1] uppercase tracking-wider">
              Connect
            </div>
            <ul className="space-y-3 text-xs text-[#F2ECE2]/70">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                <span>Podgorica, Montenegro</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>+382 (0)20 123 456</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-purple-400 flex-shrink-0" />
                <span>info@digitalden.me</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter Prompt */}
          <div className="lg:col-span-3 space-y-4">
            <div className="text-xs font-bold text-[#FCF8F1] uppercase tracking-wider">
              Stay Informed
            </div>
            <p className="text-xs text-[#F2ECE2]/60 leading-relaxed">
              Subscribe to Digital Den updates for upcoming opportunities, programs, and ecosystem news.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-400 transition-all pr-11"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="absolute right-1.5 top-1.5 bottom-1.5 px-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center transition-colors"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {subscribed && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium pt-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Subscribed successfully!</span>
                </div>
              )}
            </form>
          </div>

        </div>

        {/* ─── Bottom Copyright Bar ─── */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-[#F2ECE2]/40">
          <div>
            &copy; {new Date().getFullYear()} Digital Den Launch Platform. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <Link href="#privacy" className="hover:text-[#FCF8F1] transition-colors">Privacy Policy</Link>
            <Link href="#terms" className="hover:text-[#FCF8F1] transition-colors">Terms of Service</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
