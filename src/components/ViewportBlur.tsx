'use client';

import React, { useEffect, useState } from 'react';

/**
 * ViewportBlur
 * A high-fidelity, hardware-accelerated fixed overlay at both the top and bottom of the viewport.
 * It creates a gradual, organic progressive blur & dark fade transition at both edges of the screen,
 * making content scroll smoothly into a gorgeous blurred fade-out from the frames section down to the footer.
 */
export default function ViewportBlur() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const mainContent = document.getElementById('main-content');
      if (!mainContent) {
        setIsVisible(true);
        return;
      }
      const rect = mainContent.getBoundingClientRect();
      // Activate as soon as the main-content (frames section) reaches or enters the viewport
      if (rect.top <= window.innerHeight) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Stacking layers of increasing blur with offset gradient masks creates an
  // incredibly smooth, organic blur gradient (exponential-like curve).
  const layers = [
    { blur: '1px', start: 0, end: 15 },
    { blur: '2px', start: 10, end: 30 },
    { blur: '4px', start: 25, end: 45 },
    { blur: '8px', start: 40, end: 60 },
    { blur: '16px', start: 55, end: 75 },
    { blur: '24px', start: 70, end: 90 },
    { blur: '32px', start: 85, end: 100 },
  ];

  return (
    <>
      {/* ─── Top Progressive Viewport Blur ─── */}
      <div
        className={`fixed top-0 left-0 right-0 pointer-events-none select-none z-[45] w-full h-[80px] md:h-[120px] transition-opacity duration-700 ease-out ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        aria-hidden="true"
      >
        {/* Cumulative backdrop-filter blur layers for top */}
        {layers.map((layer, index) => (
          <div
            key={`top-${index}`}
            className="absolute inset-0 w-full h-full"
            style={{
              backdropFilter: `blur(${layer.blur})`,
              WebkitBackdropFilter: `blur(${layer.blur})`,
              maskImage: `linear-gradient(to top, rgba(0, 0, 0, 0) ${layer.start}%, rgba(0, 0, 0, 1) ${layer.end}%, rgba(0, 0, 0, 1) 100%)`,
              WebkitMaskImage: `linear-gradient(to top, rgba(0, 0, 0, 0) ${layer.start}%, rgba(0, 0, 0, 1) ${layer.end}%, rgba(0, 0, 0, 1) 100%)`,
              zIndex: 1,
            }}
          />
        ))}

        {/* Seamless blend dark background gradient for top */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            background:
              'linear-gradient(to top, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.25) 30%, rgba(0, 0, 0, 0.75) 75%, rgb(0, 0, 0) 100%)',
            zIndex: 2,
          }}
        />
      </div>

      {/* ─── Bottom Progressive Viewport Blur ─── */}
      <div
        className={`fixed bottom-0 left-0 right-0 pointer-events-none select-none z-[9990] w-full h-[90px] md:h-[140px] transition-opacity duration-700 ease-out ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        aria-hidden="true"
      >
        {/* Cumulative backdrop-filter blur layers for bottom */}
        {layers.map((layer, index) => (
          <div
            key={`bottom-${index}`}
            className="absolute inset-0 w-full h-full"
            style={{
              backdropFilter: `blur(${layer.blur})`,
              WebkitBackdropFilter: `blur(${layer.blur})`,
              maskImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0) ${layer.start}%, rgba(0, 0, 0, 1) ${layer.end}%, rgba(0, 0, 0, 1) 100%)`,
              WebkitMaskImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0) ${layer.start}%, rgba(0, 0, 0, 1) ${layer.end}%, rgba(0, 0, 0, 1) 100%)`,
              zIndex: 1,
            }}
          />
        ))}

        {/* Seamless blend dark background gradient for bottom */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            background:
              'linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.25) 30%, rgba(0, 0, 0, 0.75) 75%, rgb(0, 0, 0) 100%)',
            zIndex: 2,
          }}
        />
      </div>
    </>
  );
}
