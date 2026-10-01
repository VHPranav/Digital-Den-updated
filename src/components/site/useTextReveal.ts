'use client';

import { useEffect, type RefObject } from 'react';

// Fade-and-rise intro for body copy on the inner pages. Only data attributes
// are set (never text or className), so React-owned nodes stay untouched.
// Skips anything already animated (FadeIn / Reveal mark themselves with
// data-fadein), headings (SplitWords), the footer and [data-noreveal] areas.
const TARGETS = 'p, h3, h4, dt, dd, blockquote, figcaption, label';
const SKIP = '[data-fadein], [data-noreveal], [data-footer], h1, h2, nav, header, button';

export function useTextReveal(root: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const io = new IntersectionObserver(
      (entries) => {
        let n = 0;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const t = entry.target as HTMLElement;
          io.unobserve(t);
          t.style.setProperty('--reveal-delay', `${Math.min(n++ * 0.08, 0.48)}s`);
          t.dataset.reveal = 'in';
          // Hand transitions back to the element's own classes once done.
          window.setTimeout(() => {
            t.dataset.revealDone = '';
            delete t.dataset.reveal;
            t.style.removeProperty('--reveal-delay');
          }, 1600);
        }
      },
      { rootMargin: '0px 0px -6% 0px' },
    );

    const scan = (scope: ParentNode) => {
      scope.querySelectorAll<HTMLElement>(TARGETS).forEach((t) => {
        // 'pending' ones are re-observed: effects can re-run (StrictMode, HMR).
        if (t.dataset.reveal === 'in' || t.dataset.revealDone != null || t.closest(SKIP) || t.parentElement?.closest(TARGETS)) return;
        t.dataset.reveal = 'pending';
        io.observe(t);
      });
    };
    scan(el);

    // Content swapped in later (tabs, filters) gets the same intro.
    const mo = new MutationObserver((records) => {
      for (const r of records) r.addedNodes.forEach((node) => node instanceof HTMLElement && scan(node.parentElement ?? node));
    });
    mo.observe(el, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [root]);
}
