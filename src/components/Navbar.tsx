'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowUpRight } from 'lucide-react';

interface NavbarProps {
  onOpenAction?: () => void;
}

export default function Navbar({ onOpenAction }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
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
    background: 'rgba(11, 11, 12, 0.3)',
    backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
    boxShadow: '0 8px 32px 0 rgba(0,0,0,0.4), inset 0 1px 0 0 rgba(255, 255, 255, 0.15)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
  };

  const navItems = [
    { name: 'Platform', href: '/platform' },
    { name: 'Programs', href: '/programs' },
    { name: 'Partners', href: '/partners' },
    { name: 'Opportunities', href: '/opportunities' },
    { name: 'Services', href: '/services' },
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'Events', href: '/events' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 pointer-events-none ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
          }`}
      >
        <nav className="w-full px-4 sm:px-8 md:px-10 xl:px-16 py-4 md:py-5">
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
                    className="h-6 sm:h-7 md:h-7 w-auto max-w-none shrink-0 object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>
              </div>
            </div>

            {/* --- CENTER: FLOATING GLASS PILL --- */}
            <div className="flex-none flex justify-center items-center">
              <div
                className={`hidden md:flex items-center rounded-2xl transition-all duration-500 ease-in-out pointer-events-auto ${isScrolled ? 'px-5 py-3 scale-100' : 'px-5 xl:px-7 py-3.5 scale-95'
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
                <div className={`flex items-center ${isScrolled ? 'space-x-4 xl:space-x-6' : 'space-x-4 xl:space-x-8'}`}>
                  {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`text-[13px] xl:text-sm font-medium transition-colors ${isActive
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
                      <span>Apply as Startup</span>
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
                  className="p-2 rounded-xl bg-[#0b0b0c]/30 backdrop-blur-xl border border-white/20 text-white hover:text-purple-300"
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
          <div className="fixed top-20 left-4 right-4 bg-[#0b0b0c]/95 border border-purple-500/30 rounded-3xl shadow-2xl overflow-y-auto p-6 flex flex-col justify-between space-y-6">
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
