'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createPortal } from 'react-dom';
import { Compass, Menu, X, ArrowUpRight, ChevronDown, Rocket, Layers, Globe, Trophy } from 'lucide-react';

interface NavbarProps {
  onOpenAction?: () => void;
}

export default function Navbar({ onOpenAction }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollThreshold = window.innerHeight * 0.02;

      // Check scroll depth
      setIsScrolled(currentScrollY > scrollThreshold);

      // Hide navbar when scrolling down past 100px, show when scrolling up
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Glassmorphism inline styles for exact cross-browser support
  const glassStyle = {
    background: 'rgba(2, 11, 24, 0.65)',
    backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
    boxShadow: '0 8px 32px 0 rgba(0,0,0,0.4), inset 0 1px 0 0 rgba(255, 255, 255, 0.15)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
  };

  const dropdownGlassStyle = {
    background: 'rgba(2, 11, 24, 0.85)',
    backdropFilter: 'blur(24px) saturate(180%)',
    WebkitBackdropFilter: 'blur(24px) saturate(180%)',
    boxShadow: '0 20px 50px 0 rgba(0,0,0,0.6), inset 0 1px 0 0 rgba(255, 255, 255, 0.15)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
  };

  const navItems = [
    { name: 'Platform', href: '/platform', hasDropdown: true, key: 'platform' },
    { name: 'Programs', href: '/programs', hasDropdown: true, key: 'programs' },
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'Opportunities', href: '/opportunities' },
    { name: 'Partners', href: '/partners' },
    { name: 'Events', href: '/events' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 pointer-events-none ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
          }`}
      >
        <nav className="w-full px-4 sm:px-8 md:px-12 lg:px-16 py-4 md:py-5">
          <div className="w-full flex items-center justify-between h-16 md:h-20">

            {/* --- LEFT: LOGO (Viewport Left End) --- */}
            <div className="flex-1 flex justify-start items-center overflow-hidden">
              <div
                className={`transition-all duration-500 ease-in-out pointer-events-auto ${isScrolled
                  ? 'opacity-100 blur-0 scale-100 md:opacity-0 md:blur-sm md:scale-95 md:pointer-events-none'
                  : 'opacity-100 blur-0 scale-100'
                  }`}
              >
                <Link href="/" className="flex items-center gap-3 group">
                  <Image
                    src="/logoden.svg"
                    alt="Digital Den Logo"
                    width={257}
                    height={52}
                    priority
                    className="h-6 sm:h-7 md:h-7 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>
              </div>
            </div>

            {/* --- CENTER: FLOATING GLASS PILL --- */}
            <div className="flex-none flex justify-center items-center">
              <div
                className={`hidden md:flex items-center rounded-2xl transition-all duration-500 ease-in-out pointer-events-auto ${isScrolled ? 'px-5 py-3 scale-100' : 'px-7 py-3.5 scale-95'
                  }`}
                style={glassStyle}
              >
                {/* Logo inside pill on scroll */}
                <div
                  className={`flex items-center transition-all duration-500 ease-in-out ${isScrolled
                    ? 'opacity-100 blur-0 scale-100'
                    : 'opacity-0 blur-sm scale-95 w-0 overflow-hidden'
                    }`}
                >
                  <Link href="/" className="flex items-center gap-2 group">
                    <Image
                      src="/logoden.svg"
                      alt="Digital Den Logo"
                      width={257}
                      height={52}
                      className="h-6 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                </div>

                {/* Vertical Divider */}
                <div
                  className={`transition-all duration-500 ease-in-out ${isScrolled ? 'opacity-100 w-px h-4 mx-3 bg-purple-500/30' : 'opacity-0 w-0 mx-0'
                    }`}
                />

                {/* Nav Links */}
                <div className={`flex items-center ${isScrolled ? 'space-x-6' : 'space-x-6 lg:space-x-8'}`}>
                  {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    if (item.hasDropdown) {
                      return (
                        <div
                          key={item.name}
                          className="relative"
                          onMouseEnter={() => setActiveDropdown(item.key)}
                          onMouseLeave={() => setActiveDropdown(null)}
                        >
                          <Link
                            href={item.href}
                            className={`flex items-center gap-1 text-sm font-medium transition-colors cursor-pointer ${isActive
                              ? 'text-purple-300 font-semibold'
                              : 'text-slate-200 hover:text-white'
                              }`}
                          >
                            <span>{item.name}</span>
                            <ChevronDown className="w-3.5 h-3.5 text-purple-300/80 transition-transform duration-300 group-hover:rotate-180" />
                          </Link>

                          {/* Dropdown Portal */}
                          {mounted &&
                            item.key === 'platform' &&
                            createPortal(
                              <div
                                className={`fixed left-1/2 -translate-x-1/2 rounded-2xl border border-purple-500/20 shadow-2xl transition-all duration-300 z-[9999] pointer-events-auto overflow-hidden w-[720px] ${activeDropdown === 'platform'
                                  ? 'opacity-100 translate-y-0 visible'
                                  : 'opacity-0 -translate-y-2 invisible'
                                  }`}
                                style={{ top: '100px', ...dropdownGlassStyle }}
                                onMouseEnter={() => setActiveDropdown('platform')}
                                onMouseLeave={() => setActiveDropdown(null)}
                              >
                                {/* Radial Glow Orbs */}
                                <div
                                  className="pointer-events-none absolute -top-16 -right-16 w-[350px] h-[350px] rounded-full opacity-25"
                                  style={{ background: 'radial-gradient(circle, #a855f7 0%, transparent 70%)', filter: 'blur(40px)' }}
                                />
                                <div
                                  className="pointer-events-none absolute -bottom-16 -left-16 w-[350px] h-[350px] rounded-full opacity-25"
                                  style={{ background: 'radial-gradient(circle, #06b6d4 0%, transparent 70%)', filter: 'blur(40px)' }}
                                />

                                <div className="relative z-10 p-6 grid grid-cols-2 gap-4 text-white">
                                  <Link
                                    href="/platform#building"
                                    className="p-4 rounded-xl bg-white/[0.03] hover:bg-purple-600/10 transition-all border border-white/10 group flex gap-3.5 items-start"
                                  >
                                    <div className="w-9 h-9 rounded-lg bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300 flex-shrink-0">
                                      <Layers className="w-4 h-4" />
                                    </div>
                                    <div>
                                      <h4 className="font-semibold text-sm text-white group-hover:text-purple-300 transition-colors">
                                        Venture Building
                                      </h4>
                                      <p className="text-xs text-slate-300 mt-1">
                                        Architectural support to build, validate & scale your tech stack.
                                      </p>
                                    </div>
                                  </Link>

                                  <Link
                                    href="/platform#expansion"
                                    className="p-4 rounded-xl bg-white/[0.03] hover:bg-purple-600/10 transition-all border border-white/10 group flex gap-3.5 items-start"
                                  >
                                    <div className="w-9 h-9 rounded-lg bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-300 flex-shrink-0">
                                      <Globe className="w-4 h-4" />
                                    </div>
                                    <div>
                                      <h4 className="font-semibold text-sm text-white group-hover:text-purple-300 transition-colors">
                                        Global Expansion
                                      </h4>
                                      <p className="text-xs text-slate-300 mt-1">
                                        Direct market access across Montenegro, US, Benelux & Jordan.
                                      </p>
                                    </div>
                                  </Link>
                                </div>
                              </div>,
                              document.body
                            )}

                          {mounted &&
                            item.key === 'programs' &&
                            createPortal(
                              <div
                                className={`fixed left-1/2 -translate-x-1/2 rounded-2xl border border-purple-500/20 shadow-2xl transition-all duration-300 z-[9999] pointer-events-auto overflow-hidden w-[720px] ${activeDropdown === 'programs'
                                  ? 'opacity-100 translate-y-0 visible'
                                  : 'opacity-0 -translate-y-2 invisible'
                                  }`}
                                style={{ top: '100px', ...dropdownGlassStyle }}
                                onMouseEnter={() => setActiveDropdown('programs')}
                                onMouseLeave={() => setActiveDropdown(null)}
                              >
                                <div
                                  className="pointer-events-none absolute -top-16 -right-16 w-[350px] h-[350px] rounded-full opacity-25"
                                  style={{ background: 'radial-gradient(circle, #a855f7 0%, transparent 70%)', filter: 'blur(40px)' }}
                                />

                                <div className="relative z-10 p-6 grid grid-cols-2 gap-4 text-white">
                                  <Link
                                    href="/programs#acceleration"
                                    className="p-4 rounded-xl bg-white/[0.03] hover:bg-purple-600/10 transition-all border border-white/10 group flex gap-3.5 items-start"
                                  >
                                    <div className="w-9 h-9 rounded-lg bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300 flex-shrink-0">
                                      <Rocket className="w-4 h-4" />
                                    </div>
                                    <div>
                                      <h4 className="font-semibold text-sm text-white group-hover:text-purple-300 transition-colors">
                                        Startup Accelerator
                                      </h4>
                                      <p className="text-xs text-slate-300 mt-1">
                                        Structured acceleration moving founders from seed to capital.
                                      </p>
                                    </div>
                                  </Link>

                                  <Link
                                    href="/programs#fintech"
                                    className="p-4 rounded-xl bg-white/[0.03] hover:bg-purple-600/10 transition-all border border-white/10 group flex gap-3.5 items-start"
                                  >
                                    <div className="w-9 h-9 rounded-lg bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 flex-shrink-0">
                                      <Trophy className="w-4 h-4" />
                                    </div>
                                    <div>
                                      <h4 className="font-semibold text-sm text-white group-hover:text-purple-300 transition-colors">
                                        FinTech Innovation Loop
                                      </h4>
                                      <p className="text-xs text-slate-300 mt-1">
                                        Sector-focused opportunity connecting startups & financial institutions.
                                      </p>
                                    </div>
                                  </Link>
                                </div>
                              </div>,
                              document.body
                            )}
                        </div>
                      );
                    }

                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`text-sm font-medium transition-colors ${isActive
                          ? 'text-purple-300 font-semibold'
                          : 'text-slate-200 hover:text-white'
                          }`}
                      >
                        {item.name}
                      </Link>
                    );
                  })}
                </div>

                {/* Scrolled CTA button inside pill */}
                {isScrolled && (
                  <>
                    <div className="w-px h-4 mx-3 bg-purple-500/30" />
                    <button
                      onClick={onOpenAction}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 whitespace-nowrap bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-md shadow-purple-950/40 flex items-center gap-1 cursor-pointer border border-purple-400/30"
                    >
                      <span>Apply Now</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* --- RIGHT: ACTION BUTTON (Viewport Right End) --- */}
            <div className="flex-1 flex justify-end items-center space-x-3 pointer-events-auto">
              <div
                className={`transition-all duration-500 ease-in-out ${isScrolled ? 'opacity-0 blur-sm scale-95 pointer-events-none' : 'opacity-100 blur-0 scale-100'
                  }`}
              >
                <button
                  onClick={onOpenAction}
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-600/30 to-purple-800/30 hover:from-purple-600/50 hover:to-purple-800/50 text-white font-semibold text-xs tracking-wider uppercase border border-purple-400/40 backdrop-blur-md transition-all flex items-center gap-2 hover:border-purple-400/80 shadow-lg shadow-purple-950/40 group cursor-pointer"
                >
                  <span>Apply as Startup</span>
                  <ArrowUpRight className="w-4 h-4 text-purple-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </div>

              {/* Mobile Toggle Button */}
              <div className="md:hidden">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 rounded-xl bg-[#020b18]/80 backdrop-blur-xl border border-white/20 text-white hover:text-purple-300"
                >
                  {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </div>

          </div>
        </nav>
      </header>

      {/* --- MOBILE DRAWER OVERLAY --- */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden pointer-events-auto">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed top-20 left-4 right-4 bg-[#020b18]/95 border border-purple-500/30 rounded-3xl shadow-2xl overflow-y-auto p-6 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-base font-semibold text-slate-200 hover:text-purple-300 transition-colors py-2 border-b border-white/5"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenAction) onOpenAction();
              }}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-sm uppercase tracking-wider text-center shadow-lg shadow-purple-900/50 flex items-center justify-center gap-2"
            >
              <span>Apply as Startup</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
