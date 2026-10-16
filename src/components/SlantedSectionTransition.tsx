'use client';

import React from 'react';

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
 * using asymmetrical angled CSS clip-path masking and dynamic slope scaling (vw).
 */
export default function SlantedSectionTransition({
  children,
  slantSlopeVw = 6,
}: SlantedSectionTransitionProps) {
  // Calculate dynamic slant angle in radians / degrees
  const angleDeg = Math.atan2(slantSlopeVw, 100) * (180 / Math.PI);

  return (
    <div className="relative z-30 w-full -mt-[6vw] overflow-visible">
      {/* ─── 1. Asymmetrical Slanted HTML Masking Wrapper (Opposite Slant) ─── */}
      <div
        className="relative w-full bg-den text-white overflow-clip transition-transform duration-75 ease-out"
        style={{
          clipPath: `polygon(0 ${slantSlopeVw}vw, 100% 0, 100% 100%, 0 100%)`,
          WebkitClipPath: `polygon(0 ${slantSlopeVw}vw, 100% 0, 100% 100%, 0 100%)`,
          paddingTop: `${slantSlopeVw * 1.1}vw`,
        }}
      >
        {/* ─── 2. Seamless Slanted Black Dissolve Gradient Overlay (Joined with Slant Angle) ───
            Sits above the page content (z-12 > z-10), so it is kept short: fully transparent
            by slope + 16vw, before the Hero copy starts. */}
        <div
          className="absolute top-0 inset-x-0 pointer-events-none z-[12]"
          style={{
            height: `${slantSlopeVw + 16}vw`,
            background: `linear-gradient(${180 - angleDeg}deg, #0b0b0c 0%, #0b0b0c ${slantSlopeVw * 0.9}vw, rgba(11, 11, 12, 0.96) ${slantSlopeVw + 3}vw, rgba(11, 11, 12, 0.6) ${slantSlopeVw + 8}vw, rgba(11, 11, 12, 0.25) ${slantSlopeVw + 12}vw, transparent 100%)`,
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
