'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

const EASE = 'cubic-bezier(0.2, 0.7, 0.1, 1)';

/** 0 → 1 as the element travels through the viewport (enter bottom → leave top). */
export function useScrollProgress<T extends HTMLElement>(offset = { start: 0.9, end: 0.1 }) {
  const ref = useRef<T>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const startY = vh * offset.start;
      const endY = vh * offset.end - r.height;
      const p = (startY - r.top) / (startY - endY);
      setProgress(Math.min(1, Math.max(0, p)));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [offset.start, offset.end]);

  return [ref, progress] as const;
}

/** Characters rise from a mask, staggered. Words never break mid-word. */
export function CharReveal({
  text,
  play,
  delay = 0,
  stagger = 0.022,
  className = '',
}: {
  text: string;
  play: boolean;
  delay?: number;
  stagger?: number;
  className?: string;
}) {
  let i = 0;
  const words = text.split(' ');
  return (
    <span className={className} aria-label={text}>
      {words.map((word, w) => (
        <span key={w} className="inline-block whitespace-nowrap" aria-hidden="true">
          {[...word].map((ch) => {
            const idx = i++;
            return (
              <span key={idx} className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom">
                <span
                  className="inline-block will-change-transform"
                  style={{
                    transform: play ? 'translateY(0)' : 'translateY(110%)',
                    transition: `transform 0.9s ${EASE} ${delay + idx * stagger}s`,
                  }}
                >
                  {ch}
                </span>
              </span>
            );
          })}
          {w < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </span>
  );
}

export type ScrubPart = string | { glyph: React.ReactNode } | { underline: string };

/** Paragraph that lights up word-by-word as it scrolls through the viewport. */
export function ScrubText({ parts, className = '' }: { parts: ScrubPart[]; className?: string }) {
  const [ref, progress] = useScrollProgress<HTMLParagraphElement>({ start: 0.85, end: 0.45 });

  const tokens: { node: React.ReactNode; key: string }[] = [];
  parts.forEach((part, p) => {
    if (typeof part === 'string') {
      part
        .split(' ')
        .filter(Boolean)
        .forEach((w, i) => tokens.push({ node: w, key: `${p}-${i}` }));
    } else if ('glyph' in part) {
      tokens.push({ node: <span className="inline-flex align-middle">{part.glyph}</span>, key: `${p}-g` });
    } else {
      tokens.push({ node: <span className="underline decoration-1 underline-offset-[0.18em]">{part.underline}</span>, key: `${p}-u` });
    }
  });

  const lit = progress * tokens.length * 1.05;
  return (
    // data-noreveal: this text has its own scroll-scrubbed animation.
    <p ref={ref} data-noreveal className={className}>
      {tokens.map(({ node, key }, i) => {
        const o = Math.min(1, Math.max(0.16, lit - i + 0.16));
        return (
          <span key={key} className="transition-opacity duration-300" style={{ opacity: o }}>
            {node}{' '}
          </span>
        );
      })}
    </p>
  );
}

/** Oversized marquee line whose x-position is driven by scroll. */
export function ScrollMarquee({
  children,
  direction = 1,
  distance = 30,
  className = '',
}: {
  children: React.ReactNode;
  direction?: 1 | -1;
  distance?: number;
  className?: string;
}) {
  const [ref, progress] = useScrollProgress<HTMLDivElement>({ start: 1, end: 0 });
  const x = (direction === 1 ? -progress : progress - 1) * distance;
  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <div className="whitespace-nowrap will-change-transform" style={{ transform: `translate3d(${x}%,0,0)` }}>
        {children}
      </div>
    </div>
  );
}

/** Image (or looping video, with `src` as its poster) that wipes in from the bottom and settles from a slight zoom. */
export function ClipImage({
  src,
  alt,
  className = '',
  sizes = '100vw',
  video,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  video?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Scroll check rather than IntersectionObserver so a fast jump past the
    // image (anchor link, fling) still reveals it.
    let frame = 0;
    const check = () => {
      frame = 0;
      if (el.getBoundingClientRect().top < window.innerHeight * 0.88) {
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
      className={`group relative overflow-hidden ${className}`}
      style={{
        clipPath: shown ? 'inset(0% 0% 0% 0%)' : 'inset(100% 0% 0% 0%)',
        transition: `clip-path 1.4s ${EASE}`,
      }}
    >
      {video ? (
        <video
          src={video}
          poster={src}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={alt}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1800ms]"
          style={{ transform: shown ? undefined : 'scale(1.18)', transitionTimingFunction: EASE }}
        />
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-[1800ms] group-hover:scale-[1.03]"
          style={{ transform: shown ? undefined : 'scale(1.18)', transitionTimingFunction: EASE }}
        />
      )}
    </div>
  );
}
