'use client';

import React, { forwardRef, useEffect, useId, useImperativeHandle, useRef } from 'react';

export type InkWipeHandle = {
  /** 0 → 1. First half: ink rises from the bottom and covers the screen. Second half: ink drains upward. */
  update: (progress: number) => void;
};

// Ink-edge wipe between two scenes. A plain rectangle grows/shrinks behind an SVG
// filter that turns its straight edge into ink: fractal noise displaces the edge,
// blur + a hard alpha threshold turn the result into crisp blobs, droplets and holes.
// Only `scaleY` changes per frame; the noise stays put, so the edge "boils" as it moves.
const RIM = 0.045; // how far the coloured rim leads the black core (fraction of layer height)

const InkWipe = forwardRef<InkWipeHandle, { className?: string }>(function InkWipe({ className = '' }, ref) {
  const filterId = `ink-edge-${useId().replace(/:/g, '')}`;
  const rootRef = useRef<HTMLDivElement>(null);
  const rimRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);
  const dispRef = useRef<SVGFEDisplacementMapElement>(null);

  // Softer displacement on small screens so the edge doesn't swallow the viewport.
  useEffect(() => {
    dispRef.current?.setAttribute('scale', String(Math.round(Math.min(220, Math.max(110, window.innerWidth * 0.15)))));
  }, []);

  useImperativeHandle(ref, () => ({
    update(progress) {
      const root = rootRef.current;
      const rim = rimRef.current;
      const core = coreRef.current;
      if (!root || !rim || !core) return;

      const p = Math.max(0, Math.min(1, progress));
      if (p <= 0.002 || p >= 0.998) {
        root.style.visibility = 'hidden';
        return;
      }
      root.style.visibility = 'visible';

      // Rising (anchored bottom) then draining (anchored top). At the hand-off both cover fully.
      const rising = p < 0.5;
      const s = rising ? p / 0.5 : 1 - (p - 0.5) / 0.5;
      const origin = rising ? 'center bottom' : 'center top';
      rim.style.transformOrigin = origin;
      core.style.transformOrigin = origin;
      rim.style.transform = `scaleY(${s})`;
      core.style.transform = `scaleY(${Math.max(0, s - RIM)})`;
    },
  }));

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className={`pointer-events-none overflow-hidden ${className}`}
      style={{ visibility: 'hidden' }}
    >
      <svg width="0" height="0" className="absolute">
        <defs>
          <filter id={filterId} x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.015 0.02" numOctaves="3" seed="7" result="noise" />
            <feDisplacementMap ref={dispRef} in="SourceGraphic" in2="noise" scale="220" xChannelSelector="R" yChannelSelector="G" result="displaced" />
            <feGaussianBlur in="displaced" stdDeviation="1.8" result="presmooth" />
            <feComponentTransfer in="presmooth" result="cut">
              <feFuncA type="discrete" tableValues="0 0 0 0 0 1 1 1 1 1" />
            </feComponentTransfer>
            <feGaussianBlur in="cut" stdDeviation="0.4" />
          </filter>
        </defs>
      </svg>

      {/* Oversized so the displaced edge never shows the layer's own borders. */}
      <div className="absolute -inset-[300px] will-change-transform" style={{ filter: `url(#${filterId})` }}>
        <div
          ref={rimRef}
          className="absolute inset-0 will-change-transform"
          style={{ background: 'linear-gradient(90deg, #7c3aed 0%, #a855f7 45%, #38bdf8 100%)', transform: 'scaleY(0)' }}
        />
        <div ref={coreRef} className="absolute inset-0 bg-black will-change-transform" style={{ transform: 'scaleY(0)' }} />
      </div>
    </div>
  );
});

export default InkWipe;
