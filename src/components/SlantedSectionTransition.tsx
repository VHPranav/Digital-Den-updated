'use client';

import React, { useEffect, useRef, useState } from 'react';

interface SlantedSectionTransitionProps {
  children: React.ReactNode;
  slantSlopeVw?: number; // slope in vw units, default 6 (corresponds to 6vw)
  showLaserSeam?: boolean;
}

/**
 * SlantedSectionTransition
 *
 * Inspired by Active Theory's portfolio architecture.
 * Seamlessly bridges full-screen WebGL 3D canvas with structured HTML page sections
 * using asymmetrical angled CSS clip-path masking, dynamic slope scaling (vw),
 * glowing refractive laser seam divider, and continuous scroll velocity tracking.
 */
export default function SlantedSectionTransition({
  children,
  slantSlopeVw = 6,
  showLaserSeam = true,
}: SlantedSectionTransitionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollVelocity, setScrollVelocity] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let currentVel = 0;
    let rafId: number;

    const onScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowH = window.innerHeight;

      // Calculate reveal progress as section approaches and overlaps viewport
      const totalDist = rect.height + windowH;
      const currentDist = windowH - rect.top;
      const progress = Math.max(0, Math.min(1, currentDist / totalDist));
      setScrollProgress(progress);

      const deltaY = window.scrollY - lastScrollY;
      lastScrollY = window.scrollY;
      currentVel = deltaY;
    };

    const updatePhysics = () => {
      // Smooth lerp velocity decay
      currentVel *= 0.88;
      if (Math.abs(currentVel) > 0.01) {
        setScrollVelocity(currentVel);
      } else {
        setScrollVelocity(0);
      }
      rafId = requestAnimationFrame(updatePhysics);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    rafId = requestAnimationFrame(updatePhysics);

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  // Calculate dynamic slant angle in radians / degrees
  const angleDeg = Math.atan2(slantSlopeVw, 100) * (180 / Math.PI);

  return (
    <div
      ref={containerRef}
      className="relative z-30 w-full -mt-[6vw] overflow-visible"
    >
      {/* ─── 1. Asymmetrical Slanted HTML Masking Wrapper (Opposite Slant) ─── */}
      <div
        className="relative w-full bg-black text-white overflow-hidden transition-transform duration-75 ease-out"
        style={{
          clipPath: `polygon(0 ${slantSlopeVw}vw, 100% 0, 100% 100%, 0 100%)`,
          WebkitClipPath: `polygon(0 ${slantSlopeVw}vw, 100% 0, 100% 100%, 0 100%)`,
          paddingTop: `${slantSlopeVw * 1.1}vw`,
        }}
      >
        {/* ─── 2. Seamless Slanted Black Dissolve Gradient Overlay (Joined with Slant Angle) ─── */}
        <div
          className="absolute top-0 inset-x-0 h-[50vh] sm:h-[100vh] pointer-events-none z-[12]"
          style={{
            background: `linear-gradient(${180 - angleDeg}deg, #000000 0%, #000000 ${slantSlopeVw * 0.9}vw, rgba(0, 0, 0, 0.96) ${slantSlopeVw + 6}vw, rgba(0, 0, 0, 0.75) ${slantSlopeVw + 16}vw, rgba(0, 0, 0, 0.3) ${slantSlopeVw + 28}vw, transparent 100%)`,
          }}
          aria-hidden="true"
        />

        {/* ─── Slanted HTML Page Content ─── */}
        <div className="relative z-10 w-full">
          {children}
        </div>
      </div>
    </div>
  );
}
