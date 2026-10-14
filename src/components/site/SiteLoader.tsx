'use client';

import React, { useEffect, useState, useSyncExternalStore } from 'react';

const WORD = 'DIGITAL DEN';
const SWEEP_MS = 1100; // one light sweep across the wordmark
const SWEEPS = 2; // sweeps before the loader leaves
const STAGGER_MS = 60; // delay between letters within a sweep
const EXIT_MS = 700; // fade/blur out

// Site-wide "loader finished" flag, so pages can hold their intro animations
// until the loader leaves. Stays true for client-side navigations afterwards.
let loaderDone = false;
const listeners = new Set<() => void>();
const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};
export function useLoaderDone() {
  return useSyncExternalStore(subscribe, () => loaderDone, () => false);
}

/**
 * First-load intro: a small centred wordmark on the page background with a band of light
 * sweeping across its letters (dim → bright → dim), twice, then a soft fade-out.
 */
export default function SiteLoader() {
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    root.style.overflow = 'hidden';
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const holdMs = reduced ? 600 : SWEEP_MS * SWEEPS + STAGGER_MS * WORD.length;

    const leave = window.setTimeout(() => {
      setLeaving(true);
      root.style.overflow = '';
      loaderDone = true;
      listeners.forEach((l) => l());
    }, holdMs);
    const remove = window.setTimeout(() => setGone(true), holdMs + EXIT_MS + 100);

    return () => {
      window.clearTimeout(leave);
      window.clearTimeout(remove);
      root.style.overflow = '';
    };
  }, []);

  if (gone) return null;
  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-den"
      style={{ opacity: leaving ? 0 : 1, transition: `opacity ${EXIT_MS}ms ease-out` }}
      aria-hidden="true"
    >
      <style>{`
        @keyframes dd-loader-sweep {
          0%, 100% { color: rgba(255, 255, 255, 0.22); text-shadow: none; }
          35% { color: rgba(255, 255, 255, 1); text-shadow: 0 0 18px rgba(196, 181, 253, 0.55); }
          70% { color: rgba(255, 255, 255, 0.22); text-shadow: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .dd-loader-letter { animation: none !important; color: rgba(255, 255, 255, 0.85) !important; }
        }
      `}</style>
      <p
        className="font-['Plus_Jakarta_Sans',sans-serif] text-[18px] sm:text-[22px] font-medium tracking-[0.32em] text-white/20"
        style={{
          transform: leaving ? 'scale(1.06)' : 'scale(1)',
          filter: leaving ? 'blur(8px)' : 'blur(0px)',
          transition: `transform ${EXIT_MS}ms ease-out, filter ${EXIT_MS}ms ease-out`,
        }}
      >
        {WORD.split('').map((ch, i) => (
          <span
            key={i}
            className="dd-loader-letter inline-block"
            style={{
              animation: `dd-loader-sweep ${SWEEP_MS}ms ease-in-out ${i * STAGGER_MS}ms ${SWEEPS} both`,
              whiteSpace: 'pre',
            }}
          >
            {ch}
          </span>
        ))}
      </p>
    </div>
  );
}
