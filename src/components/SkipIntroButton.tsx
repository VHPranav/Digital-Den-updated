'use client';

import React, { useEffect, useState } from 'react';
import { FastForward, ArrowDown } from 'lucide-react';

interface SkipIntroButtonProps {
  targetId?: string;
}

export default function SkipIntroButton({
  targetId = 'main-content',
}: SkipIntroButtonProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const targetEl = document.getElementById(targetId);
      if (!targetEl) return;

      const rect = targetEl.getBoundingClientRect();
      // Hide button once user reaches or scrolls past the main section
      if (rect.top <= 120) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [targetId]);

  const handleSkip = () => {
    const targetEl = document.getElementById(targetId);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50 animate-fade-in pointer-events-auto">
      <button
        onClick={handleSkip}
        className="px-5 py-2.5 rounded-full bg-black/65 hover:bg-black/90 text-white/80 hover:text-white border border-white/20 hover:border-purple-400/60 backdrop-blur-2xl text-xs font-mono tracking-wider shadow-[0_10px_35px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.2)] flex items-center gap-2.5 transition-all hover:scale-105 active:scale-95 cursor-pointer group"
      >
        <span>Skip Intro</span>
        <div className="w-5 h-5 rounded-full bg-white/10 group-hover:bg-purple-500/30 flex items-center justify-center text-white/70 group-hover:text-white transition-colors">
          <ArrowDown className="w-3 h-3 stroke-[2.5]" />
        </div>
      </button>
    </div>
  );
}
