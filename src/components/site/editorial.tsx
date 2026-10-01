'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

// Editorial primitives shared by the video-hero pages (Platform, Programs).

export const PAGE_BG = 'bg-[#0b0b0c]';
export const EASE = 'cubic-bezier(0.2, 0.7, 0.1, 1)';

/** Muted, looping background film; the poster shows until the video can play. */
export function BgVideo({ src, poster }: { src: string; poster: string }) {
  return (
    <video
      className="absolute inset-0 h-full w-full object-cover"
      src={src}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden="true"
    />
  );
}

export function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex h-[22px] min-w-[30px] items-center justify-center rounded-full border border-current px-2 text-[11px] tabular-nums leading-none">
      {children}
    </span>
  );
}

export function ArrowLink({ children, href, onClick }: { children: React.ReactNode; href?: string; onClick?: () => void }) {
  const inner = (
    <>
      <span className="border-b border-current pb-0.5">{children}</span>
      <span className="flex h-6 w-9 items-center justify-center rounded-full bg-white text-black transition-colors duration-300 group-hover:bg-purple-300">
        <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.2} />
      </span>
    </>
  );
  const cls = 'group inline-flex items-center gap-3 text-[15px] text-white';
  return href ? (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  ) : (
    <button type="button" onClick={onClick} className={cls}>
      {inner}
    </button>
  );
}

/** Words fade in from a blur, staggered — plays once on mount. */
export function BlurWords({ text, delay = 0 }: { text: string; delay?: number }) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setOn(true));
    return () => cancelAnimationFrame(id);
  }, []);
  return (
    <>
      {text.split(' ').map((w, i) => (
        <span
          key={i}
          className="inline-block"
          style={{
            opacity: on ? 1 : 0,
            filter: on ? 'blur(0px)' : 'blur(14px)',
            transform: on ? 'none' : 'translateY(0.15em)',
            transition: `opacity 1.2s ${EASE} ${delay + i * 0.12}s, filter 1.2s ${EASE} ${delay + i * 0.12}s, transform 1.2s ${EASE} ${delay + i * 0.12}s`,
          }}
        >
          {w}
          {' '}
        </span>
      ))}
    </>
  );
}

/** Fades + lifts children when they first enter the viewport. */
export function Reveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let frame = 0;
    const check = () => {
      frame = 0;
      if (el.getBoundingClientRect().top < window.innerHeight * 0.9) {
        setShown(true);
        window.removeEventListener('scroll', onScroll);
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };
    check();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);
  return (
    <div
      ref={ref}
      data-fadein
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? 'none' : 'translateY(32px)',
        transition: `opacity 1.1s ${EASE} ${delay}s, transform 1.1s ${EASE} ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}
