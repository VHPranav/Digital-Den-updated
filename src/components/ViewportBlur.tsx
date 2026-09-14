'use client';

import React, { useEffect, useRef, useState } from 'react';

/**
 * ViewportBlur
 * A high-fidelity, hardware-accelerated fixed overlay at both the top and bottom of the viewport.
 * It creates a gradual, organic progressive blur & dark fade transition at both edges of the screen,
 * making content scroll smoothly into a gorgeous blurred fade-out from the frames section down to the footer.
 */
const HIDE_DELAY_MS = 700; // matches the opacity transition duration below

export default function ViewportBlur() {
  const [isVisible, setIsVisible] = useState(false);
  // Fully unmount the backdrop-filter layers when not visible instead of just
  // fading opacity — each layer forces the browser to sample/blur the backdrop
  // every composited frame even at opacity 0, which otherwise runs for the
  // entire Hero/CreativeTransition/Spine scroll range before this is needed.
  const [shouldRender, setShouldRender] = useState(false);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let ticking = false;

    const checkVisibility = () => {
      ticking = false;
      const mainContent = document.getElementById('main-content');
      const nowVisible = mainContent ? mainContent.getBoundingClientRect().top <= window.innerHeight : true;

      setIsVisible((prev) => (prev === nowVisible ? prev : nowVisible));

      if (nowVisible) {
        if (hideTimeoutRef.current) {
          clearTimeout(hideTimeoutRef.current);
          hideTimeoutRef.current = null;
        }
        setShouldRender(true);
      } else if (hideTimeoutRef.current === null) {
        hideTimeoutRef.current = setTimeout(() => {
          setShouldRender(false);
          hideTimeoutRef.current = null;
        }, HIDE_DELAY_MS);
      }
    };

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(checkVisibility);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    checkVisibility();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, []);

  if (!shouldRender) return null;

  // Stacking layers of increasing blur with offset gradient masks creates a
  // smooth, organic blur gradient (exponential-like curve). Kept to 4 layers
  // (down from 7) — each is a separate backdrop-filter compositing pass.
  const layers = [
    { blur: '2px', start: 0, end: 25 },
    { blur: '6px', start: 20, end: 50 },
    { blur: '16px', start: 45, end: 75 },
    { blur: '32px', start: 70, end: 100 },
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
