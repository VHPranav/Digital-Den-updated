'use client';

import React, { useEffect, useState, useSyncExternalStore } from 'react';

const EASE = 'cubic-bezier(0.2, 0.7, 0.1, 1)';
const COUNT_MS = 2400; // percentage count-up
const LIFT_MS = 1400; // curtain lift

// Site-wide "loader finished" flag, so pages can hold their intro animations
// until the curtain lifts. Stays true for client-side navigations afterwards.
let loaderDone = false;
const listeners = new Set<() => void>();
const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};
export function useLoaderDone() {
  return useSyncExternalStore(subscribe, () => loaderDone, () => false);
}

/** Full-screen intro on the first load of any page: count to 100%, then the curtain lifts. */
export default function SiteLoader() {
  const [pct, setPct] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    root.style.overflow = 'hidden';
    const start = performance.now();
    let frame = 0;
    let timer = 0;
    const tick = (now: number) => {
      const t = Math.min((now - start) / COUNT_MS, 1);
      setPct(Math.round(100 * (1 - Math.pow(1 - t, 2.2))));
      if (t < 1) {
        frame = requestAnimationFrame(tick);
        return;
      }
      setLeaving(true);
      root.style.overflow = '';
      loaderDone = true;
      listeners.forEach((l) => l());
      timer = window.setTimeout(() => setGone(true), LIFT_MS + 100);
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
      root.style.overflow = '';
    };
  }, []);

  if (gone) return null;
  return (
    <div
      className="fixed inset-0 z-[10000] flex items-end justify-end bg-[#0b0b0c] px-6 pb-8 text-white lg:px-10"
      style={{
        transform: leaving ? 'translateY(-100%)' : 'translateY(0)',
        transition: `transform ${LIFT_MS}ms ${EASE}`,
      }}
      aria-hidden="true"
    >
      <span className="text-[18vw] lg:text-[12rem] font-light leading-none tracking-[-0.06em] tabular-nums">
        {pct}
        <span className="text-white/30">%</span>
      </span>
    </div>
  );
}
