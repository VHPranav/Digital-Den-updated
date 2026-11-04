'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';
import { useLoaderDone } from './SiteLoader';

// Animate the heading's own painted surface. Moving transparent child words
// independently breaks background-clip:text in composited browser layers.
export default function SplitWords({ children, delay = 0 }: {
  children: React.ReactNode;
  delay?: number;
  stagger?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const loaderDone = useLoaderDone();

  useEffect(() => {
    const marker = ref.current;
    const heading = marker?.closest('h1,h2,h3,h4,h5,h6');
    if (!marker || !heading || !loaderDone) return;
    // Reveal already animates the complete heading with its surrounding copy.
    if (heading.closest('[data-fadein]')) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let cancelled = false;
    let context: ReturnType<typeof gsap.context> | undefined;
    let observer: IntersectionObserver | undefined;
    document.fonts.ready.then(() => {
      if (cancelled) return;
      context = gsap.context(() => {
        gsap.set(heading, { opacity: 0, y: 20 });
        observer = new IntersectionObserver(([entry]) => {
          if (!entry.isIntersecting) return;
          observer?.disconnect();
          gsap.to(heading, { opacity: 1, y: 0, duration: .9, delay,
            ease: 'power3.out', clearProps: 'opacity,transform' });
        }, { rootMargin: '0px 0px -8% 0px' });
        observer.observe(heading);
      }, heading);
    });
    return () => { cancelled = true; observer?.disconnect(); context?.revert(); };
  }, [loaderDone, delay]);

  return <span ref={ref}>{children}</span>;
}
